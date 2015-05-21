if (Meteor.isClient) {
    Meteor.subscribe('video');

    Template.home.helpers({
        courses: function() {
            return Course.find();
        },
        videos: function() {
            try {
                return Video.find({course: Session.get('current').title}, {sort: {course: 1, order: 1}});
            }
            catch(err) {
                return;
            }
        },
        inCourse: function() {
            return Video.find({course: Session.get('current').title}).count();
        },
        complete: function() {
            return Video.find({course: Session.get('current').title, checked: true}).count();
        },
        current: function() {
            return Session.get('current');
        },
        forms: function() {
            return Session.get('forms');
        },
        editMode: function() {
            return Session.get('editMode');
        },

        dragOptions: function () {
            return {
                onEnd: function(event) {
                    Meteor.call('updateVideoRank', event.data._id, event.newIndex);
                }
            };
        }
    });

    Template.home.events({
        'submit .new-course': function(event) {

            var title = event.target.title.value;

            Meteor.call('addCourse', title);

            // Clear form
            event.target.title.value = '';
            return false;
        },
        'submit .new-video': function(event) {
            var title = event.target.title.value;
            var course = event.target.course.value;

            // Finds highest video ranking to add to end
            var prev = Video.findOne({course:course}, {sort: {order: -1}});
            var order = prev ? prev.order + 1 : 1;
            Meteor.call('addVideo', title, course, order);

            // Clear form
            event.target.title.value = '';
            return false;
        },
        'click #form-toggle': function(event) {
            if (Session.get('forms') === 'open') {
                Session.set('forms', '');
            } else {
                Session.set('forms', 'open');
            }
        },
        'click .edit-toggle': function(event) {
            if (Session.get('editMode')) {
                Session.set('editMode', false);
            } else {
                Session.set('editMode', true);
            }
        },
        'change #course-menu': function(event) {
            var courseChange = Course.findOne({title: event.target.value});
            Session.set('current', courseChange);
        },
        'click .forms-close': function() {
            Session.set('forms', '');
        }
    });

    Template.home.rendered = function() {
        var $item = $(this.find('.courses'));

        Meteor.defer(function() {
            $item.removeClass('loading');
        });
    };

}