const  express = require('express')
const controller = require('./api/controller')

const bodyParser = require('body-parser'); 
var jwt = require('express-jwt');
const passport = require('passport');
require('./api/config/passport')



const app = express() ; 
var auth = jwt({
    secret: 'root',
    userProperty: 'token'
  });

app.use(passport.initialize());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://127.0.0.1:3000');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
   
    next();
  });
app.post('/api/user/signup',(req,res)=>{
    controller.register(req,res)
});


app.post('/api/user/login',(req,res)=>{
    req.body.userName = req.body.user.userName ; 
    req.body.password = req.body.user.password ;
    controller.login(req,res)
});



app.get('/api/user/profile',auth,(req,res)=>{
    console.log(req)
    console.log('inside profile');
    


});

module.exports = app 