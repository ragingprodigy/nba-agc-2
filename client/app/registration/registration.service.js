'use strict';

angular.module('nbaAgc2App')
  .service('registration', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/registrations/:id', null,
            {
                'update': { method:'PUT' }
            });
  });
