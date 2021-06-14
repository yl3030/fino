var options = '';
var isSending = false;
		

$(function() {

	var ProjectHelper = function(){
	    this.userFavCate;
	};

	ProjectHelper.prototype.initCate = function() {

		var _self = this;

		$sel = $('select[name="main_cate"]');

		var options = '<option value="0" selected>不限</option>';

		for (i in projectCate) {

			if($sel.attr('init') == projectCate[i]['category_id'])
				sel = ' selected';
			else
				sel = '';

	  		options += '<option' + sel + ' value="' + projectCate[i]['category_id'] + '">' 
	  		 		+ projectCate[i]['name'] + '</option>';
		}



		$sel.html(options);
		if (typeof $sel.selectpicker === "function")
			$sel.selectpicker('refresh');


		// sub-cate-con inb">
		// 						<select name="sub_cate"

		_self.getSubCate($('[name="sub_cate"]'), $sel.attr('init'), true);



		$sel.on('change', function(e){

			_self.getSubCate($('[name="sub_cate"]'), $(this).val(), false);

		});
	};

	ProjectHelper.prototype.getSubCate = function($sel, categoryId, isFirstIn) {

		var _self = this;

		options = '<option value="0" selected>不限</option>';

		if((categoryId == 1) || (categoryId == 2)) {
			$('.delivery_time').show();
		} else {
			$('.delivery_time').hide();
		}

		if(projectCate[categoryId]) {
			for (i in projectCate[categoryId]['list']) {

				if(isFirstIn) {
					if($sel.attr('init') == projectCate[categoryId]['list'][i]['category_id'])
						sel = ' selected';
					else
						sel = '';
				}

		  		options += '<option' + sel + ' value="' + projectCate[categoryId]['list'][i]['category_id'] + '">' 
		  		 		+ projectCate[categoryId]['list'][i]['name'] + '</option>';
			}

			if(projectCate[categoryId]['list'].length > 0)
				$('.sub-cate-con').show();
			else
				$('.sub-cate-con').hide();
		} else
			$('.sub-cate-con').hide();

		$sel.html(options);
		$sel.selectpicker('refresh');
	};

	projectHelper = new ProjectHelper();
    projectHelper.initCate();
});






