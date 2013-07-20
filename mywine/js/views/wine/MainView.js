define([
  'jquery',
  'text!templates/home/homeTemplate.html',
  'views/wine/ListView',
  'views/home/LogoutButtonView',
  'views/home/LoginButtonView',
  'libs/app/util',
  'stackmobinit'
], function($, HomeTemplate, ListView, LogoutButtonView,LoginButtonView, Util, StackMob){
  
  var MainView = Backbone.View.extend({
      className: "wine",   
      
      events: {   
        "click .logout": "logout"
      },

      initialize: function(options) {
        this.collection = this.options.collection;
      },

      render: function() {
        var     el = this.$el,
        collection = this.collection;
        
        el.append(HomeTemplate);
        el.attr("id","wineView");

        var loginStatus = StackMob.isLoggedIn();
        // Add login/logout button
        if(loginStatus) {
          $('.login').remove();
          var content = el.find(":jqmData(role='header')");
          var logoutView = new LogoutButtonView();
          
          content.append(logoutView.render().el);
        } else {
          var content = el.find(":jqmData(role='header')");
          var loginButton = new LoginButtonView();
          content.append(loginButton.render().el);
        } 

        // add Shout List to content area
        var content = el.find(":jqmData(role='content')");
        content.empty();

        var listView = new ListView({collection: collection});
        content.append(listView.render().el);

        return this;
      },

      logout: function(e) {
        Util(this.$el).setLoginLogoutButton(this.$el,"wine");
        return this;
      }

  });

  return MainView;
  
});