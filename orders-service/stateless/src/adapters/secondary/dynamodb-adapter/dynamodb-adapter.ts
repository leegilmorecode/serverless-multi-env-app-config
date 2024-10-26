import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { marshall } from '@aws-sdk/util-dynamodb';
import { logger } from '@shared';

const dynamoDb = new DynamoDBClient({});

// Example usage:
// const upsertedUser: User = await upsert<User>(newUser, "users", "user123");
export async function upsert<T>(
  newItem: T,
  tableName: string,
  id: string,
): Promise<T> {
  const params = {
    TableName: tableName,
    Item: marshall(newItem),
  };

  try {
    await dynamoDb.send(new PutItemCommand(params));

    logger.debug(`item created with ID ${id} into ${tableName}`);

    return newItem;
  } catch (error) {
    logger.error(`error creating item: ${error}`);
    throw error;
  }
}
