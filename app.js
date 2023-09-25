const express = require('express')
const dotEnv = require('dotenv').config()
const sequel = require('./dbConnect')
const PORT = process.env.PORT || 2190

const app = express()



app.get('/',(req,res)=>{
    res.send('Hello')
})


const startServer =async()=>{
    await sequel.authenticate()
    app.listen(PORT,()=>{
        console.log(`server is running on http://127.0.0.1:${PORT}`);
    })
}

startServer()