define([
  'jquery',
  'text!templates/wine/detailTemplate.html',
  'views/home/BackButtonView',
  'libs/app/util',
  'stackmobinit'
], function($, DetailTemplate, BackButtonView, Util, StackMob){
  
  var DetailView = Backbone.View.extend({
      className: "winedetail",   
      
      events: {   
        "click .logout": "logout"
      },

      initialize: function(options) {
        this.collection = this.options.collection;
        this.model = this.options.model;
        this.template = _.template(DetailTemplate);
      },

      render: function() {
        var el = this.$el,
        template = this.template;
        model = this.model;
     
        el.append(template(this.model.toJSON()));
        el.attr("id","wineDetailView");
        
        var header = $(el).find(":jqmData(role='header')");
        var backButtonView = new BackButtonView();
        
        backButtonView.$el.attr("class","ui-btn-left");
        header.append(backButtonView.el);
        return this;
      },

      logout: function(e) {
        Util(this.$el).setLoginLogoutButton(this.$el,"wine");
        return this;
      }

  });

  return DetailView;
  
});