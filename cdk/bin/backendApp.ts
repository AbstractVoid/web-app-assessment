#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BackendStack } from '../lib/backend-stack';
import { Region, } from '../lib/constants';


new BackendStack(new cdk.App(), 'BackendStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: Region }
});
