if (Meteor.isClient) {
    Template.course.events({
        'click .set-course': function() {
            Session.set('current', this);
            Session.set('show',  !Session.get('show'));
        }
    });
}
