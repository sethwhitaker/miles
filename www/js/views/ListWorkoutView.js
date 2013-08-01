define([
  'jquery',
  'underscore',
  'backbone',
  'collections/WorkoutsCollection',
  'text!templates/ListWorkoutTemplate.html',
  'utils/miles.utils'
], function($, _, Backbone, WorkoutsCollection, ListWorkoutTemplate,  milesUtil){

  var ListWorkoutView = Backbone.View.extend({
    tagName: "div",
    className: "workout panel",
    template: _.template(ListWorkoutTemplate),
    initialize: function () {
    },
    render: function () {
      var data =  this.model.toJSON();
      data.title = this.model.getTitle();
      data.pace = milesUtil.getPace(data.milliseconds, data.distance);
      data.add = false;
      this.$el.html(this.template(data));
      return this;
    }
  });
  return ListWorkoutView;
});
