var clickAndTalk = clickAndTalk || {};
clickAndTalk.videoModule = (function () {
    
    var localStream;
    var btnStartVideoSelector, btnStopVideoSelector, myVideoSelector;

    return {
        init : function (btnStartVideoSel, btnStopVideoSel, myVideoSel){
            btnStartVideoSelector = btnStartVideoSel;
            btnStopVideoSelector = btnStopVideoSel;
            myVideoSelector = myVideoSel;
            clickAndTalk.videoModule.disableButton(btnStartVideoSelector, false);
            clickAndTalk.videoModule.disableButton(btnStopVideoSelector, false);
            clickAndTalk.videoModule.initializeStartVideoButton();
            clickAndTalk.videoModule.initializeStopVideoButton();            
            clickAndTalk.videoModule.startVideo();
        },
        startVideo : function () {
            var getUserMedia = navigator.getUserMedia || 
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.oGetUserMedia ||
                               navigator.msGetUserMedia;

            if (!getUserMedia) {
                return false;
            }
            else{
                if (navigator.webkitGetUserMedia){
                        navigator.webkitGetUserMedia({
                            video: true, 
                            audio: true, 
                            toString: function () { return 'video, audio'; }
                        }, onStream, onError);
                }
                else if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                        video: true, 
                        audio: true, 
                        toString: function () { return 'video, audio'; }
                    }, onStream, onError);
                }
                else if (navigator.mozGetUserMedia) {
                    navigator.mozGetUserMedia({
                    video: true, 
                    audio: true, 
                    toString: function () { return 'video, audio'; }
                    }, onStream, onError);
                }
            }

            function onStream(stream) {
                localStream = stream;
                var myVideo = $(myVideoSelector);
                
                if (typeof(webkitURL) != 'undefined') {
                    myVideo.attr('src', webkitURL.createObjectURL(stream));
                }
                else if (typeof (window.URL) != 'undefined') {
                    myVideo.attr('src', window.URL.createObjectURL(stream));
                }
                $(myVideo)[0].load();
                
                clickAndTalk.videoModule.disableButton(btnStartVideoSelector, false);
                clickAndTalk.videoModule.disableButton(btnStopVideoSelector, true);
                
                myVideo.on('error', function () {
                    stream.stop();
                });
            };
            function onError(error) {
                console.log(error);
            };
        },
        stopVideo : function (){
            var myVideo = $(myVideoSelector).attr('src', '');;
            clickAndTalk.videoModule.disableButton(btnStartVideoSelector, true);
            clickAndTalk.videoModule.disableButton(btnStopVideoSelector, false);
        },
        initializeStartVideoButton : function () {
            $(btnStartVideoSelector).click(function () {
                clickAndTalk.videoModule.startVideo();
            });
        },
        initializeStopVideoButton : function () {
            $(btnStopVideoSelector).click(function () {
                clickAndTalk.videoModule.stopVideo();
            });
        },
        disableButton : function (btnSelector, enable){
            if (!enable) {
                $(btnSelector).attr('disabled', 'disabled');
            }
            else {
                $(btnSelector).removeAttr('disabled');
            }
        }
    };
})();