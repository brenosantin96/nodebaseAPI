import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api';
import * as http from 'http'
import socketIO, { Server, Socket } from 'socket.io';
import { SocketData, ServerToClientEvents, ClientToServerEvents, InterServerEvents } from './socketInterface';

dotenv.config();

const serverExpress = express();
const server = http.createServer(serverExpress);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

//rota estática, cors, requests e responses, routes.
serverExpress.use(cors());
serverExpress.use(express.static(path.join(__dirname, '../public')));
serverExpress.use(express.urlencoded({ extended: true }));
serverExpress.use(apiRoutes);

//Usuarios
let connectedUsers : Array<string> = [];

//EXecuta quando um cliente se conecta no servidor
io.on('connection', (socket) => {
    console.log('Um usuário se conectou');

    socket.on('joinRequest', (username)=> {
        socket.data.username = username;
        connectedUsers.push(username)
        console.log(connectedUsers);
    })

    socket.on('disconnect', () => {
        console.log('Um usuário saiu')
    })


});



server.listen(process.env.PORT, () => {
    console.log("Server iniciado.")
});
