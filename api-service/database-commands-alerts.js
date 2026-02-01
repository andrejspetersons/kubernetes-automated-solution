import { client } from "./db-client.js";
import { db } from "./db-client.js";

export async function initDatabase(){
    await client.connect();    
    await db.collection("alerts").createIndex(
      {fingerprint: 1,status:1},
      {unique: true,name: "unique_fingerprint_status"}
    )
     // use when i need to connect
}

export async function addNewAlert(alerts){
  for(const alert of alerts){
    console.log(alert.image_tag)
    await db.collection("alerts").updateOne(
      {fingerprint:alert.fingerprint, status: alert.status,image_tag: alert.image_tag},
      {$setOnInsert: alert},
      {upsert: true}
    )
  }
}

export async function getImageDigestValue(repository, tag) {
  const result = await db.collection("alerts").findOne(
    {image_repository: repository,image_tag: tag},//we assume that if digest not found in alerts table it is safe, but what if it is resolved
    {projection: { image_digest: 1 }});

  return result?.image_digest || null;
}

export async function isImageVulnerable(name,tag,digest){
  const flag = await db.collection("alerts").findOne(
    {image_repository:name,image_tag:tag,image_digest:digest}, 
    {projection:{isVulnerable:1}}
  )

  return result?.isVulnerable || null
}

export async function updateImageStatus(name){
  // make status update in both tables using name of image or smth similar
}



/*export async function addNewAlert(alert){//to do on conflict!!!
    const insertQuery = `
      INSERT INTO alerts (
        alertname, container_name, namespace_name,
        image_digest, image_repository, image_tag,
        vulnerability_id, vulnerability_score,
        timestamp, isVulnerable, status,fingerprint
      ) VALUES (
        $1, $2, $3,
        $4, $5, $6,
        $7, $8,
        $9, $10, $11, $12
      ) ON CONFLICT (fingerprint, status) DO NOTHING`

        const values = [
        //names
          alert.alertname ?? 'unknown',
          alert.container_name ?? 'unknown',
          alert.namespace_name ?? 'unknown',
          alert.image_digest ?? 'unknown',
          alert.image_repository ?? 'unknown',
          alert.image_tag ?? 'unknown',
          alert.vulnerability_id ?? 'unknown',
          parseFloat(alert.vulnerability_score) || 0,
          alert.timestamp ? new Date(alert.timestamp) : new Date(),
          alert.isVulnerable ?? false,
          alert.status ?? 'unknown',
          alert.fingerprint ?? 'unknown',
        ];

        const result=await client.query(insertQuery,values)
        return result.rows[0]
}

export async function getImageDigestValue(repository,tag){
    const value=await client.query(
      `SELECT image_digest from alerts
        WHERE image_repository=$1 AND image_tag=$2`,[repository,tag])
    return value.rows[0]?.image_digest || null
}

export async function isImageVulnerable(name,tag,digest){
    const flag=await client.query(
      `SELECT isVunerable from alerts
        WHERE container_name=$1 AND image_tag=$2 AND image_digest=$3 `,[name,tag,digest])
        return flag.rows[0].isVulnerable
}

export async function updateImageStatus(name){
   await client.query(
        `UPDATE alerts 
        SET isVulnerable=false 
        WHERE container_name=$1`,[name])
}

export async function dropTable(name){
    return await client.query(`DROP TABLE $1`,[name])
}*/