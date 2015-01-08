var clickAndTalk = clickAndTalk || {};
clickAndTalk.sessionModule = (function () {
    
    //private fields
    var sessionIdSelector;
    var joinUrlSelector;
    var txtJoinChatSelector;
    var joinUrlSelector;
    var socket = io.connect();
    
    //private methods
    var appendChatMessage = function (message, hdnUserName, hdnSessionIdName, txtMessageName) {
        var userName = $(hdnUserName).val();
        
        socket.emit('chat', { message : message, sessionId : $(hdnSessionIdName).val(), userName : userName });
        $(txtMessageName).val('');
    };
    
    return {
        //public methods
        init : function (joinUrlSel, sessionIdSel, joinChatSel, joinUrlSel, btnEnterMessageSel, textMessageSel, userNameSel, pleaseEnterMessageText, noOtherParticipiantsSel, numberOfUsersSel) {
            sessionIdSelector = sessionIdSel;
            joinUrlSelector = joinUrlSel;
            joinChatSelector = joinChatSel;
            joinUrlSelector = joinUrlSel;
            
            //setting some event handlers
            $(btnEnterMessageSel).click(function () {
                var textMessage = $(textMessageSel).val();
                
                if (textMessage) {
                    appendChatMessage(textMessage, userNameSel, sessionIdSelector, textMessageSel);
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
                        appendChatMessage(textMessage, userNameSel, sessionIdSelector, textMessageSel);
                    }
                    else {
                        alert(pleaseEnterMessageText);
                    }
                }
            });
            
            //setting socket related handlers and join specific session
            socket.emit('join session', $(sessionIdSelector).val());
            socket.on('video related message', function (message) {
                var isInitiator = clickAndTalk.videoModule.isInitiator();
                
                if (message === 'user media allowed') {
                    clickAndTalk.webRTCPeerConnectionModule.init(clickAndTalk.videoModule.getRemoteVideoSelector(), 
                                                                 clickAndTalk.videoModule.getLocalStream(),
                                                                 isInitiator,
                                                                 clickAndTalk.videoModule.getChannelReady());
                }
                else if (message.type === 'offer') {
                    if (!isInitiator && !clickAndTalk.webRTCPeerConnectionModule.isStarted()) {
                        clickAndTalk.webRTCPeerConnectionModule.init(clickAndTalk.videoModule.getRemoteVideoSelector(), 
                                                                     clickAndTalk.videoModule.getLocalStream(),
                                                                     isInitiator,
                                                                     clickAndTalk.videoModule.getChannelReady());
                    }
                    
                    clickAndTalk.webRTCPeerConnectionModule.setRemoteDescription(message);
                    clickAndTalk.webRTCPeerConnectionModule.createAnswer();
                } 
                else if (message.type === 'answer' && clickAndTalk.webRTCPeerConnectionModule.isStarted()) {
                    clickAndTalk.webRTCPeerConnectionModule.setRemoteDescription(message);
                } 
                else if (message.type === 'candidate' && clickAndTalk.webRTCPeerConnectionModule.isStarted()) {
                    clickAndTalk.webRTCPeerConnectionModule.addIceCandidate(message);
                }
            });
            socket.on('chat', function (data) { $(joinChatSelector).append('<p style="color:' + data.color + '"><b>' + data.message + '<b/><p/>') });
            socket.on('joined another user', function (numberOfUsers) {
                                                if (numberOfUsers > 1) {
                                                    clickAndTalk.videoModule.setChannelCreated();
                    
                                                    $(noOtherParticipiantsSel).hide();
                                                }
                                                else {
                                                    $(noOtherParticipiantsSel).show();
                                                }
                                                $(numberOfUsersSel).val(numberOfUsers);
                                            });
            socket.on('joined successfully', function (numberOfUsers) {
                                                if (numberOfUsers > 1) {
                                                    clickAndTalk.videoModule.setChannelCreated();
                                                    $(noOtherParticipiantsSel).hide();
                                                }
                                                else {
                                                    clickAndTalk.videoModule.setIsInitiator(true);
                                                    $(noOtherParticipiantsSel).show();
                                                }
                                                $(numberOfUsersSel).val(numberOfUsers);
            });

            $(joinUrlSelector).val(window.location.origin + '/session/join' + '?sessionId=' + $(sessionIdSelector).val());

        },
        sendVideoRelatedMessage : function (message) {
            socket.emit('video related message', { sessionId : $(sessionIdSelector).val(), message : message });
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
})();