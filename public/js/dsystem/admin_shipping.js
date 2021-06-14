//var nowProjectPage = 1;

$( "#shipping-page .panel-heading .add-cate" ).click(function(){
   	clearShipping();
   	$( "#shipping-page .panel .add-cate-con .action" ).html('新增');
    $( "#shipping-page .panel .add-cate-con" ).show();
});

getShippinglist();

function getShippinglist()
{
    $.ajax({
        type: "POST",
        url: "admin_shipping/shipping_list",
        /*data: {
            'cate_id': parent_cate_id
        }*/
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $( "#shipping-page .panel-body .cate-con" ).empty();
        for(var i = 0; i < json_data.data.shipping_list.length; i++)
        {   
            $( "#shipping-page .panel-body .cate-con" ).append('<div class="cate-b" role-data="'
                        + json_data.data.shipping_list[i].shipping_id + '">'
                        + '<span>' + json_data.data.shipping_list[i].type + '</span>'
                        + '<i class="fa fa-trash"></i><i class="fa fa-pencil"></i></div>');
        }

        $('#shipping-page .panel-body .cate-b').unbind('click');
        $('#shipping-page .panel-body .cate-b').click(function (){
            $('#shipping-page .panel-body .cate-b').removeClass('active');
            $(this).addClass('active');

            getShippinglist($(this).attr('role-data'));
        });

        $('#shipping-page .panel-body .cate-b .fa-trash').unbind('click');
        $('#shipping-page .panel-body .cate-b .fa-trash').click(function (e){
            e.stopPropagation();
            var r = confirm("確定要刪除這個類別嗎 ?");
            if (r == true) {
                delete_shipping($(this).parent().attr('role-data'));
            }
        });

        $('#shipping-page .panel-body .cate-b .fa-pencil').unbind('click');
        $('#shipping-page .panel-body .cate-b .fa-pencil').click(function (e){
        	e.stopPropagation();

        	getShipping($(this).parent().attr('role-data'));
        });

        $('#shipping-page .cate-structure a').unbind('click');
        $('#shipping-page .cate-structure a').click(function (){
            getShippinglist($(this).attr('role-data'));
        });
       

    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

function getShipping(shipping_id)
{
    $.ajax({
        type: "POST",
        url: "admin_shipping/get_shipping",
        data: {
            'shipping_id': shipping_id
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;
        
        if(json_data.result == "success")
        {
        	$('#shipping-page .add-cate-con select[name="shipping_type"]').val(json_data.data.type);
        	$('#shipping-page .add-cate-con input[name="shipping_cost"]').val(json_data.data.cost);
        	$('#shipping-page .add-cate-con input[name="free_shipping_limit"]').val(json_data.data.free_shipping_limit);
        	$('#shipping-page .add-cate-con select[name="is_active"]').val(json_data.data.is_active);

        	$( "#shipping-page .panel .add-cate-con .action" ).html('修改');
        	$('#shipping-page input[name="update_shipping_id"]').val(json_data.data.shipping_id);
        	$( "#shipping-page .panel .add-cate-con" ).show();

        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }

    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}



function delete_shipping(shipping_id) {
    $.ajax({
        type: "POST",
        url: "admin_shipping/shipping_delete",
        data: {'shipping_id': shipping_id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            getShippinglist();

            alert("刪除分類·成功 !");
        } else {
            if(json_data.msg == "has_sub_cate") 
                alert("請先移除所有子分類!!");
            else
                alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}



$('#shipping-page .add-cate-con .action').click(function(e) {

/*	alert('sdfdsf');
	return;
*/
	if($('#shipping-page input[name="update_shipping_id"]').val() == '') {
	    
	    var form_data = new FormData();

	    form_data.append("shipping_type", $('#shipping-page .add-cate-con select[name="shipping_type"]').val());
	    form_data.append("shipping_cost", $('#shipping-page .add-cate-con input[name="shipping_cost"]').val());
	    form_data.append("free_shipping_limit", $('#shipping-page .add-cate-con input[name="free_shipping_limit"]').val());
	    form_data.append("is_active", $('#shipping-page .add-cate-con select[name="is_active"]').val());

	    $.ajax({
	        url: "admin_shipping/shipping_insert",
	        dataType: 'json',
	        cache: false,
	        contentType: false,
	        processData: false,
	        data: form_data,
	        type: 'post'
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        console.log(json_data);

	        if(json_data.result == "success")
	        {
	        	$( "#shipping-page .add-cate-con" ).hide();
	            /*if(productHelper) {
	                productHelper.getShipping();
	            }*/
	            

	            getShippinglist();
	            $('#shipping-page .add-cate-con input[name="cate_name"]').val('');
	        } else {
	        	if(json_data.msg == 'incorrent')
	        		alert("運費要填寫喔 !");
	        	else if(json_data.msg == 'shipping_type_repeat')
	        		alert("運送類型重複 !");
	        	else
	            	alert("建立類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	} else {

		var form_data = new FormData();

		form_data.append("shipping_id", $('#shipping-page input[name="update_shipping_id"]').val());
	    form_data.append("shipping_type", $('#shipping-page .add-cate-con select[name="shipping_type"]').val());
	    form_data.append("shipping_cost", $('#shipping-page .add-cate-con input[name="shipping_cost"]').val());
	    form_data.append("free_shipping_limit", $('#shipping-page .add-cate-con input[name="free_shipping_limit"]').val());
	    form_data.append("is_active", $('#shipping-page .add-cate-con select[name="is_active"]').val());

	    $.ajax({
	        url: "admin_shipping/shipping_update",
	        dataType: 'json',
	        cache: false,
	        contentType: false,
	        processData: false,
	        data: form_data,
	        type: 'post'
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        console.log(json_data);

	        if(json_data.result == "success")
	        {
	        	$( "#shipping-page .add-cate-con" ).hide();
	            /*if(productHelper) {
	                productHelper.getShipping();
	            }*/
	            
	            getShippinglist();
	            clearShipping();
    			$('#shipping-page .add-cate-con').hide();

	        } else {
	        	if(json_data.msg == 'incorrent')
	        		alert("運費要填寫喔 !");
	        	else if(json_data.msg == 'shipping_type_repeat')
	        		alert("運送類型重複 !");
	        	else
	            	alert("修改類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	}
});


$('#shipping-page .add-cate-con .remove').click(function(e) {
    clearShipping();
    $('#shipping-page .add-cate-con').hide();
});

function clearShipping() {

	$('#shipping-page input[name="update_shipping_id"]').val('');
	$('#shipping-page .add-cate-con select[name="shipping_type"]').val('home_delivery');
	$('#shipping-page .add-cate-con input[name="shipping_cost"]').val('');
	$('#shipping-page .add-cate-con input[name="free_shipping_limit"]').val('');
	$('#shipping-page .add-cate-con select[name="is_active"]').val('1');

}

