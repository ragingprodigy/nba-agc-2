'use strict';

describe('Controller: DoPasswordResetCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var DoPasswordResetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DoPasswordResetCtrl = $controller('DoPasswordResetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
