'use strict';

describe('Controller: InternationalCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var InternationalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InternationalCtrl = $controller('InternationalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
