const express = require('express')
const dotEnv = require('dotenv').config()
const sequel = require('./dbConnect')
const PORT = process.env.PORT || 2190
const dbModel = require('./users')
const app = express()


app.use(express.urlencoded({extended:false}))


app.get('/',(req,res)=>{
    res.send('Hello')
})

app.post('/register', async(req,res)=>{
    const {user_name,password}=req.body
   const results  =await  dbModel.create({user_name,password})
   if (!results) {
    return res.send('Unable to create user')
   } 
   res.send('User created successfully')
})

const startServer =async()=>{
    await sequel.authenticate()
    app.listen(PORT,()=>{
        console.log(`server is running on http://127.0.0.1:${PORT}`);
    })
}

startServer()