'use strict';

angular.module('nbaAgc2App')
.controller('GroupPayCtrl', function ($scope, $state, $stateParams, Invoice, blocker,$rootScope) {

        if ($rootScope.expired()) { $state.go('main'); }

	if (!$stateParams.invoiceId) { $state.go('myRegistrations'); }

	blocker.block();

	Invoice.get({ id: $stateParams.invoiceId }, function(theInvoice) {
		$scope.data = theInvoice;

		if (!theInvoice.finalized) { $state.go('groupInvoice'); }

		blocker.clear();

	}, function() {

		blocker.clear();
		window.alert('Could not fetch Invoice!');
	});

    $scope.back = function() {
        window.history.back();
    };
});
