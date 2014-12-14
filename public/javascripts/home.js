(function () {
    clickAndTalk.homeModule.initializeCreateSessionButton('#btnHomeCreateSession', '#txtHomeUserName', '/session/create?', 'User name is required!');
    clickAndTalk.homeModule.initializeJoinSessionButton('#btnHomeJoinSession', '#txtHomeUserName', '#txtHomeJoinSessionId', '/session/join?sessionId=', 'User name is required!', 'Session id is required!');
})();