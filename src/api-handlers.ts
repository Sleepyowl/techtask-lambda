import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import {
  badRequest,
  created,
  internalError,
  noContent,
  notFound,
  ok,
} from "./api-helpers";

import {
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  updateNotification,
} from "./persistence";

import { Notification } from "./models";

export type RouteHandler = (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>;

export const routes: Record<string, RouteHandler> = {
  "GET /notifications": getNotificationsHandler,
  "GET /notifications/{id}": getNotificationHandler,
  "POST /notifications": createNotificationHandler,
  "PUT /notifications/{id}": updateNotificationHandler,
  "DELETE /notifications/{id}": deleteNotificationHandler,
};

async function getNotificationsHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const since = event.queryStringParameters?.since;

    const notifications = await getNotifications(since);

    return ok(notifications);
  } catch (err) {
    console.error(err);

    return internalError();
  }
}

async function getNotificationHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return badRequest("Missing notification id");
    }

    const notification = await getNotification(id);

    if (!notification) {
      return notFound("Notification not found");
    }

    return ok(notification);
  } catch (err) {
    console.error(err);

    return internalError();
  }
}

async function createNotificationHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    if (!event.body) {
      return badRequest("Missing request body");
    }

    const notification = JSON.parse(event.body) as Notification;

    await createNotification(notification);

    return created(notification);
  } catch (err) {
    console.error(err);

    return internalError();
  }
}

async function updateNotificationHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return badRequest("Missing notification id");
    }

    if (!event.body) {
      return badRequest("Missing request body");
    }

    const notification = JSON.parse(event.body) as Notification;

    notification.id = id;

    await updateNotification(notification);

    return ok(notification);
  } catch (err) {
    console.error(err);

    return internalError();
  }
}

async function deleteNotificationHandler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return badRequest("Missing notification id");
    }

    await deleteNotification(id);

    return noContent();
  } catch (err) {
    console.error(err);

    return internalError();
  }
}
