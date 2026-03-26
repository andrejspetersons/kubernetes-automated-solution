import bodyParser from 'body-parser';
import express from 'express';
import * as dbService from './database-commands-images.js';
import { DEPLOYMENT_NAME } from './env-variables.js';
import {getImageMinorVersionList} from './docker-api-service.js';
import { buildNewImage, clearCurrentImageVersion, compareVersions } from './image-tag-utils.js';
import { checkImageDigestInAlertsTable, patchImage } from './request-handler.js';
const app=express()
const PORT=12000

app.use(bodyParser.json())

app.post('/alerts',async(req,res)=>{
  try{
    console.log(req.body)
    const imageName = req.body.commonLabels.image
    const containerNamespace = req.body.commonLabels.namespace
    console.log(`Image name from alerts = ${imageName}`)
    const tagList = await getImageMinorVersionList(imageName)
    const cleanImageVersion = clearCurrentImageVersion(imageName)
    let patched = false
    //console.log(`Clean Image Version = ${cleanImageVersion}`)
    for(let i = 0;i<tagList.length;i++){
      console.log(tagList[i])
      if(compareVersions(tagList[i],cleanImageVersion)<=0){
        break  
      }

      const newImage = buildNewImage (imageName,tagList[i])//node:22.21.1-slim,22.22.1
      const digestExist = await checkImageDigestInAlertsTable(newImage)
      console.log(`Digest flag = ${digestExist}`)
      
      if (digestExist) {//? not sure
        console.log("Digest exist")
        continue
      }

      const response = await patchImage(newImage,containerNamespace,DEPLOYMENT_NAME)

      if(response?.status === 200){
        patched = true
        break
      }

    }
    
    if(!patched){
      console.log("There arent new or working version for image update")
    }
    
    /*if(!digestExist){
      const data = {imageData:newImage,namespace:containerNamespace,deployment:DEPLOYMENT_NAME}
      const response = axios.post("http://auto-patch-service.auto-patch-namespace:13000/patch",data,
            {timeout:5000}).catch(handleAxiosErrors("Auto-Patch Service"))
    }*/
    

    //auto-patch deployment + namespace
    
    //============OLD REQUEST 05.03.2026====================
    /*const [alert] =req.body.alerts
    const repo=alert.labels.image_repository  //extract repository name
    const containerNamespace=alert.labels.exported_namespace    //extract target namespace where upgrade
    const imageData=await dockerApiService.getLatestImageData(repo) //get the latest info about this image*/
    
    //console.log(imageData)
    //Data to find element that is neccessary to update
    
    //============OLD LOGIC 05.03.2026====================
    /*const data={imageData:imageData,
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
      }*/
      
      //const tags=await getImageMinorVersionList()
      res.status(200).send("Image check is called")
      
  }catch(error){
    console.error(" Error while processing alerts");

    if (error.response) {
        // Server responded with error status
        console.error("HTTP Status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Service:", error.config?.url);

    } else if (error.code === "ECONNABORTED") {
        // Axios timeout
        console.error(`Request timed out: [${new Date().toLocaleString()}]`, error.config?.url);

    } else if (error.code === "ECONNREFUSED") {
        // Service unavailable
        console.error(`Service refused connection: [${new Date().toLocaleString()}]`, error.config?.url);

    } else if (error.code === "ENOTFOUND") {
        // DNS failure
        console.error(`Service hostname not found [${new Date().toLocaleString()}]`);

    } else if (error.request) {
        // Request made but no response
        console.error(`No response received from service $[${new Date().toLocaleString()}]`);

    } else {
        // Unexpected error
        console.error(`Unexpected error: [${new Date().toLocaleString()}]`, error.message);
    }

    console.error(`Error code: [${new Date().toLocaleString()}]`, error.code);

    console.error(
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
  }

})

dbService.initDatabase()
.then(()=>{app.listen(PORT,()=>{console.log(`Image check app is listening on port ${PORT}`)})})
.catch((err)=>{console.log(`Failed to connect to DB:`,err);process.exit(1)})