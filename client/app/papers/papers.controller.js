'use strict';

angular.module('nbaAgc2App')
  .controller('PapersCtrl', function ($scope, Sessions) {

        Sessions.papers({}, function(papers){
            $scope.papers = papers;
        });
  });
