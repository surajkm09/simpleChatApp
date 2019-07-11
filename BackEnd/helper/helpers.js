const User = require('../database/User')


module.exports.isUserPresentById = function(userId){
    if(User.findById(userId).size()!==0)
    {
        return true ; 
    }
    else{
        return false ;
    }
}