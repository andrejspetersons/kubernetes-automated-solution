const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000





app.use(bodyParser.json())

app.post('/alerts',(req,res)=>{
    const alerts= req.body.alerts
    if(!alerts || !Array.isArray(alerts)){
        console.log("Error in alerts")
        return res.status(400).send('Invalid alert format')
    }

    


    /*for (const alert of alerts) {
    console.log('--- Alert ---');
    for (const [key, value] of Object.entries(alert)) {
        console.log(`${key}:`, value);
        }
    }*/

    console.log('Alert processed')
});


app.listen(PORT,()=>{
    console.log("Hello World!")
})