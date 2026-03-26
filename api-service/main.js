import express from 'express';
import { addNewAlert, initDatabase, getImageDigestValue, isImageVulnerable } from './database-commands-alerts.js';
import { apiRequestDuration, apiServiceRequestCounter } from './additional-app-metrics.js';
import { register } from "prom-client";

const app=express()
const PORT=11000

app.use(express.json());

app.post("/saveAlert",async(req,res)=>{
    const stop = apiRequestDuration.startTimer({endpoint: "saveAlert"})
    try {
      const alerts=req.body
      await addNewAlert(alerts)
      apiServiceRequestCounter.inc({endpoint: "saveAlert",method: "POST",status: "success"})
      res.status(201).json({ message: "Alerts saved successfully." });
      
  } catch (err) {
    console.error('Error saving alert:', err);
    apiServiceRequestCounter.inc({endpoint: "saveAlert",method: "POST",status: "error"})
    res.status(500).json({ error: 'Internal Server Error'});
  } finally {
    stop()
  }
  
})

app.get("/imageDigest",async(req,res)=>{
  const stop = apiRequestDuration.startTimer({endpoint: "imageDigest"})
  console.log(req.query.imageData)
  try {
    const digest=await getImageDigestValue(req.query.imageData) //full image->repository_name in alerts login+image_name
    apiServiceRequestCounter.inc({endpoint: "imageDigest",method: "GET",status: "success"})
    
    console.log("Image digest endpoint",digest)
    if(digest){
      console.log("Image digest is found in alerts table")
      res.json({exist:true})
    }
    else{
      console.log("Image digest not found in alerts table")
      res.json({exist:false}) //kinda 404 ,but not really
    }
    
  } catch (error) {
    apiServiceRequestCounter.inc({endpoint: "imageDigest",method: "GET",status: "error"})  
  }finally {
    stop()
  }
  
})

//app check for vulnerability status
app.get("/isImageVulnerable",async(req,res)=>{

  const flag=await isImageVulnerable(req.body.fullImage,req.body.tagName)
  res.send(flag)
})

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

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