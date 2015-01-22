(function () {
    var clickAndTalkModule = angular.module('clickAndTalk', []);
    clickAndTalkModule.controller('homeController', ['$scope', function ($scope) {
        $scope.createSession = function (redirectUrl, alertMessage) {
            if ($scope.userName) {
                window.location = redirectUrl + 'userName=' + $scope.userName;
            }
            else {
                alert(alertMessage);
            }
        };
        $scope.joinSession = function (redirectUrl, sessionIdAlertMessage, userNameAlertMessage) {
            if ($scope.sessionId && $scope.userName) {
                window.location = redirectUrl + $scope.sessionId + '&&userName=' + $scope.userName;
            }
            else {
                if ($scope.userName) {
                    alert(sessionIdAlertMessage);
                }
                else {
                    alert(userNameAlertMessage);
                }
            }
        };
        $scope.onEnterUserName = function (redirectUrl, message, $event) {
            if ($event.keyCode == 13) {
                $scope.createSession(redirectUrl, message);
            }
        };
    
    }]);
})();