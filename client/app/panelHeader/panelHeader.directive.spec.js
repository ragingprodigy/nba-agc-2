'use strict';

describe('Directive: panelHeader', function () {

  // load the directive's module and view
  beforeEach(module('nbaAgc2App'));
  beforeEach(module('app/panelHeader/panelHeader.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<panel-header></panel-header>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the panelHeader directive');
  }));
});