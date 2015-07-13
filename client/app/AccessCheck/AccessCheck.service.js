'use strict';

angular.module('nbaAgc2App')
  .factory('AccessCheck', function ($http) {
    // Service logic
    return {
      postSuccess: function (orderID, amount, callback) {

          $http.post('/api/registrations/postPay', { orderID: orderID, amount: amount }, {
            transformResponse:function(data) {
              /*jshint camelcase: false */
              /*global X2JS */
              var x2js = new X2JS();
              var json = x2js.xml_str2json( data );
              return json;
            }
          }).success(function(d){
            console.log(d);
            callback(d);
          });

      }
    };
  });
