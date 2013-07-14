window.miler = {

  app: _.extend({}, Backbone.Events),

  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  init: function() {
    new miler.Views.ApplicationView({el: '#main'});
    //new miler.Routers.MainRouter();
    //Backbone.history.start({pushState: true});
  }
};

miler.util={
  getFormValues:function(el){
    var formData =  {
      location: el.find('input[name="location"]').val(),
      date: el.find('input[name="date"]').val(),
      time: el.find('input[name="time"]').val(),
      milliseconds: this.convertToMilliseconds(el.find('input[name="time"]').val()),
      distance: parseFloat(el.find('input[name="distance"]').val())
    };
    return formData;
  },
  //TIMING FUNCTIONS
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
  },
  convertToSeconds : function(milliseconds){
    return milliseconds/1000;
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
  },
  getTotalWorkouts : function(collection){
    return collection.length;
  },
  getTotalDistance : function(collection){
    var dist = 0;
    _.each(collection.pluck("distance"), function(item){
      dist = dist + item;
    });
    return Math.round(dist*10)/10;
  },
  getTotalTime : function(collection){
    var time = 0;
    _.each(collection.pluck("milliseconds"), function(item){
      time = time + item;
    });
    return time;
  },
  getTotalTimeFormatted : function(collection){
    return this.convertToHMS(
      this.convertToSeconds(this.getTotalTime(collection))
    );
  },
  getAveragDistance : function(collection){
    var avg = this.getTotalDistance(collection)/this.getTotalWorkouts(collection);
    return Math.round(avg*10)/10;
  },
  getAverageTime : function(collection){
    var avg = this.getTotalTime(collection)/this.getTotalWorkouts(collection),
    sec = this.convertToSeconds(avg),
    avgFormatted = this.convertToHMS(sec);
    return avgFormatted;
  },
  getPace:function(time, miles){
    var sec =  this.convertToSeconds(time)/miles; //seconds/mile
    pace = this.convertToHMS(sec);
    return pace;
  },
  getAveragePace : function(collection){
    var time = this.getTotalTime(collection);
    var miles = this.getTotalDistance(collection);
    var pace = this.getPace(time, miles);
    return pace;
  }
};

miler.Models.WorkoutModel = Backbone.Model.extend({

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
      if (this.hasChanged("location")) {
        console.log("location changed");
      }
      if (this.hasChanged("date")) {
        console.log("date changed");
      }
      if (this.hasChanged("time")) {
        console.log("time changed");
      }
      if (this.hasChanged("distance")) {
        console.log("distance changed");
      }
    });
  },
  getTitle: function(){
    return this.get("location") + " "+ this.get("distance") + " miler";
  },
  validate: function(attrs, options) {
    /*console.log(attrs);

    if (!$.isNumeric(attrs.time)) {
      return "time is not a number";
    }
    if (!$.isNumeric(attrs.distance)) {
      return "Distance is not a number";
    }
    if(!this.isTime(attrs.time)){
      console.log("not valid");
      return "Not a Valid Time";
    }*/
  }
});

miler.Collections.WorkoutsCollection = Backbone.Collection.extend({
  url: '../data/data.json',
  model: miler.Models.WorkoutModel
});

miler.Views.WorkoutView = Backbone.View.extend({
  tagName: "div",
  className: "workout panel",
  readTemplate: _.template($("#workoutTemplate").html()),
  editTemplate: _.template($("#workoutEditTemplate").html()),
  template: "",

  events:{
    'click .delete' : 'deleteWorkout',
    'click .edit'   : 'editWorkout',
    'click .cancel' : 'onCancel',
    'submit #workoutForm' : 'onUpdate',
  },

  initialize: function () {
    //this.model.on('destroy', this.remove, this);
    this.template = this.readTemplate;
  },

  render: function () {
    var data =  this.model.toJSON();
    data.title = this.model.getTitle();
    data.pace = miler.util.getPace(data.milliseconds, data.distance);
    data.add = false;
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
      miler.app.trigger('workoutDeleted', this.collection);

    });
  },
  onUpdate : function(e){
    e.preventDefault();
    var data = miler.util.getFormValues(this.$el);
    this.model.set(this.model.set(data));
    if (!this.model.isValid()) {
      console.log(this.model.get("time") + " - " + this.model.validationError);
    }else{
      this.template = this.readTemplate;
      this.render();
      miler.app.trigger('workoutUpdated', this.collection);
    }
  },
  onCancel:function(e){
    e.preventDefault();
    this.template = this.readTemplate;
    this.render();
  }
});

