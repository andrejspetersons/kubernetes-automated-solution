import { MongoClient } from "mongodb";
import { MONGO_DB, MONGO_HOST, MONGO_PASSWORD, MONGO_USERNAME } from "./env-variables.js";

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/${MONGO_DB}?directConnection=true&authSource=admin`
export const client = new MongoClient(url)
export const db = client.db(MONGO_DB) // line in db-client.js separately
/*import {Client} from 'pg'
import { POSTGRES_HOST,POSTGRES_PORT,POSTGRES_USER,POSTGRES_PASSWORD,POSTGRES_DB_NAME } from './env-variables.js'

export const client=new Client({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB_NAME,    
})*/