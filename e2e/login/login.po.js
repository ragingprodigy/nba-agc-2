/**
 * Created by oladapo on 8/7/15.
 */

var LoginPage = function() {
    this.loginBox = element(by.css('.panel'));
    this.loginLabel = this.loginBox.element(by.css('.panel-title'));

    this.emailField = this.loginBox.element(by.model('user.email'));
    this.passwordField = this.loginBox.element(by.model('user.password'));
    this.loginButton = this.loginBox.element(by.css('button'));

    this.logoutBtn = element(by.css('#logout'));
    this.groupLabel = element(by.css('#group-name'));
    this.groupEmail = element(by.css('#group-login-email'));

    this.passwordRecoveryLink = this.loginBox.element(by.css('a'));

    this.loadPage = function(){
        browser.get('/myaccount');
    };

    this.setUsername = function(username) {
        this.emailField.sendKeys(username);
    };

    this.setPassword = function(password) {
        this.passwordField.sendKeys(password);
    };
};

module.exports = new LoginPage();

