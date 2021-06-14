

$('#seach-si .menu-icon').click(function(){
    if(!$('.search-console-sm').hasClass('active')) {
      	$('.search-console-sm').addClass('active');



      	$(this).find('i').removeClass('fa-search');
      	$(this).find('i').addClass('fa-remove');

      	/*var top = $(window).scrollTop();
      	if($('body').css('position') != 'fixed') {
      		$('body').css('position', 'fixed');
      		$('body').css('top', '-' + top + 'px');
      	}*/

    } else {
      	$('.search-console-sm').removeClass('active');

      	$(this).find('i').addClass('fa-search');
      	$(this).find('i').removeClass('fa-remove');

      	/*var top = $('body').css('top');
      	$('body').css('position', 'static');
      	$('body').css('top', '0px');*/

      	//$(window).scrollTop(Math.abs(parseInt(top)));
    }
});


$('.navi .op-search').click(function (){
	//alert('fewf');
	if($(this).parent().find('.search-console').hasClass('active')) {
		$(this).find('i').removeClass('fa-remove');
		$(this).find('i').addClass('fa-search');
		$(this).parent().find('.search-console').removeClass('active');
	} else {
		$(this).find('i').addClass('fa-remove');
		$(this).find('i').removeClass('fa-search');
		$(this).parent().find('.search-console').addClass('active');
	}
});

/*$( window ).resize(function() {
  	if($( window ).width() <= 685)
    	$('.search-console').css('height', $( window ).height() + "px");
  	else
    	$('.search-console').css('height', 'auto');
});

if($( window ).width() <= 685)
	$('.search-console').css('height', $( window ).height() + "px");
*/


/*$('.post-wrapper .share-f').click(function(event) {
  	event.preventDefault();
  	var url = 'http://dymain.crosssoar.com/post/' + $(this).attr('data-url');
 	// alert(url);
  	FB.ui({
      	method: 'share',
      	display: 'popup',
      	href: url,
  	}, function(response){});
});*/




var yyy;
var que;
$("#menu-si .menu-icon").click(function (){


	if($(this).hasClass("active"))
	{
		//$('#seach-si').show();
		clearTimeout(que);
		//clearTimeout(yyy);
		$(this).removeClass("active");

		var i = 0;
		$('#site-navi li.navi').each(function(){
			var kk = $(this);
			setTimeout(function(){
				kk.removeClass("active");
			}, i);

			i += 70;
		});

		$("#site-navi").addClass("collapsing-all");
		que = setTimeout(function(){
			//$("#site-navi").addClass("collapsing-all");
			$("#site-navi").removeClass("active");
			yyy = setTimeout(function(){
				$("#site-navi").removeClass("collapsing-all");
				//$("#site-navi").removeClass("active");

			}, 300);

		}, 300);

		document.ontouchmove = function(event){

		}

	} else {
		//$('#seach-si').hide();
		clearTimeout(que);

		clearTimeout(yyy);
		$("#site-navi").addClass("collapsing-all");
		//$("#site-navi").removeClass("active");

		$(this).addClass("active");

		// $("#site-navi").css("display", "block");
		$("#site-navi").addClass("active");
		que = setTimeout(function(){
			var i = 0;
			$('#site-navi li.navi').each(function(){
				var kk = $(this);
				setTimeout(function(){
					kk.addClass("active");
				}, i);

				i += 70;
			});
		}, 250);

		document.ontouchmove = function(event){
			event.preventDefault();
		}
	}
});



/*$("#menu-si .menu-icon").click(function (){
    clearTimeout(que);
    if($('#site-navi-sm').hasClass("open"))
    {
		$(this).removeClass("active");

		$('#site-navi-sm').removeClass("open");

		que = setTimeout(function () {
			if($('body').css('position') != 'fixed')
				return;
			var top = $('body').css('top');
			$('body').css('position', 'static');
			$('body').css('top', '0px');
			$(window).scrollTop(Math.abs(parseInt(top)));
		}, 400);
	} else {

		$(this).addClass("active");

		$('#site-navi-sm').addClass("open");

		que = setTimeout(function () {
			var top = $(window).scrollTop();
			$('body').css('position', 'fixed');
			$('body').css('top', '-' + top + 'px');
		}, 400);
	}
});*/



