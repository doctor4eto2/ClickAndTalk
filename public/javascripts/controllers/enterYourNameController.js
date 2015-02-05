(function () {
    var clickAndTalkModule = angular.module('clickAndTalk', []);
    clickAndTalkModule.controller('enterYourNameController', ['$scope', function ($scope) {
        $scope.enterYourName = function (message) {
            if (!$scope.name) {
                alert(message);
            }
            else {
                window.location = clickAndTalk.enterYourNameController.previousRequestedUrl + '&&userName=' + $scope.name;
            }
        };
        $scope.onEnter = function (message, $event) {
            if ($event.keyCode == 13) {
                $scope.enterYourName(message);
            }
        };
    }]);
})();