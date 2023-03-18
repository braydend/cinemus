import schema from "./schema";
import { handlerPath } from "../../../libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "post",
        path: "/postRequestTemplate",
        authorizer: {
          name: "jwtAuth",
        },
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
