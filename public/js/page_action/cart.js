$('.login-pop .bcc-content a').click(function(){
	$('.login-pop').fadeOut(300);
});




$('#cart-form .quantity input').focusout(function(){
	if($(this).val() != $(this).attr('value')) {
		//alert($(this).attr('value'));

		var quantity = $(this).val();
		var product_id = $(this).attr('role-data');
		var cid = $(this).attr('role-id');

		//if(Number.isInteger(0))

		if (quantity != parseInt(quantity, 10)){
			return;
		}


		$.ajax({
			url: base_url + 'cart/update_product_in_cart_count',
			type: 'post',
			data: {
				'cid': cid,
				'product_id': product_id,
				'quantity': quantity
			},
			dataType: 'json',
			success: function(json) {	
				

				if(json.result == "success") {

					/*fbq('track', 'AddToCart', {
						value: json.data.cost,
						currency: 'KS'
					});*/

					/*getCartList();
					showAlert('商品已加入購物車', 'ok');*/

				} else {
					/*if(json.msg == 'over_stock')
						showAlert('商品庫存不足', 'notice');*/
				}

				location.reload();
			}
		}).fail(function() {
            //alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
        	//callback();
        });
	}
});












$(document).ready(function(){

	$('.num-picker .less').click(function(){

		var $con = $(this).parent().parent().parent();
		var $p_q_input = $(this).parent().find('.product-quantity');

		var count = $p_q_input.val();

		if(!is_numeric($p_q_input.val())) {
			count = 1;
		} else {
			count = parseInt($p_q_input.val());
		}

		if(count > 1)
			count--;
		else
			count = 1;

		$p_q_input.val(count);


		var quantity = $p_q_input.val();
		var product_id = $p_q_input.attr('role-data');
		var cid = $p_q_input.attr('role-id');
		var spid = $p_q_input.attr('spec-id');

		add_to_cart_count(cid, product_id, spid, quantity, $p_q_input, $con);
	});

	$('.num-picker .add').click(function(){

		var $con = $(this).parent().parent().parent();
		var $p_q_input = $(this).parent().find('.product-quantity');

		var count = $p_q_input.val();

		if(!is_numeric($p_q_input.val())) {
			count = 0;
		} else {
			count = parseInt($p_q_input.val());
		}

		if(count >= 0)
			count++;
		else
			count = 1;

		if(count > 25)
				count = 25;

		$p_q_input.val(count);

		var quantity = $p_q_input.val();
		var product_id = $p_q_input.attr('role-data');
		var cid = $p_q_input.attr('role-id');
		var spid = $p_q_input.attr('spec-id');

		add_to_cart_count(cid, product_id, spid, quantity, $p_q_input, $con);
	});


    $(".product-quantity").keyup(function(){

    	if(!is_numeric($(this).val())) {

    		if($(this).val() != '')
				$(this).val(1);

		} else {

			if(parseInt($(this).val()) < 1)
				count = 1;
			else
				count = parseInt($(this).val());

			if(count > 25)
				count = 25;

			$(this).val(count);
		}

       // $(".product-quantity").val($(this).val());
    });
});


function add_to_cart_count(cid, product_id, spec_id, quantity, $input, $con)
{
	$.ajax({
		url: base_url + 'cart/update_product_in_cart_count',
		type: 'post',
		data: {
			'cid': cid,
			'spec_id': spec_id,
			'product_id': product_id,
			'quantity': quantity
		},
		dataType: 'json',
		success: function(json) {

			if(json.result == "success") {

				$input.val(json.data.quantity);// *


				

				$('tfoot .quantity .c').html(json.data.products_in_cart_count);



				if($con.find('.price .special').length == 1) {
					$sp = $con.find('.price .special').html().replace("$", "").replace(",", "");
					$p = $con.find('.price strike span').html().replace("$", "").replace(",", "");
					//alert(parseInt($sp) * json.data.quantity);

					$con.find('.total').html('<span class="special">$' + formatNumber($sp * json.data.quantity) + '</span>' +
					'<strike><span class="money">$' + formatNumber($p * json.data.quantity) + '</span></strike>');

					
				} else {
					$p = $con.find('.price span').html().replace("$", "").replace(",", "");
					$con.find('.total').html('<span class="money">$' + formatNumber(parseInt($p) * json.data.quantity) + '</span>');
				}

				var total = 0;



				/*$('table tbody tr').each(function( key, value ) {
				  	if($(this).find('.total .special').length == 1) {
						total += parseInt($(this).find('.total .special').html().replace("$", "").replace(",", ""));
						
					} else if($(this).find('.total .money').length == 1)  {

						total += parseInt($(this).find('.total .money').html().replace("$", "").replace(",", ""));
					}
				});*/

				$('tr.prom').remove();

				for (var i = 0; i < json.data.promotion_list.length; i++) {

					var rule = '';
					for (var k = 0; k < json.data.promotion_list[i].rule_list.length; k++) {


						if(json.data.promotion_list[i].rule_list[k].type == 'special_price') {

							rule += '，任選 ' + json.data.promotion_list[i].rule_list[k].quantity + ' 件 ' + json.data.promotion_list[i].rule_list[k].value + ' 元';

						} else if(json.data.promotion_list[i].rule_list[k].type == 'discount') {

							if((json.data.promotion_list[i].rule_list[k].value % 10) == 0)
								json.data.promotion_list[i].rule_list[k].value = json.data.promotion_list[i].rule_list[k].value.replace("0", "");

							rule += '，任選 ' + json.data.promotion_list[i].rule_list[k].quantity + ' 件 ' + json.data.promotion_list[i].rule_list[k].value + ' 折';
						}
					}


					var prom = '<tr class="prom"><td class="product-item">'
						+ '</td><td class="price" colspan="2">'
						+ '<span class="product-name"><a class="promotion" href="/promotion/'
						+ json.data.promotion_list[i].promotion_id 
						+ '">【促銷活動】' + json.data.promotion_list[i].name + rule
						+ '</a></span></td><td class="total" colspan="2">'
						+ '<span class="special">現省$-'
						+ json.data.promotion_list[i].diff_
						+ '元</span></td></tr>';

						//alert(prom);

					$('tfoot tr.subtotal').after(prom);
				}
				$('tfoot tr.subtotal').after();



				$('#cart-form .subtotal .total').html('$' + formatNumber(json.data.cost));
				$('#cart-form .total .total.final').html('$' + formatNumber(json.data.final_total));
				

			} else {
				/*if(json.msg == 'over_stock')
					showAlert('商品庫存不足', 'notice');*/
			}
		}
	}).fail(function() {
        //alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
    	//callback();
    });
}


function formatNumber(str, glue) {

	if(isNaN(str))
		return NaN;

	var glue= (typeof glue== 'string') ? glue: ',';
	var digits = str.toString().split('.');
	var integerDigits = digits[0].split("");
	var threeDigits = [];

	while (integerDigits.length > 3) {
		threeDigits.unshift(integerDigits.splice(integerDigits.length - 3, 3).join(""));
	}

	threeDigits.unshift(integerDigits.join(""));
	digits[0] = threeDigits.join(glue);

	return digits.join(".");
}