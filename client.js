'use strict';

var mongo = require('mongodb').MongoClient,
    socket = require('socket.io-client')('http://localhost:3000');

socket.on('connect', function(cSocket) {
    console.log('connected to server');
    socket.emit('message', {
        client: 'client.js',
        message: 'New Message!',
        date: new Date()
    });
});

socket.on('message', function(msg) {
    console.log('received the following message: ', msg);
});