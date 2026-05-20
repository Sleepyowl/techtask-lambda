const TABLE_NAME = "NotificationsTest";
process.env.NOTIFICATIONS_TABLE = TABLE_NAME;
process.env.DYNAMODB_ENDPOINT = "http://localhost:8000";
process.env.AWS_REGION = "local";
process.env.AWS_ACCESS_KEY_ID = "local";
process.env.AWS_SECRET_ACCESS_KEY = "local";

import { randomUUID } from "crypto";

import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { createNotification } from "../src/persistence";
import { Notification } from "../src/models";


const client = new DynamoDBClient({
  endpoint: "http://localhost:8000",
  region: "local",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const db = DynamoDBDocumentClient.from(client);

beforeAll(async () => {

  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,

      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],

      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],

      BillingMode: "PAY_PER_REQUEST",
    })
  );
});

afterAll(async () => {
  await client.send(
    new DeleteTableCommand({
      TableName: TABLE_NAME,
    })
  );
});

test("createNotification stores notification", async () => {
  const notification: Notification = {
    id: randomUUID(),
    severity: "info",
    title: "Test",
    summary: "Summary",
    content: "Content",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await createNotification(notification);

  const result = await db.send(
    new GetCommand({
      TableName: TABLE_NAME,

      Key: {
        id: notification.id,
      },
    })
  );

  expect(result.Item).toEqual(notification);
});

