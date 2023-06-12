import { formatJSONResponse } from "./api-gateway";

describe("api-gateway", () => {
  it("correctly formats successful response", () => {
    const stubBody = {
      text: "this is a text field",
      number: 69,
      object: {
        name: "This is the object's name",
      },
      array: [1, 2, 3, 4],
    };
    const result = formatJSONResponse(stubBody);

    expect(result).toStrictEqual({
      statusCode: 200,
      body: `{"text":"this is a text field","number":69,"object":{"name":"This is the object's name"},"array":[1,2,3,4]}`,
    });
  });
});
