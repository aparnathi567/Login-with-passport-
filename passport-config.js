const LocalStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')

function intialatize(passport,getUserByEmail){
    const authenticateUser=async (email,password,done)=>{
        const user=getUserByEmail(email)
        if(user == null){
            return done(null,false,{message:'No user with that email'})
        }

        try{
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null,false,{message:'Password is incorrect'})
            }
        }
        catch(e){
            console.log("fail"+e)
            return done(e)
        }

    }

    passport.use(new LocalStrategy({ usernameField: 'backendEmail' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
      return done(null, getUserById(id))
    })

} 
module.exports=intialatize