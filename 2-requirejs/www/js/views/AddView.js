define([
    'jquery',
    'underscore',
    'backbone',
    'stackmobinit',
    'models/WineModel',
    'text!templates/wine/wineDetailTemplate.html'
], function($, _, Backbone, StackMob, Wine, wineDetailTemplate){

    // Define an Add View
    var AddView = Backbone.View.extend({

        events: {
            "click #save-wine": "save",
            "submit form":      "save"
        },

        initialize: function() {
            this.template = _.template(wineDetailTemplate);

            // Attach router
            this.router = this.options.router;

            // Set model for default values
            this.model = new Wine();

        },

        save: function(ev) {
            // Prevent normal link actions
            ev.preventDefault();

            // Save reference to this for use inside callback
            var _this = this;

            // Create a new wine instance with value
            // from the input box
            var wine = new Wine({
                winery: this.$('#wine-winery').val(),
                type: $('#wine-type').val(),
                size: $('#wine-size').val()
            });

            wine.create({
                success: function(model, result, options){
                    // Add it to our collection
                    _this.collection.add(wine);

                    // Clear the input box
                    _this.$('#wine-winery').val('');
                    _this.$('#wine-type').val('');
                    _this.$('#wine-size').val('');

                    // Go back to the home page
                    _this.router.navigate("home", true);
                },
                error: function(model, response, options){
                    console.log(response);
                }
            });

            return this;
        },

        render: function() {
            this.$el.empty();
            this.$el.append( this.template(this.model.toJSON()) );

            return this;
        }
    });

    return AddView;
});