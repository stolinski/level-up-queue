Course = new Mongo.Collection('course');
Video = new Mongo.Collection('video');

if (Meteor.isClient) {

    Meteor.startup(function() {
        Session.set('forms', '');
        Session.set('editMode', false);
    });
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_ONLY'
    });


}

// Meteor Server
if (Meteor.isServer) {

    Accounts.config({
        forbidClientAccountCreation : true
    });

}
