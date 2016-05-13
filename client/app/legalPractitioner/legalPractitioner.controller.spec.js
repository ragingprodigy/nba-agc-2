'use strict';

describe('Controller: LegalPractitionerCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var LegalPractitionerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LegalPractitionerCtrl = $controller('LegalPractitionerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
