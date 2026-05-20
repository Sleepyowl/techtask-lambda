import { APIGatewayProxyResultV2 } from "aws-lambda";

type ErrorBody = {
  message: string;
};

function jsonResponse<T>(statusCode: number, body: T): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}


export function ok<T>(body: T): APIGatewayProxyResultV2 {
  return jsonResponse(200, body);
}

export function created<T>(body: T): APIGatewayProxyResultV2 {
  return jsonResponse(201, body);
}

export function noContent(): APIGatewayProxyResultV2 {
  return {
    statusCode: 204,
  };
}

export function badRequest(message = "Bad request"): APIGatewayProxyResultV2 {
  return jsonResponse<ErrorBody>(400, {
    message,
  });
}

export function notFound(message = "Not found"): APIGatewayProxyResultV2 {
  return jsonResponse<ErrorBody>(404, {
    message,
  });
}

export function internalError(message = "Internal server error"): APIGatewayProxyResultV2 {
  return jsonResponse<ErrorBody>(500, {
    message,
  });
}

export function forbidden(message = "Forbidden"): APIGatewayProxyResultV2 {
  return jsonResponse(403, {
    message,
  });
}
