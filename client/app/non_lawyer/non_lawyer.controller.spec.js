'use strict';

describe('Controller: NonLawyerCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var NonLawyerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NonLawyerCtrl = $controller('NonLawyerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
