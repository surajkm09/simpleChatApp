
const http = require('http')
const app = require('./BackEnd/app')

const server = http.createServer(app)





server.on('listening',()=>{
    console.log('the server has started listening !');
})
server.on('error',(error)=>{
    console.log('the server has encountered an error !');
    console.error(error);
    
})


module.exports =server

