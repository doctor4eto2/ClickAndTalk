(function () {
    var clickAndTalkModule = angular.module('clickAndTalk', []);
    // used for the selection on the tabs
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
            
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            
            if (hours < 10) {
                hours = '0' + hours;
            }
            
            var message = '>>> (' + hours + ':' + minutes + ') ' + data.userName + ' : ' + data.message;
            var rowMessage = data.userName + ' : ' + data.message;
            
            $scope.chatMessages.push({ message : message, color : data.color, messageId : data.messageId, show : true, rawMessage : rowMessage });
            $scope.$apply();
        };
        $scope.thumbUp = function (messageId) {
            for (var index = 0; index < $scope.chatMessages.length; index++) {
                if ($scope.chatMessages[index].messageId == messageId) {
                    $scope.chatMessages[index].show = false;
                    clickAndTalk.sessionModule.voteForMessage(messageId, $scope.chatMessages[index].rawMessage, $scope.chatMessages[index].color);
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

        clickAndTalk.sessionModule.init(clickAndTalk.joinController.userName, 
                                        clickAndTalk.joinController.sessionId, 
                                        $scope.onChat,
                                        $scope.onJoined,
                                        $scope.onSessionCreated,
                                        $scope.onTop5Changed);
    }]);
    
    // initialize video module
    clickAndTalk.videoModule.init('#btnStartVideo', 
                                  '#btnStopVideo', 
                                  '#myVideo', 
                                  '#txtNumberOfUsers', 
                                  '#remoteVideo', 
                                  '#noVideoImage', 
                                  '#lblMyVideo', 
                                  '#lblRemoteVideo');
})();