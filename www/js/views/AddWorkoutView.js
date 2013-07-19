define([
  'jquery',
  'underscore',
  'backbone',
  'models/WorkoutModel',
  'collections/WorkoutsCollection',
  'views/WorkoutFormView',
  'text!templates/AddWorkoutTemplate.html',
  'utils/miles.utils',
  'events/Channel'
], function($, _, Backbone, WorkoutModel, WorkoutsCollection, WorkoutFormView,AddWorkoutTemplate, milesUtil, EventsChannel){

  var AddWorkoutView = Backbone.View.extend({
    el: '#addWorkoutPanel',
    $drawer :"",
    template: _.template(AddWorkoutTemplate),
    events: {
      'click .add-workout-link' : 'toggleAddForm',
      'click .cancel-add-workout' : 'toggleAddForm'
    },
    initialize: function () {
      this.render();
      var view = new WorkoutFormView({
        el: '#addworkout',
        collection: this.collection
      });

      this.$drawer = this.$el.find(".add-workout-container .add-workout");

      EventsChannel.on('formSubmit', this.togglePanel, this);
    },
    toggleAddForm : function(e){
      e.preventDefault();
      this.togglePanel();
    },
    togglePanel:function(){
      this.$drawer.slideToggle('slow',function(){
        var $icon = $(this).parent().find('.add-workout-link > i');
        $icon.toggleClass('icon-plus');
        $icon.toggleClass('icon-minus');
      });
    },
    render: function () {
      this.$el.html(this.template());
      return this;
    }
  });
  return AddWorkoutView;
});
