const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
    Server
} = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
const usernames=[]




io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('globalSync',"test")
    socket.on('chat-msg', (data) => {
        data = JSON.parse(data)
        //console.log(data)
       
    })
    socket.on('getUsername', (data) => {
        data = JSON.parse(data)
        console.log(data)
        if(usernames.includes(data.username)){
            //console.log('trife')
            return socket.emit("userNotSet","error")
        }
        usernames.push(data.username)
        console.log(usernames)
        socket.username=data.username
        console.log(socket.username)
        socket.emit("userSet",JSON.stringify({username:data.username}))
        return socket.join("chat-room")
       
    })
    socket.on('chat-msg',data=>{
        socket.to('chat-room').emit('chat-msg',data)
    })
    socket.on('disconnect',()=>{
        console.log(socket.username+" disconnected")
        usernames.pop(socket.username)
        console.log(usernames)
        socket.leave('chat-room')
    })

});

server.listen(80, () => {
    console.log('80 is up!');
});