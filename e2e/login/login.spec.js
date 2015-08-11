/**
 * Created by oladapo on 8/7/15.
 */

describe('Login Page', function() {
    var page;

    beforeEach(function() {
        page = require('./login.po');
        page.loadPage();
    });

    it('should include login form with correct data', function() {
        expect(page.loginLabel.getText()).toBe('LOGIN');
        expect(page.passwordRecoveryLink.getText()).toBe('forgot your password?');
    });
});

describe('Login Form', function(){
   var page;

    beforeEach(function(){
        page = require('./login.po');
        page.loadPage();
    });

    it('should do group login', function(){
        var email = 'o.omonayajo@gmail.com';
        page.setUsername(email);
        page.setPassword('lawpavilion');

        page.loginButton.click();
        browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
                return (/registrations/).test(url);
            });
        });

        expect(page.logoutBtn.getText()).toEqual('LOGOUT');
        expect(page.groupLabel.getText()).toEqual('NBA Plateau State');
        expect(page.groupEmail.getText()).toEqual(email);
    });
});