$(function() {


	$('#new-project').on('focusout', 'input[name="num_of_member"], input[name="budget_start"], input[name="budget_end"]', function(event) {
		
		if(!isNormalInteger($(this).val())) {
			alert('請輸入正確數字');
			$(this).val('');
		}
	});

	$('#new-project .add-example').click(function(event) {

		var r = confirm("您確定要加入範例嗎 ?");
        if (r == true) {
			$('#new-project textarea[name="brief"]').val("我們目前 _____請填寫專案成立的背景_____ ，因此希望與創作者合作。\n\n本專案的目標是 _____請填寫專案目標_____  ，想要與 _____請填寫想合作的創作者類型或特質_____ 的創作者合作，希望創作者協助 _____請填寫希望創作者執行的內容_____ 。");
			$('#new-project .example-con').html("=========== 以下為文字範例 ===========<br><br>我們目前欠缺有創意的影片宣傳產品，因此希望與創作者合作。<br><br>本專案的目標是透過Youtuber介紹我們的新產品<FiNO咖啡> ，想要與像HowFun這樣優秀的創作者合作，希望創作者協助提供有梗又好笑的開箱影片。<br><br>");
		}
	});

	$('.up-con .filename').on('click', '.remove', function(event) {
		$('#new-project input[name="file"]').val('');
		$('.up-con .filename').html('');
	   // alert('remove');
	});

	$('#new-project input[name="file"]').change(function(e) {
		var filename = e.target.files[0].name;

		$(this).parent().parent().find('.filename').html(filename + '<a class="remove" type="submit"><i class="fa fa-remove"></i></a>');
		//$('.file-name span').html(filename);
	});

	$( ".datepicker" ).datepicker({ 
		//defaultDate: new Date().getFullYear() + '-08-08', 
		changeYear: true, 
		dateFormat: 'yy-mm-dd',
		yearRange: new Date().getFullYear() + ':' + (new Date().getFullYear() + 5)
	});
		
	$('.add-page').on('click', function(e) {
		
		$('.add-page-con').show();
		$('.social-page-con').hide();
		
	});

	$('.social-list .social-item').on('click', function(e) {
		
		$('.social-list .social-item').removeClass('active');
		$(this).addClass('active');
	});

	
	$('#new-project').on('submit', function(e) {
		e.preventDefault();
        e.stopPropagation();

        if(isSending)
        	return;
		
        createProject();
	});






	var allOptionIsSelected = false;

	function toggleSelectAll(control) {

		var preAllOptionIsSelected = allOptionIsSelected;

	    allOptionIsSelected = (control.val() || []).indexOf("all") > -1;
	    function valuesOf(elements) {
	        return $.map(elements, function(element) {
	            return element.value;
	        });
	    }

	    if(preAllOptionIsSelected && allOptionIsSelected) {

	    	control.selectpicker('val', valuesOf(control.find('option:selected[value!=all]')));
	    	allOptionIsSelected = false;

	    } else if(allOptionIsSelected) {

	    	control.selectpicker('val', valuesOf(control.find('option:first-child')));

	    }
	}

	$('#platform').selectpicker().change(function(){toggleSelectAll($(this));}).trigger('change');














	$('#project-edit').on('submit', function(e) {
		e.preventDefault();
        e.stopPropagation();

        if(isSending)
        	return;
		
        editProject();
	});
});




