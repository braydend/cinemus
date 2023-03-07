package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
)

func Retrieve[DataType any](collection string, filter bson.M, data *DataType) error {
	db := getDatabase()
	coll := db.Collection(collection)

	err := coll.FindOne(context.TODO(), filter).Decode(&data)
	fmt.Printf("data: %v", data)

	if err == mongo.ErrNoDocuments {
		log.Printf("No documents found in %s for filter %v", collection, filter)
		return err
	}

	if err != nil {
		log.Printf("Error retrieving from %s with filter %v: %v", collection, filter, err)
		return err
	}

	return nil
}
