'use strict';

angular.module('nbaAgc2App')
.controller('MySessionsCtrl', function ($scope, $state, Sessions, $rootScope) {

    Sessions.query({me:$rootScope.$user._id}, function(mySessions){
        $scope.sessions = mySessions; //_.sort(mySessions, 'session.start_time');
    });
});
