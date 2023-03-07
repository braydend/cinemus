package main

import (
	"bytes"
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

type List struct {
	MediaIds []int `json:"ids" bson:"ids"`
}

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	var list List
	var buf bytes.Buffer

	sub, err := utils.GetSubjectFromJwtDataString(fmt.Sprintf("%v", request.RequestContext.Authorizer["jwt"]))

	if err != nil {
		log.Fatalf("%v", err)
	}

	err = mongo.Retrieve("lists", bson.M{"user": sub}, &list)
	fmt.Printf("list: %v", list)

	if err != nil {
		log.Fatalf("Failed to retrieve list: %s", err)
	}

	responseData, err := json.Marshal(list)

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
			"X-MyCompany-Func-Reply": "getList-handler",
		},
	}

	return resp, nil
}

func main() {
	lambda.Start(Handler)
}
