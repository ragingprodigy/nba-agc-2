'use strict';

describe('Controller: RecoverPasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var RecoverPasswordCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecoverPasswordCtrl = $controller('RecoverPasswordCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
