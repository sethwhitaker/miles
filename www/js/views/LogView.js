define([
  'jquery',
  'underscore',
  'backbone',
  'collections/WorkoutsCollection',
  'views/WorkoutView'
], function($, _, Backbone, WorkoutsCollection, WorkoutView){
  
  var LogView = Backbone.View.extend({

    el: '#log',

    initialize: function () {
      //this.collection.on('sync', this.addAll, this);
      this.collection.on('add', this.addOne, this);
      this.addAll();
    },
    addAll: function () {
      this.$el.html('');
      this.collection.each(function (workout) {
        this.addOne(workout);
      }, this);
      return this;
    },
    addOne : function(model){
      var view = new WorkoutView({model: model, collection:this.collection});
      this.$el.prepend(view.render().el);
    }
  });
  return LogView;
});
