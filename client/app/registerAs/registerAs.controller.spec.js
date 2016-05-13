'use strict';

describe('Controller: RegisterAsCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var RegisterAsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegisterAsCtrl = $controller('RegisterAsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
