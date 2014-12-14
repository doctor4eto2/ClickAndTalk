var clickAndTalk = clickAndTalk || {};
clickAndTalk.videoModule = (function () {

    var getUserMedia = navigator.getUserMedia || 
                       navigator.webkitGetUserMedia ||
                       navigator.MozGetUserMedia ||
                       navigator.oGetUserMedia ||
                       navigator.msGetUserMedia;

    return {
        showMyVideoCamera : function (myVideoSelector) { 
            if (!getUserMedia) {
                return false;
            }
            
            navigator.webkitGetUserMedia({
                video: true, 
                audio: true, 
                toString: function () { return 'video, audio'; }
            }, onStream, onError);
            
            function onStream(stream) {
                var myVideo = $(myVideoSelector);
                myVideo.attr('src', webkitURL.createObjectURL(stream));
                $(myVideo)[0].load();
                myVideo.on('error', function () {
                    stream.stop();
                });
            }
            
            function onError(error) {
                console.log(error);
            }  
        }
    };
})();