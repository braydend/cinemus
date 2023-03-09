import {MongoClient} from "mongodb";
import {db, secrets} from "../../config";

const uri = `mongodb+srv://${secrets.MONGO_DB_USERNAME}:${secrets.MONGO_DB_PASSWORD}@movielist.3cizhk9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export const getDatabase = () => {
    return client.db(db.DATABASE_NAME)
}