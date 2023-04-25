export const bodySchema = {
  type: "object",
  properties: {
    media: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          __type: {
            enum: ["movie", "show"],
          },
          isWatched: {
            type: "boolean",
          },
        },
        required: ["id", "__type"],
      },
    },
  },
  required: ["media"],
} as const;

export const queryParamsSchema = {
  type: "object",
  properties: {
    region: { type: "string" },
  },
} as const;
