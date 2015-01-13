var clickAndTalk = clickAndTalk || {};
clickAndTalk.videoModule = (function ($) {
    "use strict";

    //private fields
    var _localStream;
    var _btnStartVideoSelector;
    var _btnStopVideoSelector;
    var _txtNumberOfUsersSelector;
    var _myVideoSelector;
    var _remoteVideoSelector;
    var _noVideoImageSelector;
    var _lblMyVideoSelector;
    var _lblRemoteVideoSelector;
    // flags used for determining webrtc initiator and if there is channel created yet
    var _isChannelReady = false;
    var _isInitiator = false;
    //browser hacks
    var WindowURL = window.URL || webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
        if (!navigator.getUserMedia) {
            return false;
        }
        else {
            var settings = {
                video: true, 
                audio: true, 
                toString: function () { return 'video, audio'; }
            };

            navigator.getUserMedia(settings, onStream, onError);
        }
        
        function onStream(stream) {
            var myVideo = $(_myVideoSelector);
            _localStream = stream;
            myVideo.attr('src', WindowURL.createObjectURL(stream));
            $(myVideo)[0].load();
            
            stream.onended = function () {
                clickAndTalk.videoModule.stopVideo();
            };
            clickAndTalk.sessionModule.sendVideoRelatedMessage('user media allowed');
            
            $(_noVideoImageSelector).hide();
            $(_lblMyVideoSelector).show();
            $(_lblRemoteVideoSelector).show();
            $(_myVideoSelector).show();
            disableButton(_btnStartVideoSelector, false);
            disableButton(_btnStopVideoSelector, true);

            if (_isInitiator) {
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
            _btnStartVideoSelector = btnStartVideoSel;
            _btnStopVideoSelector = btnStopVideoSel;
            _myVideoSelector = myVideoSel;
            _remoteVideoSelector = remoteVideoSel;
            _txtNumberOfUsersSelector = txtNumberOfUsersSel;
            _noVideoImageSelector = noVideoImageSel;
            _lblMyVideoSelector = lblMyVideoSel;
            _lblRemoteVideoSelector = lblRemoteVideoSel;

            disableButton(_btnStartVideoSelector, false);
            disableButton(_btnStopVideoSelector, false);
            $(_myVideoSelector).hide();
            $(_lblMyVideoSelector).hide();
            $(_remoteVideoSelector).hide();
            $(_lblRemoteVideoSelector).hide();
            $(_btnStartVideoSelector).click(function () {
                startVideo();
            });
            $(_btnStopVideoSelector).click(function () {
                clickAndTalk.videoModule.stopVideo();
            });
            startVideo();
        },
        stopVideo : function () {
            $(_myVideoSelector).attr('src', '');
            $(_myVideoSelector).hide();
            $(_remoteVideoSelector).attr('src', '');
            $(_remoteVideoSelector).hide();
            $(_noVideoImageSelector).show();
            $(_lblMyVideoSelector).hide();
            $(_lblRemoteVideoSelector).hide();
            disableButton(_btnStartVideoSelector, true);
            disableButton(_btnStopVideoSelector, false);
            clickAndTalk.webRTCPeerConnectionModule.stopWebRTCConnection();
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
        getRemoteVideoSelector : function () {
            return _remoteVideoSelector;
        },
        setIsInitiator : function (flag) {
            _isInitiator = flag;
        },
        isInitiator : function (){
            return _isInitiator;
        }
    };
})(jQuery);