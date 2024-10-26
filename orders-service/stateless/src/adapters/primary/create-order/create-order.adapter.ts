import { MetricUnit, Metrics } from '@aws-lambda-powertools/metrics';
import { errorHandler, getHeaders, logger, schemaValidator } from '@shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import { config } from '@config';
import { CreateOrder } from '@dto/create-order';
import { Order } from '@dto/order';
import { ValidationError } from '@errors/validation-error';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { createOrderUseCase } from '@use-cases/create-order';
import { schema } from './create-order.schema';

const tracer = new Tracer();
const metrics = new Metrics();

const stage = config.get('stage');

export const createOrderAdapter = async ({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!body) throw new ValidationError('no payload body');

    const order = JSON.parse(body) as CreateOrder;

    schemaValidator(schema, order);

    const created: Order = await createOrderUseCase(order);

    metrics.addMetric('SuccessfulCreateOrder', MetricUnit.Count, 1);

    return {
      statusCode: 201,
      body: JSON.stringify(created),
      headers: getHeaders(stage),
    };
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) errorMessage = error.message;
    logger.error(errorMessage);

    metrics.addMetric('CreateOrderError', MetricUnit.Count, 1);

    return errorHandler(error);
  }
};

export const handler = middy(createOrderAdapter)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics))
  .use(httpErrorHandler());
