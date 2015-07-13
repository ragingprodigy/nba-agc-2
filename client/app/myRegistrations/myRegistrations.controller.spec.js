'use strict';

describe('Controller: MyRegistrationsCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var MyRegistrationsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyRegistrationsCtrl = $controller('MyRegistrationsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
