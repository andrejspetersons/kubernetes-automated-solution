import axios from 'axios'
import bodyParser from 'body-parser'
import express from 'express'
import { mapToAlert } from './alertsMapper.js'
import { alertsReceived, alertsForwarded, alertsDuration } from './additional-app-metrics.js'
import { register } from 'prom-client'

const app = express()
const PORT = 3000

app.use(bodyParser.json())

app.post('/alerts',async (req,res)=>{
    const stop = alertsDuration.startTimer()
    try {
        const alerts= req.body.alerts
        const alertsData=mapToAlert(alerts)
        alertsReceived.inc(alerts.length)
        console.log(alertsData)
        const response=await axios.post("http://api-pod-service.api-namespace:11000/saveAlert",alertsData)
        
        if(response.status==201){
            console.log(`[${new Date().toTimeString().split(' ')[0]}]`+"✅ Alert successfully saved via API service");
            alertsForwarded.inc({status: 'success'})
            res.status(201).send("Created");
        }
        
    } catch (error) {
        alertsForwarded.inc({status: 'failed'})
        console.error("Error while forwarding alerts:", error.message || error);
        if(error.request){
            console.error("API service unreachable");
        }
    } finally {
        stop()
    }

    return res.status(200).send("Alerts was send to receiver by Alertmanager")
});

app.get('/metrics', async (req,res)=>{
    res.set('Content-Type',register.contentType)
    res.send(await register.metrics())
})

app.listen(PORT,()=>{
    console.log(`Alert processor service is listening to ${PORT}`)
})