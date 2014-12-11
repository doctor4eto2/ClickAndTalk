(function () {
    $('#btnHomeCreateSession').click(function () {
        var userName = $('#txtHomeUserName').val();         
        if (userName != '') {
            window.location = '/session/create?' + 'userName=' + userName;
        }
        else {
            alert('User name is required!');
        }
    });
    $('#btnHomeJoinSession').click(function () {
        var userName = $('#txtHomeUserName').val(); 
        var sessionId = $('#txtHomeJoinSessionId').val();
        
        if (sessionId != '' && userName != '') {
            window.location = '/session/join?sessionId=' + sessionId + '&&userName=' + userName;
        }
        else {
            if (userName == '') {
                alert('User name is required!');
            }
            else {
                alert('Session id is required!');
            }
        }
    });
})();