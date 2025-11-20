import { client } from "./db-client.js";

export async function ensureDbConnected(){
    await client.connect();//unique fingerprint+status
    await client.query(`
        CREATE TABLE IF NOT EXISTS alerts(
            alertname TEXT,
            container_name TEXT,
            namespace_name TEXT,
            image_digest TEXT,
            image_repository TEXT,
            image_tag TEXT,
            vulnerability_id TEXT,
            vulnerability_score NUMERIC,
            timestamp TIMESTAMPTZ,
            isVulnerable BOOLEAN,
            status TEXT,
            fingerprint TEXT,
            CONSTRAINT alerts_unique UNIQUE(fingerprint, status)
        );
        
    `);
}

export async function addNewAlert(alert){//to do on conflict!!!
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

export async function isImageVulnerable(name,tag,digest){
    const flag=await client.query(
      `SELECT isVunerable from alerts
        WHERE container_name=$1 AND image_tag=$2 AND image_digest=$3 `,[name,tag,digest])
        return flag.rows[0].isVulnerable
}

export async function getImageDigestValue(repository,tag){
    const value=await client.query(
      `SELECT image_digest from alerts
        WHERE image_repository=$1 AND image_digest=$2`,[repository,tag])
    return value.rows[0]?.image_digest || null
}

export async function updateImageStatus(name){
   await client.query(
        `UPDATE alerts 
        SET isVulnerable=false 
        WHERE container_name=$1`,[name])
}

export async function dropTable(name){
    return await client.query(`DROP TABLE $1`,[name])
}