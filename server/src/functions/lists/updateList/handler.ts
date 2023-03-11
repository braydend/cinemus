import type { ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';

import schema from './schema';
import {upsert} from "../../../db/mongodb/upsert";

const updateList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const {
    requestContext: {
      authorizer: {
        jwt: {
          claims: {
            sub
          }
        }
      }
    },
    body: {
      ids
    },
  } = event
  const [_, userId] = sub.split("|")
  const data = {userId, ids}

  const result = await upsert("lists", data, {userId })

  return formatJSONResponse({
    data: result
  });
};

export const main = middyfy(updateList);
