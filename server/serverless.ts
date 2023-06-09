/* eslint-disable no-template-curly-in-string */

import type { AWS } from "@serverless/typescript";

import {
  getList,
  getMovie,
  getShow,
  searchMovies,
  searchShows,
  updateList,
  getWatchProviderRegions,
  getUserPreferences,
  updateUserPreferences,
} from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "cinemus",
  app: "cinemus",
  org: "braydend",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
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
      MONGO_CONNECTION_STRING: "${param:MONGO_CONNECTION_STRING}",
      DATABASE_NAME: "${param:DATABASE_NAME}",
      TMDB_URL: "${param:TMDB_URL}",
      MOVIE_DB_API_KEY: "${param:MOVIE_DB_API_KEY}",
      SENTRY_DSN: "${param:SENTRY_DSN}",
      SENTRY_RELEASE: "${env:GITHUB_SHA}",
      UPSTASH_REDIS_API_KEY: "${param:UPSTASH_REDIS_API_KEY}",
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
    getWatchProviderRegions,
    getUserPreferences,
    updateUserPreferences,
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
    "serverless-offline": { ignoreJWTSignature: true },
  },
};

module.exports = serverlessConfiguration;
