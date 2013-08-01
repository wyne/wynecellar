define([
    'jquery',
    'underscore',
    'backbone',
    'stackmobinit',
    'text!templates/wine/wineDetailTemplate.html'
], function($, _, Backbone, StackMob, wineDetailTemplate){

    // Define Update View
    var UpdateView = Backbone.View.extend({

        events: {
            "click #save-wine": "save",
            "submit form":      "save"
        },

        initialize: function() {
            this.template = _.template(wineDetailTemplate);

            // Attach router
            this.router = this.options.router;

        },

        save: function(e) {
            // Save reference to this for use inside callback
            var _this = this;

            // Prevent normal form/link actions
            e.preventDefault();

            // Persist changes to server
            this.model.save({
                winery: $('#wine-winery').val(),
                type: $('#wine-type').val(),
                size: $('#wine-size').val()
            }, {
                success: function(model){
                    _this.router.navigate('#', true);
                }
            });
        },

        render: function() {
            this.$el.empty();
            this.$el.append( this.template(this.model.toJSON()) );

            this.$("#wine-type").val(this.model.get('type'));
            this.$("#wine-size").val(this.model.get('size'));

            return this;
        }
    });

    return UpdateView;

});