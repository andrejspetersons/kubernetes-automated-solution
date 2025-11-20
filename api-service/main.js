import express from 'express';
import { addNewAlert, ensureDbConnected, getImageDigestValue, isImageVulnerable } from './database-commands-alerts.js';

const app=express()
const PORT=11000

app.use(express.json());

app.post("/saveAlert",async(req,res)=>{
    try {
      const alerts=req.body
      console.log(alerts)

      await Promise.all(alerts.map(addNewAlert))
      res.status(201).json({ message: "Alerts saved successfully." });
      
  } catch (err) {
    console.error('Error saving alert:', err);
    res.status(500).json({ error: 'Internal Server Error'});
  }
 
})

//app check for vulnerability status
app.get("/isImageVulnerable",async(req,res)=>{

  const flag=await isImageVulnerable(req.body.fullImage,req.body.tagName)
  res.send(flag)
})

//request check if image content doesnt change
app.get("/imageDigest",async(req,res)=>{
  const digest=await getImageDigestValue(req.query.fullImage) //full image->repository_name in alerts login+image_name
  console.log(digest)
  if(digest){
    res.json({exist:true,digest})
  }
  else{
    res.json({exists:false,message: "Image digest not found in alerts table!!"}) //kinda 404 ,but not really
  }
  
})

//request SET isVulnerable to false
app.put("/updateState",async(req,res)=>{
  const result=await(req.body.containername)
})

ensureDbConnected()
.then(()=>{
    app.listen(PORT,()=>{
    console.log(`Alert api is listening PORT ${PORT}`)
    })
})
.catch((err)=>{
    console.log(`Failed to connect to DB:`,err)
    process.exit(1)
})