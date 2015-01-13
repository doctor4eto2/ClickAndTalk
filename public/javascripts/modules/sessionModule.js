﻿var clickAndTalk = clickAndTalk || {};
clickAndTalk.sessionModule = (function ($) {
    //private fields
    var _sessionIdSelector;
    var _joinUrlSelector;
    var _joinChatSelector;
    var _socket = io.connect();
    
    //private methods
    var sendChatMessage = function (message, hdnUserName, hdnSessionIdName, txtMessageName) {
        var userName = $(hdnUserName).val();
        
        _socket.emit('chat', { message : message, sessionId : $(hdnSessionIdName).val(), userName : userName, sessionId : $(_sessionIdSelector).val() });
        $(txtMessageName).val('');
    };
    var appendTextMessage = function (data) {
        var d = new Date(data.time);
        var hours = d.getHours();
        var minutes = d.getMinutes();
        
        if (minutes < 10) {
            
            minutes = '0' + minutes;
        }
        
        if (hours < 10) {
            
            hours = '0' + hours;
        }
        
        var message = '>>> (' + hours + ':' + minutes + ') ' + data.userName + ' : ' + data.message;
        
        $(_joinChatSelector).append('<p style="color:' + data.color + '"><b>' + message + '<b/><p/>');
    };

    return {
        //public methods
        init : function (joinUrlSel, sessionIdSel, joinChatSel, btnEnterMessageSel, textMessageSel, userNameSel, pleaseEnterMessageText, noOtherParticipiantsSel, numberOfUsersSel) {
            _sessionIdSelector = sessionIdSel;
            _joinUrlSelector = joinUrlSel;
            _joinChatSelector = joinChatSel;
            
            //setting some event handlers
            $(btnEnterMessageSel).click(function () {
                var textMessage = $(textMessageSel).val();
                
                if (textMessage) {
                    sendChatMessage(textMessage, userNameSel, _sessionIdSelector, textMessageSel);
                }
                else {
                    alert(pleaseEnterMessageText);
                }
            });
            
            $(textMessageSel).keypress(function (e) {
                if (e.which == 13) // enter button
                {
                    var textMessage = $(this).val();
                    
                    if (textMessage) {
                        sendChatMessage(textMessage, userNameSel, _sessionIdSelector, textMessageSel);
                    }
                    else {
                        alert(pleaseEnterMessageText);
                    }
                }
            }); 
            
            //setting socket related handlers and join specific session
            _socket.emit('join session', $(_sessionIdSelector).val());
            _socket.on('video related message', clickAndTalk.webRTCPeerConnectionModule.onVideoRelatedMessage);
            _socket.on('chat', function (data) {
                appendTextMessage(data);
            });
            _socket.on('joined another user', function (numberOfUsers) {
                if (numberOfUsers > 1) {
                    clickAndTalk.videoModule.setChannelCreated();
                    
                    $(noOtherParticipiantsSel).hide();
                }
                else {
                    $(noOtherParticipiantsSel).show();
                }
                $(numberOfUsersSel).val(numberOfUsers);
            });
            _socket.on('joined successfully', function (data) {
                
                if (data.chatHistory != null) {
                    for (var index = 0; index < data.chatHistory.length; index++) {
                        appendTextMessage(data.chatHistory[index]);
                    }
                }
                if (data.numberOfUsers > 1) {
                    clickAndTalk.videoModule.setChannelCreated();
                    $(noOtherParticipiantsSel).hide();
                }
                else {
                    clickAndTalk.videoModule.setIsInitiator(true);
                    $(noOtherParticipiantsSel).show();
                }
                $(numberOfUsersSel).val(data.numberOfUsers);
            });

            $(_joinUrlSelector).val(window.location.origin + '/session/join' + '?sessionId=' + $(_sessionIdSelector).val());

        },
        sendVideoRelatedMessage : function (message) {
            _socket.emit('video related message', { sessionId : $(_sessionIdSelector).val(), message : message });
        },
        initializeWrongSessionIdBackButton : function (btnBackSelector, redirectUrl) {
            $(btnBackSelector).click(function () {
                window.location = redirectUrl;
            })
        },
        initializeEnterYourNameToJoinButton : function (btnEnterYourNameSelector, txtEnterYourNameSelector, pleaseEnterYourNameMessage, prevousRequestedUrlSelector){
            $(btnEnterYourNameSelector).click(function () {
                var name = $(txtEnterYourNameSelector).val();
                
                if (name == '') {
                    alert(pleaseEnterYourNameMessage);
                }
                else {
                    window.location = $(prevousRequestedUrlSelector).val() + '&&userName=' + name;
                }
            });
            $(txtEnterYourNameSelector).keypress(function (e) {
                if (e.which == 13) // enter button
                {
                    var name = $(this).val();
                    
                    if (name) {
                        window.location = $(prevousRequestedUrlSelector).val() + '&&userName=' + name;
                    }
                    else {
                        alert(pleaseEnterYourNameMessage);
                    }
                }
            });
        }
    };
})(jQuery);