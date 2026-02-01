import k8sClient from './kubernetes-config.js';

export async function getDeployment(deploymentName,namespaceName){
  return await k8sClient.readNamespacedDeployment({name:deploymentName,namespace:namespaceName})
}

export async function getDeploymentStatus(deploymentName,namespaceName){
  return await k8sClient.readNamespacedDeploymentStatus({name:deploymentName,namespace:namespaceName})
}

export function patchImage(deployment,image){
  deployment.spec.template.spec.containers[0].image=image
}

export async function replaceDeployment(deploymentName,namespaceName,deploymentObject) {
    return await k8sClient.replaceNamespacedDeployment({name:deploymentName,namespace:namespaceName,body:deploymentObject})
}

export async function removeRootPermissions(deploymentName,namespaceName){
  console.log(`[${new Date().toTimeString().split(' ')[0]}]`+"removeRootPermissions function start its execution");
  const patchBody = [
    {
      op: "add",
      path: "/spec/template/spec/containers/0/securityContext",
      value: {}
    },
    {
      op: "replace",
      path: "/spec/template/spec/containers/0/securityContext/runAsNonRoot",
      value: true
    },
    {
      op: "replace",
      path: "/spec/template/spec/containers/0/securityContext/runAsUser",
      value: 1000
    },
    {
      op: "add",
      path: "/spec/template/spec/containers/0/securityContext/allowPrivilegeEscalation",
      value: false
    }
  ];
    return await k8sClient.
    patchNamespacedDeployment({
      name:deploymentName,
      namespace:namespaceName,
      body:patchBody,
      _options:{
        headers: {
          "Content-Type": "application/json-patch+json",
        },
      }
})
}