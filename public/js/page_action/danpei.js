window.fbAsyncInit = function() {
    FB.init({
      appId      : '804765666367901',
      status     : true,
      cookie     : true,
      oauth      : true,
      xfbml      : true,
      version    : 'v2.8'
     // frictionlessRequests: true
    });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



$( window ).scroll(function() {
  	
  	var scroll = $(window).scrollTop();

  	if(scroll > $(".main-nav").offset().top)
  		$("nav.fixed").show();
  	else
  		$("nav.fixed").hide();

});



$('.eat-methods li > div').click(function (){

	if($(this).hasClass('act'))
		return;

	$('.eat-methods li > div').removeClass('act');
	$(this).addClass('act');

	var img_url;

	if($(this).hasClass('method1')) {
		img_url = 'https://s3-ap-northeast-1.amazonaws.com/ecdemo/static/p/img_edible_method1.jpg';
	} else if($(this).hasClass('method2')) {
		img_url = 'https://s3-ap-northeast-1.amazonaws.com/ecdemo/static/p/img_edible_method2.jpg';
	} else if($(this).hasClass('method3')) {
		img_url = 'https://s3-ap-northeast-1.amazonaws.com/ecdemo/static/p/img_edible_method3.jpg';
	} else if($(this).hasClass('method4')) {
		img_url = 'https://s3-ap-northeast-1.amazonaws.com/ecdemo/static/p/img_edible_method4.jpg';
	}


	$('#edible-method .bg').fadeOut(300, function() {
		$('<img/>').attr('src', img_url).on('load', function() {
		   	$(this).remove();
		   	$('#edible-method .bg').fadeIn(300);
		   	$('#edible-method .bg').css('background-image', 'url(' + img_url + ')');
		});
	});
});

$('.process-step li a').click(function (){

	if($(this).hasClass('active'))
		return;

	$('.process-step li a').removeClass('active');
	$(this).addClass('active');

	$('.ginseng-process-img .step[style*="display: block"]').each(function( index ) {
		$(this).fadeOut();
	});

	var index = $( ".process-step li" ).index($(this).parent());

	$('.ginseng-process-img .step').eq(index).fadeIn(300);
});






$(document).on('click', 'nav a', function(event) {
    var target = this.getAttribute('href');

    if(!target.startsWith("#"))
    	return;

    event.preventDefault();
    if($(document).scrollTop() == $(target).offset().top)
        return;

    $('html, body').stop();
    $('html, body').animate({
        scrollTop: $(target).offset().top
    }, 1000, 'easeOutQuint');
});