package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"log"
	"time"
)

func GetFromCache(query string, mediaType string) ([]Media, error) {
	var result CachedSearchResult
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

type Media struct {
	Id   int
	Name string
}

type SearchResults struct {
	Query     string `bson:"query"`
	Results   []Media
	MediaType string `bson:"mediaType"`
}

type CachedSearchResult struct {
	SearchResults `bson:"searchResults"`
	Expiry        int64  `bson:"expiry"`
	ID            string `bson:"_id"`
}

func AddToCache(value SearchResults) {
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
