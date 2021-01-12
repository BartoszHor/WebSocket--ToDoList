const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const server = app.listen(8000,() => {
    console.log('Server is running on port 8000')
})

const io = socket(server)
const tasks = []

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => { console.log('I have new task from' + socket.id);
        tasks.push(task)
        console.log(tasks)
        socket.broadcast.emit('addTask', task)
    });

    socket.on('removeTask', (id) => {
       tasks.splice(id, 1)
       socket.broadcast.emit('removeTask', id)
    });
});

app.use((req,res)=> {
    res.status(404).send({message: 'Not found...'}) ;
 });