'use strict';

angular.module('nbaAgc2App')
  .service('User', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/auth/');
  });
