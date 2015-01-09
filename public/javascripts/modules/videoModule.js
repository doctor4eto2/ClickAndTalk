var clickAndTalk = clickAndTalk || {};
clickAndTalk.videoModule = (function () {
    
    //private fields
    var localStream;
    var btnStartVideoSelector, btnStopVideoSelector, txtNumberOfUsersSelector, myVideoSelector, remoteVideoSelector, noVideoImageSelector, lblMyVideoSelector, lblRemoteVideoSelector;
    var isChannelReady = false, isInitiator = false;// flags used for determining if webrtc connection is initialized yet and if there is channel created yet
    
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
            localStream = stream;
            console.log('Adding local stream.');
            var myVideo = $(myVideoSelector);

            if (typeof (webkitURL) != 'undefined') {
                myVideo.attr('src', webkitURL.createObjectURL(stream));
            }
            else if (typeof (window.URL) != 'undefined') {
                myVideo.attr('src', window.URL.createObjectURL(stream));
            }
            $(myVideo)[0].load();
            clickAndTalk.sessionModule.sendVideoRelatedMessage('user media allowed');
            
            $(noVideoImageSelector).hide();
            $(lblMyVideoSelector).show();
            $(lblRemoteVideoSelector).show();
            $(myVideoSelector).show();
            disableButton(btnStartVideoSelector, false);
            disableButton(btnStopVideoSelector, true);

            if (isInitiator) {
                clickAndTalk.webRTCPeerConnectionModule.init(clickAndTalk.videoModule.getRemoteVideoSelector(), 
                                                             clickAndTalk.videoModule.getLocalStream(),
                                                             clickAndTalk.videoModule.isInitiator(),
                                                             clickAndTalk.videoModule.getChannelReady());
            }
            
            myVideo.on('error', function () {
                stream.stop();
            });
        };
        function onError(error) {
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
            });
            startVideo();
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