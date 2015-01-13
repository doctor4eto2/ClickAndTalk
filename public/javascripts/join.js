$(document).ready(function () {
    clickAndTalk.sessionModule.init('#txtJoinJoinUrl', 
                                    '#hdnJoinSessionId', 
                                    '#txtJoinChat', 
                                    '#btnEnterMessage', 
                                    '#txtJoinMessage', 
                                    '#hdnJoinUserName', 
                                    'Please enter a message!', 
                                    '#no-other-participiants', 
                                    '#txtNumberOfUsers',
                                    '#chatDashboard a');
    clickAndTalk.videoModule.init('#btnStartVideo', 
                                  '#btnStopVideo', 
                                  '#myVideo', 
                                  '#txtNumberOfUsers', 
                                  '#remoteVideo', 
                                  '#noVideoImage', 
                                  '#lblMyVideo', 
                                  '#lblRemoteVideo');
});

