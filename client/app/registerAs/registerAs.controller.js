'use strict';

angular.module('nbaAgc2App')
  .controller('RegisterAsCtrl', function ($scope, $anchorScroll) {
  	/*jQuery('html, body').animate({
        scrollTop: $('#site-body').offset().top
    }, 1000);*/
  	$anchorScroll();
    $scope.message = 'Hello';
  });
