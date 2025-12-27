import { client } from "./db-client.js";
import { db } from "./db-client.js";

export async function initDatabase(){
  await client.connect();
  await db.collection("images").createIndex(
    {image_digest: 1},
    {unique: true, name: "unique_image_digest"}
  )
  /*await client.query(`
    CREATE TABLE IF NOT EXISTS docker_images (
      image_digest TEXT PRIMARY KEY,
      image_name TEXT,
      image_tag TEXT,
      last_updated TIMESTAMP,
      isSafe BOOLEAN
    );
  `);*/
}

export async function safeImageExist(data){
  console.log("DEBUG on safeImageExist function data")
  console.log(data)
  const result = await db.collection("images").findOne(
    {image_name: data.fullImage, isSafe: true},
    {projection: {image_tag: 1}}
  )

  return result?.image_tag || null
  /*const result=await client.query(`
      SELECT image_tag
      FROM docker_images
      WHERE image_name=$1 AND isSafe=true
    `,[name])
  return result.rows[0]?.image_tag || null*/
}

export async function addAsUnsafe(data){
  console.log("DEBUG on addAsUnsafe function data")
  console.log(data)

  await db.collection("images").updateOne(
    {image_digest: data.digest},
    {$setOnInsert: 
      {
        image_digest: data.digest,
        image_name: data.fullName,
        image_tag: data.tagName,
        last_updated: data.lastUpdated,
        isSafe: false
    }
  },{upsert: true}
  )
  /*await client.query(`
      INSERT INTO docker_images (image_digest,image_name,image_tag,last_updated,isSafe)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (image_digest)
      DO NOTHING`,[data.digest,data.fullName,data.tagName,data.lastUpdated,false])*/
}

export async function addAsSafe(data) {
  console.log("DEBUG on addAsSafe function data")
  console.log(data)

  await db.collection("images").updateOne(
    {image_digest: data.digest},
    {
      $setOnInsert: {
        image_digest: data.digest,
        image_name: data.fullImage,
        image_tag: data.tagName,
        last_updated: data.lastUpdated,
        isSafe: true
      }
    },{upsert: true}
  )
  /*await client.query(`
      INSERT INTO docker_images (image_digest,image_name,image_tag,last_updated,isSafe)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (image_digest)
      DO NOTHING`,[data.digest,data.fullName,data.tagName,data.lastUpdated,true])
*/
}
export async function closeConnection(){
    await client.close()
}