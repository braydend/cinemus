/*
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
 */

import {getDatabase} from "./instance";
import {Filter} from "mongodb";

export const retrieveOne = async <Data extends object>(collection: string, filter: Filter<unknown>): Promise<Data|null> => {
    const db = getDatabase();
    const mongoCollection = db.collection(collection)

    try {
    return await mongoCollection.findOne<Data>(filter)
    } catch (e) {
        throw Error(`Failed to retrieve from collection "${collection}" with filter: ${JSON.stringify(filter)}. ${e}`)
    }
};