define([
  'jquery',
  'underscore',
  'backbone',
  'collections/WorkoutsCollection',
  'text!templates/WorkoutTemplate.html',
  'text!templates/WorkoutEditTemplate.html',
  'utils/miles.utils'
], function($, _, Backbone, WorkoutsCollection, WorkoutTemplate, WorkoutEditTemplate, milesUtil){

  var WorkoutView = Backbone.View.extend({
    tagName: "div",
    className: "workout panel",
    readTemplate: _.template(WorkoutTemplate),
    editTemplate: _.template(WorkoutEditTemplate),
    template: "",
    events:{
      'click .delete' : 'deleteWorkout',
      'click .edit'   : 'editWorkout',
      'click .cancel' : 'onCancel',
      'submit #workoutForm' : 'onUpdate'
    },
    initialize: function () {
      this.template = this.readTemplate;
      this.model.on('destroy', this.remove, this);
      this.model.on('change', this.render, this);
      this.on('edit', this.render, this);
      this.on('cancelEdit', this.render, this);
      this.on('update', this.render, this);
    },
    render: function () {
      var data =  this.model.toJSON();
      data.title = this.model.getTitle();
      data.pace = milesUtil.getPace(data.milliseconds, data.distance);
      data.add = false;
      this.$el.html(this.template(data));
      return this;
    },
    editWorkout:function(e){
      e.preventDefault();
      this.template = this.editTemplate;
      this.trigger('edit');
    },
    deleteWorkout:function(e){
      e.preventDefault();
      var _this = this;
      this.$el.css('backgroundColor','rgba(255,0,0,0.5)').fadeOut('slow',function(){
        _this.model.destroy();
      });
    },
    onUpdate : function(e){
      e.preventDefault();
      var data = milesUtil.getFormValues(this.$el);
      this.model.set(data);
      if (this.model.isValid()) {
        this.template = this.readTemplate;
        this.trigger('update');
      }else{
        console.log(this.model.get("time") + " - " + this.model.validationError);
        this.template = this.editTemplate;
      }
    },
    onCancel:function(e){
      e.preventDefault();
      this.template = this.readTemplate;
      this.trigger('cancelEdit');
    }
  });
  return WorkoutView;
});
