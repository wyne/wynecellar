define([
  'jquery',
  'text!templates/home/homeTemplate.html',
  'views/wine/ListView',
  'stackmobinit'
], function($, HomeTemplate, ListView, StackMob){
  
  var MainView = Backbone.View.extend({
      className: "wine",   
      
      initialize: function(options) {
        this.collection = this.options.collection;
      },

      render: function() {
        var     el = this.$el,
        collection = this.collection;
        
        el.append(HomeTemplate);
        el.attr("id","wineView");

        // add Shout List to content area
        var content = el.find(":jqmData(role='content')");
        content.empty();

        var listView = new ListView({collection: collection});
        content.append(listView.render().el);

        return this;
      }

  });

  return MainView;
  
});