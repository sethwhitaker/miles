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
    var data =  this.model.toJSON();
    data.title = this.model.getTitle();
    this.$el.html(this.template(data));
    return this;
  }

});

milers.Views.LogView = Backbone.View.extend({

  el: '#log',

  initialize: function () {
    this.collection.on('add', this.render, this);
  },
  render: function () {
    this.collection.each(function (workout) {
      var view = new milers.Views.WorkoutView({model: workout});
      this.$el.append(view.render().el);
    }, this);
    return this;
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