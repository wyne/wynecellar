define([
  'jquery',
  'underscore', 
  'backbone',
  'stackmobinit'
], function($,_,Backbone,StackMob) {

  var Model = StackMob.Model.extend({
      schemaName: "wine"
 	});

  return Model;

});

