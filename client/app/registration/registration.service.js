'use strict';

angular.module('nbaAgc2App')
  .service('Registration', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/registrations/:id', null,
            {
                'update': { method:'PUT' },
                'clone': { method:'POST' },
                'attendees': { method:'GET', url: '/api/registrations/attendees', isArray:true }
            });
  });
