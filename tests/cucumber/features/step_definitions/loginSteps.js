var assert = require('assert');

module.exports = function() {

    var helper = this;

    this.Given(/^I am signed out$/, function(callback) {
      helper.world.browser.
        url(helper.world.cucumber.mirror.rootUrl + 'logout').
        waitForExist('.login-link-text', 7000).
        waitForVisible('.login-link-text').
        call(callback);
    });

      this.Given(/^I am on the home page$/, function(callback) {
        helper.world.browser.
          url(helper.world.cucumber.mirror.rootUrl).
          call(callback);
      });

    this.When(/^I click on sign in link$/, function(callback) {
      helper.world.browser.
        waitForExist('.login-link-text', 7000).
        waitForVisible('.login-link-text').
        click('.login-link-text').
        call(callback);
    });

    this.When(/^I enter my authentication information$/, function(callback) {
      helper.world.browser.
        saveScreenshot(process.env.PWD + '/tests/img/auth1.png').
        setValue('input#login-email', 'josh@test.com').
        setValue('input#login-password', 'good password').
        click('.login-button-form-submit').
        call(callback);
    });

    this.When(/^I enter incorrect authentication information$/,
      function(callback) {
        helper.world.browser.
        saveScreenshot(process.env.PWD + '/tests/img/auth2.png').
        setValue('input#login-email', 'josh@test.com').
        setValue('input#login-password', 'bad password').
        click('.login-button-form-submit').
        call(callback);
      }
    );

    this.Then(/^I should be logged in$/, function(callback) {
      helper.world.browser.
        waitForExist('.login-link-text', 7000).
        waitForVisible('.login-link-text').
        getText('.login-link-text', function(err, username) {
            assert.equal(username.slice(0, -2), 'Josh Owens');
        }).
        call(callback);
    });

    this.Then(/^I should see a user not found error$/, function(callback) {
        helper.world.browser.
        waitForExist('.error-message', 5000).
        waitForVisible('.error-message').
        saveScreenshot(process.env.PWD + '/tests/img/fail.png').
        getText('.error-message', function(err, errorMessage) {
            assert.equal(errorMessage, 'Incorrect password');
        }).
        call(callback);
    });

};
