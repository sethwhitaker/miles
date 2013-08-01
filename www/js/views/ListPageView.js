define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/ListPageTemplate.html',
  'views/ApplicationView'
], function($, _, Backbone, ListPageTemplate, ApplicationView ){

  var ListPageView = Backbone.View.extend({
    //el: $("#main"),
    template : _.template(ListPageTemplate),
    initialize: function () {
      this.collection = new WorkoutsCollection();
      this.collection.on('sync', this.render, this);
      this.collection.fetch();
    },
    render: function(){

      // $('.menu li').removeClass('active');
      // $('.menu li a[href="#"]').parent().addClass('active');
      this.$el.html(this.template);

      this.createViews();
      return this;
    },
    createViews:function(argument) {
      var opts = {collection: this.collection};

      // Only create the views on the initial fetch
      this.collection.off('sync', this.createViews, this);

      // Storing references to the views in case we want
      // to do something with them later.
      this.workoutlog = new LogView(opts);
    }


  });

  return ListPageView;

});