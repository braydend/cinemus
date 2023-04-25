import type { APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import { type APIGatewayProxyWithLambdaAuthorizerEvent } from "aws-lambda/trigger/api-gateway-proxy";

interface JWT {
  claims: {
    iss: string;
    sub: string;
    sud: string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
  };
  scopes: string[];
}

type AuthorisedApiGatewayEvent = APIGatewayProxyWithLambdaAuthorizerEvent<{
  jwt: JWT;
}>;
export type AuthorisedAPIGatewayProxyEvent = Handler<
  AuthorisedApiGatewayEvent,
  APIGatewayProxyResult
>;

type ValidatedAPIGatewayProxyEvent<
  Body extends JSONSchema,
  QueryParams extends JSONSchema = Record<string, never>
> = Omit<AuthorisedApiGatewayEvent, "body" | "queryStringParameters"> & {
  body: FromSchema<Body>;
  queryStringParameters: FromSchema<QueryParams>;
};
export type ValidatedEventAPIGatewayProxyEvent<
  Body extends JSONSchema,
  QueryParams extends JSONSchema = Record<string, never>
> = Handler<
  ValidatedAPIGatewayProxyEvent<Body, QueryParams>,
  APIGatewayProxyResult
>;

type ValidatedGetAPIGatewayProxyEvent<S extends JSONSchema> = Omit<
  AuthorisedApiGatewayEvent,
  "queryStringParameters"
> & { queryStringParameters: FromSchema<S> };
export type ValidatedGetEventAPIGatewayProxyEvent<S extends JSONSchema> =
  Handler<ValidatedGetAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

interface JSONResponse {
  statusCode: number;
  body: string;
}

export const formatJSONResponse = (
  response: Record<string, unknown>
): JSONResponse => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export const formatErrorResponse = (
  error: Error,
  statusCode: number = 500
): JSONResponse => {
  return {
    statusCode,
    body: JSON.stringify({ error: error.message }),
  };
};
