'use strict';

describe('Controller: BankPayCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var BankPayCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BankPayCtrl = $controller('BankPayCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
