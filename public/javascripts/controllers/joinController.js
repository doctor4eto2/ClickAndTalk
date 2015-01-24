(function ($) {
    // used for managing the video elements
    var videoHelpers = {
        myVideoSelector : '#myVideo',
        remoteVideoSelector : '#remoteVideo',
        applyStreamToVideoElement : function (videoElementSelector, stream, onError) {
            var WindowURL = window.URL || webkitURL;
            var video = $(videoElementSelector);
            video.attr('src', WindowURL.createObjectURL(stream));
            video.on('error', onError);
        },
        clearVideoStreams : function () {
            $(videoHelpers.myVideoSelector).attr('src', '');
            $(videoHelpers.remoteVideoSelector).attr('src', '');
        }
    };
    var clickAndTalkModule = angular.module('clickAndTalk', []);    
    
    // used when tab selection is changed
    clickAndTalkModule.directive('showtab', function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });
    clickAndTalkModule.controller('joinController', ['$scope', function ($scope) {
        $scope.chatMessages = [];
        $scope.top5 = [];
        $scope.videoElementsVisibility = {
            showVideoRelatedElements : false,
            disableStartVideo : true,
            disableStopVideo : true,
            showRemoteVideo : false
        };
        $scope.startVideo = function () { clickAndTalk.videoModule.startVideo(); };
        $scope.stopVideo = function () { clickAndTalk.videoModule.stopVideo(); };
        $scope.enterMessage = function (alertMessage) {
            if ($scope.message) {
                clickAndTalk.sessionModule.sendChatMessage($scope.message, function () { $scope.message = null });
            }
            else {
                alert(alertMessage);
            }
        };
        $scope.onEnterMessage = function (alertMessage, $event) {
            if ($event.keyCode == 13) {
                $scope.enterMessage(alertMessage);
            }
        };
        $scope.onJoined = function (numberOfUsers) {
            $scope.numberOfUsers = numberOfUsers;
            $scope.$apply();
        };
        $scope.onSessionCreated = function () {
            $scope.joinUrl = window.location.origin + '/session/join' + '?sessionId=' + clickAndTalk.joinController.sessionId;
        };
        $scope.onChat = function (data) {
            var d = new Date(data.time);
            var hours = d.getHours();
            var minutes = d.getMinutes();
            
            minutes = (minutes < 10) ? '0' + minutes : minutes;
            hours = (hours < 10) ? '0' + hours : hours;
            
            var message = '>>> (' + hours + ':' + minutes + ') ' + data.userName + ' : ' + data.message;
            
            $scope.chatMessages.push({ message : message, color : data.color, messageId : data.messageId, show : true, rawMessage : data.message, creator : data.userName });
            $scope.$apply();
        };
        $scope.thumbUp = function (messageId) {
            for (var index = 0; index < $scope.chatMessages.length; index++) {
                if ($scope.chatMessages[index].messageId == messageId) {
                    $scope.chatMessages[index].show = false;
                    clickAndTalk.sessionModule.voteForMessage(messageId, $scope.chatMessages[index].rawMessage, $scope.chatMessages[index].color, $scope.chatMessages[index].creator);
                    break;
                }
            }
        };
        $scope.thumbDown = function (messageId) {
            for (var index = 0; index < $scope.chatMessages.length; index++) {
                if ($scope.chatMessages[index].messageId == messageId) {
                    $scope.chatMessages[index].show = true;
                    clickAndTalk.sessionModule.unvoteForMessage(messageId);
                    break;
                }
            }
        };
        $scope.onTop5Changed = function (top5Messages) {
            var top5 = [];
            if (top5Messages && top5Messages.legnth > 5) {
                top5 = top5Messages.slice(0, 5);
            }
            else {
                top5 = top5Messages;
            }

            $scope.top5 = top5;
            $scope.$apply();
        };
        $scope.onStartVideo = function (stream) {
            videoHelpers.applyStreamToVideoElement(videoHelpers.myVideoSelector, stream, function () {
                stream.stop();
                clickAndTalk.videoModule.stopVideo();
            });
            $scope.videoElementsVisibility = {
                showVideoRelatedElements : true,
                disableStartVideo : true,
                disableStopVideo : false,
                showRemoteVideo : false,
            };
            $scope.$apply();
        };
        $scope.onStopVideo = function () {
            videoHelpers.clearVideoStreams();

            $scope.videoElementsVisibility = {
                showVideoRelatedElements : false,
                disableStartVideo : false,
                disableStopVideo : true,
                showRemoteVideo : false,
            };
        };
        $scope.onRemoteVideoStart = function (stream) {
            videoHelpers.applyStreamToVideoElement(videoHelpers.remoteVideoSelector, stream, function () {
                stream.stop();
                clickAndTalk.videoModule.stopVideo();
            });

            $scope.videoElementsVisibility.showRemoteVideo = true;
            $scope.$apply();
        };
        
        // initialize session module
        clickAndTalk.sessionModule.init(clickAndTalk.joinController.userName, 
                                        clickAndTalk.joinController.sessionId, 
                                        $scope.onChat,
                                        $scope.onJoined,
                                        $scope.onSessionCreated,
                                        $scope.onTop5Changed);
        // initialize video module
        clickAndTalk.videoModule.init($scope.onStartVideo, 
                                      $scope.onStopVideo, 
                                      $scope.onRemoteVideoStart);
    }]);
})(jQuery);