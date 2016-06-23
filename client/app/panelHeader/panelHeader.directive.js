'use strict';

angular.module('nbaAgc2App')
  .directive('panelHeader', function () {
    return {
  //templateUrl: 'app/panelHeader/panelHeader.html',
      restrict: 'EA',
      scope: {
        title: '@',
        'class': '@'
      }
    };
  })

    .directive('backBtn', function(){
        return {
            template: '<button class="btn btn-xs btn-danger pull-right" ng-click="back()"><i class="glyphicon glyphicon-backward"></i> Back </button>',
            restrict: 'E',
            controller: function($scope, $window) {
                $scope.back = function() {
                    $window.history.back();
                };
            },
        }
    });