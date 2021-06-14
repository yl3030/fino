//var nowProjectPage = 1;

$( "#product-cate-page .panel-heading .add-cate" ).click(function(){

   // $(this).parent().parent().find('.add-cate-con').show();
   	$( "#product-cate-page .panel .add-cate-con .action" ).html('新增');
    $( "#product-cate-page .panel .add-cate-con" ).show();
});


getProductCatelist(0);

function getProductCatelist(parent_cate_id)
{
    $.ajax({
        type: "POST",
        url: "admin_product_cate/cate_list",
        data: {
            'cate_id': parent_cate_id
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $( "#product-cate-page .parent-cate .cate-structure" ).html(json_data.data.parent_structure);
        $('#product-cate-page .panel input[name="parent_cate_id"]').val(json_data.data.parent_cate_id);

        $( "#product-cate-page .panel-body .cate-con" ).empty();
        for(var i = 0; i < json_data.data.cate_list.length; i++)
        {   
            $( "#product-cate-page .panel-body .cate-con" ).append('<div class="cate-b" role-data="'
                        + json_data.data.cate_list[i].product_category_id + '">'
                        + '<span>' + json_data.data.cate_list[i].name + '</span>'
                        + '<i class="fa fa-trash"></i><i class="fa fa-pencil"></i></div>');
        }

        $('#product-cate-page .panel-body .cate-b').unbind('click');
        $('#product-cate-page .panel-body .cate-b').click(function (){
            $('#product-cate-page .panel-body .cate-b').removeClass('active');
            $(this).addClass('active');

            getProductCatelist($(this).attr('role-data'));
        });

        $('#product-cate-page .panel-body .cate-b .fa-trash').unbind('click');
        $('#product-cate-page .panel-body .cate-b .fa-trash').click(function (e){
            e.stopPropagation();
            var r = confirm("確定要刪除這個類別嗎 ?");
            if (r == true) {
                delete_product_cate($(this).parent().attr('role-data'), true);
            }
        });

        $('#product-cate-page .panel-body .cate-b .fa-pencil').unbind('click');
        $('#product-cate-page .panel-body .cate-b .fa-pencil').click(function (e){
        	e.stopPropagation();


        	getProductCate($(this).parent().attr('role-data'));

        	/*$( "#product-cate-page .panel .add-cate-con .action" ).html('修改');
        	$('#product-cate-page .add-cate-con input[name="cate_name"]').val($(this).parent().find('span').html());
        	$('#product-cate-page input[name="update_cate_id"]').val($(this).parent().attr('role-data'));
        	$( "#product-cate-page .panel .add-cate-con" ).show();*/

            //get_product_by_id($(this).attr('data-product-id'));
        });



        $('#product-cate-page .cate-structure a').unbind('click');
        $('#product-cate-page .cate-structure a').click(function (){
            getProductCatelist($(this).attr('role-data'));
        });
        






    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

function getProductCate(cate_id)
{
    $.ajax({
        type: "POST",
        url: "admin_product_cate/get_product_cate",
        data: {
            'category_id': cate_id
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;
        
        if(json_data.result == "success")
        {

        	$('#product-cate-page .add-cate-con input[name="cate_name"]').val(json_data.data.name);
        	$('#product-cate-page .add-cate-con textarea[name="description"]').val(json_data.data.description);
        	$('#product-cate-page .add-cate-con input[name="keywords"]').val(json_data.data.keywords);
        	$('#product-cate-page .add-cate-con input[name="img_url"]').val(json_data.data.img_url);
        	$('#product-cate-page .add-cate-con select[name="is_promotion"]').val(json_data.data.is_promotion);

        	$( "#product-cate-page .panel .add-cate-con .action" ).html('修改');
        	$('#product-cate-page input[name="update_cate_id"]').val(json_data.data.product_category_id);
        	$( "#product-cate-page .panel .add-cate-con" ).show();



            // getProductCatelist($('#product-cate-page .panel input[name="parent_cate_id"]').val());

            // if(productHelper) {
            //     productHelper.getProductCate();
            // }

            // alert("刪除分類·成功 !");
        } else {
            // if(json_data.msg == "has_sub_cate") 
            //     alert("請先移除所有子分類!!");
            // else
                alert("發生錯誤，請檢查網路或重新載入網頁");
        }





    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}



function delete_product_cate(id, is_main_cate) {
    $.ajax({
        type: "POST",
        url: "admin_product_cate/product_cate_delete",
        data: {'category_id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            getProductCatelist($('#product-cate-page .panel input[name="parent_cate_id"]').val());

            /*if(productHelper) {
                productHelper.getProductCate();
            }*/

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



$('#product-cate-page .add-cate-con .action').click(function(e) {

/*	alert('sdfdsf');
	return;
*/
	if($('#product-cate-page input[name="update_cate_id"]').val() == '0') {
	    $( "#product-cate-page .add-cate-con" ).hide();

	    var form_data = new FormData();
	    form_data.append("cate_name", $('#product-cate-page .add-cate-con input[name="cate_name"]').val());
	    form_data.append("description", $('#product-cate-page .add-cate-con textarea[name="description"]').val());
	    form_data.append("keywords", $('#product-cate-page .add-cate-con input[name="keywords"]').val());
	    form_data.append("img_url", $('#product-cate-page .add-cate-con input[name="img_url"]').val());
	    form_data.append("parent_cate_id", $('#product-cate-page .panel input[name="parent_cate_id"]').val());

	    form_data.append("is_promotion", $('#product-cate-page .add-cate-con select[name="is_promotion"]').val());


	    $.ajax({
	        url: "admin_product_cate/product_cate_insert",
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

	            /*if(productHelper) {
	                productHelper.getProductCate();
	            }*/
	            

	            getProductCatelist($('#product-cate-page .panel input[name="parent_cate_id"]').val());
	            $('#product-cate-page .add-cate-con input[name="cate_name"]').val('');
	        } else {

	        	if(json_data.msg == 'slug_repeat')
	        		alert("建立類別失敗，類別名稱重複 !");
	        	else
	            	alert("建立類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	} else {

		var form_data = new FormData();
	    form_data.append("cate_name", $('#product-cate-page .add-cate-con input[name="cate_name"]').val());
	    form_data.append("description", $('#product-cate-page .add-cate-con textarea[name="description"]').val());
	    form_data.append("keywords", $('#product-cate-page .add-cate-con input[name="keywords"]').val());
	    form_data.append("img_url", $('#product-cate-page .add-cate-con input[name="img_url"]').val());
	    form_data.append("is_promotion", $('#product-cate-page .add-cate-con select[name="is_promotion"]').val());

	    form_data.append("category_id", $('#product-cate-page input[name="update_cate_id"]').val());

	    $.ajax({
	        url: "admin_product_cate/product_cate_update",
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

	            /*if(productHelper) {
	                productHelper.getProductCate();
	            }*/
	            
	            getProductCatelist($('#product-cate-page .panel input[name="parent_cate_id"]').val());
	            closeProductCateUpdate();

	        } else {
	        	if(json_data.msg == 'slug_repeat')
	        		alert("修改類別失敗，類別名稱重複 !");
	        	else
	            	alert("修改類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	}
});


$('#product-cate-page .add-cate-con .remove').click(function(e) {
    closeProductCateUpdate();
});

function closeProductCateUpdate() {
	$('#product-cate-page .add-cate-con input[name="cate_name"]').val('');
	$('#product-cate-page input[name="update_cate_id"]').val('0');
	//$view.find('.remove').hide();
	$('#product-cate-page .add-cate-con').hide();
}

