$(function() {

	$('.product-img .img-list .thumb').click(function(){

		if($(this).hasClass('active'))
			return;

		$('.product-img .img-list .thumb').removeClass('active');
		$(this).addClass('active');

		var url = $(this).find('img').attr("original-img");
		$(".product-img .img-show .holder img").fadeOut(200, function() {

			$(this).attr('src', url);
	      	this.onload = function(){           // make sure img is loaded
	         	$(this).fadeIn(200);             // fadeIn
	      	};
	  	});

	});

    $(".product-img img").lazyload({
        //placeholder : "https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png",
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: true,
        skip_invisible: false,
        onError: function(element) {
            //console.log('error loading ' + element.data('src'));
        }
    });
});



$(document).ready(function(){

	$('.num-picker .less').click(function(){

		var $p_q = $(".product-quantity");

		var count = $p_q.val();

		if(!is_numeric($p_q.val())) {
			count = 1;
		} else {
			count = parseInt($p_q.val());
		}

		if(count > 0)
			count--;
		else
			count = 0;

		$p_q.val(count);
	});

	$('.num-picker .add').click(function(){

		var $p_q = $(".product-quantity");

		var count = $p_q.val();

		if(!is_numeric($p_q.val())) {
			count = 0;
		} else {
			count = parseInt($p_q.val());
		}

		if(count >= 0)
			count++;
		else
			count = 1;

		if(count > 25)
			count = 25;

		$p_q.val(count);
	});



	
	var pObj = JSON.parse(product_data);

	console.log(pObj);

	$(".product-spec .spec-con .spec").click(function(){

		key = $(this).attr('data-id');

		if($(this).hasClass('active')) {

			$(".product-spec .spec-con .spec").removeClass('active');

			$('.product-name').html(pObj.normal.name);
			$('.price .special').html('NTD ' + pObj.normal.sale_price);
			$('.price .price-normal').html('NTD ' + pObj.normal.price);

			$('input.product-spec').val('');

			return;
		}

		$(".product-spec .spec-con .spec").removeClass('active');


		$('.product-name').html(pObj.normal.spec[key].name);
		$('.price .special').html('NTD ' + pObj.normal.spec[key].sale_price);
		$('.price .price-normal').html('NTD ' + pObj.normal.spec[key].price);



		key = key.split(":");

		if(key[1])
			$('input.product-spec').val(key[1]);
		else
			$('input.product-spec').val('');
		//$(".product-spec .spec-con .spec").removeClass('active');
		$(this).addClass('active');

		//$(this).attr('data-id');

	});






    $(".product-quantity").keyup(function(){

    	if(!is_numeric($(this).val())) {

    		if($(this).val() != '')
				$(".product-quantity").val(1);

		} else {

			if(parseInt($(this).val()) < 0)
				count = 0;
			else
				count = parseInt($(this).val());

			if(count > 25)
				count = 25;

			$(".product-quantity").val(count);
		}

       // $(".product-quantity").val($(this).val());
    });
});