function createProject() {
    
    var _self = (event.data) ? event.data : this;
    var file_data = $('#new-project input[name="file"]').prop("files")[0];

    var form_data = new FormData();


    if(!$('.brand-list .brand-item.active').length){
    	alert('請輸入選擇品牌!');
		return;
    }


	if($('#new-project input[name="project_name"]').val().trim() == '') {
		alert('請輸入專案名稱!');
		return;
	}

	if($('#new-project textarea[name="brief"]').val().trim() == '') {
		alert('請輸入專案達成的目標!');
		return;
	}

	if(!$('#new-project select[name="platform"]').val()) {
		alert('請選擇平台!');
		return;
	}

	if(!file_data && ($('#new-project textarea[name="requests"]').val().trim() == '')) {
    	alert('請輸入創作要求與規範或是上傳檔案!');
    	return;
    }

    form_data.append("file", file_data);

	if($('#new-project input[name="recruit_dl"]').val().trim() == '') {
		alert('請選擇招募截止日期!');
		return;
	}



	if(($('#new-project select[name="main_cate"]').val() == 1 || $('#new-project select[name="main_cate"]').val() == 2) 
		&& ($('#new-project input[name="delivery_time"]').val().trim() == '')) {
		alert('請選擇初稿交付日期!');
		return;
	}

	if($('#new-project input[name="publish_time"]').val().trim() == '') {
		alert('請選擇希望上稿日期!');
		return;
	}



	if($('#new-project input[name="num_of_member"]').val() == '') {

		//isNormalInteger($('#new-project input[name="num_of_member"]').val())

		alert('請輸入招募人數!');
		return;
	}

	if($('#new-project input[name="budget_start"]').val() == '') {
		alert('請輸入每人預算範圍!');
		return;
	}

	if($('#new-project input[name="budget_end"]').val() == '') {
		alert('請輸入每人預算範圍!');
		return;
	}


    form_data.append("project_name", $('#new-project input[name="project_name"]').val());
    form_data.append("main_cate", $('#new-project select[name="main_cate"]').val());
	form_data.append("sub_cate", $('#new-project select[name="sub_cate"]').val());
    form_data.append("brief", $('#new-project textarea[name="brief"]').val());

    form_data.append("requests", $('#new-project textarea[name="requests"]').val());
    form_data.append("platform", $('#new-project select[name="platform"]').val());

    form_data.append("recruit_dl", $('#new-project input[name="recruit_dl"]').val());
    form_data.append("delivery_time", $('#new-project input[name="delivery_time"]').val());
    form_data.append("publish_time", $('#new-project input[name="publish_time"]').val());
    form_data.append("authorize", $('#new-project select[name="authorize"]').val());
    form_data.append("payment", $('#new-project select[name="payment"]').val());
    form_data.append("num_of_member", $('#new-project input[name="num_of_member"]').val());
    form_data.append("budget_start", $('#new-project input[name="budget_start"]').val());
    form_data.append("budget_end", $('#new-project input[name="budget_end"]').val());
    form_data.append("is_public", $('#new-project input[name="is_public"]:checked').val());
    form_data.append("brand", $('.brand-list .brand-item.active').attr('rol'));


    isSending = true;
    $('.project-block').fadeIn(200);

    $.ajax({
        url: "project_create",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post'
    }).done(function( json_data ) {
        // if(!auth_response_pre_processer(json_data))
        //     return;

        if(json_data.result == "success")
        {
           // alert("建立專案成功 !");
            if (json_data.data.url) 
				location.href = json_data.data.url;
			else 
				alert('請稍後再試');

        } else {
        	if(json_data.msg == 'file_err')
				alert('檔案上錯誤，請選擇其他格式的檔案');
			else
				alert('建立專案失敗，請檢查資料都有輸入齊全 !');
           // alert("建立活動失敗，請檢查資料都有輸入齊全 !");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
    	isSending = false;
    	$('.project-block').fadeOut(200);
    });
};


function is_numeric(str){
    return /^\d+$/.test(str);
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

$('.brand-list .brand-item').click(function(){

	$('.brand-list .brand-item').removeClass('active');
	$(this).addClass('active');

});




function editProject() {

	var contractId = $('#project-contract input[name="contract_id"]').val();

	var formData = new FormData($('#project-edit')[0]);
//	var formData = getFormData($('#project-contract'));

	formData.delete('share');
	formData.append('share', '1');





	// } else
	// 	formData.append('share', '0');

    // var fileData = $('.file-uploader .img-select').prop("files")[0];  
    // formData.append("contract_file", fileData);

    // if(isDraft)
    // 	url = base_url + 'contract/draft';
    // else if(contractId && $('#project-contract input[name="is_draft"]').val() == 0)
    // 	url = base_url + 'contract/update/' + contractId;
    // else
    // 	url = base_url + 'contract/create';

	sendPost('project_edit__', formData, function(json) {

		if(json.result == "success") {

			if(isDraft == 0){

				kolItem.find('td').eq(1).html('<span class="state">等待網紅確認合約</span>');
				kolItem.find('td').eq(2).html('<a class="ctr-detail" rol="'
					+ json.data.contract_id + '">合約內容</a>');
				kolItem.find('td').eq(3).html('<a class="btn crt-contract" role="'
					+ $('#project-contract').find('input[name="user_id"]').val() + '" rol="up">修改合約</a>');

				showAlert('送出合約成功!', 'ok');
				$('.contract-pop').fadeOut();
			}else{

				kolItem.find('td').eq(3).html('<a class="btn crt-contract" role="'
					+ $('#project-contract').find('input[name="user_id"]').val() + '" rol="up">建立合約(草稿)</a>');

				showAlert('存成草稿成功!', 'ok');
				$('.contract-pop').fadeOut();
			}
		} else {
			if(json.msg == 'no_login') {
				showAlert('登入後才可以洽談喔!', 'notice');
				window.location = base_url + "auth/login";
			} else
				showAlert(errorMsg(json.msg), 'notice');//showAlert('您已送出洽談', 'notice');
		}
	});
}






