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
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  }])

    .run(["$stormpath", "$rootScope", "$sessionStorage", "Registration", "$state", function($stormpath, $rootScope, $sessionStorage, Registration, $state){
        $stormpath.uiRouter({
            loginState: 'login',
            defaultPostLoginState: 'main'
        });

        $rootScope.noneInProgress = function() {
            return $sessionStorage.lpRegistrant !== undefined;
        };

        $rootScope.doReset = function(){
            var cnf = window.confirm('Are you sure?');
            if (cnf) {
                // Remove incomplete registrations from the db
                if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant!== undefined){
                    Registration.delete({id: $sessionStorage.lpRegistrant._id });
                }

                $sessionStorage.$reset();
                $state.go('main');
            }
        };
    }]);

Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        s = n < 0 ? '-' : '';

    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? '.' : d;
    t = t === undefined ? ',' : t;

    var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

'use strict';

angular.module('nbaAgc2App')
  .controller('BenchFormCtrl', ["$scope", "$state", "Registration", "$sessionStorage", function ($scope, $state, Registration, $sessionStorage) {

        console.log($sessionStorage.lpRegistrant);

        // If any other type of Registration is on-going, cancel it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){
            if ($sessionStorage.lpRegistrant.registrationType==='sanAndBench') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: 'sanAndBench',
                member: ''
            };
        }

        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;
                });
            }
        };

        $scope.reviewForm = function() {

            var cnf = window.confirm('Are you sure?');
            if (cnf) {

                $scope.data.formFilled = true;

                // Update the Registration Information
                Registration.update({id: $scope.data._id}, $scope.data);

                // User wants to Pay now!
                $state.go('invoice');
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('benchForm', {
        url: '/SAN_AGS_BENCH',
        templateUrl: 'app/benchForm/benchForm.html',
        controller: 'BenchFormCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('InvoiceCtrl', ["$scope", "$sessionStorage", "Registration", "$state", function ($scope, $sessionStorage, Registration, $state) {
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {
            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled){
                    $state.go($scope.data.registrationType);
                }

            });
        } else {
            $state.go('main');
        }

        $scope.back = function() {
            $state.go($scope.data.registrationType);
        };

        $scope.getName = function (data) {
            if (!data) {
                return '';
            }

            $scope.userName = data.prefix+' '+data.surname+' '+data.middleName+' '+data.firstName+' '+data.suffix;

            return $scope.userName;
        };

        $scope.payOnline = function(){
            $state.go('webpay');
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('invoice', {
        url: '/invoice',
        templateUrl: 'app/invoice/invoice.html',
        controller: 'InvoiceCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('JudgeCtrl', ["$scope", "$state", function ($scope, $state) {
    $scope.details = function() {
        $state.go('judgeForm');
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('judge', {
        url: '/registerAs/judge',
        templateUrl: 'app/judge/judge.html',
        controller: 'JudgeCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('JudgeFormCtrl', ["$scope", "$state", function ($scope, $state) {
        $scope.payInvoice = function() {
            // User wants to Pay now!
            $state.go('invoice');
        };

        $scope.bookInvoice = function() {
            // User wants to pay later
            $state.go('invoice');
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('judgeForm', {
        url: '/registerAs/judge/form',
        templateUrl: 'app/judgeForm/judgeForm.html',
        controller: 'JudgeFormCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('LawyerFormCtrl', ["$scope", "$state", "$http", "$sessionStorage", "Registration", function ($scope, $state, $http, $sessionStorage, Registration) {
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
            });
        } else{
            $state.go('legalPractitioner');
        }

        $scope.reviewForm = function() {

            var cnf = window.confirm('Are you sure?');
            if (cnf) {

                $scope.data.formFilled = true;

                // Update the Registration Information
                Registration.update({id: $scope.data._id}, $scope.data);

                // User wants to Pay now!
                $state.go('invoice');
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('lawyerForm', {
        url: '/registerAs/legalPractitioner/form',
        templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'LawyerFormCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('LegalPractitionerCtrl', ["$scope", "$state", "$http", "$sessionStorage", "Registration", function ($scope, $state, $http, $sessionStorage, Registration) {

        $scope.person = {};
        $scope.members = [];

        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

            // Retrieve the data from the Server
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(regData){
                $sessionStorage.lpRegistrant = regData;
                // Set Some data in the browser cookie and on the server
                $state.go('lawyerForm');
            });
        }

        // Ask for Name as it appears on Call to Bar Certificate!
        $scope.nextForm = function() {
            $scope.person.nbSurname = $scope.person.surname;
            $scope.showForm2 = true;
        };

        // Lookup the registration data for this user
        $scope.doLookup = function() {
            $http.post('/api/members/verify', $scope.person).success(function(members) {
                $scope.members = members;
                $scope.showTable = true;
            });
        };

    $scope.details = function(person) {
        $scope.person.member = person._id;
        $scope.person.branch = person.branch;
        $scope.person.nbaId = person._id;
        // Notify the server that a registration has been started for the current user!
        var reg = new Registration($scope.person);
        reg.$save().then(function(registrationData) {

            $sessionStorage.lpRegistrant = registrationData;

            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        });
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('legalPractitioner', {
        url: '/registration/legalPractitioner',
        templateUrl: 'app/legalPractitioner/legalPractitioner.html',
        controller: 'LegalPractitionerCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('LoginCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('MagistrateCtrl', ["$scope", "$state", function ($scope, $state) {
    $scope.details = function(){
        $state.go('magistrateForm');
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('magistrate', {
        url: '/registerAs/magistrate',
        templateUrl: 'app/magistrate/magistrate.html',
        controller: 'MagistrateCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('MagistrateFormCtrl', ["$scope", "$state", function ($scope, $state) {
        $scope.payInvoice = function() {
            // User wants to Pay now!
            $state.go('invoice');
        };

        $scope.bookInvoice = function() {
            // User wants to pay later
            $state.go('invoice');
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('magistrateForm', {
        url: '/registerAs/magistrate/form',
        templateUrl: 'app/magistrateForm/magistrateForm.html',
        controller: 'MagistrateFormCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('MainCtrl', ["$scope", "$sessionStorage", "$state", function ($scope, $sessionStorage, $state) {
    /*$scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };*/
        $scope.startReg = function() {
            if ($sessionStorage.lpRegistrant!==null && $sessionStorage.lpRegistrant!== undefined) {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            } else {
                $state.go('registerAs');
            }
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('OthersCtrl', ["$scope", "$state", function ($scope, $state) {
    $scope.details = function(){
        $state.go('othersForm');
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('others', {
        url: '/registerAs/others',
        templateUrl: 'app/others/others.html',
        controller: 'OthersCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('OthersFormCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('othersForm', {
        url: '/registerAs/others/form',
        templateUrl: 'app/othersForm/othersForm.html',
        controller: 'OthersFormCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('ProfileCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        sp: {
            authenticate: true
        }
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('RegisterCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'app/register/register.html',
        controller: 'RegisterCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('RegisterAsCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('registerAs', {
        url: '/registration',
        templateUrl: 'app/registerAs/registerAs.html',
        controller: 'RegisterAsCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .service('Registration', ["$resource", function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/registrations/:id', null,
            {
                'update': { method:'PUT' }
            });
  }]);

'use strict';

angular.module('nbaAgc2App')
  .controller('SanAndBenchCtrl', ["$scope", "$state", function ($scope, $state) {

        $state.go('benchForm');
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('sanAndBench', {
        url: '/registerAs/sanAndBench',
        templateUrl: 'app/sanAndBench/sanAndBench.html',
        controller: 'SanAndBenchCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('WebpayCtrl', ["$scope", "$sessionStorage", "Registration", "$state", function ($scope, $sessionStorage, Registration, $state) {
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {
            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled){
                    $state.go($scope.data.registrationType);
                }

            });
        } else {
            $state.go('main');
        }

        $scope.getFee = function(amt) {

            var fee = 0.015 * amt;
            return fee < 2000? fee.toFixed(2) : 2000.00;
        };

        $scope.markComplete = function(r) {
            r.completed = false;
            Registration.update({id: r._id}, r);
            return false;
        };

        $scope.back = function() {
            $state.go('invoice');
        };

        $scope.getName = function () {
            if (!$scope.data){
                return '';
            }
            return $scope.data.prefix+' '+$scope.data.surname+' '+$scope.data.middleName+' '+$scope.data.firstName+' '+$scope.data.suffix;
        };

        $scope.payNow = function() {
            $('#upay_form').submit();
            return;
        };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('webpay', {
        url: '/invoice/webpay',
        templateUrl: 'app/webpay/webpay.html',
        controller: 'WebpayCtrl'
      });
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('FooterCtrl', ["$scope", function ($scope) {
    $scope.theYear = new Date().getFullYear();
  }]);

'use strict';

angular.module('nbaAgc2App')
  .factory('Modal', ["$rootScope", "$modal", function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  }]);

'use strict';

angular.module('nbaAgc2App')
  .controller('NavbarCtrl', ["$scope", "$location", function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
'use strict';

angular.module('nbaAgc2App')
  .controller('RightInfoCtrl', ["$scope", function ($scope) {
    $scope.message = 'Hello';
  }]);

angular.module('nbaAgc2App').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/benchForm/benchForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ATTENDEE DATA - SANs, ATTORNEY GENERALS AND LIFE BENCHERS <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()>CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix <span class=required>*</span></label><select name=prefix id=prefix ng-model=data.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname valuse=\"A Surname\" required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName value=\"A Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName value=\"A First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select name=suffix id=suffix ng-model=data.suffix class=form-control><option>SAN</option><option>ESQ</option><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=row><div class=col-md-3><div class=form-group><label for=yearCalled>Year of Call to Bar <span class=required>*</span></label><select class=form-control name=yearCalled ng-model=data.yearCalled id=yearCalled required><option ng-repeat=\"y in years\">{{y}}</option></select></div></div><div class=col-md-4><div class=form-group><label for=branch>NBA Branch <span class=required>*</span></label><input class=form-control name=branch id=branch ng-model=data.branch required></div></div><div class=col-md-5><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN 100,000</div></div></div></div><div ng-hide=nextForm><button class=\"btn-block btn btn-primary\" ng-click=startReg() ng-disabled=dataForm.$invalid><i class=\"fa fa-play\"></i> Next</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=form-group><label for=company>Firm / Organization / Court <span class=required>*</span></label><input class=form-control name=company id=company ng-model=data.company placeholder=\"Firm / Organization / Court\" required></div><div class=form-group><label for=address>Address <span class=required>*</span></label><input class=form-control name=address id=address ng-model=data.address placeholder=Address required></div><div class=row><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number <span class=required>*</span></label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\" required></div></div><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone Number</label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required></div><div class=row><div class=col-md-6><div class=form-group><label for=emergency>Emergency Contact Name</label><input class=form-control name=e_name id=emergency ng-model=data.emergencyContact placeholder=\"Emergency Contact Name\"></div></div><div class=col-md-6><div class=form-group><label for=e_phone>Emergency Contact Number</label><input class=form-control type=tel name=e_phone id=e_phone ng-model=data.emergencyPhone placeholder=\"Emergency Contact Number\"></div></div></div><hr><div class=\"text-center form-action\"><button type=button ng-disabled=\"dataForm2.$invalid || dataForm.$invalid\" class=\"btn btn-lg btn-block btn-success\" ng-click=reviewForm()><i class=\"fa fa-play\"></i> Next <i class=\"fa fa-check\"></i></button></div></form></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/invoice/invoice.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE <button class=\"hidden-print btn btn-xs btn-info pull-right\" ng-click=\"pInfo=!pInfo\"><i class=\"fa fa-info-circle\"></i> How To Pay</button></div></div><div class=panel-body><form method=POST id=upay_form name=upay_form action=https://cipg.accessbankplc.com/MerchantServices/MakePayment.aspx target=_top><table class=\"table table-bordered table-striped\"><tr class=space><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td></tr><tr><th colspan=4 class=\"text-uppercase text-center\"><h4>{{getName(data)}}</h4></th></tr><tr><th colspan=2><i class=\"fa fa-bullhorn\"></i> {{ data.yearCalled }} - Year of CALL</th><td colspan=2><i class=\"fa fa-building\"></i> {{data.branch}} BRANCH</td></tr><tr><td><i class=\"fa fa-phone-square\"></i> {{data.phone}}</td><td><i class=\"fa fa-mobile-phone\"></i> {{data.mobile}}</td><td colspan=2><i class=\"fa fa-envelope-o\"></i> {{data.email}}</td></tr><tr><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.company}}</td><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.address}}</td></tr><tr><td colspan=2><i class=\"fa fa-user\"></i> {{data.emergencyContact}}</td><td colspan=2><i class=\"fa fa-phone\"></i> {{data.emergencyPhone}}</td></tr><tr><th colspan=2 class=text-right><h4>Order ID:</h4></th><th colspan=2><h4>{{data.regCode}}/{{data.conferenceFee}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Conference Fees:</h4></th><th colspan=2><h4>NGN {{ data.conferenceFee }}</h4></th></tr><tr class=hidden-print><td colspan=4 class=text-center><button type=button class=\"btn btn-danger pull-left\" ng-click=back()><i class=\"fa fa-arrow-left\"></i> GO BACK</button> <button ng-hide=data.completed ng-click=payOnline() class=\"btn btn-success\" type=button><i class=\"fa fa-play\"></i> PAY ONLINE</button> <button ng-hide=data.completed ng-click=manualPay() class=\"btn btn-primary\" type=button><i class=\"fa fa-anchor\"></i> PAY TO THE BANK</button> <button type=button class=\"btn pull-right\" onclick=window.print()><i class=\"fa fa-print\"></i> PRINT</button></td></tr></table><input type=hidden name=mercId value=09948> <input type=hidden name=currCode value=566> <input type=hidden name=amt value=\"{{ data.conferenceFee }}\"> <input type=hidden name=orderId value={{data.regCode}}/{{data.conferenceFee}}> <input type=hidden name=prod value=\"NBA AGC 2015 Registration for {{userName}}\"> <input type=hidden name=email value={{data.email}}> <input type=hidden name=submit value=Pay></form></div></div><div class=\"alert alert-info hidden-print\" ng-show=pInfo><h3>Payment Instructions</h3><p>Where does the template get inserted? When a state is activated, its templates are automatically inserted into the ui-view of its parent state's template. If it's a top-level state—which 'contacts' is because it has no parent state–then its parent template is index.html. Right now, the 'contacts' state won't ever be activated. So let's see how we can activate a state. Activating a state</p></div></div><div class=\"col-sm-4 hidden-print\" ng-include=\"'components/rightInfo/rightInfo.html'\"></div></div></div>"
  );


  $templateCache.put('app/judge/judge.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>HONOURABLE JUDGES</div></div><div class=panel-body><form method=post name=dataForm ng-hide=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Please Enter your name below</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><select name=prefix id=prefix ng-model=d.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-3><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select name=suffix id=suffix ng-model=d.suffix class=form-control><option>JSC</option><option>JCA</option><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=text-center><button type=button ng-disabled=dataForm.$invalid class=\"btn btn-block btn-primary\" ng-click=\"nextForm=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Enter the Name on your Call to Bar Certificate</div><div class=row><div class=col-md-4><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-4><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-4><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div></div><div class=text-center><button type=button class=\"btn btn-block btn-success\" ng-click=\"showTable=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><hr><table class=\"table table-bordered table-striped table-hover\" ng-show=showTable><tr><th>S/N</th><th>Surname</th><th>Middle Name</th><th>First Name</th><th>Called to Bar</th><th class=col-sm-1></th></tr><tr><td>1.</td><td>James</td><td>Dean</td><td>Patterson</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>2.</td><td>Ludlum</td><td>Bruce</td><td>William</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>3.</td><td>Spindall</td><td>John</td><td>Jones</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr></table></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/judgeForm/judgeForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ATTENDEE DATA - Please provide additional data</div></div><div class=panel-body><form method=post name=dataForm ng-hide=nextForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><select readonly name=prefix id=prefix ng-model=d.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input readonly class=form-control name=surname id=surname ng-model=d.surname valuse=\"A Surname\" required></div></div><div class=col-md-2><div class=form-group><label for=middlename>Middle Name</label><input readonly class=form-control name=middlename id=middlename ng-model=d.middlename value=\"A Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstname>First Name</label><input readonly class=form-control name=firstname id=firstname ng-model=d.firstname value=\"A First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select readonly name=suffix id=suffix ng-model=d.suffix class=form-control><option>JSC</option><option>JCA</option><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=row><div class=col-md-3><div class=form-group><label for=ctb>Year of Call to Bar</label><input readonly class=form-control name=ctb id=ctb ng-model=d.yearCalled placeholder=1989 required></div></div><div class=col-md-5><div class=form-group><div class=\"form-price label label-primary\">NGN 75,000</div></div></div></div><div class=row><div class=col-sm-4><div class=form-group><label for=court>Court <span class=required>*</span></label><input class=form-control name=court id=court ng-model=d.court placeholder=Court required></div></div><div class=col-sm-4><div class=form-group><label for=state>State <span class=required>*</span></label><input class=form-control name=company id=state ng-model=d.state placeholder=State required></div></div><div class=col-sm-4><div class=form-group><label for=division>Division <span class=required>*</span></label><input class=form-control name=division id=division ng-model=d.division placeholder=Division required></div></div></div><div class=row><div class=col-md-6><div class=form-group><label for=phone>Primary Telephone Number <span class=required>*</span></label><input class=form-control type=tel name=phone id=phone ng-model=d.phone placeholder=\"Office Phone Number\" required></div></div><div class=col-md-6><div class=form-group><label for=mobile>Secondary Phone Number</label><input class=form-control type=tel name=mobile id=mobile ng-model=d.mobile placeholder=\"Mobile Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span></label><input type=email class=form-control name=email id=email ng-model=d.email placeholder=\"Email Address\" required></div><div class=row><div class=col-md-6><div class=form-group><label for=emergency>Emergency Contact Name</label><input class=form-control name=e_name id=emergency ng-model=d.e_name placeholder=\"Emergency Contact Name\"></div></div><div class=col-md-6><div class=form-group><label for=e_phone>Emergency Contact Number</label><input class=form-control type=tel name=e_phone id=e_phone ng-model=d.e_phone placeholder=\"Emergency Contact Number\"></div></div></div><hr><div class=\"text-center form-action\"><button type=button ng-disabled=!dataForm.$invalid class=\"btn btn-lg btn-success pull-left\" ng-click=payInvoice()><i class=\"fa fa-money\"></i> Pay Now <i class=\"fa fa-check\"></i></button> <button type=button ng-disabled=!dataForm.$invalid class=\"btn btn-lg btn-info pull-right\" ng-click=bookInvoice()><i class=\"fa fa-save\"></i> Book on Hold</button></div></form></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/lawyerForm/lawyerForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ATTENDEE DATA - Please provide additional data <button class=\"btn btn-danger pull-right text-white btn-xs\" ng-click=doReset()><i class=\"fa fa-times-circle\"></i> CANCEL REGISTRATION</button></div></div><div class=panel-body><form method=post name=dataForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix <span class=required>*</span></label><input name=prefix id=prefix ng-model=data.prefix class=form-control required autofocus></div><div class=col-md-3><div class=form-group><label for=surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=surname ng-model=data.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=data.middleName placeholder=Middle></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name <span class=required>*</span></label><input class=form-control name=firstName id=firstName ng-model=data.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=data.suffix class=form-control></div></div><div class=row><div class=col-md-3><div class=form-group><label for=ctb>Year of Call to Bar</label><input readonly class=form-control name=ctb id=ctb ng-model=data.yearCalled placeholder=1989></div></div><div class=col-md-5><div class=form-group><label>Conference Fee</label><div class=\"form-price label label-primary\">NGN {{data.conferenceFee .formatMoney(2)}}</div></div></div><div class=col-md-4><div class=form-group><label for=branch>NBA Branch <span class=required>*</span></label><input class=form-control name=branch id=branch ng-model=data.branch required></div></div></div><div class=form-group><label for=company>Firm / Company / Organization <span class=required>*</span></label><input class=form-control name=company id=company ng-model=data.company placeholder=\"Firm / Company / Organization\" required></div><div class=form-group><label for=address>Address <span class=required>*</span></label><input class=form-control name=address id=address ng-model=data.address placeholder=Address required></div><div class=row><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone <span class=required>*</span> <small class=text-muted>eg: 08031231234</small></label><input class=form-control type=tel name=mobile id=mobile ng-model=data.mobile placeholder=\"Mobile Phone Number\" ng-minlength=11 ng-maxlength=11 required> <span class=help-block ng-show=\"dataForm.mobile.$error.required || dataForm.mobile.$error.number\">Valid phone number is required</span> <span class=help-block ng-show=\"((dataForm.mobile.$error.minlength || dataForm.mobile.$error.maxlength) && dataForm.mobile.$dirty) \">Mobile Phone Number should be 11 digits</span></div></div><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number</label><input class=form-control type=tel name=phone id=phone ng-model=data.phone placeholder=\"Office Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span></label><input type=email class=form-control name=email id=email ng-model=data.email placeholder=\"Email Address\" required></div><div class=row><div class=col-md-6><div class=form-group><label for=emergency>Emergency Contact Name</label><input class=form-control name=e_name id=emergency ng-model=data.emergencyContact placeholder=\"Emergency Contact Name\"></div></div><div class=col-md-6><div class=form-group><label for=e_phone>Emergency Contact Number</label><input class=form-control type=tel name=e_phone id=e_phone ng-model=data.emergencyPhone placeholder=\"Emergency Contact Number\"></div></div></div><hr><div class=row><div class=col-sm-6><button class=\"btn btn-danger btn-block\" ng-click=doReset()><i class=\"fa fa-times\"></i> CANCEL REGISTRATION</button></div><div class=col-sm-6><button type=button ng-disabled=dataForm.$invalid class=\"btn btn-block btn-success\" ng-click=reviewForm()><i class=\"fa fa-play\"></i> NEXT <i class=\"fa fa-check\"></i></button></div></div></form></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/legalPractitioner/legalPractitioner.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>LEGAL PRACTITIONER <a ui-sref=registerAs class=\"btn btn-danger btn-xs pull-right text-white\"><i class=\"fa fa-backward\"></i> Go Back</a></div></div><div class=panel-body><form method=post name=dataForm ng-hide=showForm2 ng-submit=\"dataForm.$valid && nextForm()\"><div class=\"alert alert-success\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Please Enter your name below</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><input name=prefix id=prefix ng-model=person.prefix class=form-control required autofocus></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=person.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middleName>Middle Name</label><input class=form-control name=middleName id=middleName ng-model=person.middleName placeholder=Middle></div></div><div class=col-md-3><div class=form-group><label for=firstName>First Name</label><input class=form-control name=firstName id=firstName ng-model=person.firstName placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><input name=suffix id=suffix ng-model=person.suffix class=form-control></div></div><div class=text-center><button type=submit ng-disabled=dataForm.$invalid class=\"btn btn-block btn-primary\" ng-submit=\"dataForm.$valid && nextForm()\"><i class=\"fa fa-play\"></i> Next</button></div></form><form method=post name=dataForm2 ng-show=showForm2 ng-submit=\"dataForm2.$valid && doLookup()\"><div class=\"alert alert-danger\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Enter your Last Name as it appears on your Call to Bar Certificate</div><div class=row><div ng-class=\"{'col-md-6': showTable, 'col-md-12': !showTable}\"><div class=form-group><label for=_surname>Surname <span class=required>*</span></label><input class=form-control name=surname id=_surname ng-model=person.nb_surname placeholder=Surname required></div><div class=text-center><button type=submit ng-disabled=dataForm2.$invalid class=\"btn btn-block btn-success\" ng-submit=\"dataForm2.$valid && doLookup()\"><i class=\"fa fa-play\"></i> FETCH NAMES</button></div></div><div class=col-md-6 ng-show=showTable><div class=form-group><label for=_surname>Filter</label><input class=form-control name=surname id=_filter ng-model=nameFilter placeholder=\"Filter the Results\"></div></div></div></form><hr><table class=\"table table-bordered table-striped table-hover\" ng-show=showTable><tr><td colspan=6><div class=\"alert alert-success\">Select your name from the list below. In the event that the list is long, you can filter it by your <b>year of call</b> or <b>other names</b> using the textbox above.</div></td></tr><tr><th>S/N</th><th>Surname</th><th>Middle Name</th><th>First Name</th><th>Called to Bar</th><th class=col-sm-1></th></tr><tr ng-repeat=\"member in members | filter: nameFilter\"><td>{{$index+1}}.</td><td>{{member.surname}}</td><td>{{member.middleName}}</td><td>{{member.firstName}}</td><td>{{member.yearCalled}}</td><td><button class=\"btn btn-xs btn-success\" ng-click=details(member)><i class=\"fa fa-check\"></i> SELECT</button></td></tr></table></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/login/login.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-xs-12><h3>Login</h3><hr></div></div><div sp-login-form></div></div>"
  );


  $templateCache.put('app/magistrate/magistrate.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>MAGISTRATES</div></div><div class=panel-body><form method=post name=dataForm ng-hide=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Please Enter your name below</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><select name=prefix id=prefix ng-model=d.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-3><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select name=suffix id=suffix ng-model=d.suffix class=form-control><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=text-center><button type=button ng-disabled=dataForm.$invalid class=\"btn btn-block btn-primary\" ng-click=\"nextForm=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Enter the Name on your Call to Bar Certificate</div><div class=row><div class=col-md-4><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-4><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-4><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div></div><div class=text-center><button type=button class=\"btn btn-block btn-success\" ng-click=\"showTable=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><hr><table class=\"table table-bordered table-striped table-hover\" ng-show=showTable><tr><th>S/N</th><th>Surname</th><th>Middle Name</th><th>First Name</th><th>Called to Bar</th><th class=col-sm-1></th></tr><tr><td>1.</td><td>James</td><td>Dean</td><td>Patterson</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>2.</td><td>Ludlum</td><td>Bruce</td><td>William</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>3.</td><td>Spindall</td><td>John</td><td>Jones</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr></table></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/magistrateForm/magistrateForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ATTENDEE DATA - Please provide additional data</div></div><div class=panel-body><form method=post name=dataForm ng-hide=nextForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><select readonly name=prefix id=prefix ng-model=d.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input readonly class=form-control name=surname id=surname ng-model=d.surname valuse=\"A Surname\" required></div></div><div class=col-md-2><div class=form-group><label for=middlename>Middle Name</label><input readonly class=form-control name=middlename id=middlename ng-model=d.middlename value=\"A Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstname>First Name</label><input readonly class=form-control name=firstname id=firstname ng-model=d.firstname value=\"A First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select readonly name=suffix id=suffix ng-model=d.suffix class=form-control><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=row><div class=col-md-3><div class=form-group><label for=ctb>Year of Call to Bar</label><input readonly class=form-control name=ctb id=ctb ng-model=d.yearCalled placeholder=1989 required></div></div><div class=col-md-5><div class=form-group><div class=\"form-price label label-primary\">NGN 50,000</div></div></div></div><div class=row><div class=col-sm-4><div class=form-group><label for=court>Court <span class=required>*</span></label><input class=form-control name=court id=court ng-model=d.court placeholder=Court required></div></div><div class=col-sm-4><div class=form-group><label for=state>State <span class=required>*</span></label><input class=form-control name=company id=state ng-model=d.state placeholder=State required></div></div><div class=col-sm-4><div class=form-group><label for=division>Division <span class=required>*</span></label><input class=form-control name=division id=division ng-model=d.division placeholder=Division required></div></div></div><div class=row><div class=col-md-6><div class=form-group><label for=phone>Primary Telephone Number <span class=required>*</span></label><input class=form-control type=tel name=phone id=phone ng-model=d.phone placeholder=\"Office Phone Number\" required></div></div><div class=col-md-6><div class=form-group><label for=mobile>Secondary Phone Number</label><input class=form-control type=tel name=mobile id=mobile ng-model=d.mobile placeholder=\"Mobile Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span></label><input type=email class=form-control name=email id=email ng-model=d.email placeholder=\"Email Address\" required></div><div class=row><div class=col-md-6><div class=form-group><label for=emergency>Emergency Contact Name</label><input class=form-control name=e_name id=emergency ng-model=d.e_name placeholder=\"Emergency Contact Name\"></div></div><div class=col-md-6><div class=form-group><label for=e_phone>Emergency Contact Number</label><input class=form-control type=tel name=e_phone id=e_phone ng-model=d.e_phone placeholder=\"Emergency Contact Number\"></div></div></div><hr><div class=\"text-center form-action\"><button type=button ng-disabled=!dataForm.$invalid class=\"btn btn-lg btn-success pull-left\" ng-click=payInvoice()><i class=\"fa fa-money\"></i> Pay Now <i class=\"fa fa-check\"></i></button> <button type=button ng-disabled=!dataForm.$invalid class=\"btn btn-lg btn-info pull-right\" ng-click=bookInvoice()><i class=\"fa fa-save\"></i> Book on Hold</button></div></form></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/main/main.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-lg-12><div class=text-center><a class=\"btn btn-primary btn-lg\" ng-click=startReg()>{{!noneInProgress()?'Start':'Resume'}} Registration <i class=\"fa fa-play\"></i></a></div><br><div class=row><div class=col-md-7><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>CONFERENCE FEES</div></div><div class=panel-body><table class=\"table table-bordered table-striped table-condensed table-hover\"><thead><tr><th style=\"vertical-align: middle\">Year (Age at the Bar)</th><th class=text-center>Regular Fee<br><small class=text-danger>May 1st - Aug. 21st</small></th><th class=text-center>Onsite Fee<br><small class=text-danger>Aug. 22nd - Aug. 28th</small></th></tr></thead><tbody><tr><td>1-5 Years</td><td class=text-center>N 8,000</td><td class=text-center>N 15,000</td></tr><tr><td>6-10 Years</td><td class=text-center>N 15,000</td><td class=text-center>N 25,000</td></tr><tr><td>11-14 Years</td><td class=text-center>N 20,000</td><td class=text-center>N 40,000</td></tr><tr><td>15-20 Years</td><td class=text-center>N 30,000</td><td class=text-center>N 50,000</td></tr><tr><td>Above 20 Years</td><td class=text-center>N 50,000</td><td class=text-center>N 80,000</td></tr><tr><td>SAN/AGS/Benchers</td><td class=text-center>N 100,000</td><td class=text-center>N 120,000</td></tr><tr><td>Honourable Judges</td><td class=text-center>N 75,000</td><td class=text-center>N 75,000</td></tr><tr><td>Magistrates</td><td class=text-center>N 50,000</td><td class=text-center>N 50,000</td></tr><tr><td>Governors, Legislators & Political Appointees</td><td class=text-center>N 250,000</td><td class=text-center>N 250,000</td></tr></tbody></table></div></div></div><div class=col-md-5 ng-include=\"'components/rightInfo/rightInfo.html'\"></div></div></div></div></div>"
  );


  $templateCache.put('app/others/others.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>GOVERNORS, LEGISLATORS & POLITICAL APPOINTEES</div></div><div class=panel-body><form method=post name=dataForm ng-hide=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Please Enter your name below</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><select name=prefix id=prefix ng-model=d.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-3><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select name=suffix id=suffix ng-model=d.suffix class=form-control><option>SAN</option><option>ESQ</option><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=text-center><button type=button ng-disabled=dataForm.$invalid class=\"btn btn-block btn-primary\" ng-click=\"nextForm=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Enter the Name on your Call to Bar Certificate</div><div class=row><div class=col-md-4><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-4><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-4><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div></div><div class=text-center><button type=button class=\"btn btn-block btn-success\" ng-click=\"showTable=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><hr><table class=\"table table-bordered table-striped table-hover\" ng-show=showTable><tr><th>S/N</th><th>Surname</th><th>Middle Name</th><th>First Name</th><th>Called to Bar</th><th class=col-sm-1></th></tr><tr><td>1.</td><td>James</td><td>Dean</td><td>Patterson</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>2.</td><td>Ludlum</td><td>Bruce</td><td>William</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>3.</td><td>Spindall</td><td>John</td><td>Jones</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr></table></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/othersForm/othersForm.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>ATTENDEE DATA - Please provide additional data</div></div><div class=panel-body><form method=post name=dataForm ng-hide=nextForm><div class=\"alert alert-info\">Fields marked <span class=required>*</span> are required!</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><select readonly name=prefix id=prefix ng-model=d.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input readonly class=form-control name=surname id=surname ng-model=d.surname valuse=\"A Surname\" required></div></div><div class=col-md-2><div class=form-group><label for=middlename>Middle Name</label><input readonly class=form-control name=middlename id=middlename ng-model=d.middlename value=\"A Middle Name\"></div></div><div class=col-md-3><div class=form-group><label for=firstname>First Name</label><input readonly class=form-control name=firstname id=firstname ng-model=d.firstname value=\"A First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select readonly name=suffix id=suffix ng-model=d.suffix class=form-control><option>SAN</option><option>ESQ</option><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=row><div class=col-md-3><div class=form-group><label for=ctb>Year of Call to Bar</label><input readonly class=form-control name=ctb id=ctb ng-model=d.yearCalled placeholder=1989 required></div></div><div class=col-md-5><div class=form-group><div class=\"form-price label label-primary\">NGN 250,000</div></div></div></div><div class=form-group><label for=designation>Designation <span class=required>*</span></label><input class=form-control name=designation id=designation ng-model=d.designation placeholder=Designation required></div><div class=form-group><label for=address>Address <span class=required>*</span></label><input class=form-control name=address id=address ng-model=d.address placeholder=Address required></div><div class=row><div class=col-md-6><div class=form-group><label for=phone>Office Telephone Number <span class=required>*</span></label><input class=form-control type=tel name=phone id=phone ng-model=d.phone placeholder=\"Office Phone Number\" required></div></div><div class=col-md-6><div class=form-group><label for=mobile>Mobile Phone Number</label><input class=form-control type=tel name=mobile id=mobile ng-model=d.mobile placeholder=\"Mobile Phone Number\"></div></div></div><div class=form-group><label for=email>Email Address <span class=required>*</span></label><input type=email class=form-control name=email id=email ng-model=d.email placeholder=\"Email Address\" required></div><div class=row><div class=col-md-6><div class=form-group><label for=emergency>Emergency Contact Name</label><input class=form-control name=e_name id=emergency ng-model=d.e_name placeholder=\"Emergency Contact Name\"></div></div><div class=col-md-6><div class=form-group><label for=e_phone>Emergency Contact Number</label><input class=form-control type=tel name=e_phone id=e_phone ng-model=d.e_phone placeholder=\"Emergency Contact Number\"></div></div></div><hr><div class=\"text-center form-action\"><button type=button ng-disabled=!dataForm.$invalid class=\"btn btn-lg btn-success pull-left\" ng-click=payInvoice()><i class=\"fa fa-money\"></i> Pay Now <i class=\"fa fa-check\"></i></button> <button type=button ng-disabled=!dataForm.$invalid class=\"btn btn-lg btn-info pull-right\" ng-click=bookInvoice()><i class=\"fa fa-save\"></i> Book on Hold</button></div></form></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/profile/profile.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-xs-12><h3>My Profile</h3><hr></div></div><div class=row><div class=col-xs-12><pre ng-bind=\"user | json\"></pre></div></div></div>"
  );


  $templateCache.put('app/register/register.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-xs-12><h3>Registration</h3><hr></div></div><div sp-registration-form post-login-state=main></div></div>"
  );


  $templateCache.put('app/registerAs/registerAs.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-xs-7><ul id=group-list><li><a ui-sref=legalPractitioner>LEGAL PRACTITIONER</a></li><li><a ui-sref=benchForm>SAN, AGS, BENCHERS</a></li><li><a ui-sref=judgeForm>HONOURABLE JUDGES</a></li><li><a ui-sref=magistrateForm>MAGISTRATES</a></li><li><a ui-sref=othersForm>GOVERNORS, LEGISLATORS, POLITICAL APPOINTEES</a></li></ul></div><div class=col-md-5 ng-include=\"'components/rightInfo/rightInfo.html'\"></div></div></div>"
  );


  $templateCache.put('app/sanAndBench/sanAndBench.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=col-sm-8><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>SENIOR ADVOCATES, ATTORNEY GENERALS & BENCHERS</div></div><div class=panel-body><form method=post name=dataForm ng-hide=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Please Enter your name below</div><div class=row><div class=col-md-2><label for=prefix>Prefix</label><select name=prefix id=prefix ng-model=d.prefix class=form-control required autofocus><option>Dr.</option><option>Prof.</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Chief</option></select></div><div class=col-md-3><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-2><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-3><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div><div class=col-md-2><label for=suffix>Suffix</label><select name=suffix id=suffix ng-model=d.suffix class=form-control><option>SAN</option><option>JSC</option><option>JCA</option><option>ESQ</option><option>MNI</option><option>MON</option><option>CON</option><option>GCON</option></select></div></div><div class=text-center><button type=button ng-disabled=dataForm.$invalid class=\"btn btn-block btn-primary\" ng-click=\"nextForm=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><form method=post name=dataForm2 ng-show=nextForm><div class=\"alert alert-info\"><i class=\"glyphicon glyphicon-chevron-down\"></i> Enter the Name on your Call to Bar Certificate</div><div class=row><div class=col-md-4><div class=form-group><label for=surname>Surname</label><input class=form-control name=surname id=surname ng-model=d.surname placeholder=Surname required></div></div><div class=col-md-4><div class=form-group><label for=middlename>Middle Name</label><input class=form-control name=middlename id=middlename ng-model=d.middlename placeholder=Middle></div></div><div class=col-md-4><div class=form-group><label for=firstname>First Name</label><input class=form-control name=firstname id=firstname ng-model=d.firstname placeholder=\"First Name\" required></div></div></div><div class=text-center><button type=button class=\"btn btn-block btn-success\" ng-click=\"showTable=true\"><i class=\"fa fa-play\"></i> Next</button></div></form><hr><table class=\"table table-bordered table-striped table-hover\" ng-show=showTable><tr><th>S/N</th><th>Surname</th><th>Middle Name</th><th>First Name</th><th>Called to Bar</th><th class=col-sm-1></th></tr><tr><td>1.</td><td>James</td><td>Dean</td><td>Patterson</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>2.</td><td>Ludlum</td><td>Bruce</td><td>William</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr><tr><td>3.</td><td>Spindall</td><td>John</td><td>Jones</td><td>1976</td><td><button class=\"btn btn-xs btn-success\" ng-click=details()><i class=\"fa fa-check\"></i></button></td></tr></table></div></div></div><div ng-include=\"'components/rightInfo/rightInfo.html'\" class=col-sm-4></div></div></div>"
  );


  $templateCache.put('app/webpay/webpay.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div><div class=container><div class=row><div class=\"col-sm-8 col-sm-offset-2\"><div class=\"panel panel-default\"><div class=panel-heading><div class=panel-title>PAYMENT INVOICE</div></div><div class=panel-body><form method=POST id=upay_form name=upay_form action=https://cipg.accessbankplc.com/MerchantServices/MakePayment.aspx target=_top><table class=\"table table-bordered table-striped\"><tr class=space><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td><td style=\"width: 25%\"></td></tr><tr><th colspan=4 class=\"text-uppercase text-center\"><h4>{{getName(data)}}</h4></th></tr><tr><th colspan=2><i class=\"fa fa-bullhorn\"></i> {{ data.yearCalled }} - Year of CALL</th><td colspan=2><i class=\"fa fa-building\"></i> {{data.branch}} BRANCH</td></tr><tr><td><i class=\"fa fa-phone-square\"></i> {{data.phone}}</td><td><i class=\"fa fa-mobile-phone\"></i> {{data.mobile}}</td><td colspan=2><i class=\"fa fa-envelope-o\"></i> {{data.email}}</td></tr><tr><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.company}}</td><td colspan=2><i class=\"fa fa-map-marker\"></i> {{data.address}}</td></tr><tr><td colspan=2><i class=\"fa fa-user\"></i> {{data.emergencyContact}}</td><td colspan=2><i class=\"fa fa-phone\"></i> {{data.emergencyPhone}}</td></tr><tr><th colspan=2 class=text-right><h4>Order ID:</h4></th><th colspan=2><h4>{{data.regCode}}/{{data.conferenceFee}}</h4></th></tr><tr><th colspan=2 class=text-right><h4>Conference Fees:</h4></th><th colspan=2><h4>NGN {{ data.conferenceFee }}</h4></th></tr><tr><th colspan=2 class=text-right>Processing Fees:</th><th colspan=2><strong>(at most) NGN {{ getFee(data.conferenceFee) }}</strong></th></tr><tr class=hidden-print><td colspan=4 class=text-center><button type=button class=\"btn btn-danger pull-left\" ng-click=back()><i class=\"fa fa-arrow-left\"></i> GO BACK</button> <button ng-hide=data.completed ng-click=markComplete(data) class=\"btn btn-success\" type=submit><i class=\"fa fa-play\"></i> PROCEED TO PAYMENT</button></td></tr></table><input type=hidden name=mercId value=09948> <input type=hidden name=currCode value=566> <input type=hidden name=amt value=\"{{ data.conferenceFee }}\"> <input type=hidden name=orderId value={{data.regCode}}/{{data.conferenceFee}}> <input type=hidden name=prod value=\"NBA AGC 2015 Registration for {{getName()}}\"> <input type=hidden name=email value={{data.email}}> <input type=hidden name=submit value=Pay></form></div></div></div></div></div>"
  );


  $templateCache.put('components/footer/footer.html',
    "<footer class=footer ng-controller=FooterCtrl><div class=container><p class=text-right>&copy {{theYear}}. POWERED BY <a href=http://lawpavilion.com target=_blank>LawPavilion</a> - OFFICIAL ICT PARTNER</p></div></footer>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat=\"button in modal.buttons\" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href=\"/\" class=navbar-brand>N.B.A. A.G.C. REGISTRATION PORTAL</a></div><div collapse=isCollapsed class=\"navbar-collapse collapse pull-right\" id=navbar-main><ul class=\"nav navbar-nav\"><li if-user ng-class=\"{active: isActive('/profile')}\"><a ui-sref=profile>Profile</a></li><!--<li if-not-user ng-class=\"{active: isActive('/register')}\">\n" +
    "                <a ui-sref=\"register\">Register</a>\n" +
    "            </li>--><li if-not-user ng-class=\"{active: isActive('/login')}\" ng-hide=noneInProgress()><a ui-sref=login>Check Registration Details</a></li><li if-user ng-class=\"{active: isActive('/logout')}\"><a ui-sref=main sp-logout>Logout</a></li><li if-not-user ng-show=noneInProgress()><button class=\"btn btn-danger\" ng-click=doReset()>CANCEL REGISTRATION</button></li></ul></div></div></div><header class=\"hero-unit hidden-print\" id=banner></header><div class=\"text-center text-uppercase\" style=\"margin-bottom: 15px\"><strong>Welcome to the NIGERIAN BAR ASSOCIATION's Annual General Conference Portal. Please read and follow the instructions below.</strong></div>"
  );


  $templateCache.put('components/rightInfo/rightInfo.html',
    "<div class=\"panel panel-success\" ng-controller=RightInfoCtrl><div class=panel-heading><div class=panel-title>INFORMATION</div></div><div class=panel-body><p class=\"alert alert-info\">Please note that the rate for the pre-conference manual registration closes on the 21st of August 2015 while all pre-conference manual registration will end on the 7th of August 2015.</p><!--<p>Conferees who register after the 21st of August, 2015 will be required to pay the corresponding\n" +
    "            Onsite Fee and submit their forms and payment teller onsite at the registration centre in Abuja.\n" +
    "            After the 7th of August, no forms should be submitted or will be received by the NBA Secretariat\n" +
    "            or Branch Offices.</p>\n" +
    "\n" +
    "        <p>For further details and enquiries please call any of the following: <strong>Chinelo Agbala</strong> 08067200353; <strong>Oti Edah</strong>, 08065901348; <strong>Kemi Beatrice Odeniyi</strong> 08068619570;</p>\n" +
    "\n" +
    "        <p class=\"text-danger\">We regret to inform that there will be no refund for cancellations.</p>\n" +
    "\n" +
    "        <p class=\"text-primary\">By submitting this form you accept the terms and conditions of this\n" +
    "            registration.</p>--><ol><li>From the <b>Home Page</b> click <b>Start Registration</b></li><li>Select your <b>Category</b></li><li>Enter your name as it appears on your <b>Call to Bar</b> certificate and click <b>Fetch Names</b></li><li>Select your correct detail from the <b>Search Result</b> that appears</li><li>Fill out the Registration Form that follows appropriately</li><li>Select your preferred Payment Option (registration payment MUST be completed within 72 hours from filling the form or your application will be disregarded)<ul><li><strong>Pay Online</strong> – Payment will be processed immediately</li><li><strong>Pay To the Bank</strong> – Payment will be processed subject to confirmation from the issuing bank</li></ul></li><li>Upon successful payment a verification code via email/sms will be sent to you within 48 hours</li><li>A Personal Login Information will be issued you, from which you can preview activities regarding the Conference and also print your Payment Receipt and Participation Slip</li><li>Online registration for <strong>Pay to the Bank</strong> option <b>closes on 13 August 2015;</b> Online registration for Pay Online closes on 20 August 2015.</li><li>Prepare for your trip to Abuja</li></ol></div></div>"
  );

}]);

