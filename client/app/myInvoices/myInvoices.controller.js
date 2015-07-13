'use strict';

angular.module('nbaAgc2App')
.controller('MyInvoicesCtrl', function ($scope, blocker, Invoice, $anchorScroll, $http) {

	$anchorScroll();

	blocker.block();

	Invoice.query(function(invoices) {
            
	    $scope.invoices = invoices;


	    $scope.paidInvoices = _.filter(invoices, function(i) { return i.paymentSuccessful && i.responseGotten; });
      $scope.unpaidInvoices = _.filter(invoices, function(i) { return i.finalized && !i.paymentSuccessful && !i.responseGotten && (i.bankpay || i.webpay); });
	    $scope.unpaidWebInvoices = _.filter(invoices, function(i) { return i.finalized && !i.paymentSuccessful && !i.responseGotten && i.webpay; });
	    $scope.voidInvoices = _.filter(invoices, function(i) { return !i.paymentSuccessful && i.responseGotten; });

      _.each($scope.unpaidWebInvoices, function(r) { $scope.updateRecord(r._id); } );

	    blocker.clear();

  	});

  	$scope.getGroupFee = function(group) {
        return _.reduce(group, function(result, reg) { return result + reg.invoiceAmount; }, 0);
    };

    $scope.updateRecord = function(id) {

        blocker.block();

        $http.post('/api/registrations/webPayStatus', { _id: id, which: 'invoice' }, {
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

              // Update the Payment Details for the Client
              Invoice.update({id: id}, d, function(){
                // Reduce the list of pending Registrations
                $scope.unpaidInvoices = _.reject($scope.unpaidInvoices, function(r){ return r._id===id; });
                blocker.clear();
              });

           } else {

              if (d.Error !== 'No Transaction Record') {

                blocker.clear();
                $scope.status = { message: d.Error, type: 'danger' };
              }
           }
        });
      };
});
