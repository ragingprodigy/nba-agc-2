'use strict';

angular.module('nbaAgc2App')
.controller('MySessionsCtrl', function ($scope, $state, Sessions, $rootScope, $timeout) {

        $timeout(function(){
            Sessions.query({me:$rootScope.$user._id}, function(mySessions){

                $scope.sessions = mySessions;
            });
        }, 500);
});
