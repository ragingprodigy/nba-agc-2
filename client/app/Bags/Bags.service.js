'use strict';

angular.module('nbaAgc2App')
  .service('Bags', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/bags', null, {
            choose: { method:'POST' }
        });
  });
