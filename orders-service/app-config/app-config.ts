import * as lambda from 'aws-cdk-lib/aws-lambda';

import { Region, Stage } from '../types';

export interface EnvironmentConfig {
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
  stateful: {
    tableName: string;
  };
}

export const getEnvironmentConfig = (stage: Stage): EnvironmentConfig => {
  switch (stage) {
    case Stage.test:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `lj-fast-food-service-${Stage.test}`,
          metricNamespace: `lj-fast-food-${Stage.test}`,
          stage: Stage.test,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_20_X,
        },
        env: {
          account: '111111111111',
          region: Region.london,
        },
        stateful: {
          tableName: `orders-table-${Stage.test}`,
        },
      };
    case Stage.staging:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `lj-fast-food-service-${Stage.staging}`,
          metricNamespace: `lj-fast-food-${Stage.staging}`,
          stage: Stage.staging,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_20_X,
        },
        env: {
          account: '222222222222',
          region: Region.london,
        },
        stateful: {
          tableName: `orders-table-${Stage.staging}`,
        },
      };
    case Stage.prod:
      return {
        shared: {
          logging: {
            logLevel: 'INFO',
            logEvent: 'true',
          },
          serviceName: `lj-fast-food-service-${Stage.prod}`,
          metricNamespace: `lj-fast-food-${Stage.prod}`,
          stage: Stage.prod,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_20_X,
        },
        env: {
          account: '333333333333',
          region: Region.london,
        },
        stateful: {
          tableName: `orders-table-${Stage.prod}`,
        },
      };
    case Stage.develop:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `lj-fast-food-service-${Stage.develop}`,
          metricNamespace: `lj-fast-food-${Stage.develop}`,
          stage: Stage.develop,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_20_X,
        },
        env: {
          account: '444444444444',
          region: Region.dublin,
        },
        stateful: {
          tableName: `orders-table-${Stage.develop}`,
        },
      };
    default:
      return {
        shared: {
          logging: {
            logLevel: 'DEBUG',
            logEvent: 'true',
          },
          serviceName: `lj-fast-food-service-${stage}`,
          metricNamespace: `lj-fast-food-${stage}`,
          stage: stage,
        },
        stateless: {
          runtimes: lambda.Runtime.NODEJS_20_X,
        },
        env: {
          account: '444444444444',
          region: Region.dublin,
        },
        stateful: {
          tableName: `orders-table-${stage}`,
        },
      };
  }
};
