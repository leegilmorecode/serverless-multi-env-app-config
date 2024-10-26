import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

import { Construct } from 'constructs';
import { Stage } from '../types';
import { getRemovalPolicyFromStage } from '../utils';

export interface OrdersServiceStatefulStackProps extends cdk.StackProps {
  shared: {
    stage: Stage;
  };
  env: {
    account: string;
    region: string;
  };
  stateful: {
    tableName: string;
  };
}

export class OrdersServiceStatefulStack extends cdk.Stack {
  public readonly table: dynamodb.Table;

  constructor(
    scope: Construct,
    id: string,
    props: OrdersServiceStatefulStackProps,
  ) {
    super(scope, id, props);

    const {
      shared: { stage },
      stateful: { tableName },
    } = props;

    // we create a basic table for this example
    this.table = new dynamodb.Table(this, 'OrdersServiceTable', {
      tableName: tableName,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: getRemovalPolicyFromStage(stage),
    });
  }
}
