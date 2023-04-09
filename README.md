# Cinemus

## Local Development

When developing locally, the serverless backend can be run using the `serverless-offline` plugin.
This is already configured, but you will need to pass some CLI flags in order to get Auth0 to work.

The `--ignoreJWTSignature` flag is required in order to work with the JWT authoriser locally.

The `--noTimeout` flag is required to prevent the functions from timing out locally.

e.g.
```shell
npm run dev -- --param="MOVIE_DB_API_KEY={YOUR_API_KEY}" --param="JWT_ISSUER={AUTH0-ISSUER}" --param="JWT_AUDIENCE={AUTH0-AUDIENCE}" --param="MONGO_DB_USERNAME={MONGODB-LOCAL-USERNAME}" --param="MONGO_DB_PASSWORD={MONGODB-LOCAL-PASSWORD}" --param="DATABASE_NAME=local-dev" --ignoreJWTSignature --noTimeout
```

### Parameter description

| Name              | Description                                                            |
|-------------------|------------------------------------------------------------------------|
| MOVIE_DB_API_KEY  | Your API key for accessing TMDB                                        |
| JWT_ISSUER        | The Auth0 application to authenticate with                             |
| JWT_AUDIENCE      | The Auth0 service that can the user will access with their credentials |
| MONGO_DB_USERNAME | MongoDB username                                                       |
| MONGO_DB_PASSWORD | MongoDB password                                                       |
| DATABASE_NAME     | MongoDB database to use                                                |
| SENTRY_DSN        | Sentry DSN for the backend                                             |