import type { ValidatedEventAPIGatewayProxyEvent } from '../../../libs/api-gateway';
import { formatJSONResponse } from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';

import schema from './schema';
import {upsert} from "../../../db/mongodb/upsert";
import {getMovie} from "../../../domain/movie";
import {getShow} from "../../../domain/show";

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
      media
    },
  } = event
  const [_, userId] = sub.split("|")
  const data: List = {userId, media}

  const result = await upsert<List>("lists", data, {userId })

  const hydratedResults = await Promise.all(result.media.map((media) => media.__type === "movie" ? getMovie(media.id) : getShow(media.id)))

  return formatJSONResponse({
    data: hydratedResults
  });
};

export const main = middyfy(updateList);
