'use strict';

describe('Service: MyRegistration', function () {

  // load the service's module
  beforeEach(module('nbaAgc2App'));

  // instantiate service
  var MyRegistration;
  beforeEach(inject(function (_MyRegistration_) {
    MyRegistration = _MyRegistration_;
  }));

  it('should do something', function () {
    expect(!!MyRegistration).toBe(true);
  });

});
