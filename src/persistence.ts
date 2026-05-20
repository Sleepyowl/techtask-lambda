import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { env } from "./env";
import { Notification } from "./models";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export async function getNotifications(since?: string): Promise<Notification[]> {

  // TODO: Change to QueryCommand (needs secondary index)
  const result = await db.send(
    new ScanCommand({
      TableName: env.notificationsTable,

      ...(since
        ? {
            FilterExpression: "updatedAt >= :since",
            ExpressionAttributeValues: {
              ":since": since,
            },
          }
        : {}),

      Limit: env.notificationsLimit,
    })
  );

  return (result.Items ?? []) as Notification[];
}

export async function getNotification(id: string): Promise<Notification | undefined> {
  const result = await db.send(
    new GetCommand({
      TableName: env.notificationsTable,

      Key: {
        id,
      },
    })
  );

  return result.Item as Notification | undefined;
}

export async function createNotification(notification: Notification): Promise<void> {
  await db.send(
    new PutCommand({
      TableName: env.notificationsTable,

      Item: notification,

      ConditionExpression: "attribute_not_exists(id)",
    })
  );
}

export async function updateNotification(notification: Notification): Promise<void> {
  await db.send(
    new UpdateCommand({
      TableName: env.notificationsTable,

      Key: {
        id: notification.id,
      },

      UpdateExpression: `
        SET
          severity = :severity,
          title = :title,
          summary = :summary,
          content = :content,
          updatedAt = :updatedAt
      `,

      ExpressionAttributeValues: {
        ":severity": notification.severity,
        ":title": notification.title,
        ":summary": notification.summary,
        ":content": notification.content,
        ":updatedAt": notification.updatedAt,
      },

      ConditionExpression: "attribute_exists(id)",
    })
  );
}

export async function deleteNotification(id: string): Promise<void> {
  await db.send(
    new DeleteCommand({
      TableName: env.notificationsTable,

      Key: {
        id,
      },

      ConditionExpression: "attribute_exists(id)",
    })
  );
}
