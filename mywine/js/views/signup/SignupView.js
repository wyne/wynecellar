define([
  'jquery',
  'underscore', 
  'backbone',
  'stackmob',
  'text!templates/signup/signupTemplate.html',
  'libs/app/util'
], function($,_,Backbone, Stackmob,SignupTemplate,Util){
  
  var SignupView = Backbone.View.extend({
      className: "signup",   
      
      events: {  
        "click #signupBtn": "signup",   
        "change #photo": "saveImage"
      },

      initialize: function() {
         this.collection = this.options.collection;
         this.router = this.options.router;
         this.render();
         this.photoBase64;
      },

      saveImage: function(e) {
        var f = e.target.files[0];
        if (f.type.match('image.*')) {
          
          var reader = new FileReader();
          reader.readAsDataURL(f);

          reader.onload = (function(e) {
            var base64Content = e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length);
            $(".latest img").attr("src", e.target.result).fadeIn();
            $(".latest img").attr("data-base64", base64Content);
            $(".latest img").attr("data-name", f.name);
            $(".latest img").attr("data-type", f.type);

          });
        } else {
          console.log("not valid image handle exception");
        }
        
        return this;
      },

      render: function() {
        var el = this.$el;

        el.empty();
        el.append(SignupTemplate);
        el.attr("data-role","dialog");
        el.attr("data-theme","b");

        return this;
      },

      signup: function(e) {
        var collection = this.collection,
                  item = $('#signupForm').serializeObject(),
                router = this.router,
                    el = this.$el;
                 
        e.preventDefault();
        
        if (item.username === ''){
          
        } else if (item.password === ''){
          
        } else {
          $('#signupBtn').addClass('disabled');
          $('#signupBtn').attr('disabled',true);

          var user = new StackMob.User(item);
          var base64Content = $(".latest img").attr("data-base64");
          var fileName = $(".latest img").attr("data-name");
          var fileType = $(".latest img").attr("data-type");
          
          if(fileName !== undefined) {
            user.setBinaryFile("pic", fileName, fileType, base64Content);
          }
          
          $.mobile.loading( 'show', {
            text: "Signing Up!",
            textVisible: true,
            theme: "b"
          });

          user.create({
            success: function(model){
              
              var user = new StackMob.User(model.toJSON());
                user.login(false,{
                  success: function(model){
                    $.mobile.loading('hide');
                    $('input.usernameSignup').val('');
                    $('input.passwordSignup').val('');
                    $('input.imagePickerSignup').val('');
                    $('.latest img').attr('src','');
                    router.navigate("#wineadd", {trigger: true}); 
                  },
                  error: function(error){
                    $.mobile.loading('hide');
                  }
                });  

            },
            error: function(error){
                $('#signupBtn').removeClass('disabled');
                $('#signupBtn').attr('disabled',false);
                $.mobile.loading('hide');

                var content = el.find(":jqmData(role='content')");
                content.prepend("<h5 align='center'>" + error.error_description + "</h5");
            }
          }); 
        }
        
        return this;
      }
    });

  return SignupView;
  
});