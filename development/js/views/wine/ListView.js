define([
  'jquery',
  'underscore', 
  'backbone',
  'stackmob',
  'text!templates/wine/mainTemplate.html'
], function($,_,Backbone, Stackmob, WineTemplate){

  var ListView = Backbone.View.extend({   
      tagName: 'ul',

      initialize: function() {
        this.collection = this.options.collection;
        this.collection.bind('all', this.render,this);
        this.template = _.template(WineTemplate);
      },

      render:function (e) {
        var       el = this.$el,
            template = this.template,
          collection = this.collection;
        
        el.attr("data-role","listview");
        el.attr("data-theme","c");
        el.attr("id","wineListView");
        el.empty();
 
        collection.each(function(model){
            el.append(template(model.toJSON()));
        });

        if(collection.length === 0) {  
          el.append('<li>No Wines</li>');      
        }

        $('#wineListView').listview('refresh');

        return this;
      }

    });

  return ListView;
  
});