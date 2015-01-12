var clickAndTalk = clickAndTalk || {};
clickAndTalk.videoModule = (function () {
    
    //private fields
    var localStream;
    var btnStartVideoSelector, btnStopVideoSelector, txtNumberOfUsersSelector, myVideoSelector, remoteVideoSelector, noVideoImageSelector, lblMyVideoSelector, lblRemoteVideoSelector;
    var isChannelReady = false, isInitiator = false;// flags used for determining if webrtc connection is initialized yet and if there is channel created yet
    var WindowURL = window.URL || webkitURL;

    //private methods
    var disableButton = function (btnSelector, enable) {
        if (!enable) {
            $(btnSelector).attr('disabled', 'disabled');
        }
        else {
            $(btnSelector).removeAttr('disabled');
        }
    }
    var startVideo = function () {
        var getUserMedia = navigator.getUserMedia || 
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.oGetUserMedia ||
                           navigator.msGetUserMedia;
        
        if (!getUserMedia) {
            return false;
        }
        else {
            var settings = {
                video: true, 
                audio: true, 
                toString: function () { return 'video, audio'; }
            };

            if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia(settings, onStream, onError);
            }
            else if (navigator.getUserMedia) {
                navigator.getUserMedia(settings, onStream, onError);
            }
            else if (navigator.mozGetUserMedia) {
                navigator.mozGetUserMedia(settings, onStream, onError);
            }
        }
        
        function onStream(stream) {
            var myVideo = $(myVideoSelector);
            localStream = stream;
            myVideo.attr('src', WindowURL.createObjectURL(stream));
            $(myVideo)[0].load();
            
            stream.onended = function () {
                clickAndTalk.videoModule.stopVideo();
            };
            clickAndTalk.sessionModule.sendVideoRelatedMessage('user media allowed');
            
            $(noVideoImageSelector).hide();
            $(lblMyVideoSelector).show();
            $(lblRemoteVideoSelector).show();
            $(myVideoSelector).show();
            disableButton(btnStartVideoSelector, false);
            disableButton(btnStopVideoSelector, true);

            if (isInitiator) {
                clickAndTalk.webRTCPeerConnectionModule.init();
            }
            
            myVideo.on('error', function () {
                stream.stop();
                clickAndTalk.videoModule.stopVideo();
            });
        };
        function onError(error) {
            clickAndTalk.videoModule.stopVideo();
            console.log(error);
        };
    }
    return {
        //public methods
        init : function (btnStartVideoSel, btnStopVideoSel, myVideoSel, txtNumberOfUsersSel, remoteVideoSel, noVideoImageSel, lblMyVideoSel, lblRemoteVideoSel) {
            btnStartVideoSelector = btnStartVideoSel;
            btnStopVideoSelector = btnStopVideoSel;
            myVideoSelector = myVideoSel;
            remoteVideoSelector = remoteVideoSel;
            txtNumberOfUsersSelector = txtNumberOfUsersSel;
            noVideoImageSelector = noVideoImageSel;
            lblMyVideoSelector = lblMyVideoSel;
            lblRemoteVideoSelector = lblRemoteVideoSel;

            disableButton(btnStartVideoSelector, false);
            disableButton(btnStopVideoSelector, false);
            $(myVideoSelector).hide();
            $(lblMyVideoSelector).hide();
            $(remoteVideoSelector).hide();
            $(lblRemoteVideoSelector).hide();
            $(btnStartVideoSelector).click(function () {
                startVideo();
            });
            $(btnStopVideoSelector).click(function () {
                clickAndTalk.videoModule.stopVideo();
            });
            startVideo();
        },
        stopVideo : function () {
            $(myVideoSelector).attr('src', '');
            $(myVideoSelector).hide();
            $(remoteVideoSelector).attr('src', '');
            $(remoteVideoSelector).hide();
            $(noVideoImageSelector).show();
            $(lblMyVideoSelector).hide();
            $(lblRemoteVideoSelector).hide();
            disableButton(btnStartVideoSelector, true);
            disableButton(btnStopVideoSelector, false);
            clickAndTalk.webRTCPeerConnectionModule.stopWebRTCConnection();
        },
        setChannelCreated : function (){
            isChannelReady = true;
        },
        getChannelReady : function (){
            return isChannelReady;
        },
        getLocalStream : function () {
            return localStream;
        },
        getRemoteVideoSelector : function () {
            return remoteVideoSelector;
        },
        setIsInitiator : function (flag) {
            isInitiator = flag;
        },
        isInitiator : function (){
            return isInitiator;
        }
    };
})();