$(document).ready(function () {
    clickAndTalk.sessionModule.joinSession('#hdnJoinSessionId');
    clickAndTalk.sessionModule.onChat(function (data) {
        $('#txtJoinChat').append('<p style="color:' + data.color + '"><b>' + data.message + '<b/><p/>');
    });
    clickAndTalk.sessionModule.onVideoRelatedMessage(function (message) { 
        clickAndTalk.webRTCPeerConnectionModule.onVideoRelatedMessage(message);
    });
    clickAndTalk.sessionModule.onJoinedAnotherUser(function (numberOfUsers) {
        console.log('Another peer made a request to join room ' + $('#hdnJoinSessionId').val());
        console.log('This peer is the initiator of room ' + $('#hdnJoinSessionId').val() + '!');
        if (numberOfUsers > 1) {
            clickAndTalk.videoModule.channelCreated();

            $('#no-other-participiants').hide();
        }
        else {
            $('#no-other-participiants').show();
        }
        $('#txtNumberOfUsers').val(numberOfUsers);
    });
    clickAndTalk.sessionModule.onJoinedSuccessfully(function (numberOfUsers) {
        console.log('Room ' + $('#hdnJoinSessionId').val() + ' Successsfully joined.');
        if (numberOfUsers > 1) {
            clickAndTalk.videoModule.channelCreated();
            $('#no-other-participiants').hide();
        }
        else {
            clickAndTalk.videoModule.setInitiator();
            $('#no-other-participiants').show();
        }
        $('#txtNumberOfUsers').val(numberOfUsers);
    });
    clickAndTalk.sessionModule.setJoinUrl('#txtJoinJoinUrl', '#hdnJoinSessionId');
    clickAndTalk.sessionModule.initializeEnterMessageButton('#btnEnterMessage', '#txtJoinMessage', '#hdnJoinUserName', '#hdnJoinSessionId', 'Please enter a message!');
    clickAndTalk.sessionModule.initializeMessageOnKeyPress('#txtJoinMessage', '#hdnJoinUserName', '#hdnJoinSessionId', 'Please enter a message!');
    
    clickAndTalk.videoModule.init('#btnStartVideo', '#btnStopVideo', '#myVideo', '#txtNumberOfUsers', '#remoteVideo');
});