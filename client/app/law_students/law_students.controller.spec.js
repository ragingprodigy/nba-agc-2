'use strict';

describe('Controller: LawStudentsCtrl', function () {

    // load the controller's module
    beforeEach(module('nbaAgc2App'));

    var NonLawyerCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        NonLawyerCtrl = $controller('LawStudentsCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function () {
        expect(1).toEqual(1);
    });
});
