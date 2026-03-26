import axios from 'axios';
import { handleAxiosErrors } from './errors/custom-errors.js';
export async function checkImageDigestInAlertsTable(imageName){
    const payload = {imageData:imageName}
    const response = await axios.get("http://api-pod-service.api-namespace:11000/imageDigest",
        {params:payload},
        {timeout:5000}).catch(handleAxiosErrors("API Service Failed!"))
    return response.data.exist
}

export async function patchImage(newImage,containerNamespace,deploymentName){
    const data = {imageData:newImage,namespace:containerNamespace,deployment:deploymentName}
    return axios.post("http://auto-patch-service.auto-patch-namespace:13000/patch",
            data,
            {timeout:5000}).catch(handleAxiosErrors("Auto-Patch Service"))
}