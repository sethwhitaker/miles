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

milers.timing = {

  isHMSTime:function(theTime){
    var regExp = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g;
    var valid = (theTime.match(regExp)) ? true:false;
    return valid;
  },
  convertToHMS : function(time){
    time = Number(time);
    var h = Math.floor(time / 3600);
    var m = Math.floor(time % 3600 / 60);
    var s = Math.floor(time % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "00:") + (s < 10 ? "0" : "") + s);

    // var t = moment.duration(time, 'seconds');
    // var hu = moment.duration(time, 'seconds').humanize();
    // h = t.hours();
    // m = t.minutes();
    // s = t.seconds();
    //return moment.seconds(time).format("h:mm:ss");
  },
  convertToMilliseconds:function(hms){
    var a = hms.split(':');
    var n = a.length; // number of array items
    var ms = 0; // milliseconds result
    if (n > 0)
    {
      var b = a[n-1].split('.');
      if (b.length > 1)
      {
        var m = b[1];
        while (m.length < 3) m += '0'; // ensure we deal with thousands
        ms += m - 0; // ensure we deal with numbers
      }
      ms += b[0] * 1000;
      if (n > 1) // minutes
      {
        ms += a[n-2] * 60 * 1000;

        if (n > 2) // hours
        {
          ms += a[n-3] * 60 * 60 * 1000;
        }
      }
    }
    return ms;
    //console.log(moment.duration(hms).asMilliseconds());
    //return moment.duration(hms).asMilliseconds();
  },
  getPace:function(time, miles){
    var sec =  this.convertToSeconds(time)/miles; //seconds/mile
    pace = this.convertToHMS(sec);
    return pace;
  },
  convertToSeconds : function(milliseconds){
    return milliseconds/1000;
  }
};

milers.Models.WorkoutModel = Backbone.Model.extend({

  idAttribute: '_id',

  defaults: {
    location: "Location",
    date: "Date",
    time: "",
    milliseconds: 0,
    distance: 0
  },
  initialize: function(){
    this.on("change", function() {
      console.log("CHANGE EVENT");
      if (this.hasChanged("location")) {
        console.log("location changed");
      }
    });
  },
  getTitle: function(){
    return this.get("location") + " "+ this.get("distance") + " miler";
  },
  validate: function(attrs, options) {
    console.log(attrs);

    // if (!$.isNumeric(attrs.time)) {
    //   return "time is not a number";
    // }
    // if (!$.isNumeric(attrs.distance)) {
    //   return "Distance is not a number";
    // }
    // if(!this.isTime(attrs.time)){
    //   console.log("not valid");
    //   return "Not a Valid Time";
    // }
  }
});
milers.Collections.WorkoutsCollection = Backbone.Collection.extend({

  url: '../data/data.json',
  model: milers.Models.WorkoutModel

});

milers.Views.WorkoutView = Backbone.View.extend({
  tagName: "div",
  className: "workout",
  readTemplate: _.template($("#workoutTemplate").html()),
  editTemplate: _.template($("#workoutEditTemplate").html()),
  template: "",

  events:{
    'click .delete' : 'deleteWorkout',
    'click .edit'   : 'editWorkout',
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
    data.pace = milers.timing.getPace(data.milliseconds, data.distance);
    this.$el.html(this.template(data));
    return this;
  },

  editWorkout:function(e){
    e.preventDefault();
    this.template = this.editTemplate;
    this.render();
  },
  deleteWorkout:function(e){
    e.preventDefault();
    var _this = this;
    this.$el.css('backgroundColor','rgba(255,0,0,0.5)').fadeOut('slow',function(){
      _this.model.destroy();
      _this.remove();
    });
  },
  onUpdate : function(e){
    e.preventDefault();
    this.model.set({
      location: this.$el.find('input[name="location"]').val(),
      date: this.$el.find('input[name="date"]').val(),
      time: this.$el.find('input[name="time"]').val(),
      milliseconds: milers.timing.convertToMilliseconds(this.$el.find('input[name="time"]').val()),
      distance: this.$el.find('input[name="distance"]').val()
    });
    if (!this.model.isValid()) {
      console.log(this.model.get("time") + " - " + this.model.validationError);
    }else{
      this.template = this.readTemplate;
      this.render();
    }
  },
  onCancel:function(e){
    e.preventDefault();
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
    this.$el.prepend(view.render().el);
  }
});

milers.Views.AddWorkoutView = Backbone.View.extend({
  el: '#addworkout',
  template: _.template($("#workoutAddTemplate").html()),
  events: {
    'submit #addForm' : 'onSubmit'
  },
  initialize: function () {
    this.render();
  },
  render: function () {
    this.$el.html(this.template({
      location : "",
      date: "",
      time:"",
      distance:"",
      add:true,
      edit:false
    }));
    return this;
  },
  onSubmit : function(e){
    e.preventDefault();
    var model = new milers.Models.WorkoutModel({
      location: this.$el.find('input[name="location"]').val(),
      date: this.$el.find('input[name="date"]').val(),
      time: this.$el.find('input[name="time"]').val(),
      milliseconds: milers.timing.convertToMilliseconds(this.$el.find('input[name="time"]').val()),
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

    //$('.nav-add-workout').on('click', this.showAddForm);
    //$('.cancel-add-workout').on('click', this.hideAddForm);
  },
  showAddForm : function(e){
    e.preventDefault();
    $("#add-workout-container").slideDown('slow');
  },
  hideAddForm : function(e){
    e.preventDefault();
    $("#add-workout-container").slideUp('slow');
  },
  createViews: function () {

    var V = milers.Views,
      opts = {collection: this.collection};

    // Only create the views on the initial fetch
    this.collection.off('sync', this.createViews, this);

    // Storing references to the views in case we want
    // to do something with them later.
    this.views.addWorkoutView = (new V.AddWorkoutView(opts));
    this.views.workoutlog = (new V.LogView(opts));
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