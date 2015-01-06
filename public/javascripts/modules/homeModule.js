var clickAndTalk = clickAndTalk || {};
clickAndTalk.homeModule = (function () {
    return {
        init : function (btnCreateSessionSelector, 
                         btnJoinSessionSelector, 
                         joinSessionIdSelector,
                         userNameSelector, 
                         joinSessionRedirectUrl, 
                         createSessionRedirectUrl, 
                         userNameRequiredMessage, 
                         sessionIdRequiredMessage) {
            $(btnCreateSessionSelector).click(function () {
            var userName = $(userNameSelector).val();

            if (userName != '') {
                window.location = createSessionRedirectUrl + 'userName=' + userName;
            }
            else {
                alert(userNameRequiredMessage);
            }
            });

            $(btnJoinSessionSelector).click(function () {
                var userName = $(userNameSelector).val();
                var sessionId = $(joinSessionIdSelector).val();
                
                if (sessionId != '' && userName != '') {
                    window.location = joinSessionRedirectUrl + sessionId + '&&userName=' + userName;
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