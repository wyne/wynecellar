define([
  'stackmobinit'
], function(StackMob){
    // Define Wine Model
    var Wine = StackMob.Model.extend({
        schemaName: "wine",
        defaults: {
            winery: "",
            type:   "",
            size:   ""
        }
    });

    return Wine;
});