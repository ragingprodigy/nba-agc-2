'use strict';

describe('Controller: AccessBankTestCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var AccessBankTestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccessBankTestCtrl = $controller('AccessBankTestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
