import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

import { Construct } from 'constructs';
import { Stage } from '../types';
import { getRemovalPolicyFromStage } from '../utils';

export interface OrdersServiceStatelessStackProps extends cdk.StackProps {
  shared: {
    stage: Stage;
    serviceName: string;
    metricNamespace: string;
    logging: {
      logLevel: 'DEBUG' | 'INFO' | 'ERROR';
      logEvent: 'true' | 'false';
    };
  };
  env: {
    account: string;
    region: string;
  };
  stateless: {
    runtimes: lambda.Runtime;
  };
  table: dynamodb.Table;
}

export class OrdersServiceStatelessStack extends cdk.Stack {
  private table: dynamodb.Table;
  private api: apigw.RestApi;

  constructor(
    scope: Construct,
    id: string,
    props: OrdersServiceStatelessStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: {
        stage,
        serviceName,
        metricNamespace,
        logging: { logLevel, logEvent },
      },
      stateless: { runtimes },
      table,
    } = props;

    this.table = table;

    const lambdaConfig = {
      LOG_LEVEL: logLevel,
      POWERTOOLS_LOGGER_LOG_EVENT: logEvent,
      POWERTOOLS_LOGGER_SAMPLE_RATE: '1',
      POWERTOOLS_TRACE_ENABLED: 'enabled',
      POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'true',
      POWERTOOLS_SERVICE_NAME: serviceName,
      POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'true',
      POWERTOOLS_METRICS_NAMESPACE: metricNamespace,
    };

    // create a basic lambda function for creating orders
    const createOrderLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'CreateOrderLambda', {
        functionName: `create-order-lambda-${stage}`,
        runtime: runtimes,
        entry: path.join(
          __dirname,
          './src/adapters/primary/create-order/create-order.adapter.ts',
        ),
        memorySize: 1024,
        handler: 'handler',
        architecture: lambda.Architecture.ARM_64,
        tracing: lambda.Tracing.ACTIVE,
        environment: {
          ...lambdaConfig,
          TABLE_NAME: this.table.tableName,
        },
        bundling: {
          minify: true,
          externalModules: ['@aws-sdk/*'],
        },
      });
    createOrderLambda.applyRemovalPolicy(getRemovalPolicyFromStage(stage));

    // give the lambda function access to the dynamodb table
    this.table.grantWriteData(createOrderLambda);

    // create our api for creating orders
    this.api = new apigw.RestApi(this, 'Api', {
      description: `(${stage}) lj fast food api`,
      restApiName: `${stage}-lj-fast-food-service-api`,
      deploy: true,
      deployOptions: {
        stageName: 'api',
        loggingLevel: apigw.MethodLoggingLevel.INFO,
      },
    });

    const root: apigw.Resource = this.api.root.addResource('v1');
    const appointments: apigw.Resource = root.addResource('orders');

    // point the api resource to the lambda function
    appointments.addMethod(
      'POST',
      new apigw.LambdaIntegration(createOrderLambda, {
        proxy: true,
      }),
    );
  }
}
