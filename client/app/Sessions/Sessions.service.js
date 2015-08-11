'use strict';

angular.module('nbaAgc2App')
  .service('Sessions', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/sessions/:id');
  });
