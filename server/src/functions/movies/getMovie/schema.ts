export default {
  type: "object",
  properties: {
    id: { type: "string" },
    region: { type: "string" },
  },
  required: ["id"],
} as const;
