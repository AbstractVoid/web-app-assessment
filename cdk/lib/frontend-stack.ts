import * as cdk from "@aws-cdk/core";
import * as s3deployment from "@aws-cdk/aws-s3-deployment";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { inlineHandleNextRoutes } from "./util";
import { join } from "path";

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "CdnBucket", {
      cors: [
        {
          maxAge: 3600,
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
        },
      ],
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    bucket.grantRead(originAccessIdentity);

    const redirectFunction = new cloudfront.Function(this, "Redirect", {
      code: cloudfront.FunctionCode.fromInline(inlineHandleNextRoutes),
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "Distribution",
      {
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        errorConfigurations: [403, 404].map((errorCode) => ({
          errorCode,
          responsePagePath: "/index.html",
          responseCode: 200,
        })),
        originConfigs: [
          {
            behaviors: [
              {
                isDefaultBehavior: true,
                forwardedValues: {
                  headers: [
                    "Access-Control-Allow-Origin",
                    "Access-Control-Request-Method",
                    "Origin",
                  ],
                  queryString: false,
                },
                compress: true,
                functionAssociations: [
                  {
                    eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                    function: redirectFunction,
                  },
                ],
              },
            ],
            s3OriginSource: {
              s3BucketSource: bucket,
              originPath: "/webapp",
              originAccessIdentity,
            },
          },
        ],
      }
    );

    new s3deployment.BucketDeployment(this, "Deployment", {
      sources: [
        s3deployment.Source.asset(join(__dirname, "..", "..", "app", "out")),
      ],
      distribution,
      destinationBucket: bucket,
      destinationKeyPrefix: "webapp",
      distributionPaths: ["/*"],
      memoryLimit: 1024,
    });
  }
}
