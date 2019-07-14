const User = require('../database/User')

var passport = require('passport')


module.exports.login=function(req,res){
        passport.authenticate('local',(error,user,info)=>{
            var token   ;
            if(error){
                res.status(404).json(error);
                return ; 
            }
            if(user)
            {
                token = user.generateJWT();
               
                
                res.status(200)
                res.json({
                    "token":token
                })
            }
            else {
                res.status(401).json(info);
            }

        })(req,res);
}



module.exports.register = function(req,res){

    var user = new User(); 
    user.firstName = req.body.user.firstName ; 
    user.lastName = req.body.user.lastName ; 
    user.userName = req.body.user.userName ; 
    user.setPassword(req.body.user.password);

    user.save((error)=>{
        if(error)
        {   
            console.log('error has occurred in save!!');
            console.error(error)
        }
        var token ; 
        token = user.generateJWT();
        res.status(200);
        res.json({"token":token});
    })


}