miler.Views.LogView = Backbone.View.extend({

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
    var view = new miler.Views.WorkoutView({model: model, collection:this.collection});
    this.$el.prepend(view.render().el);
     miler.app.trigger('workoutAdded', this.collection);

  }
});

miler.Views.AddWorkoutView = Backbone.View.extend({
  el: '#addworkout',
  template: _.template($("#workoutEditTemplate").html()),
  events: {
    'submit #workoutForm' : 'onSubmit'
  },
  initialize: function () {
    this.render();
  },
  render: function () {
    this.$el.html(this.template({
      title: "",
      location : "",
      date: "",
      time:"",
      distance:"",
      add:true
    }));
    return this;
  },
  onSubmit : function(e){
    e.preventDefault();
    var data = miler.util.getFormValues(this.$el),
    model = new miler.Models.WorkoutModel(data);

    if (!model.isValid()) {
      console.log(model.get("time") + " - " + model.validationError);
    }else{
      this.collection.add(model);
      this.render();
      $(".add-workout-container .add-workout").slideUp();
    }
  }
});

miler.Views.StatsView = Backbone.View.extend({
  el: '#workout-stats',
  template: _.template($("#workoutStatsTemplate").html()),
  initialize:function(){
    miler.app.on('workoutAdded', this.render, this);
    miler.app.on('workoutUpdated', this.render, this);
    miler.app.on('workoutDeleted', this.render, this);
    this.render();
  },
  // getTotalWorkouts : function(){
  //   return this.collection.length;
  // },
  // getTotalDistance : function(){
  //   var dist = 0;
  //   _.each(this.collection.pluck("distance"), function(item){
  //     dist = dist + item;
  //   });
  //   return Math.round(dist*10)/10;
  // },
  // getAveragDistance : function(){
  //   var avg = this.getTotalDistance()/this.getTotalWorkouts();
  //   return Math.round(avg*10)/10;
  // },
  // getTotalTime : function(){
  //   var time = 0;
  //   _.each(this.collection.pluck("milliseconds"), function(item){
  //     time = time + item;
  //   });
  //   return time;
  // },
  // getTotalTimeFormatted : function(){
  //   return miler.util.convertToHMS(
  //     miler.util.convertToSeconds(this.getTotalTime())
  //   );
  // },
  // getAverageTime : function(){
  //   var avg = this.getTotalTime()/this.getTotalWorkouts(),
  //   sec = miler.util.convertToSeconds(avg),
  //   avgFormatted = miler.util.convertToHMS(sec);
  //   return avgFormatted;
  // },
  // getAveragePace : function(){
  //   var time = this.getTotalTime();
  //   var miles = this.getTotalDistance();
  //   var pace = miler.util.getPace(time, miles);
  //   return pace;
  // },
  updateStats: function(){
    var stats = {
      totalWorkouts : miler.util.getTotalWorkouts(this.collection),
      totalDistance : miler.util.getTotalDistance(this.collection),
      totalTime : miler.util.getTotalTimeFormatted(this.collection),
      avgDistance : miler.util.getAveragDistance(this.collection),
      avgTime : miler.util.getAverageTime(this.collection),
      avgPace : miler.util.getAveragePace(this.collection)
    };
    return stats;
  },
  render : function (){
    var data = this.updateStats();
    this.$el.html(this.template(data));
    return this;
  }
});

miler.Views.ApplicationView = Backbone.View.extend({

  views: {},

  initialize: function () {

    this.collection = new miler.Collections.WorkoutsCollection();
    this.collection.on('sync', this.createViews, this);

    this.collection.fetch();

    $('.add-workout-link').on('click', this.showAddForm);
    $('.cancel-add-workout').on('click', this.hideAddForm);
  },
  showAddForm : function(e){
    e.preventDefault();
    $(".add-workout-container .add-workout").slideDown();
  },
  hideAddForm : function(e){
    e.preventDefault();
    $(".add-workout-container .add-workout").slideUp();
  },
  createViews: function () {

    var V = miler.Views,
      opts = {collection: this.collection};

    // Only create the views on the initial fetch
    this.collection.off('sync', this.createViews, this);

    // Storing references to the views in case we want
    // to do something with them later.
    this.views.addWorkoutView = (new V.AddWorkoutView(opts));
    this.views.workoutlog = (new V.LogView(opts));
    this.views.workoutStats = (new V.StatsView(opts));
    this.render();
  },
  render: function () {
    this.$el.fadeIn('slow');
    return this;
  }

});

/* miler.Routers.MainRouter = Backbone.Router.extend({

  routes: {
    "list":                 "list"   // #help
   "search/:query":        "search",  // #search/kiwis
    "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  list: function() {
  console.log("LIST ROUTE");
  }
}); */

$(document).ready(function(){
  miler.init();
});