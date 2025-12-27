import k8sClient from './kubernetes-config.js';

export async function updateDeploymentImage(namespaceName,deploymentName,patchedImage){
  const res =await getDeployment(deploymentName,namespaceName)
  const deploymentStatus = await getDeploymentStatus(deploymentName,namespaceName)
  const deploymentObject=res
  console.log("Deployment status\n",deploymentStatus)

  const oldImage=deploymentObject.spec.template.spec.containers[0].image
  patchImage(deploymentObject,patchedImage)

  await k8sClient.replaceNamespacedDeployment({name:deploymentName,namespace:namespaceName,body:deploymentObject})
  const isHealthy=await isDeploymentHealthy(deploymentObject)
  if(!isHealthy){
    patchImage(deploymentObject,oldImage)
    await k8sClient.replaceNamespacedDeployment({name:deploymentName,namespace:namespaceName,body:deploymentObject})
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
    const deploymentStatus=await getDeployment(deploymentObjectName,deploymentObjectNamespace)
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

async function getDeployment(deploymentName,namespaceName){
  return await k8sClient.readNamespacedDeployment({name:deploymentName,namespace:namespaceName})
}

async function getDeploymentStatus(deploymentName,namespaceName){
  return await k8sClient.readNamespacedDeploymentStatus({name:deploymentName,namespace:namespaceName})
}

function patchImage(deployment,image){
  deployment.spec.template.spec.containers[0].image=image
}