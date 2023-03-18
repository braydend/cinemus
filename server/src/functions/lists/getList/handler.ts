import {
  type AuthorisedAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../../libs/api-gateway";
import { middyfy } from "../../../libs/lambda";
import { retrieveOne } from "../../../db/mongodb/retrieveOne";
import { getMovie } from "../../../domain/movie";
import { getShow } from "../../../domain/show";
import { type List } from "../../../domain/list";

const getList: AuthorisedAPIGatewayProxyEvent = async (event) => {
  const {
    requestContext: {
      authorizer: {
        jwt: {
          claims: { sub },
        },
      },
    },
  } = event;
  const [_, userId] = sub.split("|");

  const data = await retrieveOne<List>("lists", { userId });

  if (data == null) {
    return formatJSONResponse({
      data,
    });
  }

  const hydratedData = await Promise.all(
    data.media.map(async (media) =>
      media.__type === "movie"
        ? await getMovie(media.id)
        : await getShow(media.id)
    )
  );

  return formatJSONResponse({
    data: hydratedData,
  });
};

export const main = middyfy(getList);
