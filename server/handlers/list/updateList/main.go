package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/braydend/movie-list/server/db/mongo"
	"github.com/braydend/movie-list/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"log"
)

type Response events.APIGatewayProxyResponse

type RequestBody struct {
	MediaIds []int `json:"ids" bson:"ids"`
}

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	var body RequestBody
	sub, err := utils.GetSubjectFromJwtDataString(fmt.Sprintf("%v", request.RequestContext.Authorizer["jwt"]))

	if err != nil {
		log.Fatalf("%v", err)
	}

	err = json.Unmarshal([]byte(request.Body), &body)

	if err != nil {
		log.Fatalf("Failed to parse request body to struct: %v.\n %s", request.Body, err)
	}

	err = mongo.Upsert("lists", body, bson.D{{"user", sub}})

	if err != nil {
		log.Fatalf("Failed to upsert list: %s", err)
	}

	resp := Response{
		StatusCode:      200,
		IsBase64Encoded: false,
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
