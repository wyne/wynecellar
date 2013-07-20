define([
  'jquery',
  'underscore', 
  'backbone',
  'stackmob',
  'models/wine/WineModel',
  'views/home/BackButtonView',
  'text!templates/home/homeTemplate.html',
  'text!templates/wine/addTemplate.html',
  'router',
  'libs/app/util'
], function($,_,Backbone, Stackmob,WineModel, BackButtonView, HomeTemplate, AddTemplate, Router, Util){

  var WineAddView = Backbone.View.extend({
      className: "wineadd",   
      events: {  
        "click #addBtn": "save"
      },

      initialize: function() {
        this.collection = this.options.collection;
        this.router = this.options.router;
        this.template = _.template(AddTemplate);
      },

      render: function() {
        var el = this.$el,
        template = this.template;

        el.append(template());
        el.attr("id","wineAdd");

        var header = $(el).find(":jqmData(role='header')");
        var backButtonView = new BackButtonView();
        
        backButtonView.$el.attr("class","ui-btn-left");
        header.append(backButtonView.el);
          
        return this;
      },

      save: function(e) {
        var collection = this.collection,
                  item = Util('#addForm').serializeObject(),
                router = this.router;        
        
        e.preventDefault();
        var loginStatus = StackMob.isLoggedIn();

        if(!loginStatus) {
            router.navigate("#login", {trigger: true});
        } else {
          
          if(item.winery === ''){
            console.log('error no winery name');
          
          } else {

            $('#addBtn').attr('disabled',true);
           
            var loadingMsg = "Adding to Wine Rack ...";
              $.mobile.loading( 'show', {
              text: loadingMsg,
              textVisible: true,
              theme: "b"
            });  


            var wine = new WineModel(item); 

            wine.create({
                success: function(model){

                  var currentUser = StackMob.LoggedInUserObject;
                  
                  if(currentUser === undefined) {
                    var user = new StackMob.User({username: StackMob.getLoggedInUser()});
                    user.fetch({async:false});
                    currentUser = user.toJSON();
                  }
                  model.set("users", [currentUser]);

                  collection.add(model);

                  model.appendAndSave("users", [StackMob.getLoggedInUser()], {
                    success: function(){
                      $.mobile.loading('hide');
                      $('#addBtn').attr('disabled',false);
                      
                      $('input.winery').val('');
                      $('input.year').val('');
                      $('input.description').val('');

                      router.navigate("#wine/true", {trigger: true});
                   
                    },
                    error: function(error) {
                      console.log(error);
                      $('#addBtn').attr('disabled',false);
                      $.mobile.loading('hide');
                    }
                  });
                                
                },
                error: function(error){
                  console.log(error);
                  $.mobile.loading('hide');
                  $('#addBtn').attr('disabled',false);
                }
            });
          }
        }

        return this;
      }

    });

  return WineAddView;
  
});