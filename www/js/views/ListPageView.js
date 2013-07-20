define([
  'jquery',
  'underscore',
  'backbone',
  'text!/templates/ListPageTemplate.html',
  'views/ApplicationView'
], function($, _, Backbone, ListPageTemplate, ApplicationView ){

  var ListPageView = Backbone.View.extend({
    el: $("#main"),
    template : _.template(ListPageTemplate),
    render: function(){

      // $('.menu li').removeClass('active');
      // $('.menu li a[href="#"]').parent().addClass('active');
      this.$el.html(this.template);

      var appView = new ApplicationView({el: '#main'});
      appView.render();
    }

  });

  return ListPageView;

});