(function (chatServerManager) {
    var socketIOModule = require('socket.io');
    var colors = ['green', 'blue', 'red', 'yellow', 'black', 'orange', 'grey', 'brown', 'purple', 'pink'];
    var userColors = {};
    var usersPerSession = { };
    
    chatServerManager.init = function (server) {
        var io = socketIOModule.listen(server);
        
        io.sockets.on('connection', function (socket) {
            socket.on('chat', function (data) {
                
                var d = new Date();
                var hours = d.getHours();
                var minutes = d.getMinutes();
                
                if (minutes < 10) {
                    
                    minutes = '0' + minutes;
                }
                
                if (hours < 10) {
                    
                    hours = '0' + hours;
                }
                
                var message = '>>> (' + hours + ':' + minutes + ') ' + data.userName + ' : ' + data.message;                
                var color;
                
                if (!userColors[data.userName]) {
                    userColors[data.userName] = colors[Math.floor((Math.random() * 100) + 1) % colors.length];
                }

                color = userColors[data.userName];
                
                var dataToSend = 
                {
                    message : message, 
                    color : color
                };
                
                socket.broadcast.to(data.sessionId).emit('chat', dataToSend);
                socket.client.sockets[0].emit('chat', dataToSend);//push back to the sender
            });
            
            socket.on('join session', function (sessionId) {
                socket.join(sessionId);
                
                var numberOfUsers;

                if (!usersPerSession[sessionId]) {
                    numberOfUsers = 1;
                    usersPerSession[sessionId] = 1;
                }
                else {
                    usersPerSession[sessionId]++;
                    numberOfUsers = usersPerSession[sessionId];
                }

                socket.broadcast.to(sessionId).emit('joined another user', numberOfUsers);
                socket.client.sockets[0].emit('joined another user', numberOfUsers);
            });
        });

    };

})(module.exports);