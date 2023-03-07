package main

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/braydend/movie-list/server/api"
	"github.com/braydend/movie-list/server/db/mongo"
	"github.com/braydend/movie-list/server/domain"
	"github.com/braydend/movie-list/server/types"
	"github.com/braydend/movie-list/server/utils"
	"log"
)

type Response events.APIGatewayProxyResponse

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	var buf bytes.Buffer
	query := utils.GetQueryParameter(request, "query")

	results, err := mongo.GetFromCache(query, "tv")

	if err != nil {
		var media []types.Media
		queryResults := api.SearchShows(query)

		for _, result := range queryResults {
			media = append(media, domain.ParseMediaFromShow(result))
		}

		mongo.AddToCache(types.SearchResults{Query: query, Results: media, MediaType: "tv"})

		results = media
	}

	responseData, err := json.Marshal(results)

	if err != nil {
		log.Fatal(err)
	}

	json.HTMLEscape(&buf, responseData)

	resp := Response{
		StatusCode:      200,
		IsBase64Encoded: false,
		Body:            buf.String(),
		Headers: map[string]string{
			"Content-Type":           "application/json",
			"X-MyCompany-Func-Reply": "findMovie-handler",
		},
	}

	return resp, nil
}

func main() {
	lambda.Start(Handler)
}
