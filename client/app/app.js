'use strict';

angular.module('nbaAgc2App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngStorage',
  'ui.router',
  'ui.bootstrap',
    'stormpath',
    'stormpath.templates'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })

    .run(function($stormpath, $rootScope, $sessionStorage, registration, $state){
        $stormpath.uiRouter({
            loginState: 'login',
            defaultPostLoginState: 'main'
        });

        $rootScope.noneInProgress = function() {
            return $sessionStorage.lpRegistrant != undefined;
        };

        $rootScope.doReset = function(){
            if (confirm("Are you sure?")) {
                // Remove incomplete registrations from the db
                if ($sessionStorage.lpRegistrant != null && $sessionStorage.lpRegistrant!= undefined)
                    registration.delete({id: $sessionStorage.lpRegistrant._id });

                $sessionStorage.$reset();
                $state.go('main');
            }
        };
    });
;

Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
