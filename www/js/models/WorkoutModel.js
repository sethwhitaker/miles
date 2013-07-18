define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  var WorkoutModel = Backbone.Model.extend({

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

    return WorkoutModel;

});
