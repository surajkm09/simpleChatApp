const express = require("express");
const controller = require("./api/controller");
const helper = require('./helper/helpers')
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
var jwt = require("express-jwt");
var jwtDecode = require('jwt-decode')
const passport = require("passport");
require("./api/config/passport");
var auth = jwt({
  secret: "root",
  userProperty: "token"
});
var sockets =[] ; 
io.on("connection",socket => {
    var decodedToken =jwtDecode(socket.handshake.query.token);
    if(helper.isUserPresentById(decodedToken._id))
    {
        sockets[decodedToken.userName] = socket ;
        console.log('success')
    }
    else {
      console.log('failed to connect ')
      socket.disconnect();
    }
    for (const key in sockets) {
      if (sockets.hasOwnProperty(key)) {
        sockets[key].emit('onlineUsers',JSON.stringify(Object.keys(sockets).filter((value)=>{
          if(value!==key)
          {
            return true ;
          }
          else 
          {
            return false ;
          }
        })));
        
      }
    }
 
    socket.on('logout',() => {
      socket.disconnect();
    });
    socket.on('message-send',(data)=>{
      data = JSON.parse(data);
      console.log(data)
      sockets[data.userName].emit('message-receive',data.message);
    });
    socket.on('disconnect',(data)=>{
       delete sockets[decodedToken.userName];
       for (const key in sockets) {
        if (sockets.hasOwnProperty(key)) {
          sockets[key].emit('onlineUsers',JSON.stringify(Object.keys(sockets)));
          
        }
      }

    })
    
     
});

app.use(passport.initialize());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "http://localhost:3000");
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append(
    "Access-Control-Allow-Headers",
    "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.append("Access-Control-Allow-Credentials", true);

  next();
});
app.post("/api/user/signup", (req, res) => {
  controller.register(req, res);
});

app.post("/api/user/login", (req, res) => {
  req.body.userName = req.body.user.userName;
  req.body.password = req.body.user.password;
  controller.login(req, res);
});

app.get("/api/user/profile", auth, (req, res) => {
  console.log(req.token);
  if(helper.isUserPresentById(req.token._id))
  {
      res.json(Object.keys(sockets)) 
  }
  else 
  {
    res.status(401).json({"message":"unautorized access"})
  }
});

server.on("listening", () => {
  console.log("the server has started listening !");
});
server.on("error", error => {
  console.log("the server has encountered an error !");
  console.error(error);
});
server.listen(3333);
