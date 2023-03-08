package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

func Upsert(collection string, data interface{}, filter bson.D) error {
	db := getDatabase()
	coll := db.Collection(collection)

	update := bson.D{{"$set", data}}
	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(context.TODO(), filter, update, opts)
	if err != nil {
		log.Fatalf("Failed to upsert list: %v", err)
	}

	return nil
}
