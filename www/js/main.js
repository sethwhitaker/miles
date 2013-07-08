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

  set: function (attrs, options) {
    Backbone.Model.prototype.set.call(this, attrs, options);
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

  initialize: function () {
    //this.model.on('destroy', this.remove, this);
  },

  render: function () {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }

});

milers.Views.LogView = Backbone.View.extend({

  el: '#log',

  initialize: function () {
    this.collection.on('add', this.onColorAdded, this);
  },

  render: function () {
    this.collection.each(function (workout) { this.onWorkoutAdded(workout); }, this);
    return this;
  },
  onWorkoutAdded: function (workout) {
    var view = new milers.Views.WorkoutView({model: workout});
    this.$el.append(view.render().el);
  }
});

milers.Views.ApplicationView = Backbone.View.extend({

  views: {},

  initialize: function () {
    this.collection = new milers.Collections.WorkoutsCollection();
    this.collection.on('reset', this.createViews, this);
    this.collection.fetch();
  },

  createViews: function () {
    console.log("INIT");

    var V = milers.Views,
      opts = {collection: this.collection};

    // Only create the views on the initial fetch
    this.collection.off('reset', this.createViews, this);

    // Storing references to the views in case we want
    // to do something with them later.
    this.views.workoutlog = (new V.LogView(opts)).render();

    this.render();
  },

  render: function () {
    $(this.el).fadeIn('slow');
    return this;
  }

});
$(document).ready(function(){
  milers.init();
});


    // var LogView = Backbone.View.extend({
    //   el: $("#log"),
    //    initialize: function () {
    //     this.collection = new Log(workouts);
    //     this.render();
    //   },
    //    render: function () {
    //     this.$el.find('div.workout').remove();
    //     var that = this;
    //     _.each(this.collection.models, function (item) {
    //       that.renderWorkout(item);
    //     }, this);
    //   },
    //   renderWorkout: function (item) {
    //     var workoutView = new WorkoutView({
    //       model: item
    //     });
    //     $(this.el).append(workoutView.render().el);
    //   }
    // });


