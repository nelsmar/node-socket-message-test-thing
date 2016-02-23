'use strict';

var MongoClient = require('mongodb').MongoClient;
var io = require('socket.io')();
var mongo;

io.listen(3000);

MongoClient.connect('mongodb://localhost:27017/message-test', function(err, db) {
    console.log('Connected correctly to server.');
    mongo = db;

    var stream = mongo.collection('queue').find({}, {tailable: true, awaitdata: true}).stream();

    // Send an emit to all clients to verify the tailable cursor is working...
    stream.on('data', function(document) {
        console.log('broadcasting this message: ', document);
        io.emit('message', document);
    });
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('message', function(data) {
        console.log('message received: ', data);

        // Insert into our DB. The DB has a tailable cursor and a stream to emit on every insert
        mongo.collection('queue').insert(data, function(err, result) {
            if(err) console.log('db insert err: ', err);
        });
    });
});