function showAlert(msg, type, isFixed, $msec) {

	var icon;
	if(type == 'ok') {
		icon = '<span class="icon"><i class="fa fa-check-circle" aria-hidden="true"></i></span>';
	} else {
		icon = '<span class="icon"><i class="fa fa-exclamation-circle" aria-hidden="true"></i></span>';
	}

	$('footer + div').html('<div class="bg-cover alert">'
		+ '<div class="bg-cover-table">'
  		+ '<div class="bg-cover-cell">'
      	+ '<div class="bg-cover-content">'
        + '<div class="bcc-content">'
        + icon
        + '<p>' + msg + '</p>'
      	+ '</div></div></div></div></div>');

	var alertBlk = $('footer + div').find('.alert');
	alertBlk.fadeIn(200);

	if(!isFixed){
		alertBlk.click(function() {
			$(this).fadeOut(200, function() {
				$(this).parent().html('');
			});
		});
	}

	$sec = 2000

	if($msec)
		$sec = $msec;

	setTimeout(function() {
		alertBlk.fadeOut(200, function() {
			$(this).parent().html('');
		});
	}, $sec);
}




function showConfirm(content, title, showInput, callback) {
	var id = "pop" + Math.floor((Math.random() * 99999) + 1);

	if(showInput)
		input = '<h5>訊息內容</h5><textarea name="message"></textarea>';
	else
		input = '';

	$('footer + div').append('<div id="' + id + '" class="bg-cover confirm-pop">'
		+ '<div class="bg-cover-table">'
		+ '<div class="bg-cover-cell">'
			+ '<div class="bg-cover-content">'
				+ '<div class="bcc-head">'
					+ '<span>' + title + '</span>'
					+ '<div href="#" class="bcc-close-btn">'
						+ '<i class="fa fa-remove"></i>'
					+ '</div></div>'
				+ '<div class="bcc-content">'
					+ '<div class="sub-con">' + content + '</div>'
						+ '<div class="sub-con">'
							+ '<input type="hidden" name="project_id" value="55">'
							+ '<input type="hidden" name="user_id" value="1439">'
							+ '<input type="hidden" name="action" value="1">'
							+ input
						+ '</div>'
						+ '<div class="pair">'
							+ '<button type="submit" class="btn btn-gray cancel">取消</button><button type="submit" class="btn confirm">確定</button>'
							+ '<img class="loading-gif" src="/public/img/loading.gif">'
						+ '</div>'
				+ '</div></div></div></div></div>');

	var dialog = $('#' + id);

	dialog.find('.bcc-close-btn, .cancel').click(function(){
		dialog.fadeOut(300, function(){
			dialog.remove();
		});
	});

	dialog.find('.confirm').click(function(){
		if(callback)
			callback(dialog);
	});

	dialog.fadeIn(300);
}








$('.header-body .op-cart').on('click', this, function(event){
	event.stopPropagation();
	if($(this).hasClass('open')) {
		$(this).removeClass('open');
		$(this).siblings('.drop-down-menu').css('display', 'none');
	} else {
		$(this).addClass('open');
    	$(this).siblings('.drop-down-menu').css('display', 'block');
	}
});

$('.header-body .op-cart').siblings('.drop-down-menu').on('click', this, function(event){
	event.stopPropagation();
});


$(window).click(function() {
	if($('.header-body .op-cart').hasClass('open')) {
			$('.header-body .op-cart').removeClass('open');
			$('.header-body .op-cart').siblings('.drop-down-menu').css('display', 'none');
	}
});








$("#site-navi .navi > a").click(function(event){

	var parent = $(this).parent();

	//alert(parent.not(":has(sub-cate-block)"));

	if(parent.find('.sub-cate-block').length == 0)
		return;


	if($( window ).width() > 1000){
	 	if(typeof $(this).attr("href") != typeof undefined)
	 		return;
	}

	event.preventDefault();

	if(parent.hasClass('open'))
		parent.removeClass('open');
	else
		parent.addClass('open');
});

$("#site-navi .navi").mouseenter(function(){

	if ($(window).width() > 1000)
		$(this).addClass('open');
	/*if(!block) {
	    block = true;
	    $("#toggleDiv").slideDown(400, function(){
	        block = false;
	    });
	}*/
});

