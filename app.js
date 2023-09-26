const express = require('express')
const dotEnv = require('dotenv').config()
const sequel = require('./dbConnect')
const PORT = process.env.PORT || 2190
const dbModel = require('./users')
const { default: helmet } = require('helmet')
const app = express()
app.use(helmet())
const bcrypt = require('bcrypt')
const expressSession = require('express-session')

const APP_SECRET = process.env.APP_SECRET
app.use(express.urlencoded({extended:false}))
app.use(expressSession({
    secret: APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{}
}))

app.get('/',(req,res)=>{
    res.send('Hello')
})



app.post('/register', async(req,res)=>{
   try {
    const {user_name,password}=req.body
    const hashPassword = await bcrypt.hash(password,10)
    const results  =await  dbModel.create({user_name,'password':hashPassword})
    if (results) {
        return res.send('User created successfully')
    } 
    res.send('Unable to create user')
   } catch (error) {
    console.log(error);
   }
})

app.post('/login',async(req,res)=>{
    try {
       const {user_name,password} =req.body
    //   determine if the username is vaild in the database
        const results = await dbModel.findOne({where:{user_name}})
        if(!results){
           return  res.send('Invaild Credentials 😒')
        }
        const correctPassword = results.password

        // comparing hashed pass with current password
        const isCorrectPassword =await bcrypt.compare(password,correctPassword)
        if(!isCorrectPassword){
           return res.send('Invaild Credentials 😒')
        }
        req.session.user =results.id
    
        res.send('Logged in Successfully  🎉 🎊')
      
    } catch (error) {
       console.log(error);
    }
   
})
const isUserAuth =(req,res,next)=>{
    if(req.session.user)
    return next()
    res.send('Kindly Login First')
}



app.get('/homepage',isUserAuth,async(req,res)=>{
    try {
       const userId = req.session.user
       const userInfo = await dbModel.findOne({where:{id:userId}})
       res.send(`Welcome ${userInfo.user_name}`)
    } catch (error) {
        console.log(error);
    }
})

const startServer =async()=>{
    await sequel.authenticate()
    app.listen(PORT,()=>{
        console.log(`server is running on http://127.0.0.1:${PORT}`);
    })
}

startServer()