var nowCouponPage = 1;


(function ($, window, i) {

    var CouponHelper = function(){
        this.rootView = $('#coupon-page');
        this.form = $('#coupon_form');
        this.listView = this.rootView.find('.coupon-list');
        this.editView = this.rootView.find('.coupon-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');
        this.user_counter = 0;

        this.editView.find( ".datepicker" ).datepicker({ 
        	dateFormat: 'yy-mm-dd'
        });


        this.editView.find('select[name="user_limit"]').on('change', this, function(event){
        	
        	var _self = (event.data) ? event.data : this;

        	if($(this).val() == '1') {
        		_self.editView.find('.coupon-user-list').hide();
			} else if($(this).val() == '2') {
				_self.editView.find('.coupon-user-list').show();
			}
        });

        this.editView.find(".coupon-user-list .add-user").on('click', this, function(event){

         	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

            var userId = _self.editView.find( ".coupon-user-list input[name='user_id']" ).val();

            var is_added = false;
        	var $preElement = '';
        	_self.editView.find(".coupon-user-list tbody input[name*='coupon_user']").each(function() {

        		if($(this).val() == userId) {
        			alert('用戶不可以重複!!');
        			is_added = true;
        			return;
        		}

	        });

	        if(is_added)
	        	return;

            $.ajax({
	            type: "POST",
	            url: "admin_user/get_user_by_id",
	            data: {'id': userId}
	        }).done(function( json_data ) {
	            if(!auth_response_pre_processer(json_data))
	                return;

	            if(json_data.result == "success")
	            {
			        var $tb = _self.editView.find('.coupon-user-list tbody');
			        var $tr = '<tr id="coupon-user-row' + _self.user_counter + '">'
		                + '<td class="text-left">' + json_data.data.id
						+ '</td><td class="text-left">'
						+ '<img class="user-thumb" src="' + json_data.data.photo + '">'
						+ '<input type="hidden" name="coupon_user[' + _self.user_counter + ']" value="' + json_data.data.id + '">'
						+ '</td><td class="text-left">' + json_data.data.name + '</td>'
						+ '<td class="text-left">'
						+ '<button type="button" onclick="$(\'#coupon-user-row' 
						+ _self.user_counter + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i></button>'
						+ '</td></tr>'

		           // if($preElement == '')
				        $tb.prepend($tr);
				  //  else
				    	//$preElement.after($tr);

			        _self.user_counter++;

	            }else{
	            	alert('不存在此用戶!!');
	            }
	        });
        });


        this.editBtn.on('click', this, function(event){
            var _self = (event.data) ? event.data : this;
            _self.editView.hide();
            _self.listView.show();
        });

        this.form.on('submit', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;

            if(_self.state.val() == 'insert')
                _self.createCoupon();
            else
                _self.updateCoupon();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });



        this.editView.find( ".rand-btn" ).on('click', this, function(event){
            $('.coupon-edit input[name="code"]').val(randomString(12));
        });


        //randomString(10);

    };

    CouponHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < couponCateJson.length; i++) {
            if(couponCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < couponCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + couponCateJson[i].sub_cate[k].category_id + '">' 
                    + couponCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    CouponHelper.prototype.yyyyyy = function(event) {
        var _self = (event.data) ? event.data : this;
        _self.editView.hide();
        _self.listView.show();
    };

    CouponHelper.prototype.getCouponList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowCouponPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_coupon/coupon_list",
            data: {
                'num': num, 
                'start': startCount
            }
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            _self.tableView.empty();
            _self.pagination.empty();
            _self.pagination.find('li').unbind('click');

            if(json_data.data.count > 20)
            {
                for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
                {
                    if(i == start)
                        _self.pagination.append('<li class="active"><a>' + i + '</a></li>');
                    else
                        _self.pagination.append('<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }

                _self.pagination.find('li').click(function (){
                    if($(this).hasClass("active"))
                        return false;
                    _self.getCouponList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.coupon.length; i++)
            {   
            	if(json_data.data.coupon[i].discount_type == 1)
            		json_data.data.coupon[i].discount_type = '折扣';
            	else
            		json_data.data.coupon[i].discount_type = '金額';


                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' + json_data.data.coupon[i].coupon_id + '</td>'
                            + '<td class="text-left">' + json_data.data.coupon[i].coupon_name + '</td>'
                            + '<td class="text-left desc">' + json_data.data.coupon[i].discount_type + '</td>'
                            + '<td class="text-left desc">' + json_data.data.coupon[i].create_user_id + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-coupon-id="' 
                            + json_data.data.coupon[i].coupon_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-coupon-id="' 
                            + json_data.data.coupon[i].coupon_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    _self.deleteCouponById($(this).attr('data-coupon-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.get_coupon_by_id($(this).attr('data-coupon-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    CouponHelper.prototype.createCoupon = function() {
        
        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        form_data.append("coupon_name", $('.coupon-edit input[name="coupon_name"]').val());
        form_data.append("code", $('.coupon-edit input[name="code"]').val());
        form_data.append("user_limit", $('.coupon-edit select[name="user_limit"]').val());
        form_data.append("discount_type", $('.coupon-edit select[name="discount_type"]').val());
        form_data.append("discount_val", $('.coupon-edit input[name="discount_val"]').val());
        form_data.append("start_time", $('.coupon-edit input[name="start_time"]').val());
        form_data.append("end_time", $('.coupon-edit input[name="end_time"]').val());
        form_data.append("remarks", $('.coupon-edit textarea[name="remarks"]').val());

        _self.editView.find('.coupon-user-list tbody input[name^="coupon_user"]').each(function() {
	    	form_data.append($(this).attr("name"), $(this).val());
	    });


        $.ajax({
            url: "admin_coupon/coupon_insert",
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
                alert("建立優惠卷成功 !");

                _self.getCouponList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
            	if(json_data.msg == 'no_user')
            		alert("請選擇用戶 !");
            	else if(json_data.msg == 'discount_err')
            		alert("折扣不得小於 7折(70以下)，或是金額不得小於等於 0!");
            	else if(json_data.msg == 'code_short')
            		alert("票卷序號至少12個字喔 !");
            	else
                	alert("建立優惠卷失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    CouponHelper.prototype.updateCoupon = function() {
        var _self = (event.data) ? event.data : this;
        
        var form_data = new FormData();

        form_data.append("coupon_id", $('.coupon-edit input[name="coupon_id"]').val());
        form_data.append("coupon_name", $('.coupon-edit input[name="coupon_name"]').val());
        form_data.append("code", $('.coupon-edit input[name="code"]').val());
        form_data.append("user_limit", $('.coupon-edit select[name="user_limit"]').val());
        form_data.append("discount_type", $('.coupon-edit select[name="discount_type"]').val());
        form_data.append("discount_val", $('.coupon-edit input[name="discount_val"]').val());
        form_data.append("start_time", $('.coupon-edit input[name="start_time"]').val());
        form_data.append("end_time", $('.coupon-edit input[name="end_time"]').val());
        form_data.append("remarks", $('.coupon-edit textarea[name="remarks"]').val());

        _self.editView.find('.coupon-user-list tbody input[name^="coupon_user"]').each(function() {
	    	form_data.append($(this).attr("name"), $(this).val());
	    });


        $.ajax({
            url: "admin_coupon/coupon_update",
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
                alert("修改優惠卷成功 !");
                
                _self.getCouponList(20, nowCouponPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
            	if(json_data.msg == 'code_short')
            		alert("票卷序號至少12個字喔 !");
            	else
                	alert("修改優惠卷失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    CouponHelper.prototype.getPostCate = function() {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_coupon/coupon_cate_list",
            data: {}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                couponCateJson = json_data.data;

                //options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';
                options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';

                for(var i = 0; i < couponCateJson.length; i++) {
                    options += '<option value="' + couponCateJson[i].category_id + '">' 
                        + couponCateJson[i].name + '</option>';
                }

                _self.editView.find('select[name="main-cate"]').html(options);

                sub_options = '';
                for(var i = 0; i < couponCateJson.length; i++) {
                    if(couponCateJson[i].category_id == _self.editView.find('select[name="main-cate"]').val()) {
                        for(var k = 0; k < couponCateJson[i].sub_cate.length; k++) {
                            sub_options += '<option value="' + couponCateJson[i].sub_cate[k].category_id + '">' 
                            + couponCateJson[i].sub_cate[k].name + '</option>';
                        }
                    }
                }

                _self.editView.find('select[name="sub-cate"]').html(sub_options);

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };

    CouponHelper.prototype.get_coupon_by_id = function(id) {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_coupon/get_coupon_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
            	_self.editorInit();
                $('.coupon-edit .state').val('update');

                _self.editView.find('input[name="coupon_id"]').val(json_data.data.coupon_id);

        		_self.editView.find('input[name="coupon_name"]').val(json_data.data.coupon_name);
        		_self.editView.find('input[name="code"]').val(json_data.data.code);
        		_self.editView.find('select[name="user_limit"]').val(json_data.data.user_limit);
        		_self.editView.find('select[name="discount_type"]').val(json_data.data.discount_type);
        		_self.editView.find('input[name="discount_val"]').val(json_data.data.discount_val);
        		_self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
        		_self.editView.find('input[name="end_time"]').val(json_data.data.end_time);
        		_self.editView.find('textarea[name="remarks"]').val(json_data.data.remarks);
                _self.editView.find('input[name="create_user"]').val(json_data.data.create_user_id);
                _self.editView.find('input[name="edit_time"]').val(json_data.data.edit_time);
                _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);


                if(json_data.data.user_limit == 2) {
                	for(var i = 0; i < json_data.data.user_list.length; i++) {

                		_self.editView.find('.coupon-user-list').show();

                		var $tb = _self.editView.find('.coupon-user-list tbody');
				        var $tr = '<tr id="coupon-user-row' + _self.user_counter + '">'
			                + '<td class="text-left">' + json_data.data.user_list[i].id
							+ '</td><td class="text-left">'
							+ '<img class="user-thumb" src="' + json_data.data.user_list[i].photo + '">'
							+ '<input type="hidden" name="coupon_user[' + _self.user_counter + ']" value="' + json_data.data.user_list[i].id + '">'
							+ '</td><td class="text-left">' + json_data.data.user_list[i].name + '</td>'
							+ '<td class="text-left">'
							+ '<button type="button" onclick="$(\'#coupon-user-row' 
							+ _self.user_counter + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i></button>'
							+ '</td></tr>'

			           // if($preElement == '')
					        $tb.prepend($tr);
					  //  else
					    	//$preElement.after($tr);

				        _self.user_counter++;
                	}
                }





                $("#coupon-page .coupon-edit").show();
                $("#coupon-page .coupon-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }



    CouponHelper.prototype.deleteCouponById = function(id) {

        var _self = (event.data) ? event.data : this;

        $.ajax({
	        type: "POST",
	        url: "admin_coupon/coupon_delete",
	        data: {'id': id}
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {
	            _self.getCouponList(20, 1);
	            alert("刪除優惠卷·成功 !");
	        } else {
	            alert("發生錯誤，請檢查網路或重新載入網頁");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
    }

    


    CouponHelper.prototype.editorInit = function() {

        this.editView.find('input[name="coupon_id"]').val('');
        this.editView.find('input[name="coupon_name"]').val('');
        this.editView.find('input[name="code"]').val('');
        this.editView.find('select[name="count"]').val(-1);
        this.editView.find('select[name="discount_type"]').val(1);
        this.editView.find('input[name="discount_val"]').val('');
        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('textarea[name="remarks"]').val('');
        this.editView.find('input[name="edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');


        this.editView.find('select[name="user_limit"]').val('1');
        this.editView.find('.coupon-user-list').hide();
        this.editView.find('.coupon-user-list tbody').html('');


        
        this.user_counter = 0;

        this.editView.show();
        this.listView.hide();
    };




    couponHelper = new CouponHelper();
    couponHelper.getCouponList(20, nowCouponPage);
   // couponHelper.getPostCate();

})(jQuery, this, 0);





$('#coupon-page .create').click(function (){

    $('.coupon-edit .state').val('insert');
    couponHelper.editorInit();
    
});
