'use strict';

angular.module('nbaAgc2App')
  .service('blocker', [
    '$localStorage', function($localStorage) {
      return {
        block: function(element, message) {
          var msg;
          msg = message || 'Processing';

          $localStorage.blockedElement = element || 'html';

          angular.element($localStorage.blockedElement).block({
            message: '<div class="alert alert-info">' + msg + '</div>',
            css: {
              height: '38px',
              border: ''
            }
          });
          return true;
        },
        clear: function() {
           angular.element($localStorage.blockedElement).unblock();
           return true;
        }
      };
    }
    ]);
