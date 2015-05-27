if (Meteor.isClient) {
    Meteor.subscribe('course');

    Template.course.helpers({
        editMode: function() {
            return Session.get('editMode');
        }
    });

    Template.course.events({
        'click .set-course': function() {
            Session.set('current', this);
            Session.set('show',  !Session.get('show'));
        },
        'click .fa-times-circle': function() {
            Meteor.call('deleteCourse', this._id);
        }
    });
}

// Meteor Server
if (Meteor.isServer) {

    Meteor.startup(function() {

    });

    Meteor.publish('course', function() {
        return Course.find();
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

    deleteCourse: function(courseId) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Course.remove(courseId);
    },

});

