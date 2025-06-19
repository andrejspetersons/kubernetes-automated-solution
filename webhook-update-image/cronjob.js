import * as dbService from './database-commands.js';
import * as dockerApiService from './docker-api-service.js';
import { DEPLOYMENT_NAME, DOCKER_REPO, DOCKER_USERNAME, NAMESPACE } from './env-variables.js';
import * as k8sService from './k8s-service.js';

async function runCheck() {
  console.log(`Program version 6`)
  await dbService.ensureDbConnected();
  const imageExist=await dbService.CheckIfImageExistInDB(`${DOCKER_USERNAME}/${DOCKER_REPO}`)
  const latestInfo=await dockerApiService.getLatestDockerHubImageTagDate(`${DOCKER_USERNAME}/${DOCKER_REPO}`)

  if(!imageExist){
    console.log(`📦 Image ${DOCKER_REPO} not found in DB. Inserting...`);
    await dbService.upsertImageDate(DOCKER_REPO, latestInfo.lastUpdated);  
  }

  const storedDate=await dbService.getStoredImageDate(`${DOCKER_USERNAME}/${DOCKER_REPO}`)
  //const storedDate=new Date()
  console.log(storedDate)
  if(new Date(latestInfo.lastUpdated)>storedDate){
    console.log("🚀 New tag detected. Updating deployment...");
    await k8sService.updateDeploymentImage(NAMESPACE, DEPLOYMENT_NAME, latestInfo.fullImage);
    await dbService.upsertImageDate(`${DOCKER_USERNAME}/${DOCKER_REPO}`, latestInfo.lastUpdated);
  }
  else{
    console.log(`🟢 No update needed to ${DOCKER_REPO}. Deployment already on latest tag.`);
  }

  await dbService.closeConnection()
}

runCheck().catch(err=>{
  console.log("Test7")
  console.log('Error during update check',err)
})
