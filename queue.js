Course = new Mongo.Collection('course');
Video = new Mongo.Collection('video');

if (Meteor.isClient) {

    Meteor.startup(function() {
        Session.set('current', Course.findOne());
        Session.set('forms', '');
        Session.set('editMode', false);
    });

    Accounts.config({
        forbidClientAccountCreation : true
    });
}

// Meteor Server
if (Meteor.isServer) {
    Meteor.startup(function() {

    });
}

// Meteor Methods
Meteor.methods({

    addCourse: function(title) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Course.insert({
            title: title,
            createdAt: new Date()
        });
    },

    addVideo: function(title, course, order) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Video.insert({
            title: title,
            course: course,
            order: order,
            checked: false,
            createdAt: new Date()
        });
    },

    deleteVideo: function(videoId) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Video.remove(videoId);
    },

    updateVideoRank: function(videoId, newRank) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Video.update(videoId, { $set: { order: newRank} });
    },

    updateVideoCheck: function(videoId, setChecked) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Video.update(videoId, { $set: { checked: setChecked} });
    }
});
