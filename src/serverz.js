const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io')
const dotenv = require('dotenv');

dotenv.config()
const app = express();
const server = http.createServer(app)
const io = socketIO(server);

//rota estática, cors, requests e responses
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.use('/main', (req, res)=>{
    res.send("Olá mundo");
})


//SOCKET
//Usuarios
let connectedUsers = [];

//EXecuta quando um cliente se conecta no servidor
io.on('connection', (socket) => {
    console.log('Um usuário se conectou');

    socket.on('join-request', (username)=> {
        socket.username = username;
        connectedUsers.push(username)
        console.log(connectedUsers);

        socket.emit('user-ok', connectedUsers);

        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        })

    })

    socket.on('disconnect', (username) => {

        //removendo o usuário do array
        connectedUsers = connectedUsers.filter(u => u != socket.username);

        console.log(connectedUsers);
        
        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        })


    })

    socket.on('send-msg', (txt)=>{
        let obj = {
            username: socket.username,
            msg: txt
        };

        socket.emit('show-msg', obj);
        socket.broadcast.emit('show-msg', obj);

    })


});



server.listen(process.env.PORT, ()=>{
    console.log('Servidor iniciado');
})