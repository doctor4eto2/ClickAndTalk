(function (chatServerManager) {
    // module references
    var socketIOModule = require('socket.io');
    var shortIdModule = require('shortid');
    var dataRepository = require('.././repositories').dataRepository;
    
    // private fields
    var _colors = ['green', 'red', 'black','brown', 'purple'];
    var _userColors = {};
    var _usersPerSession = {};
    
    // private methods
    var sortVotes = function (threadRating) {
        var result = [];
        
        if (threadRating != null) {
            for (var index = 0; index < threadRating.stats.length; index++) {
                result.push({
                    messageId : threadRating.stats[index].messageId, 
                    numberOfVotes : threadRating.stats[index].votes.length, 
                    message : threadRating.stats[index].message,
                    color : threadRating.stats[index].color,
                    votes : threadRating.stats[index].votes,
                });
            }
            result.sort(function (a, b) { return b.numberOfVotes - a.numberOfVotes });
        }

        return result;
    }
    
    // public methods
    chatServerManager.init = function (server) {
        var io = socketIOModule.listen(server);
        
        io.sockets.on('connection', function (socket) {
            socket.on('chat', function (data) {
                if (!_userColors[data.sessionId]) {
                    _userColors[data.sessionId] = {};
                }
                
                if (!_userColors[data.sessionId][data.userName]){
                    _userColors[data.sessionId][data.userName] = _colors[Math.floor((Math.random() * 100) + 1) % _colors.length];
                }
                
                var messageId = shortIdModule.generate();

                var dataToSend = 
                {
                    messageId : messageId,
                    message : data.message, 
                    color : _userColors[data.sessionId][data.userName],
                    time : new Date().toString(),
                    userName : data.userName,
                    sessionId : data.sessionId
                };
                
                dataRepository.saveThread(dataToSend, function () { 
                    socket.broadcast.to(data.sessionId).emit('chat', dataToSend);
                    socket.client.sockets[0].emit('chat', dataToSend);//push back to the sender
                });
            });
            
            socket.on('video related message', function (data) {
                socket.broadcast.to(data.sessionId).emit('video related message', data.message);
            });
            
            socket.on('vote for message', function (data) {
                dataRepository.voteForMessage(data, function () { 
                    var topVotesQuery = dataRepository.getThreadRating(data.sessionId);
                    topVotesQuery.exec(function (error, threadRating) {
                        var sortedVotes = sortVotes(threadRating);
                        
                        socket.broadcast.to(data.sessionId).emit('reload top votes', sortedVotes);
                        socket.client.sockets[0].emit('reload top votes', sortedVotes);
                    });
                });
            });

            socket.on('join session', function (sessionId) {
                socket.join(sessionId);
                
                var numberOfUsers;

                if (!_usersPerSession[sessionId]) {
                    numberOfUsers = 1;
                    _usersPerSession[sessionId] = 1;
                }
                else {
                    _usersPerSession[sessionId]++;
                    numberOfUsers = _usersPerSession[sessionId];
                }
                
                var callHistoryQuery = dataRepository.getChatHistory(sessionId);
                callHistoryQuery.exec(function (error, thread) {
                    var chatHistory = [];
                    
                    if (thread != null) {
                        for (var index = 0; index < thread.messages.length; index++) {
                            chatHistory.push({
                                userName : thread.messages[index].userName,
                                message : thread.messages[index].message, 
                                messageId : thread.messages[index].messageId, 
                                time : thread.messages[index].time, 
                                color : thread.messages[index].color, 
                                sessionId : thread.sessionId
                            })
                        }
                    }
                    
                    var topVotesQuery = dataRepository.getThreadRating(sessionId);
                    topVotesQuery.exec(function (error, threadRating) {
                        var sortedVotes = sortVotes(threadRating);

                        socket.broadcast.to(sessionId).emit('joined another user', numberOfUsers);
                        socket.client.sockets[0].emit('joined successfully', { numberOfUsers : numberOfUsers, chatHistory : chatHistory, chatRatings : sortedVotes});
                    });
                });
            });
        });

    };

})(module.exports);