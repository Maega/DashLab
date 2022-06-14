// * Console Socket API


const ipc = require('node-ipc').default;

ipc.config.id = 'socket-api';
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.serve(() => ipc.server.on('terminal', data => {
    data.out.html = ansiToHtml.toHtml(data.out.raw);
    io.sockets.emit('terminal', data);
}));
ipc.server.start();

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://192.168.1.176:1338",
        methods: ["GET", "POST"]
    }
});
const port = 1339;

const AnsiToHtml = require('ansi-to-html');
const ansiToHtml = new AnsiToHtml({
    fg: '#000',
    bg: '#fff',
    stream: true
});

io.on('connection', (socket) => {
    console.log('Got socket connection!');
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

http.listen(port, () => console.log(`Console socket is running on port ${port}`));