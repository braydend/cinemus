package utils

import (
	"github.com/aws/aws-lambda-go/events"
	"log"
)

func GetQueryParameter(request events.APIGatewayProxyRequest, key string) (val string) {
	val = request.QueryStringParameters[key]

	if len(val) == 0 {
		log.Fatal("Missing query string")
	}

	return val
}
