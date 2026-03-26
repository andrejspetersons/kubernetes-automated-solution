import express from 'express'
import * as k8sService from './kubernetes-service.js'
import { patchAttempts, patchDuration } from './additional-app-metrics.js'
import { register } from 'prom-client'

const app=express()
const PORT=13000

app.use(express.json())

app.post("/patch",async(req,res)=>{ 
    const stop = patchDuration.startTimer()
    console.log("Auto patch service was called")
    try {
        const {imageData,namespace,deployment}=req.body
        const isPatchSucessfull=await k8sService.updateDeploymentImage(namespace,deployment,imageData) //patchedimage name+tag which is safe
        
        if(isPatchSucessfull){
            console.log("Image patched successfully!!")
            patchAttempts.inc({status: success})
            return res.status(200).send("Image is patched successfully!!")
        }
        
        return res.status(500).send({
            success:false,
            message: "Auto-patch failed. Deployment was rolled back to previous state.",
            reason: "Image tag not found or not deployable"
        })
    } catch (error) {
        patchAttempts.inc({status: "failed"})
        console.error("Patch error:", err);    
    }finally{
        stop()
    }
    
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
        console.error(error)
        res.status(500).send("Failed to apply security context")
    }


})

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});


app.listen(PORT,()=>{
    console.log(`Kubernetes auto-patch listen port ${PORT}`)
})