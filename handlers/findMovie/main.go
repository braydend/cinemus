package main

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/braydend/movie-list/api"
	"github.com/braydend/movie-list/db/mongo"
	"github.com/braydend/movie-list/utils"
	"log"
)

type Response events.APIGatewayProxyResponse

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	var buf bytes.Buffer
	query := utils.GetQueryParameter(request, "query")
	results, err := mongo.GetFromCache(query, "movie")

	if err != nil {
		var media []mongo.Media
		queryResults := api.FindShow(query)

		for _, result := range queryResults {
			media = append(media, mongo.Media{Id: result.ID, Name: result.Name})
		}

		mongo.AddToCache(mongo.SearchResults{Query: query, Results: media, MediaType: "movie"})

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
