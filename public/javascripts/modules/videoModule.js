var clickAndTalk = clickAndTalk || {};
clickAndTalk.videoModule = (function () {
    "use strict";

    //private fields
    var _onStartVideo;
    var _onStopVideo;
    var _onRemoteVideoStart;
    var _localStream;
    // flags used for determining if this webrtc initiator and if there is a channel created yet
    var _isChannelReady = false;
    var _isInitiator = false;
    //browser hacks
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    return {
        //public methods
        init : function (onStartVideo, onStopVideo, onRemoteVideoStart) {
            _onStartVideo = onStartVideo;
            _onStopVideo = onStopVideo;
            _onRemoteVideoStart = onRemoteVideoStart;
            clickAndTalk.videoModule.startVideo();
        },
        startVideo : function () {
            if (!navigator.getUserMedia) {
                return false;
            }
            else {
                var settings = {
                    video: true, 
                    audio: true, 
                    toString: function () { return 'video, audio'; }
                };
                    
                navigator.getUserMedia(settings, onStream, function onError(error) {
                    clickAndTalk.videoModule.stopVideo();
                });
            }
                
            function onStream(stream) {
                _localStream = stream;
                _onStartVideo(stream);
                stream.onended = function () {
                    clickAndTalk.videoModule.stopVideo();
                };
                clickAndTalk.sessionModule.sendVideoRelatedMessage('user media allowed');
                    
                if (_isInitiator) {
                    clickAndTalk.webRTCPeerConnectionModule.init();
                }
            };
        },
        stopVideo : function () {
            _onStopVideo();
            clickAndTalk.webRTCPeerConnectionModule.close();
        },
        setChannelCreated : function (){
            _isChannelReady = true;
        },
        getChannelReady : function (){
            return _isChannelReady;
        },
        getLocalStream : function () {
            return _localStream;
        },
        onRemoteVideoStart : function (stream) {
            _onRemoteVideoStart(stream);
        },
        setIsInitiator : function (flag) {
            _isInitiator = flag;
        },
        isInitiator : function (){
            return _isInitiator;
        }
    };
})();