if (Meteor.isClient) {
    Meteor.subscribe('course');

    Template.course.events({
        'click .set-course': function() {
            Session.set('current', this);
            Session.set('show',  !Session.get('show'));
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
    }
});

