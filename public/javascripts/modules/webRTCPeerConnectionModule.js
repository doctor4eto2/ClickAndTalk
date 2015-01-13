var clickAndTalk = clickAndTalk || {};
clickAndTalk.webRTCPeerConnectionModule = (function ($) {
    //private fields
    var _pc; 
    var _isStarted = false;// flag used to determine if the peer connection was initialized
    var _remoteVideoSelector;
    var _remoteVideoStream;
    // Set up audio and video regardless of what devices are present.
    var _sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };
    var _configuration = {
        iceServers: [
                        { url: "stun:23.21.150.121" },
                        { url: "stun:stun.l.google.com:19302" },
                        { url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com" }
                    ]
    };
    var _options = {
        optional: [
                      { RtpDataChannels: true, },
                      { DtlsSrtpKeyAgreement: true }
                  ]
    };
    
    //browser related hacks
    var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
    var ICECandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;
    var WindowURL = window.URL || webkitURL;

    //private methods
    var createPeerConnection = function () {
        try {
            _pc = new RTCPeerConnection(_configuration, _options);
            _pc.onicecandidate = function (event) {
                if (event.candidate) {
                    clickAndTalk.sessionModule.sendVideoRelatedMessage({
                        type: 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
                }
            };
            _pc.onaddstream = function (event) {
                $(_remoteVideoSelector).attr('src', WindowURL.createObjectURL(event.stream));
                $(_remoteVideoSelector).show();
                $(_remoteVideoSelector).on('error', function () {
                    _remoteVideoStream.stop();
                    clickAndTalk.videoModule.stopVideo();
                });
                _remoteVideoStream = event.stream;
                _remoteVideoStream.onended = function () {
                    clickAndTalk.videoModule.stopVideo();
                };
            };
            _pc.onremovestream = function (event) {
            };

        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            return;
        }
    };

    return {
        //public methods
        init : function () {
            var localVideoStream = clickAndTalk.videoModule.getLocalStream();
            var isInitiator = clickAndTalk.videoModule.isInitiator();
            
            if (!_isStarted && typeof localVideoStream != 'undefined' && clickAndTalk.videoModule.getChannelReady()) {
                _remoteVideoSelector = clickAndTalk.videoModule.getRemoteVideoSelector();
                createPeerConnection(isInitiator);
                
                _pc.addStream(localVideoStream);
                
                _isStarted = true;
                
                if (isInitiator) {
                    _pc.createOffer(function (sessionDescription) {
                        _pc.setLocalDescription(sessionDescription);
                        clickAndTalk.sessionModule.sendVideoRelatedMessage(sessionDescription);
                    }, function (event) {}, _sdpConstraints);
                }
            }
        },
        stopWebRTCConnection : function (){
            _isStarted = false;
            _pc = null;
        },
        onVideoRelatedMessage : function (message) {
            if (message === 'user media allowed') {
                clickAndTalk.webRTCPeerConnectionModule.init();
            }
            else if (message.type === 'offer') {
                if (!clickAndTalk.videoModule.isInitiator() && !_isStarted) {
                    clickAndTalk.webRTCPeerConnectionModule.init();
                }
            
                _pc.setRemoteDescription(new RTCSessionDescription(message));
                _pc.createAnswer(function (sessionDescription) {
                    _pc.setLocalDescription(sessionDescription);
                    clickAndTalk.sessionModule.sendVideoRelatedMessage(sessionDescription);
                }, function (event) {}, _sdpConstraints);
            } 
            else if (message.type === 'answer' && _isStarted) {
                _pc.setRemoteDescription(new RTCSessionDescription(message));
            } 
            else if (message.type === 'candidate' && _isStarted) {
                var candidate = new ICECandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                _pc.addIceCandidate(candidate);
            }
        }
    };
})(jQuery);