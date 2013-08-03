define([
    'jquery',
    'underscore',
    'backbone',
    'stackmobinit',
    'text!templates/wine/wineTemplate.html'
], function($, _, Backbone, StackMob, wineTemplate){

    // Define a Wine View
    var WineView = Backbone.View.extend({
        tagName: 'li',

        initialize: function() {
            // Set template for this view once
            this.template = _.template(wineTemplate);

        },

        render: function() {
            // Clear out any old DOM elements there may be
            this.$el.empty();

            // Render template with model then append to DOM
            this.$el.append( this.template(this.model.toJSON()) );

            return this;
        }
    });

    return WineView;
});