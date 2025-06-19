import { k8sApi } from "./config.js";
import { DEPLOYMENT_NAME, NAMESPACE } from "./env-variables.js";


async function updateDeployment(deploymentName,namespaceName){
    console.log(`V3 test10`)
    try {
        const res= await k8sApi.readNamespacedDeployment({name: deploymentName,namespace:namespaceName})
        const deployment_obj=res
        const container=deployment_obj.spec?.template.spec?.containers[0]

        if(container){
            container.resources={
                limits:{
                    cpu: '500m',
                    memory: '256Mi', 
                },

                requests: {
                    cpu: '500m',
                    memory: '256Mi'
                },
            }
        }

        const updatedDeployment= await k8sApi.replaceNamespacedDeployment({name: deploymentName,namespace: namespaceName,body: deployment_obj})
        console.log(`Deployment '${deploymentName}' updated successfully.`);
        return updatedDeployment;

    } catch (err) {
        console.error(`Error updating deployment:` ,err.response?.body || err.message);   
    }
}


updateDeployment(DEPLOYMENT_NAME,NAMESPACE)
