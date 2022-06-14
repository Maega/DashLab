const express = require('express');
const app = express();
/* const http = require('http').Server(app);
const io = require('socket.io')(http); */
const port = 1338;

// Root Route
/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
}); */

app.use('/', express.static(__dirname))

// Listener
app.listen(port, () => console.log(`DashLab Web Server is running on port ${port}`));

/* io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
}); */
/* 
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
}); */