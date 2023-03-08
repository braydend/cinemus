package mongo

import (
	"context"
	"fmt"
	"github.com/braydend/movie-list/server/types"
	"go.mongodb.org/mongo-driver/bson"
	"log"
	"time"
)

func GetFromCache(query string, mediaType string) ([]types.Media, error) {
	var result types.CachedSearchResult
	currentDate := time.Now().Unix()

	filter := bson.M{
		"$and": []bson.M{
			bson.M{"searchResults.query": query},
			bson.M{"searchResults.mediaType": mediaType},
			bson.M{"expiry": bson.M{"$gt": currentDate}},
		},
	}

	err := Retrieve("cache", filter, &result)

	if err != nil {
		return nil, err
	}

	return result.Results, nil
}

func AddToCache(value types.SearchResults) {
	db := getDatabase()
	coll := db.Collection("cache")
	expiry := time.Now().AddDate(0, 0, 3).Unix()
	data := bson.M{"searchResults": value, "expiry": expiry}
	result, err := coll.InsertOne(context.TODO(), data)

	if err != nil {
		log.Fatalf("Failed to add %v to cache", value)
	}

	fmt.Printf("Inserted document with _id: %v\n", result.InsertedID)
}
