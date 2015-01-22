var clickAndTalk = clickAndTalk || {};
clickAndTalk.sessionModule = (function ($) {
    "use strict";
    
    //private fields
    var _sessionId;
    var _userName;
    var _socket = io.connect();
    
    return {
        //public methods
        init : function (userName, sessionId, onChat, onJoined, onSessionCreated, onRatingsChanged) {
            _sessionId = sessionId;
            _userName = userName;
           
            //setting socket related handlers and join specific session
            _socket.emit('join session', _sessionId);
            _socket.on('video related message', clickAndTalk.webRTCPeerConnectionModule.onVideoRelatedMessage);
            _socket.on('chat', function (data) {
                onChat(data);
            });
            _socket.on('joined another user', function (numberOfUsers) {
                if (numberOfUsers > 1) {
                    clickAndTalk.videoModule.setChannelCreated();
                }
                
                onJoined(numberOfUsers);
            });
            _socket.on('joined successfully', function (data) {
                if (data.chatHistory != null) {
                    for (var index = 0; index < data.chatHistory.length; index++) {
                        onChat(data.chatHistory[index]);
                    }
                }
                if (data.numberOfUsers > 1) {
                    clickAndTalk.videoModule.setChannelCreated();
                }
                else {
                    clickAndTalk.videoModule.setIsInitiator(true);
                }

                onJoined(data.numberOfUsers);
                onRatingsChanged(data.chatRatings);
            });
            _socket.on('reload top votes', function (data) {
                onRatingsChanged(data);
            });
            
            onSessionCreated();
        },
        sendVideoRelatedMessage : function (message) {
            _socket.emit('video related message', { sessionId : _sessionId, message : message });
        },
        sendChatMessage : function (messageToSend, next) {
            _socket.emit('chat', { message : messageToSend, userName : _userName, sessionId : _sessionId });
            next();
        },
        voteForMessage : function (messageId, message, color) {
            _socket.emit('vote for message', { sessionId : _sessionId, userName : _userName, messageId : messageId, message : message, color : color});
        }
    };
})(jQuery);