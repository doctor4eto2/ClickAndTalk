$(document).ready(function () {
    clickAndTalk.homeModule.init('#btnHomeCreateSession', 
                                 '#btnHomeJoinSession', 
                                 '#txtHomeJoinSessionId',
                                 '#txtHomeUserName', 
                                 '/session/join?sessionId=', 
                                 '/session/create?', 
                                 'User name is required!', 
                                 'Session id is required!');      
});