(function () {
    var clickAndTalkModule = angular.module('clickAndTalk', []);
    clickAndTalkModule.controller('wrongSessionIdController', ['$scope', function ($scope) {
        $scope.back = function (redirectUrl) {
            window.location  = redirectUrl;
        };
    }]);
})();