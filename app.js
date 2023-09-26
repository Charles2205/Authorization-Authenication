const express = require('express')
const dotEnv = require('dotenv').config()
const sequel = require('./dbConnect')
const PORT = process.env.PORT || 2190
const dbModel = require('./users')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.urlencoded({extended:false}))


app.get('/',(req,res)=>{
    res.send('Hello')
})

app.post('/register', async(req,res)=>{
   try {
    const {user_name,password}=req.body
    const hashPassword = await bcrypt.hash(password,10)
    const results  =await  dbModel.create({user_name,'password':hashPassword})
    if (results) {
        res.send('User created successfully')
    } 
    res.send('Unable to create user')
   } catch (error) {
    console.log('Internal Server Error');
   }
})

const startServer =async()=>{
    await sequel.authenticate()
    app.listen(PORT,()=>{
        console.log(`server is running on http://127.0.0.1:${PORT}`);
    })
}

startServer()