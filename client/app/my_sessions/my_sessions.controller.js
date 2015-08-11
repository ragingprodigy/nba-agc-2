'use strict';

angular.module('nbaAgc2App')
.controller('MySessionsCtrl', function ($scope, $state, Sessions, $rootScope) {

    $rootScope.confirmedUser = true;

    Sessions.query({me:true}, function(mySessions){
        $scope.sessions = mySessions;
    });
});
