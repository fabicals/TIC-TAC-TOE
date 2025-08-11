const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let players = 0;

io.on('connection', (socket) => {

    if (players >= 2) {
        socket.emit('room-full');
            return;
    }

    const symbol = players === 0 ? 'X' : 'O';
    players++;
    socket.emit('player-assigned', symbol);

    socket.on('move' , (data) => {
        socket.broadcast.emit('move',data);
    });

    socket.on('disconnect', () => {
        players--;
        socket.broadcast.emit('player-disconnected');
    });

});

http.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
