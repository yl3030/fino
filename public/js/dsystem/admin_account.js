$("#cus_account_form").submit(function(e) {
    e.preventDefault();

   // $('#cus_account_form .user-name').val()
   // $('#cus_account_form .user-email').val()
    


    if($('#cus_account_form .password').val().length < 6){
        alert("密碼不可以小於 6 個字!!");
        return;
    }

    if($('#cus_account_form .password').val() != $('#cus_account_form .password-again').val()){
        alert("密碼確認不相符!!");
        return;
    }
    


   // return;


    $.ajax({
        type: "POST",
        url: "admin_account/insert_admin_account",
        data: $("#cus_account_form").serialize()
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            alert("新增客服成功 !");
            $('#cus-account-dt-pop').fadeOut();
            get_customer_service_account();
        } else {
            if(json_data.msg == 'lack_data')
                alert("新增客服失敗，請檢查資料都有輸入齊全 !");
            else if(json_data.msg == 'mail_already')
                alert("信箱已經存在 !");
            else if(json_data.msg == 'email_error')
                alert("信箱格式錯誤 !");
            else if(json_data.msg == 'pwd_short')
                alert("密碼太短 !");
            else if(json_data.msg == 'pwd_not_match')
                alert("確認密碼不符合 !");
            else
                alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });


        /*form_data.append("schoolfile", file_data);
        form_data.append("level1_city_id", $('#school-dt-pop .level1_city_id').val());
        form_data.append("level2_city_id", $('#school-dt-pop .level2_city_id').val());
        form_data.append("school_name_tw", $('#school-dt-pop .school_name_tw').val());
        form_data.append("school_name_jp", $('#school-dt-pop .school_name_jp').val());
        form_data.append("school_name_en", $('#school-dt-pop .school_name_en').val());
        form_data.append("school_type", $('#school-dt-pop .school_type').val());
        form_data.append("postal_code", $('#school-dt-pop .postal_code').val());*/
});











