$('#info-data-setting-page .tr.plr-15 .btn-gold').click(function (){

	setting_index = $(this).parent().parent().attr("id");

	if(setting_index == 'tab-school-info-setting') {
		update_data_info_setting({
			'school_free_valid_day': $('#info-data-setting-page .school-valid-day').val(), 
			'school_free_sticker': $('#info-data-setting-page .school-free-sticker').val()
		});
	} else if(setting_index == 'tab-user-info-setting') {
		update_data_info_setting({
			'user_free_valid_day': $('#info-data-setting-page .user-valid-day').val(), 
			'user_free_sticker': $('#info-data-setting-page .user-free-sticker').val(),
			'invite_code_own_sticker_count': $('#info-data-setting-page .user-invite-fri-sticker').val(),



			'invite_code_use_sticker_count': $('#info-data-setting-page .user-use-invite-code-get-s').val()



		});
	} else if(setting_index == 'tab-ad-info-setting') {
		update_data_info_setting({
			'jp_ad_free_valid_day': $('#info-data-setting-page .jp-ad-free-valid-day').val(), 
			'tw_support_free_valid_day': $('#info-data-setting-page .tw-support-free-valid-day').val()
		});
	} else if(setting_index == 'tab-customer-service') {
		update_data_info_setting({
			'customer_service_default_msg': $('#info-data-setting-page .default-customer-service-msg').val()
		});
	}
});

function update_data_info_setting(data)
{
	$.ajax({
        type: "POST",
        url: "admin_info_data_setting/update_data_info",
        data: data
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
	        if(json_data.data.school_free_valid_day != undefined) {
		        $('#info-data-setting-page .school-valid-day').val(json_data.data.school_free_valid_day);
		        $('#info-data-setting-page .school-valid-day').attr('old-value', json_data.data.school_free_valid_day);
			}

			if(json_data.data.school_free_sticker != undefined) {
		        $('#info-data-setting-page .school-free-sticker').val(json_data.data.school_free_sticker);
		        $('#info-data-setting-page .school-free-sticker').attr('old-value', json_data.data.school_free_sticker);
		    }

		    if(json_data.data.user_free_valid_day != undefined) {
		        $('#info-data-setting-page .user-valid-day').val(json_data.data.user_free_valid_day);
		        $('#info-data-setting-page .user-valid-day').attr('old-value', json_data.data.user_free_valid_day);
			}

			if(json_data.data.user_free_sticker != undefined) {
		        $('#info-data-setting-page .user-free-sticker').val(json_data.data.user_free_sticker);
		        $('#info-data-setting-page .user-free-sticker').attr('old-value', json_data.data.user_free_sticker);
			}

			if(json_data.data.invite_code_own_sticker_count != undefined) {
	        	$('#info-data-setting-page .user-invite-fri-sticker').val(json_data.data.invite_code_own_sticker_count);
	        	$('#info-data-setting-page .user-invite-fri-sticker').attr('old-value', json_data.data.invite_code_own_sticker_count);
	        	$('#info-data-setting-page .user-use-invite-code-get-s').val(json_data.data.invite_code_use_sticker_count);
	        	$('#info-data-setting-page .user-use-invite-code-get-s').attr('old-value', json_data.data.invite_code_use_sticker_count);
	        }

	        if(json_data.data.jp_ad_free_valid_day != undefined) {
	       		$('#info-data-setting-page .jp-ad-free-valid-day').val(json_data.data.jp_ad_free_valid_day);
	        	$('#info-data-setting-page .jp-ad-free-valid-day').attr('old-value', json_data.data.jp_ad_free_valid_day);
			}

			if(json_data.data.tw_support_free_valid_day != undefined) {
		        $('#info-data-setting-page .tw-support-free-valid-day').val(json_data.data.tw_support_free_valid_day);
				$('#info-data-setting-page .tw-support-free-valid-day').attr('old-value', json_data.data.tw_support_free_valid_day);
			}

			if(json_data.data.customer_service_default_msg != undefined)
	        	$('#info-data-setting-page .default-customer-service-msg').val(json_data.data.customer_service_default_msg);

	        alert( "修改資訊設定成功!!" );
	    } else {
	    	if(json_data.msg == "is_not_int")
	    		alert( "輸入的資料不正確!!" );
	    	else
	    		alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}





function get_data_info_setting()
{
	$.ajax({
        type: "POST",
        url: "admin_info_data_setting/get_data_info"
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;
        
        if(json_data.result == "success")
        {
	        $('#info-data-setting-page .school-valid-day').val(json_data.data.school_free_valid_day);
	        $('#info-data-setting-page .school-free-sticker').val(json_data.data.school_free_sticker);

	        $('#info-data-setting-page .user-valid-day').val(json_data.data.user_free_valid_day);
	        $('#info-data-setting-page .user-free-sticker').val(json_data.data.user_free_sticker);
	        $('#info-data-setting-page .user-invite-fri-sticker').val(json_data.data.invite_code_own_sticker_count);

	        $('#info-data-setting-page .user-use-invite-code-get-s').val(json_data.data.invite_code_use_sticker_count);
	        
	        
	        $('#info-data-setting-page .jp-ad-free-valid-day').val(json_data.data.jp_ad_free_valid_day);
	        $('#info-data-setting-page .tw-support-free-valid-day').val(json_data.data.tw_support_free_valid_day);

	        $('#info-data-setting-page .default-customer-service-msg').val(json_data.data.customer_service_default_msg);


	        $('#info-data-setting-page .school-valid-day').attr('old-value', json_data.data.school_free_valid_day);
	        $('#info-data-setting-page .school-free-sticker').attr('old-value', json_data.data.school_free_sticker);

	        $('#info-data-setting-page .user-valid-day').attr('old-value', json_data.data.user_free_valid_day);
	        $('#info-data-setting-page .user-free-sticker').attr('old-value', json_data.data.user_free_sticker);
	        $('#info-data-setting-page .user-invite-fri-sticker').attr('old-value', json_data.data.invite_code_own_sticker_count);
	        
	        $('#info-data-setting-page .user-use-invite-code-get-s').attr('old-value', json_data.data.invite_code_use_sticker_count);

	        $('#info-data-setting-page .jp-ad-free-valid-day').attr('old-value', json_data.data.jp_ad_free_valid_day);
	        $('#info-data-setting-page .tw-support-free-valid-day').attr('old-value', json_data.data.tw_support_free_valid_day);
        } else {
        	alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

//get_data_info_setting();


