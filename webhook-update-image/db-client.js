import { Client } from 'pg'
import { POSTGRES_HOST, POSTGRES_DB_NAME, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from './env-variables.js'

export const client=new Client({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB_NAME,
})