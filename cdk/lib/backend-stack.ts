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
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });

    const secret = new secretsmanager.Secret(this, 'DBSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'dbmaster' }),
        generateStringKey: 'password',
        excludeCharacters: '"/@ ',
        passwordLength: 30,
      }
    });

    const database = new rds.DatabaseInstance(this, "WebAppDB", {
      engine: rds.DatabaseInstanceEngine.sqlServerEx({
        version: rds.SqlServerEngineVersion.VER_15,
      }),
      credentials: rds.Credentials.fromSecret(secret),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL
      ),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      allocatedStorage: 100,
      storageType: rds.StorageType.GP2,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publiclyAccessible: true,
    });

    (database.node.defaultChild as cdk.CfnResource).addDependsOn(secret.node.defaultChild as cdk.CfnResource);

    const securityGroup = new ec2.SecurityGroup(this, "LambdaSG", {
      vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      securityGroup,
      ec2.Port.tcp(1433),
      "Allow SQL inbound connections"
    );

    const fn = createLambdaFunction(this, "Test", {
      handler: "main.main.handler",
      requirementsFile: "lambdas",
      memorySize: 128,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },
      securityGroups: [securityGroup],
      environment: {
        SECRET_ARN: secret.secretArn,
        DB_HOST: database.dbInstanceEndpointAddress,
        DB_PORT: database.dbInstanceEndpointPort
      },
    });

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ["secretsmanager:GetSecretValue"],
      resources: [secret.secretArn]
    }))
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
  });

  return func;
}

function createApi(
  scope: cdk.Construct,
  func: lambda.IFunction,
  apiId: string,
  version: number,
  path: string,
  apiKey: string
) {
  const corsOptions: apigw.CorsOptions = {
    allowOrigins: apigw.Cors.ALL_ORIGINS,
    allowMethods: apigw.Cors.ALL_METHODS,
  };
  const api = new apigw.LambdaRestApi(scope, apiId, {
    handler: func,
    apiKeySourceType: apigw.ApiKeySourceType.HEADER,
    proxy: false,
    defaultCorsPreflightOptions: corsOptions,
  });

  const v1 = api.root.addResource(`v${version}`, {
    defaultCorsPreflightOptions: corsOptions,
  });
  const update = v1.addResource(path, {
    defaultCorsPreflightOptions: corsOptions,
  });
  update.addMethod("POST", undefined, { apiKeyRequired: true });
  const plan = api.addUsagePlan("MainUsagePlan", {
    apiStages: [{ stage: api.deploymentStage }],
  });
  plan.addApiKey(
    api.addApiKey("MainApiKey", {
      value: apiKey,
    })
  );
}