$("#site-navi .navi").mouseleave(function(){

	if ($(window).width() > 1000)
		$(this).removeClass('open');
	/*if(!block) {
	    block = true;
	    $("#toggleDiv").slideUp(400, function(){
	        block = false;
	    });
	}*/
});





$('.product-detail .add-cart').on('click', this, function(event){

	var _self = $(this);
	if(_self.hasClass('processing'))
		return;

	_self.addClass('processing');
	_self.find('span').css('visibility', 'hidden');
	_self.find('.dymain-loading').show();


	addToCart($('.product-detail input[type=\'text\'], .product-detail select, .product-detail input[type=\'hidden\'], .product-info input[type=\'radio\']:checked, .option input[type=\'checkbox\']:checked, .product-info select, .product-info textarea,.product-info input[name=\'promotion_id\']'), function() {

		_self.removeClass('processing');
		_self.find('span').css('visibility', 'inherit');
		_self.find('.dymain-loading').hide();

	});
});

$('.product-detail .btn-buynow').on('click', this, function(event){


	addToCart($('.product-detail input[type=\'text\'], .product-detail input[type=\'hidden\'], .product-info input[type=\'radio\']:checked, .option input[type=\'checkbox\']:checked, .product-info select, .product-info textarea,.product-info input[name=\'promotion_id\']'), function() {

		/*_self.removeClass('processing');
		_self.find('span').css('visibility', 'inherit');
		_self.find('.dymain-loading').hide();*/

		document.location.href = base_url + "cart";

	});


	/*document.location.href = base_url + "cart/buy_now?product_id="
		+ $('.product-detail input[name="product_id"]').val();*/

	//alert("馬上買！！");
});


$('.product-item .pfooter .add-cart').on('click', this, function(event){

	var _self = $(this);
	if(_self.hasClass('processing'))
		return;

	_self.addClass('processing');


	var quantity = 1;

	if(_self.parent().find('.p-count').length > 0)
		quantity = _self.parent().find('.p-count').val();


	addToCart({
		'product_id': $(this).attr('data-item-id'),
		'quantity': quantity
	},function() {
		_self.removeClass('processing');
	});
});


