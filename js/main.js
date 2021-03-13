$(document).ready(function(){

  // slick-slider settings
    $('.city-page-slider').slick({
      prevArrow: $('.nav-prev'),
      nextArrow: $('.nav-next'),
      dots: true,
      dotsClass: 'vertical-dots'
    });

    // circle chart

    var circle = $('.progress-ring__circle');
    var timeValue = $('.circle-chart__minutes');

    for (var i = 0; i < circle.length; i++) {

      var radius = circle[i].r.baseVal.value;
      var circumference = 2*Math.PI*radius;
      var minutesValue = timeValue[i];
      var minutesNum = parseInt($(minutesValue).text());

      circle[i].style.strokeDasharray = circumference + " " + circumference;
      circle[i].style.strokeDashoffset = circumference;

      function setProgress(minutes) {
        var offset = circumference - minutes/60 * circumference;
        circle[i].style.strokeDashoffset = offset;
      }

      setProgress(minutesNum);
        
    } 
  
  });

  // Sticky Header

  $(window).scroll(function() {    
		var height = $(window).scrollTop();  
		if(height  > 74) {
      $(".wrap-order").addClass('header-fixed');
      
		} else{
      $(".wrap-order").removeClass('header-fixed');
		}
	});