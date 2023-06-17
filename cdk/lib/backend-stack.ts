import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds'
import * as ec2 from '@aws-cdk/aws-ec2'

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true
    });

    const database = new rds.DatabaseInstance(this, 'WebAppDB', {
      engine: rds.DatabaseInstanceEngine.sqlServerEx({
        version: rds.SqlServerEngineVersion.VER_15,
      }),
      credentials: rds.Credentials.fromGeneratedSecret('admin'),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      allocatedStorage: 100,
      storageType: rds.StorageType.GP2,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publiclyAccessible: true
    });

  }
}
