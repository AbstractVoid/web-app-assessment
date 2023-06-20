import * as cdk from '@aws-cdk/core';
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();

new FrontendStack(app, "FrontendStack", {
  env: { account: process.env.APP_FRONTEND_ACCOUNT!, region: 'us-east-1' },
});
