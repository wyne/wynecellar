define([
  'jquery',
  'underscore', 
  'backbone',
  'stackmobinit',
  'models/wine/WineModel'
], function($,_,Backbone,StackMob,WineModel){

  var Collection = StackMob.Collection.extend({
 	model: WineModel
  });

  return Collection;

});