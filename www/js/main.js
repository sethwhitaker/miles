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
  readTemplate: _.template($("#workoutTemplate").html()),
  editTemplate: _.template($("#workoutEditTemplate").html()),
  template: "",

  events:{
    'click .delete': 'deleteWorkout',
    'click .edit': 'editWorkout',
    'click .update' : 'onUpdate',
    'click .cancel' : 'onCancel'
  },

  initialize: function () {
    //this.model.on('destroy', this.remove, this);
    this.template = this.readTemplate;
  },

  render: function () {
    var data =  this.model.toJSON();
    data.title = this.model.getTitle();
    data.edit = true;
    data.add = false;
    this.$el.html(this.template(data));
    return this;
  },
  editWorkout:function(){
    this.template = this.editTemplate;
    this.render();
  },
  deleteWorkout:function(){
    this.model.destroy();
    this.remove();
  },
  onUpdate : function(){
    this.model.set({
      location: this.$el.find('input[name="location"]').val(),
      date: this.$el.find('input[name="date"]').val(),
      time: this.$el.find('input[name="time"]').val(),
      distance: this.$el.find('input[name="distance"]').val()
    });
    if (!this.model.isValid()) {
      console.log(this.model.get("time") + " - " + this.model.validationError);
    }else{
      this.template = this.readTemplate;
      this.render();
    }
  },
  onCancel:function(){
    this.template = this.readTemplate;
    this.render();
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
  template: _.template($("#workoutEditTemplate").html()),
  events: {
    'click .add' : 'onSubmit'

  },

  initialize: function () {

  },
  render: function () {
    data = {
      title : "Add New Workout",
      location : "",
      date: "",
      time:"",
      distance:"",
      add:true,
      edit:false
    };
    this.$el.html(this.template(data));
    return this;
  },
  onSubmit : function(){
    var model = new milers.Models.WorkoutModel({
      location: this.$el.find('input[name="location"]').val(),
      date: this.$el.find('input[name="date"]').val(),
      time: this.$el.find('input[name="time"]').val(),
      distance: this.$el.find('input[name="distance"]').val()
    });
    if (!model.isValid()) {
      console.log(model.get("time") + " - " + model.validationError);
    }else{
      this.collection.add(model);
      this.render();
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