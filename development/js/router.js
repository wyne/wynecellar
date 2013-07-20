// Filename: router.js
define([
  'jquery',
  'stackmobinit',
  'libs/app/util',
  'views/wine/MainView',
  'views/wine/DetailView',
  'views/wine/AddView',
  'collections/wine/WineCollection'

], function($, StackMob, Util, WineMainView, WineDetailView, WineAddView,WineCollection) {
  
  var AppRouter = Backbone.Router.extend({
    routes:{
        "":"wine",
        "wine/:reload":"wine",
        "winedetail/:id":"winedetail",
        "wineadd":"wineadd",
    },

    initialize: function(options) {
      this.collection = options.collection;

      // Handle back button throughout the application
      $('.back').live('click', function(event) {
        window.history.back();

        return false;
      });
      this.firstPage = true;
    },

    wine:function(reload) {
      this.changePage(new WineMainView({collection: this.collection}),'wine',null,reload);
    },

    winedetail:function(e) {
      model = this.collection.get(e);
      this.changePage(new WineDetailView({collection: this.collection, model: model}),'winedetail','slide',true);
    },

    wineadd:function(e) {
      this.changePage(new WineAddView({collection: this.collection, router: this}),'wineadd');
    },


    changePage:function (view,className,transition,reload) { 
      // set the transition
      if(transition === 'undefined') {
        var transition = $.mobile.defaultPageTransition;
      }
      
      // We don't want to slide the first page
      if (this.firstPage) {
          transition = 'none';
          this.firstPage = false;
      }

      // Check if the page is already in the DOM
      var page = $("." + className);

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

      // Go to page
      $.mobile.changePage($(page), {changeHash:false, transition: transition, reverse: false});
    }, 

  });
  
  var initialize = function(){
    var wineCollection = new WineCollection();
    wineCollection.fetch({async: false});

    var app_router = new AppRouter({collection: wineCollection});

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});