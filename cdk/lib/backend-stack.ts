import * as cdk from "@aws-cdk/core";
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as secretsmanager from "@aws-cdk/aws-secretsmanager";
import * as lambdaPython from "@aws-cdk/aws-lambda-python";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import path = require("path");

export class BackendStack extends cdk.Stack {
  private database: rds.DatabaseInstance;
  private vpc: ec2.IVpc;
  private secret: secretsmanager.Secret;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createDatabase();
    this.createApi();
  }

  createDatabase() {
    this.vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });

    this.secret = new secretsmanager.Secret(this, "DBSecret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "dbmaster" }),
        generateStringKey: "password",
        excludeCharacters: '"/@ ',
        passwordLength: 30,
      },
    });

    this.database = new rds.DatabaseInstance(this, "WebAppDB", {
      engine: rds.DatabaseInstanceEngine.sqlServerEx({
        version: rds.SqlServerEngineVersion.VER_15,
      }),
      credentials: rds.Credentials.fromSecret(this.secret),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL
      ),
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      allocatedStorage: 100,
      storageType: rds.StorageType.GP2,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publiclyAccessible: true,
    });

    (this.database.node.defaultChild as cdk.CfnResource).addDependsOn(
      this.secret.node.defaultChild as cdk.CfnResource
    );
  }

  createApi() {
    const securityGroup = new ec2.SecurityGroup(this, "LambdaSG", {
      vpc: this.vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      securityGroup,
      ec2.Port.tcp(1433),
      "Allow SQL inbound connections"
    );

    const lambdaProps: IAutomationFunctionProps = {
      requirementsFile: "lambdas",
      memorySize: 128,
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },
      securityGroups: [securityGroup],
      environment: {
        SECRET_ARN: this.secret.secretArn,
        DB_HOST: this.database.dbInstanceEndpointAddress,
        DB_PORT: this.database.dbInstanceEndpointPort,
      },
      initialPolicy: new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [this.secret.secretArn],
      }),
      timeout: cdk.Duration.seconds(20),
    };

    const corsOptions: apigw.CorsOptions = {
      allowOrigins: apigw.Cors.ALL_ORIGINS,
      allowMethods: apigw.Cors.ALL_METHODS,
    };
    const api = new apigw.RestApi(this, "BackendApi");
    const apiKey = api.addApiKey("APIKey", {
      value: process.env.BACKEND_API_KEY!,
      defaultCorsPreflightOptions: corsOptions,
    });
    const plan = api.addUsagePlan("UsagePlan", {
      apiKey,
      throttle: {
        rateLimit: 5,
        burstLimit: 100,
      },
    });
    plan.addApiStage({ api, stage: api.deploymentStage });

    const queryFn = createLambdaFunction(this, "QueryFn", {
      handler: "main.query_data.handler",
      ...lambdaProps,
    });
    const insertFn = createLambdaFunction(this, "InsertFn", {
      handler: "main.insert_data.handler",
      ...lambdaProps,
    });
    const deleteFn = createLambdaFunction(this, "DeleteFn", {
      handler: "main.delete_data.handler",
      ...lambdaProps,
    });

    const tableResource = api.root.addResource("{table}");
    tableResource.addCorsPreflight(corsOptions);

    tableResource.addMethod("GET", new apigw.LambdaIntegration(queryFn), {
      apiKeyRequired: true,
    });
    tableResource.addMethod("POST", new apigw.LambdaIntegration(insertFn), {
      apiKeyRequired: true,
    });

    const itemIdResource = tableResource.addResource("{itemId}");
    itemIdResource.addCorsPreflight(corsOptions);

    itemIdResource.addMethod("DELETE", new apigw.LambdaIntegration(deleteFn), {
      apiKeyRequired: true,
    });
  }
}

export interface IAutomationFunctionProps {
  requirementsFile?: string;
  handler?: string;
  timeout?: cdk.Duration;
  memorySize?: number;
  environment?: { [key: string]: string };
  retryAttempts?: number;
  vpc?: ec2.IVpc;
  vpcSubnets?: ec2.SubnetSelection;
  securityGroups?: ec2.ISecurityGroup[];
  initialPolicy?: iam.PolicyStatement;
}

function createLambdaFunction(
  construct: cdk.Construct,
  id: string,
  props: IAutomationFunctionProps
): lambdaPython.PythonFunction {
  const buildArgs: { [key: string]: string } = {};
  if (props.requirementsFile) {
    buildArgs["REQUIREMENTS_FILE"] = props.requirementsFile;
  }

  const dockerImagePath = path.join(__dirname, "..", "..");
  const func = new lambda.DockerImageFunction(construct, id, {
    code: lambda.DockerImageCode.fromImageAsset(dockerImagePath, {
      file: "python.Dockerfile",
      cmd: [`index.${props.handler}`],
      buildArgs: buildArgs,
    }),
    functionName: `${construct.toString()}-${id}`,
    vpcSubnets: props.vpcSubnets,
    securityGroups: props.securityGroups,
    timeout: props.timeout ?? cdk.Duration.minutes(5),
    memorySize: props.memorySize ?? undefined,
    environment: props.environment,
    retryAttempts: props.retryAttempts ?? 0,
    initialPolicy: props.initialPolicy ? [props.initialPolicy] : undefined,
  });

  return func;
}
