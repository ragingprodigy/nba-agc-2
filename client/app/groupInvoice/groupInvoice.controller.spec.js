'use strict';

describe('Controller: GroupInvoiceCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var GroupInvoiceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GroupInvoiceCtrl = $controller('GroupInvoiceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
