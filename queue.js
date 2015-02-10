Course = new Mongo.Collection('course');
Video = new Mongo.Collection('video');

if (Meteor.isClient) {

    Meteor.startup(function() {
        Session.set('current', Course.findOne());
        Session.set('forms', '');
        Session.set('editMode', false);
    });

    Template.body.helpers({
        courses: function() {
            return Course.find();
        },
        videos: function() {
            return Video.find({course: Session.get('current').title}, {sort: {course: 1, order: 1}});
        },
        inCourse: function() {
            return Video.find({course: Session.get('current').title}).count();
        },
        complete: function() {
            return Video.find({course: Session.get('current').title, checked: true}).count();;
        },
        current: function() {
            return Session.get('current');
        },
        forms: function() {
            return Session.get('forms');
        },
        editMode: function() {
            return Session.get('editMode');
        }
    });

    Template.body.events({
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

            Meteor.call('addVideo', title, course, prev.order + 1);

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
        }
    });

    Template.body.rendered = function() {
        this.$('#items').sortable({
            axis: 'y',
            stop: function(e, ui) {;
                el = ui.item.get(0)
                before = ui.item.prev().get(0)
                after = ui.item.next().get(0)
                    // Here is the part that blew my mind!
                    //  Blaze.getData takes as a parameter an html element
                    //    and will return the data context that was bound when
                    //    that html element was rendered!
                if (!before) {
                      //if it was dragged into the first position grab the
                      // next element's data context and subtract one from the rank
                    newRank = 1;
                } else if (!after) {
                      //if it was dragged into the last position grab the
                      //  previous element's data context and add one to the rank
                    newRank = Blaze.getData(before).order + 1
                } else {
                      //else take the average of the two ranks of the previous
                      // and next elements
                    newRank = (Blaze.getData(after).order + Blaze.getData(before).order) / 2
                }
                Meteor.call('updateVideoRank', Blaze.getData(el)._id, newRank);
            }
        });
    }

    Template.course.events({
        'click .set-course': function() {
            Session.set('current', this);
        }
    });

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
    Accounts.config({
        forbidClientAccountCreation : true
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {

    });
}

Meteor.methods({

    addCourse: function(title) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }
        Course.insert({
            title: title,
            createdAt: new Date()
        });
    },

    addVideo: function(title, course, order) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
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
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }
        Video.remove(videoId);
    },

    updateVideoRank: function(videoId, newRank) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }
        Video.update(videoId, { $set: { order: newRank} });
    },

    updateVideoCheck: function(videoId, setChecked) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
        }
        Video.update(videoId, { $set: { checked: setChecked} });
    }
});