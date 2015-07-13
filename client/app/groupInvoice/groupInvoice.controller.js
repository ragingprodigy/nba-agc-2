'use strict';

angular.module('nbaAgc2App')
.controller('GroupInvoiceCtrl', function ($scope, $state, $stateParams, Invoice, blocker, $sessionStorage) {

	if (!$stateParams.invoiceId) { $state.go('myRegistrations'); }

	$scope.showGroup = true;
	blocker.block();

	Invoice.get({ id: $stateParams.invoiceId }, function(theInvoice) {
		$scope.invoice = theInvoice;
		blocker.clear();

	}, function() {

		blocker.clear();
		window.alert('Could not fetch Invoice!');
	});

	$scope.deleteInvoice = function() {
		var cnf = window.confirm('Are you sure you want to delete this invoice?');

		if (cnf) {
			blocker.block();
			Invoice.delete({ id: $stateParams.invoiceId }, function(){
				
				blocker.clear();
				window.alert('Invoice deleted successfully!');

				$state.go('myRegistrations');
			}, function(e) {

				blocker.clear();
				window.alert(e.data.message);
			});
		}
		
	};

	$scope.markFinal = function(what) {

        blocker.block();

        var toUp = {
        	webpay: $scope.invoice.webpay,
        	bankpay: $scope.invoice.bankpay,
        	finalized: $scope.finalized
        };

        if (what==='webpay') { toUp.webpay = true; $sessionStorage.activeGroupInvoice = $stateParams.invoiceId; }
        else { toUp.bankpay = true;  }

        toUp.finalized = true;

        Invoice.update({id: $scope.invoice._id}, toUp, function(){

            $state.go('group_'+what, {invoiceId: $stateParams.invoiceId});

        });
    };

	$scope.getName = function (data) {
        if (!data) {
            return '';
        }

        $scope.userName = data.prefix+' '+data.firstName+' '+data.middleName+' '+data.surname+' '+data.suffix;

        return $scope.userName;
    };
});
