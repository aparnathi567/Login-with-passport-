if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

const express=require('express');
const app=express()
const bcrypt=require('bcrypt')
const Passport=require('passport')
const flash=require('express-flash')
const session=require('express-session')
const initializePassport=require('./passport-config');

initializePassport(
    Passport,
    email=>users.find(user =>user.email ===email))

const users=[];
app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(Passport.initialize())
app.use(Passport.session())
app.get('/',(req,res)=>{
    res.render('index.ejs', {name:'kaushik'})
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.get('/register',(req,res)=>{
    res.render('register.ejs')
})


app.post('/login',Passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true

}))

app.post('/register',async (req,res)=>{
    try{
        const hashedPassword=await bcrypt.hash(req.body.backendPassword,10)
        users.push({
            'id':Date.now().toString(),
            'name':req.body.backendName,
            'email':req.body.backendEmail,
            'Password':hashedPassword
        })
        res.redirect('/login')
    }
    catch{
        res.redirect('/register')
    }
})

app.listen(3001)