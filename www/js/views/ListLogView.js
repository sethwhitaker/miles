define([
  'jquery',
  'underscore',
  'backbone',
  'collections/WorkoutsCollection',
  'views/ListWorkoutView'
], function($, _, Backbone, WorkoutsCollection, ListWorkoutView){

  var ListLogView = Backbone.View.extend({

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
      var view = new ListWorkoutView({model: model, collection:this.collection});
      this.$el.prepend(view.render().el);
    }
  });
  return ListLogView;
});
