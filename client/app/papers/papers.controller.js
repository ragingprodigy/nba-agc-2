'use strict';

angular.module('nbaAgc2App')
  .controller('PapersCtrl', function ($scope, Sessions, $auth, $state) {

        if (!$auth.isAuthenticated()) { $state.go('conference_sessions'); }

        Sessions.papers({}, function(papers){
            $scope.papers = papers;
        });
  });
