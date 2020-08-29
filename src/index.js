const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { addUser, removeUser, getUser, getUsersInRooms } = require('./utils/users');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New Websocket connection');

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }
        socket.join(user.room)

        socket.emit('message', generateMessage(user.username, 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username, `has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRooms(user.room)
        })
        callback();
    });
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        const user = getUser(socket.id);
        if (filter.isProfane(message)) {
            return callback('Profanity is not Allowed');
        }
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    })
    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage(user.username, ` has Left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRooms(user.room)
            })
        }

    })
});
server.listen(port, () => {
    console.log(`Server started on port ` + port);
});