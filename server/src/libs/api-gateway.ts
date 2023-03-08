import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type {FromSchema, JSONSchema} from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>


type ValidatedGetAPIGatewayProxyEvent<S extends JSONSchema> = Omit<APIGatewayProxyEvent, 'queryStringParameters'> & { queryStringParameters: FromSchema<S> }
export type ValidatedGetEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<ValidatedGetAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
