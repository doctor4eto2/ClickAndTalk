var clickAndTalk = clickAndTalk || {};
clickAndTalk.webRTCPeerConnectionModule = (function () {
    
    //private fields
    var pc, isStarted = false;// flag used to determine if the peer connection was initialized
    var remoteVideoSelector, remoteVideoStream;
    //browser related hacks
    var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
    var ICECandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;
    var WindowURL = window.URL || webkitURL;
    // Set up audio and video regardless of what devices are present.
    var sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };
    var configuration = {
        iceServers: [
                        { url: "stun:23.21.150.121" },
                        { url: "stun:stun.l.google.com:19302" },
                        { url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com" }
                    ]
    };
    var options = {
        optional: [
                      { RtpDataChannels: true, },
                      { DtlsSrtpKeyAgreement: true }
                  ]
    };
    
    //private methods
    var createPeerConnection = function () {
        try {
            pc = new RTCPeerConnection(configuration, options);
            pc.onicecandidate = function (event) {
                if (event.candidate) {
                    clickAndTalk.sessionModule.sendVideoRelatedMessage({
                        type: 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
                }
            };
            pc.onaddstream = function (event) {
                $(remoteVideoSelector).attr('src', WindowURL.createObjectURL(event.stream));
                $(remoteVideoSelector).show();
                $(remoteVideoSelector).on('error', function () {
                    remoteVideoStream.stop();
                    clickAndTalk.videoModule.stopVideo();
                });
                remoteVideoStream = event.stream;
                remoteVideoStream.onended = function () {
                    clickAndTalk.videoModule.stopVideo();
                };
            };
            pc.onremovestream = function (event) {
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
            
            if (!isStarted && typeof localVideoStream != 'undefined' && clickAndTalk.videoModule.getChannelReady()) {
                remoteVideoSelector = clickAndTalk.videoModule.getRemoteVideoSelector();
                createPeerConnection(isInitiator);
                
                pc.addStream(localVideoStream);
                
                isStarted = true;
                
                if (isInitiator) {
                    pc.createOffer(function (sessionDescription) {
                        pc.setLocalDescription(sessionDescription);
                        clickAndTalk.sessionModule.sendVideoRelatedMessage(sessionDescription);
                    }, function (event) {}, sdpConstraints);
                }
            }
        },
        stopWebRTCConnection : function (){
            isStarted = false;
            pc = null;
        },
        onVideoRelatedMessage : function (message) {
            if (message === 'user media allowed') {
                clickAndTalk.webRTCPeerConnectionModule.init();
            }
            else if (message.type === 'offer') {
                if (!clickAndTalk.videoModule.isInitiator() && !isStarted) {
                    clickAndTalk.webRTCPeerConnectionModule.init();
                }
            
                pc.setRemoteDescription(new RTCSessionDescription(message));
                pc.createAnswer(function (sessionDescription) {
                    pc.setLocalDescription(sessionDescription);
                    clickAndTalk.sessionModule.sendVideoRelatedMessage(sessionDescription);
                }, function (event) {}, sdpConstraints);
            } 
            else if (message.type === 'answer' && isStarted) {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } 
            else if (message.type === 'candidate' && isStarted) {
                var candidate = new ICECandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                pc.addIceCandidate(candidate);
            }
        }
    };
})();