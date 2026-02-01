import axios from 'axios'
import bodyParser from 'body-parser'
import express from 'express'
import { mapToAlert } from './alertsMapper.js'

const app = express()
const PORT = 3000

app.use(bodyParser.json())

app.post('/alerts',async (req,res)=>{
    try {
        const alerts= req.body.alerts
        //get original alerts
        console.log(alerts)
        const alertsData=mapToAlert(alerts)

        //mapped data
        console.log(alertsData)

        const response=await axios.post("http://api-pod-service.api-namespace:11000/saveAlert",alertsData)
        
        if(response.status==201){
            console.log(`[${new Date().toTimeString().split(' ')[0]}]`+"✅ Alert successfully saved via API service");
            res.status(201).send("Created");
        }
        
    } catch (error) {
        console.error("Error while processing alerts:", error.message || error);

        if (error.response) {
            // Server responded with a non-2xx status
            return res.status(error.response.status).send(error.response.data);
        } else {
            return res.status(500).send('Internal server error while processing alerts.');
        }
    }

});
app.listen(PORT,()=>{
    console.log("Hello World!")
})