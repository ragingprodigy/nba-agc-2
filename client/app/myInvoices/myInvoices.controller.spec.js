'use strict';

describe('Controller: MyInvoicesCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var MyInvoicesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyInvoicesCtrl = $controller('MyInvoicesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
