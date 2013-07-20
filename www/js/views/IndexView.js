define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/IndexTemplate.html',
  'views/ApplicationView'
], function($, _, Backbone, IndexTemplate, ApplicationView ){

  var IndexView = Backbone.View.extend({
    el: $("#main"),
    template : _.template(IndexTemplate),
    render: function(){

      // $('.menu li').removeClass('active');
      // $('.menu li a[href="#"]').parent().addClass('active');
      this.$el.html(this.template);

      var appView = new ApplicationView({el: '#main'});
      appView.render();
    }

  });

  return IndexView;

});