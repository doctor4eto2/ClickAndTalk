(function () {
    var socket = io.connect();
    socket.emit('join session', $('#hdnJoinSessionId').val());
    
    socket.on('chat', function (data) {
        $('#txtJoinChat').append('<p style="color:' + data.color + '"><b>' + data.message + '<b/><p/>');
    });
    socket.on('joined another user', function (numberOfUsers) {
        if (numberOfUsers > 1) {
            $('#no-other-participiants').hide();
        }
        else {
            $('#no-other-participiants').show();
        }
        $('#txtNumberOfUsers').val(numberOfUsers);
    });
    $('#txtJoinJoinUrl').val(window.location.origin + '/session/join' + '?sessionId=' + $('#hdnJoinSessionId').val());
    $('#btnJoinEnterMessage').click(function () {
        
        var textMessage = $('#txtJoinMessage').val();        
        
        if (textMessage) {
            appendMessage(textMessage, '#hdnJoinUserName', '#hdnJoinSessionId', '#txtJoinMessage');
        }
        else {
            alert('Please enter a message!');
        }
    });
    
    $("#txtJoinMessage").keypress(function (e) {
        if (e.which == 13) { // enter
            var textMessage = $(this).val();
            
            if (textMessage) {
                appendMessage(textMessage, '#hdnJoinUserName', '#hdnJoinSessionId', '#txtJoinMessage');
            }
            else {
                alert('Please enter a message!');
            }
        }
    });

    function appendMessage(message, hdnUserName, hdnSessionIdName, txtMessageName)
    {
        var userName = $(hdnUserName).val();
        
        socket.emit('chat', { message : message, sessionId : $(hdnSessionIdName).val(), userName : userName });
        $(txtMessageName).val('');
    }
})();