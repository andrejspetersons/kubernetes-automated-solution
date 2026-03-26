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
  const patchBody = [
    {
      op: "add",
      path: "/spec/template/spec/containers/0/securityContext",
      value: {
        runAsUser: 1000,
        allowPrivilegeEscalation: false,
        runAsNonRoot: true
      }
    },
    {
      op: "add",
      path: "/spec/template/metadata/annotations/security.k8s.io~1configuration-hardening-timestamp",
      value: new Date().toISOString()
    },

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