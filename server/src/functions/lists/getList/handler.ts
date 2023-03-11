import {
  AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import {retrieveOne} from "../../../db/mongodb/retrieveOne";

const getList: AuthorisedAPIGatewayProxyEvent = async (event) => {
  const { requestContext: { authorizer: { jwt: { claims: { sub }} }} } = event
  const [_, userId] = sub.split("|")

  const data = await retrieveOne("lists", {userId})

  return formatJSONResponse({
    data
  });
};

export const main = middyfy(getList);
