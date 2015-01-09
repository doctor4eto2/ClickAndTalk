$(document).ready(function () {
    clickAndTalk.sessionModule.init('#txtJoinJoinUrl', 
                                    '#hdnJoinSessionId', 
                                    '#txtJoinChat', 
                                    '#txtJoinJoinUrl', 
                                    '#btnEnterMessage', 
                                    '#txtJoinMessage', 
                                    '#hdnJoinUserName', 
                                    'Please enter a message!', 
                                    '#no-other-participiants', 
                                    '#txtNumberOfUsers');
    clickAndTalk.videoModule.init('#btnStartVideo', 
                                  '#btnStopVideo', 
                                  '#myVideo', 
                                  '#txtNumberOfUsers', 
                                  '#remoteVideo', 
                                  '#noVideoImage', 
                                  '#lblMyVideo', 
                                  '#lblRemoteVideo');
});

