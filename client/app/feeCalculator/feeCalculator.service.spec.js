'use strict';

describe('Service: FeeCalculator', function () {

    // load the service's module
    beforeEach(module('nbaAgc2App'));

    // instantiate service
    var FeeCalculator;
    beforeEach(inject(function (_fees_) {
        FeeCalculator = _fees_;
    }));

    it('should do something', function () {
        expect(!!FeeCalculator).toBe(true);
    });

});
