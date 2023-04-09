export default {
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
