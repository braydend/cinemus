package main

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/braydend/movie-list/api"
	"github.com/braydend/movie-list/utils"
)

type Response events.APIGatewayProxyResponse

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (Response, error) {
	var buf bytes.Buffer
	query := utils.GetQueryParameter(request, "query")
	results := api.FindShow(query)
	json.HTMLEscape(&buf, results)

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
