define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/WorkoutStatsTemplate.html'
], function($, _, Backbone, WorkoutStatsTemplate){

  var StatsView = Backbone.View.extend({
    el: '#workout-stats',
    template: _.template(WorkoutStatsTemplate),
    initialize:function(){
      this.collection.on('add', this.render, this);
      this.collection.on('remove', this.render, this);
      this.collection.on('change', this.render, this);
      this.render();
    },
    render : function (){
      var data = this.collection.getStats();
      this.$el.html(this.template(data));
      return this;
    }
  });
  return StatsView;
});
