/* eslint-disable no-template-curly-in-string */

import type { AWS } from "@serverless/typescript";

import {
  getList,
  getMovie,
  getShow,
  searchMovies,
  searchShows,
  updateList,
} from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "cinemus",
  app: "cinemus",
  org: "braydend",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    stage: "dev",
    region: "ap-southeast-2",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: true,
      authorizers: {
        jwtAuth: {
          type: "jwt",
          identitySource: "$request.header.Authorization",
          issuerUrl: "${param:JWT_ISSUER}",
          audience: ["${param:JWT_AUDIENCE}"],
        },
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      MOVIE_DB_API_KEY: "${param:MOVIE_DB_API_KEY}",
      MONGO_DB_USERNAME: "${param:MONGO_DB_USERNAME}",
      MONGO_DB_PASSWORD: "${param:MONGO_DB_PASSWORD}",
      DATABASE_NAME: "${param:DATABASE_NAME}",
    },
  },
  // import the function via paths
  functions: {
    searchMovies,
    searchShows,
    getList,
    updateList,
    getMovie,
    getShow,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
