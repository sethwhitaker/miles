define([
  'jquery',
  'underscore',
  'backbone',
  'models/WorkoutModel',
  'text!templates/WorkoutEditTemplate.html',
  'utils/miles.utils',
  'events/Channel'
], function($, _, Backbone, WorkoutModel, WorkoutEditTemplate,  milesUtil, EventsChannel){

  var WorkoutFormView = Backbone.View.extend({
    //el: '#addworkout',
    drawer : $(".add-workout-container .add-workout"),
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
        EventsChannel.trigger('formSubmit');
      }
    }
  });
  return WorkoutFormView;

});