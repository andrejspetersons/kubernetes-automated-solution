import express from 'express';
import { addNewAlert, initDatabase, getImageDigestValue, isImageVulnerable } from './database-commands-alerts.js';

const app=express()
const PORT=11000

app.use(express.json());

app.post("/saveAlert",async(req,res)=>{
    try {
      
      const alerts=req.body
      await addNewAlert(alerts)

      res.status(201).json({ message: "Alerts saved successfully." });
      
  } catch (err) {
    console.error('Error saving alert:', err);
    res.status(500).json({ error: 'Internal Server Error'});
  }
 
})

app.get("/imageDigest",async(req,res)=>{
  console.log(req.query.fullImage)
  console.log(req.query.tagName)
  const digest=await getImageDigestValue(req.query.fullImage,req.query.tagName) //full image->repository_name in alerts login+image_name
  console.log("Image digest endpoint",digest)
  if(digest){
    console.log("Image digest is found in alerts table")
    res.json({exist:true})
  }
  else{
    console.log("Image digest not found in alerts table")
    res.json({exists:false}) //kinda 404 ,but not really
  }
  
})

//app check for vulnerability status
app.get("/isImageVulnerable",async(req,res)=>{

  const flag=await isImageVulnerable(req.body.fullImage,req.body.tagName)
  res.send(flag)
})

//request check if image content doesnt change


//request SET isVulnerable to false
/*app.put("/updateState",async(req,res)=>{
  const result=await(req.body.containername)
})*/
initDatabase()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`Alert api is listening PORT ${PORT}`)
    })
})
.catch((err)=>{
    console.log(`Failed to connect to DB:`,err)
    process.exit(1)
})