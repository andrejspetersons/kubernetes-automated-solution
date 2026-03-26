const express = require('express');
const app=express();
const PORT=4000

function delay(ms){
  return new Promise(resolve=>setTimeout(resolve,ms))
}

let number = 0;
let increasing = true;

async function main(){
  while (true) {
    console.log(number);
    if (increasing) {
      number += 2;
      if (number >= 40) {
        increasing = false;
      }
    } else {
      number -= 2;
      if (number <= 0) {
        increasing = true;
      }
    }

    await delay(5000);
  }
}

app.get('/metrics', (req, res) => {
  res.set('Content-Type','text/plain')
  res.status(200).send('UP 1')
})

app.listen(PORT,()=>{
  console.log(`Test4${PORT}`)
})

main();