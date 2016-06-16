'use strict';

angular.module('nbaAgc2App')
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, slides) {

    $scope.slides = slides;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selectBag = function(index) {
        $modalInstance.close($scope.slides[index]);
    };
})
  .controller('MyRegistrationsCtrl', function ($scope, $timeout, $http, Registration, blocker, $auth, $rootScope, Invoice, $sessionStorage, $state, $modal, Bags, User) {

        $scope.editingTag = false;

        $scope.editTag = function() {
            $scope.editingTag = true;
        };

        $scope.confirmEdit = function(tagForm) {
            if (tagForm.$valid && window.confirm('Are you sure?')) {
                // Do Update
                User.update({}, $scope.tag, function(resp){
                    $rootScope.$user = resp;
                    tagForm.$setPristine();
                    $scope.editingTag = false;
                });
            }
        };

        Bags.query({}, function(data) {
            $scope.slides = data;
            var selection = _.find($scope.slides, function(bag){
                return bag.name === $rootScope.$user.bag;
            });
            $scope.imageUrl = selection?selection.image : '';
            $scope.pickerTitle = $scope.imageUrl.length?'Here\'s the bag you\'ve selected':'Pick your bag';
        });

        $scope.pickBag = function () {

            if ($rootScope.expired()) { return false; }

            var modalInstance = $modal.open({
                animation: true,
             //templateUrl: 'components/modal/modal.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    slides: function () {
                        return $scope.slides;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                var selection = new Bags();
                selection.details = selectedItem;
                selection.$choose().then(function(data) {
                    $rootScope.$user = data;
                    $scope.imageUrl = selectedItem.image;
                });
            });
        };

      $scope.status = {};

      $scope.isGroup = function() {
        return $auth.isAuthenticated() && $auth.getPayload().accountType==='group';
      };

      $scope.newReg = function(reg) {
        var cnf = window.confirm('This would create a new payment invoice for you. Do you want to continue?');

        if (cnf) {

          if ($scope.pendingRegistrations.length > 0) {

            $scope.status = { message: 'We cannot create a new Invoice for you because you still have pending Invoices. If you have a pending Bank Payment, please allow 24 hours for us to reconcile and update the status. Thank You.', type: 'danger' };

          } else {

            // Create a new Registration from the Old one
            Registration.clone({id: reg._id}, reg, function(registrationData){
              $sessionStorage.lpRegistrant = registrationData;
              $state.go('invoice');
            });
          }
        }
      };

      $scope.showBank = function(r) {
        $sessionStorage.lpRegistrant = r;
        $state.go('bankPay');
      };

      $scope.getRegistrations = function() {
        blocker.block();
          var params = {};

          if ($rootScope.isGroup()) {
              params.isGroup = $rootScope.isGroup();
          }

        Registration.query(params, function(data) {

            $scope.paidRegistrations = _.flatten(_.filter(data, function(r) { return r.statusConfirmed && r.paymentSuccessful; }));
          $scope.pendingRegistrations = _.flatten(_.filter(data, function(r) { return !r.responseGotten && (r.webpay || r.bankpay); }));
          $scope.failedRegistrations = _.filter(data, function(r) { return r.responseGotten && !r.paymentSuccessful; });

          $scope.registrations = data;

          $scope.regIds = _.map(data, function(r){ return r._id; });

          if (!$scope.isGroup()) {
            _.each($scope.pendingRegistrations, function(r) { if (r.webpay) { $scope.updateRecord(r._id); } } );
          }

          if ($scope.paidRegistrations.length) {
            $scope.showPayStatus($scope.paidRegistrations[0]);
              if (!$rootScope.$user.hasTag) {
                  $scope.tag = {
                      prefix: $scope.selectedReg.prefix,
                      suffix: $scope.selectedReg.suffix,
                      name: $scope.selectedReg.firstName+' '+$scope.selectedReg.middleName.substring(0,1)+' '+$scope.selectedReg.surname,
                      firm: ($scope.selectedReg.registrationType!='judge'&&$scope.selectedReg.registrationType!='magistrate'?$scope.selectedReg.company:($scope.selectedReg.court+' '+$scope.selectedReg.state+' '+$scope.selectedReg.division))
                  };
              } else {
                  $scope.tag = _.pick($rootScope.$user, ['prefix','suffix','name','firm']);
              }

              if (!$scope.isGroup()) {
                  $rootScope.confirmedUser = true;
              }
          }

          blocker.clear();
        });
      };

      $scope.getInvoices = function() {
          Invoice.query(function(invoices) {

            if ($rootScope.isGroup()) {

              $scope.invoices = invoices;
              $scope.paidInvoices = _.filter(invoices, function(i) { return i.paymentSuccessful; });
              $scope.paidRegistrations = _.flatten(_.map($scope.paidInvoices, function(i) { return i.registrations; }));
              $scope.paidRegIds = _.map($scope.paidRegistrations, function(r){ return r._id; });
              var myIds = _.difference($scope.regIds, $scope.paidRegIds);

              $scope.unpaidRegistrations = _.filter($scope.registrations, function(reg){ return myIds.indexOf(reg._id) > -1; });

            }

          });
      };

      $scope.getRegistrations();
      $scope.getInvoices();
      $timeout($scope.getRegistrations, 5000);
      $timeout($scope.getInvoices, 5000);

      $scope.writeInvoice = function(data) {

        var cnf = window.confirm('Are you sure you want to generate an Invoice now?'),
            registrationIds = _.map(data, function(obj){ return obj._id; });

        if (cnf) {
          var inv = new Invoice({ registrations: registrationIds });

          blocker.block('table');

          inv.$save().then(function(invoiceData) {

            $state.go('groupInvoice', { invoiceId: invoiceData._id });

          }, function(err){

            $scope.status = { message: err.data.message, type: 'danger' };
            
          });
        }

      };

      $scope.cancelReg = function(regId) {
        var cnf = window.confirm('Are you sure you want to delete this registration?');

        if (cnf) {
          blocker.block();

          Registration.delete({id: regId }, function(){
            $scope.status = { message: 'Registration deleted successfully!', type: 'success' };
            $scope.getRegistrations();
          });
        }
        
      };

      $scope.getGroupFee = function(group) {
        return _.reduce(group, function(result, reg) { return result + reg.conferenceFee; }, 0);
      };

      $scope.showPayStatus = function (selected) {
    		$scope.selectedReg = selected;
    		$scope.showPay = true;
    	};

      $scope.updateRecord = function(id, now) {

        blocker.block();

        $http.post('/api/registrations/webPayStatus', {_id: id}, {
          transformResponse:function(data) {
            /*jshint camelcase: false */
            /*global X2JS */
            var x2js = new X2JS();
            var json = x2js.xml_str2json( data );
            return json;
          }
        }).success(function(d){
           d = d.CIPG;

           if (d.Error === undefined ) {

              d.responseGotten = true;

              // Update the Payment Details for the Client
              Registration.update({id: id}, d, function(){
                // Reduce the list of pending Registrations
                $scope.pendingRegistrations = _.reject($scope.pendingRegistrations, function(r){ return r._id===id; });
              });

           } else {

              if (d.Error === 'No Transaction Record') {

                if (now) {
                  // Allow Payment to Proceed on this as it's not been sent to the switch yet
                  var theReg = _.find($scope.pendingRegistrations, function(r){ return r._id===id; });
                  $sessionStorage.lpRegistrant = theReg;
                  $state.go('webpay');
                }

                // Update the Payment Details for the Client
                //Registration.update({id: id}, {responseGotten:true}, function(){
                  
                //});

              } else {
                $scope.status = { message: d.Error, type: 'danger' };
              }
           }
        });
      };
  });