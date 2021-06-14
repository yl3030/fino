//var nowProjectPage = 1;


$( "#post-cate-page .main-cate .add-cate" ).click(function(){

    $('#post-cate-page .main-cate input[name="cate_name"]').val('');
	$('#post-cate-page .main-cate input[name="update_id"]').val('0');
	$('#post-cate-page .main-cate .in-sub').html('新增');
	$('#post-cate-page .main-cate .remove').hide();
	$('#post-cate-page .main-cate .add-cate-con').show();

});

$( "#post-cate-page .sub-cate .add-cate" ).click(function(){
    $('#post-cate-page .sub-cate input[name="cate_name"]').val('');
	$('#post-cate-page .sub-cate input[name="update_id"]').val('0');
	$('#post-cate-page .sub-cate .in-sub').html('新增');
	$('#post-cate-page .sub-cate .remove').hide();
	$('#post-cate-page .sub-cate .add-cate-con').show();
});

getMainPostCatelist();

function getMainPostCatelist()
{
    $.ajax({
        type: "POST",
        url: "admin_post_cate/main_cate_list",
        data: {
            'num': 0, 
            'start': 0
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $( "#post-cate-page .main-cate .panel-body" ).empty();


        for(var i = 0; i < json_data.data.post_main_cate.length; i++)
        {   
            $( "#post-cate-page .main-cate .panel-body" ).append('<div class="cate-b" role-data="'
                        + json_data.data.post_main_cate[i].category_id + '">'
                        + '<span>' + json_data.data.post_main_cate[i].name + '</span>'
                        + '<i class="fa fa-trash"></i><i class="fa fa-pencil"></i></div>');
        }

        $('#post-cate-page .main-cate .cate-b').unbind('click');
        $('#post-cate-page .main-cate .cate-b').click(function (){
            $('#post-cate-page .main-cate .cate-b').removeClass('active');
            $(this).addClass('active');



            $('#post-cate-page .main-cate input[name="main_cate_id"]').val($(this).attr('role-data'));
            getSubPostCatelist($(this).attr('role-data'));
            $('#post-cate-page .sub-cate .panel-title').html($(this).find('span').html() + ' - 子類別');
        });

        $('#post-cate-page .main-cate .cate-b .fa-trash').unbind('click');
        $('#post-cate-page .main-cate .cate-b .fa-trash').click(function (e){
            e.stopPropagation();
            var r = confirm("確定要刪除這個類別嗎 ?");
            if (r == true) {
                delete_post_cate($(this).parent().attr('role-data'), true);
            }
        });

        $('#post-cate-page .main-cate .cate-b .fa-pencil').unbind('click');
        $('#post-cate-page .main-cate .cate-b .fa-pencil').click(function (e){
        	e.stopPropagation();
            //get_post_by_id($(this).attr('data-post-id'));


            //$(this).parent().attr('role-data');



            $('#post-cate-page .main-cate input[name="cate_name"]').val($(this).parent().find('span').html());
			$('#post-cate-page .main-cate input[name="update_id"]').val($(this).parent().attr('role-data'));
			$('#post-cate-page .main-cate .in-sub').html('修改');
			$('#post-cate-page .main-cate .remove').show();
			$('#post-cate-page .main-cate .add-cate-con').show();





            //alert('update');
        });

    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}



function getSubPostCatelist(main_cate_id)
{
    $.ajax({
        type: "POST",
        url: "admin_post_cate/sub_cate_list",
        data: {
            'main_cate_id': main_cate_id
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $( "#post-cate-page .sub-cate .panel-body" ).empty();


        for(var i = 0; i < json_data.data.post_main_cate.length; i++)
        {   
            $( "#post-cate-page .sub-cate .panel-body" ).append('<div class="cate-b" role-data="'
                        + json_data.data.post_main_cate[i].category_id + '">'
                        + '<span>' + json_data.data.post_main_cate[i].name + '</span>'
                        + '<i class="fa fa-trash"></i><i class="fa fa-pencil"></i></div>');
        }

        $('#post-cate-page .sub-cate .cate-b .fa-trash').unbind('click');
        $('#post-cate-page .sub-cate .cate-b .fa-trash').click(function (){
            var r = confirm("確定要刪除這個類別嗎 ?");
            if (r == true) {
                delete_post_cate($(this).parent().attr('role-data'), false);
            }
        });

        $('#post-cate-page .sub-cate .cate-b .fa-pencil').unbind('click');
        $('#post-cate-page .sub-cate .cate-b .fa-pencil').click(function (e){
           
            e.stopPropagation();

            $('#post-cate-page .sub-cate input[name="cate_name"]').val($(this).parent().find('span').html());
			$('#post-cate-page .sub-cate input[name="update_id"]').val($(this).parent().attr('role-data'));
			$('#post-cate-page .sub-cate .in-sub').html('修改');
			$('#post-cate-page .sub-cate .remove').show();
			$('#post-cate-page .sub-cate .add-cate-con').show();

        });

        /*$('#post-cate-page .sub-cate .cate-b').unbind('click');
        $('#post-cate-page .sub-cate .cate-b').click(function (){
            $('#post-cate-page .sub-cate .cate-b').removeClass('active');
            $(this).addClass('active');

            sub_cate_list
        });*/


    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}



function delete_post_cate(id, is_main_cate) {
    $.ajax({
        type: "POST",
        url: "admin_post_cate/post_cate_delete",
        data: {'category_id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            if(is_main_cate)
                getMainPostCatelist();
            else
                getSubPostCatelist($('#post-cate-page .main-cate input[name="main_cate_id"]').val());

            if(postHelper) {
                postHelper.getPostCate();
            }
            //get_post_list(20, 1);
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



$('#post-cate-page .main-cate .in-sub').click(function(e) {

    if($('#post-cate-page .main-cate input[name="update_id"]').val() == 0) {
    	$( "#post-cate-page .main-cate .add-cate-con" ).hide();
	    var form_data = new FormData();
	    form_data.append("cate_name", $('#post-cate-page .main-cate input[name="cate_name"]').val());

	    $.ajax({
	        url: "admin_post_cate/post_cate_insert",
	        dataType: 'json',
	        cache: false,
	        contentType: false,
	        processData: false,
	        data: form_data,
	        type: 'post'
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {

	            if(postHelper) {
	                postHelper.getPostCate();
	            }
	            



	            getMainPostCatelist();
	            $('#post-cate-page .main-cate input[name="cate_name"]').val('');
	        } else {
	            alert("建立類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	} else {

		$( "#post-cate-page .main-cate .add-cate-con" ).hide();
	    var form_data = new FormData();
	    form_data.append("cate_name", $('#post-cate-page .main-cate input[name="cate_name"]').val());
	    form_data.append("category_id", $('#post-cate-page .main-cate input[name="update_id"]').val());

	    $.ajax({
	        url: "admin_post_cate/post_cate_update",
	        dataType: 'json',
	        cache: false,
	        contentType: false,
	        processData: false,
	        data: form_data,
	        type: 'post'
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {
	            if(postHelper) {
	                postHelper.getPostCate();
	            }
	            
	            getMainPostCatelist();
	            closePostCateUpdate($('#post-cate-page .main-cate'));
	        } else {
	            alert("建立類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	}
});


$('#post-cate-page .main-cate .remove').click(function(e) {
    closePostCateUpdate($('#post-cate-page .main-cate'));
});

$('#post-cate-page .sub-cate .remove').click(function(e) {
    closePostCateUpdate($('#post-cate-page .sub-cate'));
});

function closePostCateUpdate($view) {
	$view.find('input[name="cate_name"]').val('');
	$view.find('input[name="update_id"]').val('0');
	$view.find('.remove').hide();
	$view.find('.add-cate-con').hide();
}



$('#post-cate-page .sub-cate .in-sub').click(function(e) {


	if($('#post-cate-page .sub-cate input[name="update_id"]').val() == 0) {

	    if($('#post-cate-page .main-cate input[name="main_cate_id"]').val() == '-1'){
	        alert("請選擇一個主類別");
	        return;
	    }

	    $( "#post-cate-page .sub-cate .add-cate-con" ).hide();

	    var form_data = new FormData();
	    form_data.append("cate_name", $('#post-cate-page .sub-cate input[name="cate_name"]').val());
	    form_data.append("main_cate_id", $('#post-cate-page .main-cate input[name="main_cate_id"]').val());

	    $.ajax({
	        url: "admin_post_cate/post_cate_insert",
	        dataType: 'json',
	        cache: false,
	        contentType: false,
	        processData: false,
	        data: form_data,
	        type: 'post'
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {
	            if(postHelper) {
	                postHelper.getPostCate();
	            }
	            
	            getSubPostCatelist($('#post-cate-page .main-cate input[name="main_cate_id"]').val());
	            $('#post-cate-page .sub-cate input[name="cate_name"]').val('');
	        } else {
	            alert("建立類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	} else {

		$( "#post-cate-page .sub-cate .add-cate-con" ).hide();
	    var form_data = new FormData();
	    form_data.append("cate_name", $('#post-cate-page .sub-cate input[name="cate_name"]').val());
	    form_data.append("category_id", $('#post-cate-page .sub-cate input[name="update_id"]').val());

	    $.ajax({
	        url: "admin_post_cate/post_cate_update",
	        dataType: 'json',
	        cache: false,
	        contentType: false,
	        processData: false,
	        data: form_data,
	        type: 'post'
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {
	            if(postHelper) {
	                postHelper.getPostCate();
	            }
	            
	            getSubPostCatelist($('#post-cate-page .main-cate input[name="main_cate_id"]').val());
	            closePostCateUpdate($('#post-cate-page .sub-cate'));
	        } else {
	            alert("建立類別失敗，請檢查資料都有輸入齊全 !");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
	}
});

