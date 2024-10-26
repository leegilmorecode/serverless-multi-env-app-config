#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { getEnvironmentConfig } from '../app-config';
import { OrdersServiceStatefulStack } from '../stateful/stateful';
import { OrdersServiceStatelessStack } from '../stateless/stateless';
import { Stage } from '../types';
import { getStage } from '../utils';

const stage = getStage(process.env.STAGE as Stage) as Stage;
const appConfig = getEnvironmentConfig(stage);

const app = new cdk.App();

const statefulStack = new OrdersServiceStatefulStack(
  app,
  'OrdersServiceStatefulStack',
  {
    env: appConfig.env,
    stateful: appConfig.stateful,
    shared: appConfig.shared,
  },
);

new OrdersServiceStatelessStack(app, 'OrdersServiceStatelessStack', {
  env: appConfig.env,
  stateless: appConfig.stateless,
  shared: appConfig.shared,
  table: statefulStack.table,
});
