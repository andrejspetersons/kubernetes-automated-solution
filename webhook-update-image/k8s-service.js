import k8sClient from './kubeconfig.js';

//updateDeployment
export async function updateDeploymentImage(namespaceName,deploymentName,patchedImage){
  const res =await k8sClient.readNamespacedDeployment({name: deploymentName,namespace: namespaceName})
  const deploymentObject=res
  deploymentObject.spec.template.spec.containers[0].image=patchedImage
  deploymentObject.spec.template.metadata.annotations={
    ...(deploymentObject.spec.template.metadata.annotations || {}),
    'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),  
  }
  
  await k8sClient.namespacedeployment
  await k8sClient.replaceNamespacedDeployment({name:deploymentName,namespace:namespaceName,body:deploymentObject})
  console.log(`Deployment updated to image: ${patchedImage}`);
}