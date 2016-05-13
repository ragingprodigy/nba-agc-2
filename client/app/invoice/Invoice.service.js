'use strict';

angular.module('nbaAgc2App')
  .service('Invoice', function ($resource) {
    return $resource('/api/invoices/:id', null,
    {
        'update': { method:'PUT' }
    });
  });
