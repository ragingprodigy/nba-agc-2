'use strict';

describe('Controller: MySessionsCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var MySessionsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MySessionsCtrl = $controller('MySessionsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
