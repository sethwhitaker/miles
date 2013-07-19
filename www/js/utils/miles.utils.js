define([
  'jquery'
], function($){

  var utils = {
    /*
    * FORM FUNCTIONS
    */
    //grabs and returns a data object of the form inputs
    getFormValues:function(el){
      var formData =  {
        location: el.find('input[name="location"]').val(),
        date: el.find('input[name="date"]').val(),
        time: el.find('input[name="time"]').val(),
        milliseconds: this.convertToMilliseconds(el.find('input[name="time"]').val()),
        distance: parseFloat(el.find('input[name="distance"]').val())
      };
      return formData;
    },

    /*
    * TIMING FUNCTIONS
    */

    //returns a bool if string is an HH:MM:SS formatted time string
    isHMSTime:function(theTime){
      var regExp = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g;
      var valid = (theTime.match(regExp)) ? true:false;
      return valid;
    },
    //takes time in seconds and converts to HH:MM:SS formated string
    convertToHMS : function(time){
      time = Number(time);
      var h = Math.floor(time / 3600);
      var m = Math.floor(time % 3600 / 60);
      var s = Math.floor(time % 3600 % 60);
      return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "00:") + (s < 10 ? "0" : "") + s);
    },
    //convert milliseconds to seconds
    convertToSeconds : function(milliseconds){
      return milliseconds/1000;
    },
    //takes a HH:MM:SS formatted string and convertts to milliseconds
    convertToMilliseconds:function(hms){
      var a = hms.split(':');
      var n = a.length; // number of array items
      var ms = 0; // milliseconds result
      if (n > 0)
      {
        var b = a[n-1].split('.');
        if (b.length > 1)
        {
          var m = b[1];
          while (m.length < 3) m += '0'; // ensure we deal with thousands
          ms += m - 0; // ensure we deal with numbers
        }
        ms += b[0] * 1000;
        if (n > 1) // minutes
        {
          ms += a[n-2] * 60 * 1000;

          if (n > 2) // hours
          {
            ms += a[n-3] * 60 * 60 * 1000;
          }
        }
      }
      return ms;
    },
    // takes time(milli) anddistance in mile and converts to a formatted pace
    getPace : function(time, dist){
      var sec =  this.convertToSeconds(time)/dist; //seconds/mile
      pace = this.convertToHMS(sec);
      return pace;
    },
    //1 mile = 1609.34 m or 1.60934 km
    milesToKm : function(mi){
      return mi*1.60934;
    },
    //1km = 0.621371 mile
    kmToMiles : function(km){
      return km*0.621371;
    },
    //1760 yds in a mile
    milesToYards : function(mi){
      return mi*1760;
    },
    yardsToMiles : function(yds){
      return yds/1760;
    },
    kmToMeters : function(km){
      return km*1000;
    },
    metersToKm : function(m){
      return m/1000;
    },
    yardsToMeters : function(yds){
      return yds*0.9144;
    },
    metersToYards : function(m){
      return m*1.093613;
    }
  };
  return utils;
});
