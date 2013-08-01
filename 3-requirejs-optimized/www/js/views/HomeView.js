define([
    'jquery',
    'underscore',
    'backbone',
    'stackmobinit',
    'views/WinesView',
    'text!templates/filterTemplate.html'
], function($, _, Backbone, StackMob, WinesView, filterTemplate){

    // Define the Home View
    var HomeView = Backbone.View.extend({
        events: {
            "change .type": "filter",
            "change .size": "filter"
        },

        initialize: function() {
            this.collection = this.options.collection;
            this.template = _.template(filterTemplate);
        },

        render: function() {
            this.$el.empty();

            // Append filter template
            this.$el.append(this.template());

            // Get Wines template with current collection
            winesView = new WinesView({ collection: this.collection });

            // Append it to the DOM
            this.$el.append( winesView.render().el );

            return this;
        },

        filter: function(e) {
            var collection = this.collection;
            e.preventDefault();

            var type = $("#filterForm select.type").val();
            var size = $("#filterForm select.size").val();

            var q = new StackMob.Collection.Query();

            if (type !== "") {
                q.equals('type', type);
            }

            if (size !== "") {
                q.equals('size',size);
            }

            collection.query(q ,{
                success: function(collection){
                    console.log(collection.toJSON());
                }
            });
        }

    });

    return HomeView;
});