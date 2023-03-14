import {
  AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from '../../../libs/api-gateway';
import { middyfy } from '../../../libs/lambda';
import {retrieveOne} from "../../../db/mongodb/retrieveOne";
import {getMovie} from "../../../domain/movie";
import {getShow} from "../../../domain/show";

const getList: AuthorisedAPIGatewayProxyEvent = async (event) => {
  const { requestContext: { authorizer: { jwt: { claims: { sub }} }} } = event
  const [_, userId] = sub.split("|")

  const data = await retrieveOne<List>("lists", {userId})

  if (!data) {
    return formatJSONResponse({
      data
    });
  }

  const hydratedData = await Promise.all(data.media.map((media) => media.__type === "movie" ? getMovie(media.id) : getShow(media.id)))

  return formatJSONResponse({
    data: hydratedData
  });
};

export const main = middyfy(getList);
