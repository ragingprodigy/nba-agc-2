'use strict';

angular.module('nbaAgc2App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
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

    .run(function($stormpath){
        $stormpath.uiRouter({
            loginState: 'login',
            defaultPostLoginState: 'main'
        });
    });
;