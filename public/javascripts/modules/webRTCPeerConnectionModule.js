var clickAndTalk = clickAndTalk || {};
clickAndTalk.webRTCPeerConnectionModule = (function () {

    //private fields
    var pc, isStarted = false;// flag used to determine if the peer connection was initialized
    var isChromeOrOpera = false;
    var isFirefox = false;
    var remoteVideoSelector;
    var remoteVideoStream;
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
    var options = { optional: [
                                { RtpDataChannels: true, },
                                { DtlsSrtpKeyAgreement: true }
                              ]
    };

    //private methods
    var createPeerConnection = function () {
        try {
            if (window.webkitRTCPeerConnection) {
                isChromeOrOpera = true;
                pc = new webkitRTCPeerConnection(configuration, options);
            }
            else if (window.mozRTCPeerConnection) {
                isFirefox = true;
                pc = new mozRTCPeerConnection(configuration, options);
            }

            pc.onicecandidate = function (event) {
                if (event.candidate) {
                    clickAndTalk.sessionModule.sendVideoRelatedMessage({
                        type: 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
                } else {
                    console.log('End of candidates.');
                }
            };
            pc.onaddstream = function (event) {
                console.log('Remote stream added.');
                if (typeof (webkitURL) != 'undefined') {
                    $(remoteVideoSelector).attr('src', webkitURL.createObjectURL(event.stream));
                }
                else if (typeof (window.URL) != 'undefined') {
                    $(remoteVideoSelector).attr('src', window.URL.createObjectURL(event.stream));
                }
                remoteVideoStream = event.stream;
            };
            pc.onremovestream = function (event) {
                console.log('Remote stream removed. Event: ', event);
            };
            console.log('create webrtc connection');

        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            return;
        }
    };
    var handleOfferAndAnswer = function (sessionDescription) {
        // Set Opus as the preferred codec in SDP if Opus is present. commented for now
        //sessionDescription.sdp = clickAndTalk.audioCodecModule.preferOpus(sessionDescription.sdp);
        pc.setLocalDescription(sessionDescription);
        clickAndTalk.sessionModule.sendVideoRelatedMessage(sessionDescription);
    };
    var setRemoteDescription = function (message) {
        if (isFirefox) {
        pc.setRemoteDescription(new mozRTCSessionDescription(message));
        }
        else if (isChromeOrOpera) {
        pc.setRemoteDescription(new RTCSessionDescription(message));
        }
        console.log('setRemoteDescription');
    };
    var createAnswer = function (message) {
        
        setRemoteDescription(message);
        
        if (isChromeOrOpera) {
            pc.createAnswer(handleOfferAndAnswer, function (event) {
                console.log('handle answer error');
            }, sdpConstraints);
        }
        else if (isFirefox) {
            pc.createAnswer(handleOfferAndAnswer, function (event) {
                console.log('handle answer error');
            }, sdpConstraints);
        }
        console.log('createAnswer');
    };
    var addIceCandidate = function (message) {
        var candidate;
        if (isChromeOrOpera) {
            candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
        }
        else if (isFirefox) {
            candidate = new mozRTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
        }
        pc.addIceCandidate(candidate);
        console.log('addIceCandidate');
    };

    return {
        //public methods
        init : function (remoteVideoSel, localVideoStream, isInitiator, isChannelReady) {
            if (!isStarted && typeof localVideoStream != 'undefined' && isChannelReady) {
                remoteVideoSelector = remoteVideoSel;
                createPeerConnection(isInitiator);

                pc.addStream(localVideoStream);
                console.log('add stream');
                
                isStarted = true;
                
                if (isInitiator) {
                    if (isChromeOrOpera) {
                        pc.createOffer(handleOfferAndAnswer, function (event) {
                            console.log('createOffer() error: ', e);
                        });
                    }
                    else if(isFirefox){
                        pc.createOffer(handleOfferAndAnswer, function (event) {
                            console.log('createOffer() error: ', e);
                        }, sdpConstraints);
                    }
                    console.log('create offer');
                }
            }
        },
        stopWebRTCConnection : function (){
            isStarted = false;
            pc = null;
        },
        onVideoRelatedMessage : function (message) {
            var isInitiator = clickAndTalk.videoModule.isInitiator();
        
            if (message === 'user media allowed') {
                clickAndTalk.webRTCPeerConnectionModule.init(clickAndTalk.videoModule.getRemoteVideoSelector(), 
                                                             clickAndTalk.videoModule.getLocalStream(),
                                                             isInitiator,
                                                             clickAndTalk.videoModule.getChannelReady());
            }
            else if (message.type === 'offer') {
                if (!isInitiator && !isStarted) {
                    clickAndTalk.webRTCPeerConnectionModule.init(clickAndTalk.videoModule.getRemoteVideoSelector(), 
                                                                 clickAndTalk.videoModule.getLocalStream(),
                                                                 isInitiator,
                                                                 clickAndTalk.videoModule.getChannelReady());
                }
            
                createAnswer(message);
            } 
            else if (message.type === 'answer' && isStarted) {
                setRemoteDescription(message);
            } 
            else if (message.type === 'candidate' && isStarted) {
                addIceCandidate(message);
            }
        }
    };
})();