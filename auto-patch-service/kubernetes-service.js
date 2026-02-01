import * as k8sUtils from './kubernetes-service-utils.js'

export async function updateDeploymentImage(namespaceName,deploymentName,patchedImage){
  const res =await k8sUtils.getDeployment(deploymentName,namespaceName)
  const deploymentStatus = await k8sUtils.getDeploymentStatus(deploymentName,namespaceName)
  const deploymentObject=res
  
  console.log("DELPLOYMENT\n",res)
  console.log("Deployment status\n",deploymentStatus)

  const oldImage=deploymentObject.spec.template.spec.containers[0].image
  k8sUtils.patchImage(deploymentObject,patchedImage)

  await k8sUtils.replaceDeployment(deploymentName,namespaceName,deploymentObject)
  const isHealthy=await isDeploymentHealthy(deploymentObject)
  if(!isHealthy){
    k8sUtils.patchImage(deploymentObject,oldImage)
    await k8sUtils.replaceDeployment(deploymentName,namespaceName,deploymentObject)
    return false
  }
  else{

    return true
  }
}

async function isDeploymentHealthy(deploymentobject,retries=3,delay=2000){
  const deploymentObjectName=deploymentobject.metadata.name
  const deploymentObjectNamespace=deploymentobject.metadata.namespace
  const desiredReplicas=deploymentobject.spec?.replicas ?? 1
  const avaiable=deploymentobject.status?.availableReplicas ?? 0

  for(let i=0; i<retries;i++){
    const deploymentStatus=await k8sUtils.getDeployment(deploymentObjectName,deploymentObjectNamespace)
    const status= deploymentStatus.status
    console.log(`Try ${i + 1}/${retries} - availableReplicas: ${status.availableReplicas} ${status.unavailableReplicas} ${status.replicas}`);
    
    if(avaiable === desiredReplicas){
      console.log("Pod is healthy")
      return true
    }

    await new Promise(res=>setTimeout(res,delay))
  }
    console.log("Pod is unhealthy")
    return false
}

export async function addSecurityProperties(deploymentName,namespaceName){
  await k8sUtils.removeRootPermissions(deploymentName,namespaceName)  
}