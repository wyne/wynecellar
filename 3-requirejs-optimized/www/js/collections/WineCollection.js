define([
  'stackmobinit',
  'models/WineModel'
], function(StackMob, Wine){
    // Define Wines Collection
    var Wines = StackMob.Collection.extend({
        model: Wine
    });

    return Wines;
});