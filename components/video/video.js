if (Meteor.isClient) {

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
