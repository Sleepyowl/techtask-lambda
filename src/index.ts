import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { notFound, internalError } from "./api-helpers";
import { routes } from "./api-handlers"


export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const routeKey = event.routeKey;
  const route = routes[routeKey];

  if (!route) {
    return notFound();
  }

  try {
    return await route(event);
  } catch (err) {
    console.error(err);
    return internalError();
  }
};


