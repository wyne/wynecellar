define(["jquery","underscore","backbone","stackmobinit","text!templates/wine/wineDetailTemplate.html"],function(e,t,n,r,i){var s=n.View.extend({events:{"click #save-wine":"save","submit form":"save"},initialize:function(){this.template=t.template(i),this.router=this.options.router},save:function(t){var n=this;t.preventDefault(),this.model.save({winery:e("#wine-winery").val(),type:e("#wine-type").val(),size:e("#wine-size").val()},{success:function(e){n.router.navigate("#",!0)}})},render:function(){return this.$el.empty(),this.$el.append(this.template(this.model.toJSON())),this.$("#wine-type").val(this.model.get("type")),this.$("#wine-size").val(this.model.get("size")),this}});return s});