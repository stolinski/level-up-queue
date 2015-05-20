if (Meteor.isClient) {
    Meteor.subscribe('video');

    Template.video.events({
        'click .toggle-checked': function() {
            Meteor.call('updateVideoCheck', this._id, !this.checked);
        },
        'click .delete-video': function() {
            Meteor.call('deleteVideo', this._id);
        }
    });

    Template.video.helpers({
        editMode: function() {
            return Session.get('editMode');
        }
    });

}


// Meteor Server
if (Meteor.isServer) {

    Meteor.startup(function() {

    });

    Meteor.publish('video', function() {
        return Video.find();
    });
}

// Meteor Methods
Meteor.methods({

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
