define([
    'jquery',
    'jquery.mobile',
    'backbone',
    'stackmobinit',
    'views/HomeView',
    'views/Addview',
    'views/UpdateView',
    'views/SignUpView',
    'collections/WineCollection'
], function($, jqm, Backbone, StackMob, HomeView, AddView, UpdateView, SignUpView, Wines) {

    // Define the Router
    var Router = Backbone.Router.extend({
        routes: {
            "(home)":       "home",
            "add":          "add",
            "update/:id":   "update",
            "signup":       "signup"
        },

        initialize:function(options) {
            this.collection = options.collection;
        },

        home: function () {
            this.changePage( new HomeView({ collection : this.collection }) );
        },

        add: function () {
            this.changePage( new AddView({ collection : this.collection, router : this }) );
        },

        update: function (e) {
            var model = this.collection.get(e);
            this.changePage( new UpdateView({ model : model, router : this }) );
        },

        signup: function() {
            this.changePage( new SignUpView({ collection : this.collection, router : this }));
        },

        changePage: function (view, reload) {
            // Check if the page is already in the DOM
            var page = $("." + view.className);

            if(reload) {
                page.remove();
                page.html('');
            }
              
            // Page is NOT in the DOM, let's render it
            if (!page.html()){
                view.render();
                $('body').append($(view.el));  
                page = view.el; 
            }

            $.mobile.changePage( $(page), {transition: 'flip'} );
        }
    });

    return {
        initialize: function() {
            // Create instance of Wine Collection
            var wines = new Wines();

            // Add Wine models to the Wines Collection
            wines.fetch({ async: false });

            // Create instance of Router
            var appRouter = new Router({ collection: wines });

            // Route the initial URL and start watching for others
            Backbone.history.start();
        }
    };

});

