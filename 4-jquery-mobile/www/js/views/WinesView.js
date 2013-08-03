define([
    'jquery',
    'underscore',
    'backbone',
    'stackmobinit',
    'views/WineView'
], function($, _, Backbone, StackMob, WineView){

    // Define a Wines View
    var WinesView = Backbone.View.extend({
        tagName: 'ul',
        attributes: {
            "data-role": "listview",
            "data-inset": "true"
        },

        // Add class for Bootstrap styles
        className: "nav nav-list",

        initialize: function() {
            // Trigger a render when this collection changes
            this.collection.on('all', this.render, this);

        },

        render: function() {
            // Clear out any old DOM elements there may be
            this.$el.empty();

            // Save reference for use inside loop
            var _this = this;

            // Iterate over all wines in the collection
            this.collection.each(function(item) {

                // And append a Wine view for each.
                _this.$el.append( new WineView({ model: item }).render().$el );

            });

            return this;
        }
    });

    return WinesView;
});