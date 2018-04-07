// var net = require('net');
// var server = net.createServer(function(socket){
//     socket.on('data', function(data){
//         socket.write(data);
//     })
// })
// server.listen(8888);

// var EventEmitter = require('events').EventEmitter;
// var channel = new EventEmitter();
// channel.on('join', function(){
//     console.log('Welcome');
// })
// channel.emit('join');

var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function(id, client){
    this.clients[id] = client;
    this.subscriptions[id] = function(senerId, message){
        if(id != senerId){
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
});

var server = net.createServer(function(client){
    var id = client.remoteAddress + ':' + client.remotePort;
    channel.emit('join', id, client);
    client.on('data', function(data){
        data = data.toString();
        channel.emit('broadcast', id, data);
    })
    client.on('close', function(){
        channel.emit('leave', id)
    })
});

channel.on('leave', function(id){
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + ' has left the chat .\n');
})

channel.on('shutdown', function(){
    channel.emit('broadcast', '', 'chat has shut down . \n');
    channel.removeAllListeners('broadcast');
})
channel.on('data', function(data){
    data = data.toString();
    if(data == 'shutdown\r\n'){
        channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data)
})
server.listen(8888)