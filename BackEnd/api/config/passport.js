const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const User = require('../../database/User') ;




passport.use(new localStrategy({usernameField:'userName'},function(username,password,done){
       User.findOne({userName:username},function(err,user){
           if(err)
           {
            console.log(err);
           }
           if(!user)
           {
            return done(null,false,{message:"user Not Found "})
           }
           if(!user.validPassword(password))
           {
                return done(null ,false ,{message:"password is wrong"})
           }
           return done(null ,user )
       })
}));