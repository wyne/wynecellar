define([
    'jquery',
    'underscore',
    'backbone',
    'stackmobinit',
    'text!templates/signUpTemplate.html'
], function($, _, Backbone, StackMob, signUpTemplate){

    var SignUpView = Backbone.View.extend({
        events: {
            "click #signUpBtn": "signup",
            "click #loginBtn": "login",
            "click #statusBtn": "status",
            "click #logoutBtn": "logout"
        },

        initialize: function() {
            this.template = _.template(signUpTemplate);
            this.router = this.options.router;
        },

        render:function (eventName) {
            // Render the page template
            $(this.el).html(this.template());

            return this;
        },

        signup:function (e) {
            e.preventDefault();

            var username = $("#signUpForm input.username").val();
            var pw = $("#signUpForm input.password").val();

            var user = new StackMob.User({ username: username,
                                          password:  pw });

            user.create({
                success: function(data) {
                    console.log(data.toJSON());
                },
                error: function(error) {
                    console.log(error);
                }
            });

            return this;
        },

        login:function (e) {
            e.preventDefault();

            var username = $("#signUpForm input.username").val();
            var pw = $("#signUpForm input.password").val();

            var user = new StackMob.User({ username: username,
                                          password:  pw });

            user.login(true,{
                success: function(data) {
                    console.log(data);
                },
                error: function(error) {
                    console.log(error);
                }
            });

            return this;
        },

        status:function (e) {
            e.preventDefault();

            console.log(StackMob.isLoggedIn());

            return this;
        },

        logout:function (e) {
            e.preventDefault();

            var user = new StackMob.User();
            user.logout({
                success: function() {
                    console.log("logout success");
                },
                error: function(error) {
                    console.log(error);
                }
            });

            return this;
        }
    });

    return SignUpView;
});