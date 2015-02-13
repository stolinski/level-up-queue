Router.map(function() {
    this.route('home', {path: '/'});
    this.route('logout', {
        path: '/logout',
        onBeforeAction: function(pause) {
            Meteor.logout(function(err) {
                Router.go('/');
            });
            this.next();
        }
    });
});