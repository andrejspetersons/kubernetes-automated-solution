import { client } from "./db-client.js"

export async function ensureDbConnected(){
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS docker_images (
      image_name TEXT PRIMARY KEY,
      last_updated TIMESTAMP
    );
  `);
}

export async function CheckIfImageExistInDB(name){
  const res=await client.query(`SELECT 1 from docker_images WHERE image_name = $1`,[name])
  return res.rowCount>0
}

export async function getStoredImageDate(name){
  const res = await client.query(
    `SELECT last_updated FROM docker_images WHERE image_name = $1`,
    [name]
  );
  return res.rows[0]?.last_updated || null
}

export async function upsertImageDate(name,updateAt){
  await client.query(`
      INSERT INTO docker_images (image_name,last_updated)
      VALUES ($1,$2)
      ON CONFLICT (image_name)
      DO UPDATE SET last_updated = $2`,[name,updateAt])
}

export async function closeConnection(){
    await client.end()
}