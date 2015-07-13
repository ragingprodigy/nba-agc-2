'use strict';

function toPay(v) {
    return v;
}

angular.module('nbaAgc2App')
    .controller('SuccessCtrl', function($scope, $sessionStorage, $state, $stateParams, Registration, Invoice, AccessCheck, blocker, $anchorScroll) {

        $anchorScroll();

        $scope.postFetchCallback = function(amountDue, theType) {
            AccessCheck.postSuccess($stateParams.OrderID, toPay(amountDue), function(d) {

                blocker.clear();
                d = d.CIPG;

                // Prevent User from restarting Transaction
                $sessionStorage.$reset();

                if (['00', '0', '001', 'APPROVED'].indexOf(d.ResponseCode) !== -1) {
                
                    $scope.message = 'Your Payment was SUCCESSFUL';

                    $scope.transactionReference = d.TransactionRef;
                    $scope.paymentReference = d.PaymentRef;
                    $scope.orderID = d.OrderID;
                    $scope.merchantID = d.MerchantID;
                    $scope.paymentGate = d.PaymentGateway;
                    $scope.status = d.Status;
                    $scope.responseDescription = d.ResponseDescription;

                    d.completed = true;
                    d.responseGotten = true;
                    d.DateTime = d.Date;

                    // Update the Payment Details for the Client
                    if (theType==='single') { Registration.update({id: $scope.data._id}, d); }
                    else { Invoice.update({id: $scope.data._id}, d); }

                } else {

                    blocker.block();

                    d.paymentSuccessful = false;
                    d.responseGotten = true;
                    d.DateTime = d.Date;

                    if (theType==='single') {
                        Registration.update({id: $scope.data._id}, d, function(){
                            blocker.clear();
                            window.alert('Transaction Failed!');
                        });
                    } else {
                        Invoice.update({id: $scope.data._id}, d, function(){
                            blocker.clear();
                            window.alert('Transaction Failed!');
                        });
                    }
                }

            });
        };

        // Get the Data from the DB
        if (($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) || ($sessionStorage.activeGroupInvoice)) {

            blocker.block();

            if ($sessionStorage.activeGroupInvoice) {
                // Group Payment
                Invoice.get({ id: $sessionStorage.activeGroupInvoice }, function (d) {
                    $scope.data = d;
                    $scope.data.email = d._group.email;

                    $scope.postFetchCallback($scope.data.invoiceAmount, 'group');
                }, function(){
                    window.alert('Invoice not found! Please contact support!');
                });
            } else {
                // Single Payment
                Registration.get({ id: $sessionStorage.lpRegistrant._id }, function (d) {
                    $scope.data = d;
                    $scope.postFetchCallback($scope.data.conferenceFee, 'single');
                }, function(){
                    window.alert('Registration data not found. Please contact support!');
                });
            }
        } else {
            $scope.message = 'Session Expired. Transaction Record Unavailable! Please login with the details we sent to the email address you provided during the registration.';
        }
    })

.controller('CancelledCtrl', function($scope, $sessionStorage, $state, $stateParams, Registration, Invoice, AccessCheck, message, blocker, $anchorScroll) {

    $anchorScroll();

    $scope.postFetchCallback = function(amountDue, theType) {
        AccessCheck.postSuccess($stateParams.OrderID, toPay(amountDue), function(d){

            d = d.CIPG;

            if (['00', 'APPROVED'].indexOf(d.ResponseCode) === -1) {
                $scope.message = message;

                $scope.transactionReference = d.TransactionRef;
                $scope.paymentReference = d.PaymentRef;
                $scope.orderID = d.OrderID;
                $scope.merchantID = d.MerchantID;
                $scope.paymentGate = d.PaymentGateway;
                $scope.status = d.Status;
                $scope.responseDescription = d.ResponseDescription;

                d.paymentSuccessful = false;
                d.responseGotten = true;
                d.DateTime = d.Date;

                if (theType==='single') {
                    Registration.update({id: $scope.data._id}, d, function(){
                        $sessionStorage.$reset();
                        blocker.clear();
                    });
                } else {
                    Invoice.update({id: $scope.data._id}, d, function(){
                        $sessionStorage.$reset();
                        blocker.clear();
                    });
                }
            }

        });
    };

    // Get the Data from the DB
    if (($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) || ($sessionStorage.activeGroupInvoice)) {

        blocker.block();

        if ($sessionStorage.activeGroupInvoice) {

            // Group Payment
            Invoice.get({ id: $sessionStorage.activeGroupInvoice }, function (d) {
                $scope.data = d;
                $scope.data.email = d._group.email;

                $scope.postFetchCallback($scope.data.invoiceAmount, 'group');
            }, function(){
                window.alert('Invoice not found! Please contact support!');
            });
        } else {

            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function (d) {
                $scope.data = d;
                $scope.postFetchCallback($scope.data.conferenceFee, 'single');
            }, function(){
                window.alert('Registration data not found! Please contact support!');
            });
        }
    } else {
        $scope.message = 'Session Expired. Transaction Record Unavailable! Please login with the details we sent to the email address you provided during the registration.';
    }
})

  .controller('WebpayCtrl', function ($scope, $sessionStorage, Registration, $state, $auth, blocker, $anchorScroll) {

        $anchorScroll();

        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

            blocker.block();

            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled){
                    $state.go($scope.data.registrationType);
                }

                $sessionStorage.lpRegistrant = d;

                blocker.clear();

            });
        } else {
            $state.go('main');
        }

        /*$scope.markComplete = function(r) {

            blocker.block();

            $auth.signup(r).then(function(response) {
                console.log(response.data);

                r.completed = true;
                Registration.update({id: $scope.data._id}, r, function(){
                    window.alert('Account created. Please proceed to payment.');
                });

                blocker.clear();

            }, function(err){
                window.alert(err.data.message);
                blocker.clear();
            });
        };*/

        $scope.back = function() {
            $state.go('invoice');
        };

        $scope.getName = function () {
            if (!$scope.data){
                return '';
            }
            return $scope.data.firstName+' '+$scope.data.middleName+' '+$scope.data.surname;
        };

        $scope.toPay = toPay;
  });