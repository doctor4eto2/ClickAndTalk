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

    //private methods
    var handleIceCandidate = function (event) {
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
    var handleRemoteStreamAdded = function (event) {
        console.log('Remote stream added.');
        if (typeof (webkitURL) != 'undefined') {
            $(remoteVideoSelector).attr('src', webkitURL.createObjectURL(event.stream));
        }
        else if (typeof (window.URL) != 'undefined') {
            $(remoteVideoSelector).attr('src', window.URL.createObjectURL(event.stream));
        }
        remoteVideoStream = event.stream;
    };
    var handleCreateOfferError = function (event) {
        console.log('createOffer() error: ', e);
    };
    var handleRemoteStreamRemoved = function (event) {
        console.log('Remote stream removed. Event: ', event);
    };
    var handleCreateOffer = function (sessionDescription) {
        // Set Opus as the preferred codec in SDP if Opus is present.
        sessionDescription.sdp = clickAndTalk.audioCodecModule.preferOpus(sessionDescription.sdp);
        pc.setLocalDescription(sessionDescription);
        clickAndTalk.sessionModule.sendVideoRelatedMessage(sessionDescription);
    };
    var handlerAnswerError = function (event) {
        console.log('handle answer error'); 
    }
    var createPeerConnection = function () {
        try {
            var servers = null;
            
            if (window.webkitRTCPeerConnection) {
                isChromeOrOpera = true;
                pc = new webkitRTCPeerConnection(servers, {
                    optional: [{
                        RtpDataChannels: true
                    }]
                });
            }
            else if (window.mozRTCPeerConnection) {
                isFirefox = true;
                pc = new mozRTCPeerConnection(servers, {
                    optional: [{
                        RtpDataChannels: true
                    }]
                });
            }

            pc.onicecandidate = handleIceCandidate;
            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;
            console.log('create webrtc connection');

        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            return;
        }
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
                        pc.createOffer(handleCreateOffer, handleCreateOfferError);
                    }
                    else if(isFirefox){
                        pc.createOffer(handleCreateOffer, handleCreateOfferError, sdpConstraints);
                    }
                    console.log('create offer');
                }
            }
        },
        isStarted : function () { 
            return isStarted;
        },
        addIceCandidate : function (message) { 
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
        },
        createAnswer : function () {
            if (isChromeOrOpera) {
                pc.createAnswer(handleCreateOffer, handlerAnswerError, sdpConstraints);
            }
            else if (isFirefox) {
                pc.createAnswer(handleCreateOffer, handlerAnswerError,sdpConstraints);
            }
            console.log('createAnswer');
        },
        setRemoteDescription : function (message) {
            if (isFirefox) {
                pc.setRemoteDescription(new mozRTCSessionDescription(message));
            }
            else if (isChromeOrOpera) {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            }
            console.log('setRemoteDescription');
        }
    };
})();