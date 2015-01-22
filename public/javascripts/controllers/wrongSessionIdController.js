(function () {
    var clickAndTalkModule = angular.module('clickAndTalk', []);
    clickAndTalkModule.controller('wrongSessionIdController', ['$scope', '$location', function ($scope, $location) {
        $scope.back = function (redirectUrl) {
            window.location  = redirectUrl;
        };
    }]);
})();