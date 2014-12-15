(function () {
    clickAndTalk.sessionModule.joinSession('#hdnJoinSessionId');
    clickAndTalk.sessionModule.onChat(function (data) {
        $('#txtJoinChat').append('<p style="color:' + data.color + '"><b>' + data.message + '<b/><p/>');
    });
    clickAndTalk.sessionModule.onJoinedAnotherUser(function (numberOfUsers) {
        if (numberOfUsers > 1) {
            $('#no-other-participiants').hide();
        }
        else {
            $('#no-other-participiants').show();
        }
        $('#txtNumberOfUsers').val(numberOfUsers);
    });
    clickAndTalk.sessionModule.setJoinUrl('#txtJoinJoinUrl', '#hdnJoinSessionId');
    clickAndTalk.sessionModule.initializeEnterMessageButton('#btnEnterMessage', '#txtJoinMessage', '#hdnJoinUserName', '#hdnJoinSessionId', 'Please enter a message!');
    clickAndTalk.sessionModule.initializeMessageOnKeyPress('#txtJoinMessage', '#hdnJoinUserName', '#hdnJoinSessionId', 'Please enter a message!');
    
    clickAndTalk.videoModule.init('#btnStartVideo', '#btnStopVideo', '#myVideo');
})();