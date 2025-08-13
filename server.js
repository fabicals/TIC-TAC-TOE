const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
    const playerCount = Object.keys(players).length;


    if (playerCount >= 2) {
        socket.emit('room-full');
            return;
    }

    const assignedSymbols = Object.values(players);
    const symbol = assignedSymbols.includes ('X') ? 'O' : 'X';

    players[socket.id] = symbol;
    

    socket.emit('player-assigned', symbol);
    io.emit('update-players', players);

    if(Object.keys(players).length === 2) {
        io.emit('both-players-connected');
    } else {
        socket.emit('waiting-for-players');
    }

    socket.on('move' , (data) => {
        socket.broadcast.emit('move',data);
    });

    
    socket.on('game-over', (data) => {
        io.emit('game-over', data);
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        console.log('Player disconnected, emitting waiting-for-players');
        io.emit('waiting-for-players');
        socket.broadcast.emit('player-disconnected');
    });  

});


http.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
