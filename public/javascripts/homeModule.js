var clickAndTalk = clickAndTalk || {};
clickAndTalk.homeModule = (function () {
    return {
        initializeCreateSessionButton : function (btnCreateSessionSelector, userNameSelector, redirectUrl, alertMessage) {
            $(btnCreateSessionSelector).click(function () {
            var userName = $(userNameSelector).val();

            if (userName != '') {
                window.location = redirectUrl + 'userName=' + userName;
            }
            else {
                alert(alertMessage);
            }
            });
        },
        initializeJoinSessionButton : function (btnJoinSessionSelector, userNameSelector, joinSessionIdSelector, redirectUrl, userNameRequiredMessage, sessionIdRequiredMessage){
            $(btnJoinSessionSelector).click(function () {
                var userName = $(userNameSelector).val();
                var sessionId = $(joinSessionIdSelector).val();
                
                if (sessionId != '' && userName != '') {
                    window.location = redirectUrl + sessionId + '&&userName=' + userName;
                }
                else {
                    if (userName == '') {
                        alert(userNameRequiredMessage);
                    }
                    else {
                        alert(sessionIdRequiredMessage);
                    }
                }
            });
        }
    };
})();