'use strict';

angular.module('nbaAgc2App')
  .controller('ConferenceSessionsCtrl', function ($scope, Sessions) {

        Sessions.query({}, function(data) {
            $scope.sessions = data;
        });
  });
