import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import * as dbService from './database-commands-images.js';
import * as dockerApiService from './docker-api-service.js';
import { DEPLOYMENT_NAME } from './env-variables.js';
import { handleAxiosErrors } from './errors/custom-errors.js';

const app=express()
const PORT=12000

app.use(bodyParser.json())

app.post('/alerts',async(req,res)=>{
  try{
    const [alert] =req.body.alerts
    const repo=alert.labels.image_repository  //extract repository name
    const containerNamespace=alert.labels.exported_namespace    //extract target namespace where upgrade
    const imageData=await dockerApiService.getLatestImageData(repo) //get the latest info about this image
    
    //console.log(imageData)
    //Data to find element that is neccessary to update
    const data={imageData:imageData,
            namespace:containerNamespace,
            deployment:DEPLOYMENT_NAME}
    
    //add const safeTag later
    const digestExist=await axios.get("http://api-pod-service.api-namespace:11000/imageDigest",  //check if digest of container exist in alerts
      {params:imageData},
      {timeout:5000})   

      if(!digestExist.data.exist){
        console.log("Safe digest detected!!")
        await dbService.addAsSafe(imageData) // we suggest image is safe if the digest value not in alerts
        await axios.post("http://auto-patch-service.auto-patch-namespace:13000/patch",data,
            {timeout:5000}).catch(handleAxiosErrors("Auto-Patch Service"))
      }
      else{
        await dbService.addAsUnsafe(imageData) //if digest exist we add image data as unSafe
        console.log("There are no safe image published yet")
      }
      
      res.status(200).send("Image check is called")
      
  }catch(error){
    console.error("Error while processing alerts:", error.message || error);
    console.error("Error code",error.code)
    console.error((JSON.stringify(error, Object.getOwnPropertyNames(error))))
  }

})
dbService.initDatabase()
.then(()=>{app.listen(PORT,()=>{console.log(`Image check app is listening on port ${PORT}`)})})
.catch((err)=>{console.log(`Failed to connect to DB:`,err);process.exit(1)})