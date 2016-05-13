'use strict';

describe('Service: Bags', function () {

  // load the service's module
  beforeEach(module('nbaAgc2App'));

  // instantiate service
  var Bags;
  beforeEach(inject(function (_Bags_) {
    Bags = _Bags_;
  }));

  it('should do something', function () {
    expect(!!Bags).toBe(true);
  });

});
