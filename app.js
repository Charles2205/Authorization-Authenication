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

app.post('/login',async(req,res)=>{
    try {
       const {user_name,password} =req.body
    //   determine if the username is vaild in the database
        results = await dbModel.findOne({where:{user_name}})
        if(!results){
            res.send('Invaild Credentials 😒')
        }
        const correctPassword = results.password

        // comparing hashed pass with current password
        const isCorrectPassword =await bcrypt.compare(password,correctPassword)
        if(!isCorrectPassword){
            res.send('Invaild Credentials 😒')
        }
        res.send('Logged in Successfully  🎉 🎊')
      res.send(results)
    } catch (error) {
       console.log('Can not login 😒!');
    }
   
})

app.get('/homepage',(req,res)=>{
    res.send('Welcome')
})

const startServer =async()=>{
    await sequel.authenticate()
    app.listen(PORT,()=>{
        console.log(`server is running on http://127.0.0.1:${PORT}`);
    })
}

startServer()