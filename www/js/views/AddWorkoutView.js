define([
  'jquery',
  'underscore',
  'backbone',
  'models/WorkoutModel',
  'collections/WorkoutsCollection',
  'text!templates/WorkoutTemplate.html',
  'text!templates/WorkoutEditTemplate.html',
  'utils/miles.utils'
], function($, _, Backbone, WorkoutModel, WorkoutsCollection, WorkoutTemplate, WorkoutEditTemplate, milesUtil){


  var AddWorkoutView = Backbone.View.extend({
    el: '#addworkout',
    template: _.template(WorkoutEditTemplate),
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
      var data = milesUtil.getFormValues(this.$el),
      model = new WorkoutModel(data);

      if (!model.isValid()) {
        console.log(model.get("time") + " - " + model.validationError);
      }else{
        this.collection.add(model);
        this.render();
        $(".add-workout-container .add-workout").slideUp();
      }
    }
  });
  return AddWorkoutView;
});
