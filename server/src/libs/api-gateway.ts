import type {APIGatewayProxyResult, Handler } from "aws-lambda"
import type {FromSchema, JSONSchema} from "json-schema-to-ts";
import {APIGatewayProxyWithLambdaAuthorizerEvent} from "aws-lambda/trigger/api-gateway-proxy";

/*
{
  claims: {
    iss: 'https://dev-pt5nxvvf.au.auth0.com/',
    sub: 'auth0|63fd31f5d7ea5c12c38c52f6',
    aud: [ 'localhost:3000', 'https://dev-pt5nxvvf.au.auth0.com/userinfo' ],
    iat: 1678343750,
    exp: 1678430150,
    azp: 'XFquV2psiu7v2mhCqcjZdPU0lkdgOFCJ',
    scope: 'openid profile email'
  },
  scopes: [ 'openid', 'profile', 'email' ]
}
 */

type JWT = {
  claims: {
    iss: string,
    sub: string,
    sud: string[],
    iat: number,
    exp: number,
    azp: string,
    scope: string
  },
  scopes: string[]
}

type AuthorisedApiGatewayEvent = APIGatewayProxyWithLambdaAuthorizerEvent<{jwt:JWT}>
export type AuthorisedAPIGatewayProxyEvent = Handler<AuthorisedApiGatewayEvent, APIGatewayProxyResult>

type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<AuthorisedApiGatewayEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>


type ValidatedGetAPIGatewayProxyEvent<S extends JSONSchema> = Omit<AuthorisedApiGatewayEvent, 'queryStringParameters'> & { queryStringParameters: FromSchema<S> }
export type ValidatedGetEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<ValidatedGetAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
