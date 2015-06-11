'use strict';

describe('Service: Registration', function () {

  // load the service's module
  beforeEach(module('nbaAgc2App'));

  // instantiate service
  var registration;
  beforeEach(inject(function (_Registration_) {
    registration = _Registration_;
  }));

  it('should do something', function () {
    expect(!!registration).toBe(true);
  });

});
