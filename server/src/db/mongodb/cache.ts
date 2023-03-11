import {upsert} from "./upsert";
import dayjs from "dayjs";
import {retrieveOne} from "./retrieveOne";
import {Document, Filter} from "mongodb";

interface Cacheable<Data> {
    type: string,
    key: string,
    expiry: number,
    data: Data
}

export const addToCache = async <Data>(type: string, key: string, data: Data): Promise<Cacheable<Data>> => {
    const expiry = dayjs().add(3, "days").unix()
    const dataToCache: Cacheable<Data> = {type, key, data, expiry}
    const filter = {key, type}

    return await upsert("cache", dataToCache, filter)
};

export const retrieveFromCache = async <Data>(type: string, key: string): Promise<Cacheable<Data>|null> => {
    const currentTimestamp = dayjs().unix()
    const filter: Filter<Document> = {key, type, expiry: {$gt: currentTimestamp}}

    return await retrieveOne<Cacheable<Data>>("cache", filter)
};