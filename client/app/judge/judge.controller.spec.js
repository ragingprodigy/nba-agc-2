'use strict';

describe('Controller: JudgeCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var JudgeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JudgeCtrl = $controller('JudgeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
