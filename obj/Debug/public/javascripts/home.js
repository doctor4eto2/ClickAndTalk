(function () {
    $('#btnHomeCreateSession').click(function () {
        window.location = '/session/create';
    });
    $('#btnHomeJoinSession').click(function () {
        
        var sessionId = $('#txtHomeJoinSessionId').val();
        
        if (sessionId != '') {
            window.location = '/session/join?sessionId=' + sessionId;
        }
        else {
            alert("Please enter session id");
        }
    });
})();