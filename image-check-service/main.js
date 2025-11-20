import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import {handleAxiosErrors} from './errors/custom-errors.js';
import * as dbService from './database-commands-images.js';
import * as dockerApiService from './docker-api-service.js';
import { DEPLOYMENT_NAME } from './env-variables.js';

const app=express()
const PORT=12000

app.use(bodyParser.json())

app.post('/alerts',async(req,res)=>{
  try{
    const [alert] =req.body.alerts
    //extract repository name
    const repo=alert.labels.image_repository
    //extract target namespace where upgrade
    const containerNamespace=alert.labels.exported_namespace
    
    //get the latest info about this image
    const imageData=await dockerApiService.getLatestImageData(repo)
    console.log(imageData)

    const data={imageData:imageData,
            namespace:containerNamespace,
            deployment:DEPLOYMENT_NAME}

    //check if there isSafe version of image in table
    const safeTag=await dbService.safeImageExist(imageData)
    
    if(safeTag){
      console.log("Safe tag exist!!!")
      await axios.post("http://auto-pacth-service.auto-pacth-namespace:13000/patch",
        {imageData:imageData,
          namespace:alerts.exported_namespace,
          deployment:DEPLOYMENT_NAME},
          {timeout:5000}).catch(handleAxiosErrors("Auto-Patch Service"))
    }

    //check if digest of container exist
    const digestExist=await axios.get("http://api-pod-service.api-namespace:11000/imageDigest",
      {params:imageData},
      {timeout:5000})                //.catch(handleAxiosErrors("API service"))

      if(!digestExist.data.exist){
        console.log("Safe digest detected!!")
        await dbService.addAsSafe(imageData)
        await axios.post("http://auto-patch-service.auto-patch-namespace:13000/patch",data,
            {timeout:5000}).catch(handleAxiosErrors("Auto-Patch Service"))
      }
      else{
        console.log("There are no safe image published yet")
      }
      
  }catch(error){
    console.error("Error while processing alerts:", error.message || error);
  }

})

dbService.ensureDbConnected()
.then(()=>{app.listen(PORT,()=>{console.log(`Image check app is listening on port ${PORT}`)})})
.catch((err)=>{console.log(`Failed to connect to DB:`,err);process.exit(1)})