function get_customer_service_account()
{
	$.ajax({
        type: "POST",
        url: "admin_account/get_customer_service_list"
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            $('#account-page .customer-con').html('');

        	for(var i = 0; i < json_data.data.length; i++)
        	{
        		$('#account-page .customer-con').append(
        				'<div class="container-fluid"><div class="panel panel-default">'
                        + '<div class="panel-heading"><h3 class="panel-title">客服'
                        + (i + 1) + '.</h3></div><div class="panel-body">'
						+ '<div class="form-group required"><label class="col-sm-2 control-label">'
						+ 'email</label><div class="col-sm-10">'
                        + '<input type="text" class="form-control email" value="' + json_data.data[i].email + '">'
                        + '</div></div><div class="form-group required">'
                        + '<label class="col-sm-2 control-label">專員名字</label>'
                        + '<div class="col-sm-10">'
                       	+ '<input type="text" class="form-control name" value="' + json_data.data[i].name + '">'
                        + '</div></div><div class="form-group required">'
                        + '<label class="col-sm-2 control-label">建立時間</label>'
                        + '<div class="col-sm-10">'
                        + '<input type="text" class="form-control" disabled="disabled" value="' 
                        + json_data.data[i].add_time + '">'
                        + '</div></div>'


                        + '<div class="form-group required">'
                        + '<label class="col-sm-2 control-label">權限控管</label>'
                        + '<div class="col-sm-10 auth-list">'


						+ '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.user_permission ? 'checked="checked"' : '')  + ' name="user_permission">會員管理權限'
                        + '</label></div>'
                        + '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.order_permission ? 'checked="checked"' : '')  + ' name="order_permission">訂單管理權限'
                        + '</label></div>'
                        + '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.article_permission ? 'checked="checked"' : '')  + ' name="article_permission">文章管理權限'
                        + '</label></div>'
                        + '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.product_permission ? 'checked="checked"' : '')  + ' name="product_permission">商品管理權限'
                        + '</label></div>'
                        + '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.shipping_permission ? 'checked="checked"' : '')  + ' name="shipping_permission">運費管理權限'
                        + '</label></div>'
                        + '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.activity_permission ? 'checked="checked"' : '')  + ' name="activity_permission">活動管理權限'
                        + '</label></div>'
                        + '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.store_permission ? 'checked="checked"' : '')  + ' name="store_permission">通路管理權限'
                        + '</label></div>'
                        + '<div class="col-sm-6 pg-0"><label>'
                        + '<input type="checkbox" ' + (json_data.data[i].permissions.media_box_permission ? 'checked="checked"' : '')  + ' name="media_box_permission">媒體櫃管理權限'
                        + '</label></div>'


                        + '</div></div>'


                        + '<div class="tr plr-15"><div class="btn btn-gold update mgr-15" data-id="'
                        + json_data.data[i].id + '">修改</div><div class="btn btn-gold delete" data-id="'
                        + json_data.data[i].id + '">刪除</div></div>'


                        + '<div class="cus-pwd"><hr /><div class="form-group required">'
                        + '<label class="col-sm-2 control-label">重設密碼</label>'
                        + '<div class="col-sm-10">'
                        + '<input type="text" class="form-control newpwd" value="">'
                        + '<label>★ 請記好密碼，以後不會再顯示</label></div></div>'
                        + '<div class="tr plr-15"><div class="btn btn-gold repwd" data-id="'
                        + json_data.data[i].id + '">重設</div></div></div>'



                        + '</div></div></div>');
        	}


        	$('#account-page .customer-con .update').unbind('click');
            $('#account-page .customer-con .update').click(function (){
                
            	update_non_su_admin_user({
            		'account_id': $(this).attr("data-id"), 
					'email': $(this).parent().parent().find('.email').val(), 
					'name': $(this).parent().parent().find('.name').val(),

                    'user_permission': $(this).parent().parent().find('input[name="user_permission"]').is(':checked') ? '1' : '0',
                    'order_permission': $(this).parent().parent().find('input[name="order_permission"]').is(':checked') ? '1' : '0',
                    'article_permission': $(this).parent().parent().find('input[name="article_permission"]').is(':checked') ? '1' : '0',
                    'product_permission': $(this).parent().parent().find('input[name="product_permission"]').is(':checked') ? '1' : '0',
                    'shipping_permission': $(this).parent().parent().find('input[name="shipping_permission"]').is(':checked') ? '1' : '0',
                    'activity_permission': $(this).parent().parent().find('input[name="activity_permission"]').is(':checked') ? '1' : '0',
                    'store_permission': $(this).parent().parent().find('input[name="store_permission"]').is(':checked') ? '1' : '0',
                    'media_box_permission': $(this).parent().parent().find('input[name="media_box_permission"]').is(':checked') ? '1' : '0'
				});

            });

            $('#account-page .customer-con .repwd').unbind('click');
            $('#account-page .customer-con .repwd').click(function (){

            	update_non_su_admin_user_pwd({
            		'account_id': $(this).attr("data-id"), 
            		'pwd': $(this).parent().parent().find('.newpwd').val()
				}, $(this).parent().parent().find('.newpwd'));

            });

	    } else {
	    	alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

get_customer_service_account();


function update_non_su_admin_user(data)
{
	$.ajax({
        type: "POST",
        url: "admin_account/update_admin_account",
        data: data
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
        	alert( "修改資訊成功!!" );
	    } else {
	    	if(json_data.msg == 'lack_data')
	    		alert( "請輸入未填資訊!!" );
	    	else	
	    		alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

function update_non_su_admin_user_pwd(data, $input)
{
	$.ajax({
        type: "POST",
        url: "admin_account/update_admin_account_pwd",
        data: data
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
        	$input.val('');
        	alert( "修改密碼成功!!" );
	    } else {
	    	if(json_data.msg == 'lack_data')
	    		alert( "請輸入未填資訊!!" );
	    	else	
	    		alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}


$('.close-btn').unbind('click');
$('.close-btn').click(function (){
    $("#" + $(this).attr('role-btn')).fadeOut(); 
});

$('#account-page #tab-customer-service-account .cre-cus').click(function (){
	$('#cus-account-dt-pop').fadeIn();
});



$('#account-page #tab-superadmin-account #tab-superadmin-pwd .tr.plr-15 .btn').click(function (){

	if($('#account-page #tab-superadmin-account #tab-superadmin-pwd .new-pwd').val() == 
		$('#account-page #tab-superadmin-account #tab-superadmin-pwd .new-pwd-again').val()){
		update_su_admin_user_pwd({
			'old_pwd': $('#account-page #tab-superadmin-account #tab-superadmin-pwd .old-pwd').val(),
			'new_pwd': $('#account-page #tab-superadmin-account #tab-superadmin-pwd .new-pwd').val()
		});
	}else{
		alert('兩次密碼輸入不一樣')	;
	}
	/*$('#account-page #tab-superadmin-account .old-pwd')
	$('#account-page #tab-superadmin-account .new-pwd')
	$('#account-page #tab-superadmin-account .new-pwd-again')*/

	
});

function update_su_admin_user_pwd(data)
{
	$.ajax({
        type: "POST",
        url: "admin_account/change_su_admin_account_pwd",
        data: data
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
        	$('#account-page #tab-superadmin-account #tab-superadmin-pwd .old-pwd').val('');
			$('#account-page #tab-superadmin-account #tab-superadmin-pwd .new-pwd').val('');
			$('#account-page #tab-superadmin-account #tab-superadmin-pwd .new-pwd-again').val('');
        	alert( "修改密碼成功!!" );
	    } else {
	    	if(json_data.msg == 'pwd_error')
	    		alert( "舊密碼輸入錯誤!!" );
	    	else if(json_data.msg == 'pwd_short')
	    		alert( "新密碼太短!!" );
	    	else if(json_data.msg == 'lack_data')
	    		alert( "未輸入密碼!!" );
	    	else	
	    		alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}





