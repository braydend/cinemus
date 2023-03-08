import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

// @ts-ignore
export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser())
}
