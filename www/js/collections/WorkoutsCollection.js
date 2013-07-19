define([
  'underscore',
  'backbone',
  'models/WorkoutModel',
  'utils/miles.utils'
], function(_, Backbone, WorkoutModel, milesUtil){

  var WorkoutsCollection = Backbone.Collection.extend({
      url: '../data/data.json',
      model: WorkoutModel,
      //initialize : function(models, options) {},
      getTotalWorkouts : function(){
        return this.length;
      },
      getTotalDistance : function(){
        var dist = 0;
        _.each(this.pluck("distance"), function(item){
          dist = dist + item;
        });
        return Math.round(dist*10)/10;
      },
      getAveragDistance : function(){
        var avg = this.getTotalDistance()/this.getTotalWorkouts();
        return Math.round(avg*10)/10;
      },
      getTotalTime : function(){
        var time = 0;
        _.each(this.pluck("milliseconds"), function(item){
          time = time + item;
        });
        return time;
      },
      getTotalTimeFormatted : function(){
        return milesUtil.convertToHMS(
          milesUtil.convertToSeconds(this.getTotalTime())
        );
      },
      getAverageTime : function(){
        var avg = this.getTotalTime()/this.getTotalWorkouts(),
        sec = milesUtil.convertToSeconds(avg),
        avgFormatted = milesUtil.convertToHMS(sec);
        return avgFormatted;
      },
      getAveragePace : function(){
        var time = this.getTotalTime(),
        dist = this.getTotalDistance(),
        pace = milesUtil.getPace(time, dist);
        return pace;
      },
      getStats: function(){
        var stats = {
          "totalWorkouts" : this.getTotalWorkouts(),
          "totalDistance" : this.getTotalDistance(),
          "totalTime"     : this.getTotalTimeFormatted(),
          "avgDistance"   : this.getAveragDistance(),
          "avgTime"       : this.getAverageTime(),
          "avgPace"       : this.getAveragePace()
        };
        return stats;
      }

      // url : function() {
      //   return 'https://api.github.com/repos/thomasdavis/backbonetutorials/contributors';
      // },
      // parse : function(data) {
      //     var uniqueArray = this.removeDuplicates(data.data);
      //     return uniqueArray;
      // },


  });

  return WorkoutsCollection;

});