function addToCart($data, callback) {

	$.ajax({
		url: base_url + 'cart/add',
		type: 'post',
		data: $data,
		dataType: 'json',
		success: function(json) {

			if(json.result == "success") {

				getCartList();
				showAlert('商品已加入購物車', 'ok');

				// if(fbq){
				// 	fbq('track', 'AddToCart', {
				// 		content_ids: [$data.product_id],
				// 		content_type: 'product',
				// 		currency: 'TWD'
				// 	});
				// }

			} else {
				if(json.msg == 'no_login')
					window.location = base_url + "auth/login";//showAlert('請先登入，謝謝您', 'notice');
				else if(json.msg == 'over_stock')
					showAlert('商品庫存不足', 'notice');

				//return;
			}

			callback();
		}
	}).fail(function() {
        //alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
	return false;
}


function getCartList() {

	$.ajax({
		url: base_url + 'cart/content',
		type: 'post',
		dataType: 'json',
		success: function(json) {

			$(".cart-product-count").html();

			$("#loading-spinner").empty();

			if(json.result == "success") {

				$(".cart-product-count").html(json.data.count);
				$(".cart-product-count").removeClass('empty');

				var cartMenu = $('.op-cart + .drop-down-menu').find('.inner');
				cartMenu.html('');

				for (var i = 0; i < json.data.products.length; i++) {

					var total = json.data.products[i].price * json.data.products[i].quantity;
					if(json.data.products[i].sale_price > 0) {
						var sale_total = json.data.products[i].sale_price * json.data.products[i].quantity;
						total_html = '<p class="total"><span class="special">$' + sale_total
								+ '</span><strike><span>$' + total + '</span></strike></p>';
					} else {
						total_html = '<p class="total"><span>$' + total + '</span></p>';
					}

					cartMenu.append('<div class="product-item clb">'
							+ '<div class="image-wrap">'
							+ '<a href="' + base_url + 'product/' + json.data.products[i].slug + '">'
							+ '<img src="' + json.data.products[i].cover_image + '" alt=""></a>'
							+ '</div><div class="content-wrap">'
							+ '<div class="product-name">'
							+ '<a href="' + base_url + 'product/'
							+ json.data.products[i].slug + '" title="">'
							+ json.data.products[i].name + '</a>'
							+ '<span class="quantity">× ' + json.data.products[i].quantity
							+ '</span></div>'
							+ total_html
							+ '</div></div>');
				}

				if(json.data.products.length > 0) {
					$('.shopping-bag-footer').show();
					$(".cart-product-count").show();
				}

			} else {

			}
		}
	});
	return false;
}
























$( window ).resize(function() {
	if($( window ).width() <= 1000)
		$('#site-navi-sm').css('height', $( window ).height() + "px");
	else
		$('#site-navi-sm').css('height', 'auto');
});

if($( window ).width() <= 1000)
	$('#site-navi-sm').css('height', $( window ).height() + "px");



$('.nav-lang').click(function(event){
	event.stopPropagation();
	if($(this).find('.lang-menu').hasClass('active'))
		$(this).find('.lang-menu').removeClass('active');
	else
		$(this).find('.lang-menu').addClass('active');
});








$('.side-wrapper .product-category ul').find('li').has('ul').children('a').on('click', function(e) {

	if($(this).parent('li').has( "ul" ).length)
		e.preventDefault();

	$(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
});


$('.cart-content-header').on('click', function() {
	/*if(isAnimting)
	return;*/

	$(this).parent().toggleClass('open').children('.cart-content-detail').collapse('toggle');


//	$(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
	// par_li_trigger($(this).parent('li'));

	//$(this).parent('li').siblings().removeClass('open').children('ul.in').collapse('hide');

});
















var isAnimting = false;
function par_li_trigger($li){
	if($li.hasClass('open')) {



		isAnimting = true;
		//dddd;
		//alert($li.children('ul').height());
		$li.children('ul').css('height', 'auto');
		var height = $li.children('ul').outerHeight();

		ul = $li.children('ul').get(0);



		// alert(height);

		//$li.children('ul').css('height', '0px');
		$li.children('ul').removeClass('collapse').addClass('collapsing');
		//$li.children('ul').css('height', '0');

		ul.style['height'] = 0;
		//ul.setAttribute('aria-expanded', true);
		//ul.style.height = 0;
		// ul._element.style.height = 0;
		//$li.children('ul').addClass('collapsing');


		/*setTimeout(function () {
		  $li.children('ul').css('height', height + 'px');

		}, 50);*/

		setTimeout(function () {
		  	$li.children('ul').removeClass('collapsing').addClass('collapse').addClass('in');
		  	$li.children('ul').removeAttr( 'style' );

		  	isAnimting = false;
		 	// $li.children('ul').css('');

		}, 400);

		ul.style['height'] = height + 'px';
		//$li.children('ul').css('height', height + 'px');
	} else {

		/*if(isAnimting)
		return;*/

		isAnimting = true;
		// ffff;
		var height = $li.children('ul').height();
		//alert(height);

		$li.children('ul').removeClass('collapse');
		$li.children('ul').removeClass('in');
		$li.children('ul').addClass('collapsing');
		$li.children('ul').css('height', '0px');
		setTimeout(function () {
			$li.children('ul').removeClass('collapsing');
			$li.children('ul').addClass('collapse');
			//$li.children('ul').removeAttr( 'style' );

			isAnimting = false;
			// $li.children('ul').css('');

		}, 350);
	}
}





$(window).click(function() {
if($('.nav-lang .lang-menu').hasClass('active'))
  	$('.nav-lang .lang-menu').removeClass('active');
});

$(window).scroll(function() {
if($('.nav-lang .lang-menu').hasClass('active'))
  	$('.nav-lang .lang-menu').removeClass('active');
});















jQuery(function($) {
	$('.spi-muti-ck-con .spi-muti-ck input[type="checkbox"]').change(function(){

		$list = $(this).parent().parent().parent().parent();

		str_data = '';
		$list.find('li input[type="checkbox"]').each(function() {
			if ($(this).is(':checked')) {
				if(str_data == '')
					str_data += $(this).val();
				else
					str_data += ', ' + $(this).val();
			}
		});

		if($list.parent().attr('data-type') == 's-o')
			if(str_data == '')
				str_data = '不拘';

		$list.parent().find('.spi-muti-ck-input').html(str_data);
	});


	$('.spi-muti-ck').click(function(e){
		event.stopPropagation();
	});

	$('.spi-muti-ck-input').click(function(e){

		$ul = $(this).siblings('.spi-muti-ck');

		if(!$ul.hasClass('active')){
			$('.spi-muti-ck').removeClass('active')
			$ul.addClass('active');
		}else
			$('.spi-muti-ck').removeClass('active')

		e.stopPropagation();
		// e.stopPropagation();
	});

	$(window).click(function() {
		if($('.spi-muti-ck').hasClass('active'))
			$('.spi-muti-ck').removeClass('active');
	});
});






function sendPost(url, data, action, fail, always) {
	$.ajax({
		url: url,
		type: 'post',
		data: data,
		dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
		success: function(json) {
			action(json);
		}
	}).fail(function(jqXHR, textStatus) {
		if(fail)
			fail(jqXHR.status);
    }).always(function() {
    	if(always)
			always();
		hideCVLoading();
    });
}










$('.bg-cover.alert').click(function() {
	$('.bg-cover').fadeOut();
});

$('.bg-cover-content').click(function() {
	event.stopPropagation();
});


$('.bcc-close-btn').click(function() {
	//alert('sdfsfsdf');
	$(this).parents('.bg-cover').fadeOut();
});









        //alert($('.search-console').length);

$('#seach-si').click(function(){
  	if($('.search-console').length == 0)
  	{
    	if($('#site-search').hasClass('open'))
      		$('#site-search').removeClass('open');
    	else
      		$('#site-search').addClass('open');
  	}
});






$('#scroll-top.back-to-top').click(function (){
    $('html, body').animate({
        scrollTop: 0
    }, 1000, 'easeOutCubic');
});






$(window).on('resize scroll', function() {

	//var tb = $('.top-banner');
  //	console.log(tb.prop("scrollHeight"));

  	// if(($(window).scrollTop() > (200 + tb.prop("scrollHeight"))) && (1 == 1)){

  	// 	if(!$('header').hasClass('act'))
  	// 		$('header').addClass('act');

  	// }else{
  	// 	if($('header').hasClass('act'))
  	// 		$('header').removeClass('act');
  	// }




  //	var tb = $('.top-banner');
  	// if($(window).scrollTop() >= tb.prop("scrollHeight")){
  	// 	if(!$('body').hasClass('fix'))
  	// 		$('body').addClass('fix');
  	// }else{
  	// 	if($('body').hasClass('fix'))
  	// 		$('body').removeClass('fix');
  	// }
});

if($(window).scrollTop() > 200) {
	$('header').addClass('act');
	$('body').addClass('fix');
}



function is_numeric(str){
    return /^\d+$/.test(str);
}

$('.product-item .favorite').click(function (){

	var _self = $(this);

	favorite({
		'pid': $(this).parent().find('.add-cart').attr('data-item-id')
	},function(is_f) {
		if(is_f == 1)
			_self.addClass('active');
		else
			_self.removeClass('active');
	});
});


$('.product-detail .btn-favorite').click(function (){

	var _self = $(this);

	favorite({
		'pid': $('.product-detail input[name="product_id"]').val()
	},function(is_f) {
		if(is_f == 1)
			$('.product-detail .btn-favorite').addClass('active').html('<span>已收藏</span>');
		else
			$('.product-detail .btn-favorite').removeClass('active').html('<span>收藏商品</span>');
	});
});



function getFormData($form) {

	var $inputs = $form.find('input[name], textarea[name], select[name]');
    var formData = new FormData();

    $inputs.each(function() {
        formData.append(this.name, $(this).val());
    });

    return formData;
}



function is_numeric(str){
    return /^\d+$/.test(str);
}

function isInt(str){

	if(/^\d+$/.test(str)) {

		var num = parseInt(str);

		if(num >= 0)
			return true;
		else
			return false;
	}else
		return false
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isNormalInteger(str){

	if(/^\d+$/.test(str)) {

		var num = parseInt(str);

		if(num > 0)
			return true;
		else
			return false;
	}else
		return false
}

function showDialog(dialogPanel, name) {

	$('footer').html(dialogPanel);

	var dialog = $('footer').find(name);

	dialog.find('.bcc-close-btn').click(function(){
		dialog.fadeOut(300, function(){
			dialog.parent().html('');
		});
	});

	dialog.fadeIn(300);
}


function showCVLoading() {

	$('footer + div').html('<div id="cv-loading" class="bg-cover"><div class="bg-cover-table"><div class="bg-cover-cell tc"><div class="ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div></div>');

	var loadingBlk = $('footer + div').find('#cv-loading');
	loadingBlk.show();
}

function hideCVLoading() {
	$('footer + div').find('#cv-loading').hide().remove();
}


var preScrollTop = 0;
function fixBody() {
	preScrollTop = $(window).scrollTop();
	$('body').css('top', '-' + preScrollTop + 'px');
	$('body').css('position', 'fixed');
	$('body').css('width', '100%');
	$('body').css('left', '0');
	$('body').css('overflow', 'hidden');
}

function clearFixBody() {
	$('body').removeAttr('style');
	$(window).scrollTop(preScrollTop);
}














$("#kol-join").click(function (){
		showJoinDialog("reg");
	});

	function showJoinDialog(type) {
		var formData = new FormData();

		sendPost('/AAAAAA/auth_dialog_', formData, function(json) {
			if(json.code == 200) {
				showAskDialog(type, json.content)
        	} else {

        	}
		});
	}

	function showAskDialog(type, dialog) {

		fixBody();

		$('#show-dialog-con').html(dialog);

		var joinPanel = $('#show-dialog-con').find('#join-fino');




		var loginForm = joinPanel.find("#login-form");
		loginForm.on('submit', this, function(event){
			event.preventDefault();

			var email = $(this).find('[name="email"]').val();
			var pwd = $(this).find('[name="pwd"]').val();

			if(email == '') {
				alert('請輸入帳號!');
				return;
			}

			if(pwd == '') {
				alert('請輸入密碼!');
				return;
			}

			showCVLoading();

			sendPost('/auth/login_for_', new FormData($(this)[0]), function(json) {
				if(json.result == "success") {
					//showAskDialog(json.content)
					window.top.location = json.data.loc;
	        	} else {

	        	}
			});
		});


		var regForm = joinPanel.find("#reg-form");
		regForm.on('submit', this, function(event){
			event.preventDefault();

			//alert('ewfewfewf');

			var email = $(this).find('[name="email"]').val();
			var phone = $(this).find('[name="phone"]').val();
			var password = $(this).find('[name="password"]').val();
			var passwordAgain = $(this).find('[name="password_again"]').val();

			if(email == '') {
				alert('請輸入信箱!');
				return;
			}

			if(phone == '') {
				alert('請輸入電話!');
				return;
			}

			if(password == '') {
				alert('請輸入密碼!');
				return;
			}

			if(passwordAgain == '') {
				alert('請確認密碼!');
				return;
			}

			if(password != passwordAgain) {
				alert('密碼確認不相符!');
				return;
			}


			showCVLoading();

			sendPost('/auth/reg_for_', new FormData($(this)[0]), function(json) {
				if(json.result == "success") {
					//showAskDialog(json.content)
					window.top.location = json.data.loc;
	        	} else {

	        	}
			});
		});

		regForm.find('.btn-type').click(function (){
			regForm.find('.btn-type').removeClass('active');
			$(this).addClass('active');
		});


		joinPanel.find('.show-login').click(function() {
			joinPanel.find('.reg-panel').fadeOut();
			joinPanel.find('.login-panel').fadeIn();
		});

		joinPanel.find('.show-reg').click(function() {
			joinPanel.find('.reg-panel').fadeIn();
			joinPanel.find('.login-panel').fadeOut();
		});


		if(type == 'login'){
			joinPanel.find('.reg-panel').hide();
			joinPanel.find('.login-panel').show();
		}
		// joinPanel.find('.no-join').click(function() {
		// 	submitForm();
		// });


		joinPanel.find('.fxover-show, .close-btn').click(function() {

			$('#join-fino .fxover-show').addClass('fxover-hide');
			$('#join-fino .fxover-show').removeClass('fxover-show');

			$('#join-fino .flx-down-s').addClass('flx-down-h');
			$('#join-fino .flx-down-s').removeClass('flx-down-s');

			setTimeout(function() {
				$('#show-dialog-con').html('');
				clearFixBody();
			}, 300);
		});

		// joinPanel.find('.w-spanel').click(function(event) {
		// 	event.stopPropagation();
		// });
	}
