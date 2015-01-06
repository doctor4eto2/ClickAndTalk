var clickAndTalk = clickAndTalk || {};
clickAndTalk.webRTCPeerConnectionModule = (function () {
    var pc, isStarted = false;// flag used to determine if the peer connection was initialized
    var remoteVideoSelector;
    var remoteVideoStream;
    // Set up audio and video regardless of what devices are present.
    var sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };

    return {
        init : function (remoteVideoSel, localVideoStream, isInitiator, isChannelReady) {
            if (!isStarted && typeof localVideoStream != 'undefined' && isChannelReady) {
                remoteVideoSelector = remoteVideoSel;
                clickAndTalk.webRTCPeerConnectionModule.createPeerConnection(isInitiator);
                pc.addStream(localVideoStream);
                
                isStarted = true;

                if (isInitiator) {
                    console.log('Sending offer to peer');
                    pc.createOffer(clickAndTalk.webRTCPeerConnectionModule.createOfferHandler, clickAndTalk.webRTCPeerConnectionModule.handleCreateOfferError);
                }
            }
        },
        isStarted : function (){
            return isStarted;    
        },
        getRemoteVideoStream : function (){
            return remoteVideoStream;
        },
        createPeerConnection : function () {
            try {
                var servers = null;
                pc = new webkitRTCPeerConnection(servers, {
                    optional: [{
                        RtpDataChannels: true
                    }]
                });
                pc.onicecandidate = clickAndTalk.webRTCPeerConnectionModule.handleIceCandidate;
                pc.onaddstream = clickAndTalk.webRTCPeerConnectionModule.handleRemoteStreamAdded;
                pc.onremovestream = clickAndTalk.webRTCPeerConnectionModule.handleRemoteStreamRemoved;

            } catch (e) {
                console.log('Failed to create PeerConnection, exception: ' + e.message);
                return;
            }
        },
        handleIceCandidate : function (event) {
            if (event.candidate) {
                clickAndTalk.sessionModule.sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            } else {
                console.log('End of candidates.');
            }
        },
        handleRemoteStreamAdded : function (event) {
            console.log('Remote stream added.');
            $(remoteVideoSelector).attr('src', webkitURL.createObjectURL(event.stream));
            remoteVideoStream = event.stream;
        },
        handleCreateOfferError : function (event) {
            console.log('createOffer() error: ', e);
        },
        handleRemoteStreamRemoved : function (event) {
            console.log('Remote stream removed. Event: ', event);
        },
        createOfferHandler : function (sessionDescription) {
            // Set Opus as the preferred codec in SDP if Opus is present.
            
            sessionDescription.sdp = clickAndTalk.audioCodecModule.preferOpus(sessionDescription.sdp);
            pc.setLocalDescription(sessionDescription);
            clickAndTalk.sessionModule.sendMessage(sessionDescription);
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
                if (!isInitiator && !clickAndTalk.webRTCPeerConnectionModule.isStarted()) {
                    clickAndTalk.webRTCPeerConnectionModule.init(clickAndTalk.videoModule.getRemoteVideoSelector(), 
                                                                 clickAndTalk.videoModule.getLocalStream(),
                                                                 isInitiator,
                                                                 clickAndTalk.videoModule.getChannelReady());
                }
                
                pc.setRemoteDescription(new RTCSessionDescription(message));
                console.log('Sending answer to peer');
                pc.createAnswer(clickAndTalk.webRTCPeerConnectionModule.createOfferHandler, null, sdpConstraints);
            } 
            else if (message.type === 'answer' && clickAndTalk.webRTCPeerConnectionModule.isStarted()) {
                pc.setRemoteDescription(new RTCSessionDescription(message));
            } 
            else if (message.type === 'candidate' && clickAndTalk.webRTCPeerConnectionModule.isStarted()) {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                pc.addIceCandidate(candidate);
            }
        }
    };
})();