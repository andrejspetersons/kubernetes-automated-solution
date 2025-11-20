import { client } from "./db-client.js";

export async function ensureDbConnected(){
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS docker_images (
      image_digest TEXT PRIMARY KEY,
      image_name TEXT,
      image_tag TEXT,
      last_updated TIMESTAMP,
      isSafe BOOLEAN
    );
  `);
}

export async function safeImageExist(name){
  const result=await client.query(`
      SELECT image_tag
      FROM docker_images
      WHERE image_name=$1 AND isSafe=true
    `,[name])
  return result.rows[0]?.image_tag || null
}

export async function addAsUnsafe(data){
  await client.query(`
      INSERT INTO docker_images (image_digest,image_name,image_tag,last_updated,isSafe)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (image_digest)
      DO NOTHING`,[data.digest,data.fullName,data.tagName,data.lastUpdated,false])
}

export async function addAsSafe(data) {
  await client.query(`
      INSERT INTO docker_images (image_digest,image_name,image_tag,last_updated,isSafe)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (image_digest)
      DO NOTHING`,[data.digest,data.fullName,data.tagName,data.lastUpdated,true])
}

export async function closeConnection(){
    await client.end()
}