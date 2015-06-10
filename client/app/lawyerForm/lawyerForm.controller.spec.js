'use strict';

describe('Controller: LawyerFormCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var LawyerFormCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LawyerFormCtrl = $controller('LawyerFormCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
