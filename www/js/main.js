window.milers = {

  app: _.extend({}, Backbone.Events),

  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  init: function() {
    new milers.Views.ApplicationView({el: '#main'});
  }
};


milers.Models.WorkoutModel = Backbone.Model.extend({

  idAttribute: '_id',

  defaults: {
    location: "Location",
    date: "Date",
    time: 0,
    distance: 0
  },
  getTitle: function(){
    return this.get("location") + " "+ this.get("distance") + " miler";
  },
  validate: function(attrs, options) {
    //console.log("validate");
   // console.log(attrs);
    if (!$.isNumeric(attrs.time)) {
      return "time is not a number";
    }
    if (!$.isNumeric(attrs.distance)) {
      return "Distance is not a number";
    }
  }

});
milers.Collections.WorkoutsCollection = Backbone.Collection.extend({

  url: '../data/data.json',
  model: milers.Models.WorkoutModel

});
milers.Views.WorkoutView = Backbone.View.extend({
  tagName: "tr",
  className: "wkout",
  template: _.template($("#workoutTemplate").html()),

  events:{
    'click .delete': 'deleteWorkout'
  },

  initialize: function () {
    //this.model.on('destroy', this.remove, this);
  },

  render: function () {
    var data =  this.model.toJSON();
    data.title = this.model.getTitle();
    this.$el.html(this.template(data));
    return this;
  },
  deleteWorkout:function(){
    //console.log("delete");
    this.model.destroy();
    this.remove();
  }

});

milers.Views.LogView = Backbone.View.extend({

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
    var view = new milers.Views.WorkoutView({model: model, collection:this.collection});
    this.$el.append(view.render().el);
  }
});

milers.Views.AddWorkoutView = Backbone.View.extend({
  el: '#addworkout',
  events: {
    'click #submit' : 'onSubmit'
  },

  initialize: function () {

  },
  render: function () {

  },
  onSubmit : function(){
    var model = new milers.Models.WorkoutModel({
      location: $('input[name="location"]').val(),
      date: $('input[name="date"]').val(),
      time: $('input[name="time"]').val(),
      distance: $('input[name="distance"]').val()
    });
    if (!model.isValid()) {
      console.log(model.get("time") + " - " + model.validationError);
    }else{
      this.collection.add(model);
    }


  }
});

milers.Views.ApplicationView = Backbone.View.extend({

  views: {},

  initialize: function () {

    this.collection = new milers.Collections.WorkoutsCollection();
    this.collection.on('sync', this.createViews, this);
    this.collection.fetch();
  },

  createViews: function () {

    var V = milers.Views,
      opts = {collection: this.collection};

    // Only create the views on the initial fetch
    this.collection.off('sync', this.createViews, this);

    this.views.addWorkoutView = (new V.AddWorkoutView(opts)).render();
    // Storing references to the views in case we want
    // to do something with them later.
    this.views.workoutlog = (new V.LogView(opts)).render();
    this.render();
  },

  render: function () {
    this.$el.fadeIn('slow');
    return this;
  }

});
$(document).ready(function(){
  milers.init();
});