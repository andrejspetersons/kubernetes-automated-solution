import express from 'express'
import * as k8sService from './kubernetes-service.js'

const app=express()
const PORT=13000

app.use(express.json())

app.post("/patch",async(req,res)=>{
    const {imageData,namespace,deployment}=req.body
    const patchImage=imageData.fullImage+":"+imageData.tagName
    const isPatchSucessfull=await k8sService.updateDeploymentImage(namespace,deployment,patchImage) //patchedimage name+tag which is safe
    
    if(isPatchSucessfull){
        console.log("Image patched successfully!!")
        return res.status(200).send("Image is patched successfully!!")
    }
    
    return res.status(500).send({
        success:false,
        message: "Auto-patch failed. Deployment was rolled back to previous state.",
        reason: "Image tag not found or not deployable"
    })
})

app.post("/addSecurityContext",async(req,res)=>{
    try {
        const [alerts]=req.body.alerts
        const deploymentName=alerts.labels.deployment
        const namespaceName=alerts.labels.namespace
        console.log(`[${new Date().toTimeString().split(' ')[0]}]`+"addSecurityProperties start execution");
        await k8sService.addSecurityProperties(deploymentName,namespaceName)
        console.log(`[${new Date().toTimeString().split(' ')[0]}]`+"addSecurityProperties end execution");
        res.status(200).send("OK")
    } catch (error) {
        console.error(err)
        res.status(500).send("Failed to apply security context")        
    }


})


app.listen(PORT,()=>{
    console.log(`Kubernetes auto-patch listen port ${PORT}`)
})