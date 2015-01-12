(function (chatServerManager) {
    var socketIOModule = require('socket.io');
    var dataRepository = require('.././repositories').dataRepository;
    var colors = ['green', 'red', 'black','brown', 'purple'];
    var userColors = {};
    var usersPerSession = { };
    
    chatServerManager.init = function (server) {
        var io = socketIOModule.listen(server);
        
        io.sockets.on('connection', function (socket) {
            socket.on('chat', function (data) {
                if (!userColors[data.userName]) {
                    userColors[data.userName] = colors[Math.floor((Math.random() * 100) + 1) % colors.length];
                }
                
                var dataToSend = 
                {
                    message : data.message, 
                    color : userColors[data.userName],
                    time : new Date().toString(),
                    userName : data.userName,
                    sessionId : data.sessionId
                };
                
                dataRepository.saveThread(dataToSend);
                
                socket.broadcast.to(data.sessionId).emit('chat', dataToSend);
                socket.client.sockets[0].emit('chat', dataToSend);//push back to the sender
            });
            
            socket.on('video related message', function (data) {
                socket.broadcast.to(data.sessionId).emit('video related message', data.message);
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
                
                var callHistoryQuery = dataRepository.getChatHistory(sessionId);
                callHistoryQuery.exec(function (error, thread) {
                    var result = [];
                    
                    if (thread != null) {
                        for (var index = 0; index < thread.messages.length; index++) {
                            result.push({
                                userName : thread.messages[index].userName,
                                message : thread.messages[index].message, 
                                time : thread.messages[index].time, 
                                color : thread.messages[index].color, 
                                sessionId : thread.sessionId
                            })
                        }
                    }
                    
                    socket.broadcast.to(sessionId).emit('joined another user', numberOfUsers);
                    socket.client.sockets[0].emit('joined successfully', { numberOfUsers : numberOfUsers, chatHistory : result });
                });
            });
        });

    };

})(module.exports);