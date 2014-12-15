var clickAndTalk = clickAndTalk || {};
clickAndTalk.sessionModule = (function () {
    
    var socket = io.connect();
    
    return {
        joinSession : function (joinSessionIdSelector){
            socket.emit('join session', $(joinSessionIdSelector).val());
        },
        onChat : function (onChatEventHandler)
        {
            socket.on('chat', onChatEventHandler);
        },
        onJoinedAnotherUser : function (onJoinedAnotherUserEventHandler)
        {
            socket.on('joined another user', onJoinedAnotherUserEventHandler);
        },
        initializeEnterMessageButton : function (btnEnterMessageSelector, messageSelector, userNameSelector, sessionIdSelector, pleaseEnterMessageText){
            $(btnEnterMessageSelector).click(function () {
                var textMessage = $(messageSelector).val();
                
                if (textMessage) {
                    clickAndTalk.sessionModule.appendChatMessage(textMessage, userNameSelector, sessionIdSelector, messageSelector);
                }
                else {
                    alert(pleaseEnterMessageText);
                }
            });
        },
        initializeMessageOnKeyPress : function (txtEnterMessageSelector, userNameSelector, sessionIdSelector, pleaseEnterMessageText)
        {
            $(txtEnterMessageSelector).keypress(function (e) {
                if (e.which == 13) // enter button
                {
                    var textMessage = $(this).val();
                    
                    if (textMessage) {
                        clickAndTalk.sessionModule.appendChatMessage(textMessage, userNameSelector, sessionIdSelector, txtEnterMessageSelector);
                    }
                    else {
                        alert(pleaseEnterMessageText);
                    }
                }
            });
        },
        appendChatMessage : function (message, hdnUserName, hdnSessionIdName, txtMessageName) {
            var userName = $(hdnUserName).val();

            socket.emit('chat', { message : message, sessionId : $(hdnSessionIdName).val(), userName : userName });
            $(txtMessageName).val('');
        },
        setJoinUrl : function (joinUrlSelector, sessionIdSelector){
            $(joinUrlSelector).val(window.location.origin + '/session/join' + '?sessionId=' + $(sessionIdSelector).val());
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
        }
    };
})();