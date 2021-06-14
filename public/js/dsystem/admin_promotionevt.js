var nowPromotionevtPage = 1;


(function ($, window, i) {

    var PromotionevtHelper = function(){
        this.rootView = $('#promotionevt-page');
        this.form = $('#promotionevt_form');
        this.listView = this.rootView.find('.promotionevt-list');
        this.editView = this.rootView.find('.promotionevt-edit');
        this.editBtn = this.rootView.find('.return');
        this.createBtn = this.rootView.find('.create');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');
        this.role_counter = 0;
        this.product_counter = 0;

        this.editView.find( ".datepicker" ).datepicker({ 
        	dateFormat: 'yy-mm-dd'
        });



/////////////////////////////////////////////////////////////////
		this.editView.find( ".img-select" ).on('change', this, function(event){

			var _self = (event.data) ? event.data : this;

		    if ($(this)[0].files && $(this)[0].files[0]) {
		        var reader = new FileReader();

		        reader.onload = function (e) {

		            if(_self.editView.find('.state').val() == 'insert') {
		                _self.editView.find('.img-cover').attr('src', e.target.result);
		            } else {
		                _self.editView.find('.img-preview').attr('src', e.target.result);
		                _self.editView.find('.preview-console').show();
		            }
		        };

		        reader.readAsDataURL($(this)[0].files[0]);
		    }
		});


		this.editView.find('.cancel-img').on('click', this, function(event){

			var _self = (event.data) ? event.data : this;

		    _self.editView.find('.img-select').val('');
		    //$('#post-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
		    _self.editView.find('.preview-console').hide();
		});


		this.editView.find(".upload-img").on('click', this, function(event){

			var _self = (event.data) ? event.data : this;
		    var imgVal = _self.editView.find('.img-select').val();

		    if(imgVal=='')
		    { 
		        alert("請先選擇圖片");
		        return;
		    }

		    var file_data = _self.editView.find(".img-select").prop("files")[0];
		    var form_data = new FormData();  
		    form_data.append("imgfile", file_data);
		    form_data.append("promotion_id", _self.editView.find('input[name="promotion_id"]').val());

		    $.ajax({
		        url: "admin_promotionevt/photo",
		        dataType: 'json',
		        cache: false,
		        contentType: false,
		        processData: false,
		        data: form_data,                         // Setting the data attribute of ajax with file_data
		        type: 'post'
		    }).done(function( json ) {

		        if(json.result == 'success')
		        {
		            _self.editView.find(".img-cover").attr("src", json.data.cover_img);
		            alert('圖片上傳成功 !');
		            _self.editView.find(".img-select").val('');
		            _self.editView.find(".preview-console").hide();
		            _self.getPromotionevtList(20, nowPromotionevtPage);
		        } else {
		            alert( "發生錯誤，請檢查網路或重新載入網頁" );
		        }
		    }).fail(function( jqXHR, textStatus  ) {
		        alert( "發生錯誤，請檢查網路或重新載入網頁" );
		    });
		});

/////////////////////////////////////////////////////////////////

        this.editView.find('select[name="type"]').on('change', this, function(event){
        	
        	var _self = (event.data) ? event.data : this;


        	if(_self.editView.find('.promotion-rule-list tbody input[name^="role"]').length > 0) {

        		alert('請先清空規則，才可以切換不同折抵方式，避免造成使用者困惑!!');

        		if($(this).val() == 'discount')
        			$(this).val('special_price');
        		else if($(this).val() == 'special_price')
        			$(this).val('discount');
        	}


        	if($(this).val() == 'discount') {
	        	_self.editView.find('.promotion-rule-list .in-sub.value').html('折扣');
	        	_self.editView.find('.promotion-rule-list input[name="value"]').attr('placeholder', '請輸入折扣，ex: 9折 請輸入 90');
			} else if($(this).val() == 'special_price') {
				_self.editView.find('.promotion-rule-list .in-sub.value').html('優惠價');
	        	_self.editView.find('.promotion-rule-list input[name="value"]').attr('placeholder', '請輸入優惠價');
			}


        });


        this.editView.find('.promotion-rule-list .add-rule').on('click', this, function(event){

        	var _self = (event.data) ? event.data : this;

        	var quantity = parseInt(_self.editView.find('.promotion-rule-list input[name="quantity"]').val());
        	var value = parseInt(_self.editView.find('.promotion-rule-list input[name="value"]').val());

        	var is_added = false;
        	var $preElement = '';

	        _self.rootView.find('.promotion-rule-list tbody input[name*="quantity"]').each(function() {

        		if(quantity > $(this).val()){
        			$preElement = $(this).parent().parent();
        		}

        		if($(this).val() == quantity) {
        			alert('商品數量不可以重複!!');
        			is_added = true;
        			return;
        		}

	        });

	        if(is_added)
	        	return;

	        var v_str = '';

	        if(_self.editView.find('select[name="type"]').val() == 'discount')
	        	v_str = '折';
	        else if(_self.editView.find('select[name="type"]').val() == 'special_price')
	        	v_str = '元';

	        var $tb = _self.rootView.find('.promotion-rule-list tbody');
	        var $tr = '<tr id="prom-role' + _self.role_counter + '">'
               	+ '<td class="text-left" colspan="4">'
                + '購買商品滿 <b>' + quantity + '</b> 件， <b>' + value + '</b> ' + v_str
                + '<input type="hidden" name="role[' + _self.role_counter + '][quantity]" value="' + quantity + '">'
                + '<input type="hidden" name="role[' + _self.role_counter + '][value]" value="' + value + '">'
                + '</td><td class="text-left desc"><button type="button" onclick="$(\'#prom-role' 
                + _self.role_counter + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
                + '<i class="fa fa-minus-circle"></i></button></td>'
                + '</tr>';

            if($preElement == '')
		        $tb.prepend($tr);
		    else
		    	$preElement.after($tr);

		    _self.role_counter++;
        });
        










        this.editView.find('input[name="all_product"]').on('change', this, function(event){

        	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

		    if($(this).is(':checked')) {
		       	
		    	_self.editView.find(".product-list").hide();

		    } else {
		    	_self.editView.find(".product-list").show();
		    }


		});





        this.editView.find(".product-list .add-product").on('click', this, function(event){

         	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

/*            var amount = _self.rootView.find( ".product-list input[name='amount']" ).val();
            var can_accum = _self.rootView.find( ".product-list select[name='can_accum']" ).val();

            if(is_numeric(amount)) {
            	if(amount < 0) {
            		alert('金額輸入錯誤!!');
            		return;
            	}

            	amount = parseInt(amount);
            } else {
            	alert('金額輸入錯誤!!');
            	return;
            }*/

            var order = _self.editView.find( ".product-list input[name='order']" ).val();
            var productId = _self.editView.find( ".product-list input[name='product_id']" ).val();

            $.ajax({
	            type: "POST",
	            url: "admin_product/get_product_by_id",
	            data: {'id': productId}
	        }).done(function( json_data ) {
	            if(!auth_response_pre_processer(json_data))
	                return;

	            if(json_data.result == "success")
	            {
	            	var is_added = false;
	            	var $preElement = '';
	            	_self.editView.find(".product-list tbody input[name*='product_id']").each(function() {

	            		if($(this).val() == productId) {
	            			alert('商品不可以重複!!');
	            			is_added = true;
	            			return;
	            		}

			        });

			        if(is_added)
			        	return;
			        

			        var $tb = _self.editView.find('.product-list tbody');
			        var $tr = '<tr id="op-pro-row' + _self.product_counter
	                	+ '"><td class="text-left">'
		                + '<img class="thumb" src="'
		                + json_data.data.cover_image + '">'
		                + '<input type="hidden" name="product[' 
		                + _self.product_counter + '][product_id]" value="'
		                + json_data.data.product_id + '">'
		                + '</td><td class="text-left">'
		                + json_data.data.name
		                + '</td><td class="text-left desc">'
		                + json_data.data.price
		                + '</td><td class="text-left desc">'
		                + '<input class="form-control" name="product[' 
		                + _self.product_counter + '][order]" value="' + order + '" />'
		                + '</td><td class="text-left desc">'
		                + '<button type="button" onclick="$(\'#op-pro-row' + _self.product_counter
		                + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
		                + '<i class="fa fa-minus-circle"></i>'
                        + '</button>'
		                + '</td></tr>';


		            if($preElement == '')
				        $tb.prepend($tr);
				    else
				    	$preElement.after($tr);


			        _self.editView.find( ".product-list input[name='product_id']" ).val('');

			        _self.product_counter++;

	            }else{
	            	alert('不存在此商品!!');
	            }
	        });
        });






        //$('#promotionevt-page .create').click(function (){

        this.createBtn.on('click', this, function(event){
        	var _self = (event.data) ? event.data : this;

		    _self.editView.find('.state').val('insert');
		    _self.editorInit();
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
                _self.createPromotionevt();
            else
                _self.updatePromotionevt();
        });
    };


    PromotionevtHelper.prototype.getPromotionevtList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowPromotionevtPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_promotionevt/promotion_list",
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
                    _self.getPromotionevtList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.promotionevt.length; i++)
            {   
            	if(json_data.data.promotionevt[i].type == 'discount')
            		json_data.data.promotionevt[i].type = '滿件折扣';
            	else if(json_data.data.promotionevt[i].type == 'special_price')
            		json_data.data.promotionevt[i].type = '滿件特價';


                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' + json_data.data.promotionevt[i].promotion_id + '</td>'
                            + '<td class="text-left">' + json_data.data.promotionevt[i].name + '</td>'
                            + '<td class="text-left desc">' + json_data.data.promotionevt[i].start_time
                            + ' ~ ' + json_data.data.promotionevt[i].end_time
                            + '</td>'
                            + '<td class="text-left desc"><a target="_blank" href="' + base_url + 'promotion/' 
                            + json_data.data.promotionevt[i].promotion_id + '">前往網頁</a></td>'
                            + '<td class="text-left desc">' + json_data.data.promotionevt[i].type + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-promotionevt-id="' 
                            + json_data.data.promotionevt[i].promotion_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-promotionevt-id="' 
                            + json_data.data.promotionevt[i].promotion_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    _self.deletePromotionById($(this).attr('data-promotionevt-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.getPromotionById($(this).attr('data-promotionevt-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    PromotionevtHelper.prototype.createPromotionevt = function() {
        
        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        var file_data = _self.editView.find(".img-select").prop("files")[0];
        form_data.append("imgfile", file_data);


        form_data.append("promotion_name", _self.editView.find('input[name="promotion_name"]').val());
        form_data.append("type", _self.editView.find('select[name="type"]').val());


        _self.editView.find('.promotion-rule-list tbody input[name^="role"]').each(function() {
	    	form_data.append($(this).attr("name"), $(this).val());
	    });


        if(this.editView.find('input[name="all_product"]').is(':checked')) {
        	
        	form_data.append("all_product", "1");

        } else {
        	form_data.append("all_product", "0");

        	_self.editView.find('.product-list tbody input[name^="product"]').each(function() {
		    	form_data.append($(this).attr("name"), $(this).val());
		    });
        }

        form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
        form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
        form_data.append("remarks", _self.editView.find('textarea[name="remarks"]').val());


        $.ajax({
            url: "admin_promotionevt/insert_promotion",
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
                alert("建立優惠活動成功 !");

                _self.getPromotionevtList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {

            	if(json_data.msg == 'incorrent')
            		alert("活動名稱以及規則沒設定 !");
            	else if(json_data.msg == 'no_product')
            		alert("請選擇活動商品 !");
            	else if(json_data.msg == 'product_already_prom')
            		alert("所選商品跟其他優惠活動的商品重複 !");
            	else if(json_data.msg == 'time_error')
            		alert("活動時間錯誤，請填寫或是輸入正確時間 !");
            	else
                	alert("建立優惠活動失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    PromotionevtHelper.prototype.updatePromotionevt = function() {

        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        form_data.append("promotion_id", _self.editView.find('input[name="promotion_id"]').val());
        form_data.append("promotion_name", _self.editView.find('input[name="promotion_name"]').val());
        form_data.append("type", _self.editView.find('select[name="type"]').val());

        _self.editView.find('.promotion-rule-list tbody input[name^="role"]').each(function() {
	    	form_data.append($(this).attr("name"), $(this).val());
	    });

        if(this.editView.find('input[name="all_product"]').is(':checked')) {
        	
        	form_data.append("all_product", "1");

        } else {
        	form_data.append("all_product", "0");

        	_self.editView.find('.product-list tbody input[name^="product"]').each(function() {
		    	form_data.append($(this).attr("name"), $(this).val());
		    });
        }

        form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
        form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
        form_data.append("remarks", _self.editView.find('textarea[name="remarks"]').val());

        $.ajax({
            url: "admin_promotionevt/update_promotion",
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
                alert("修改優惠活動成功 !");
                
                _self.getPromotionevtList(20, nowPromotionevtPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
            	if(json_data.msg == 'incorrent')
            		alert("活動名稱以及規則沒設定 !");
            	else if(json_data.msg == 'no_product')
            		alert("請選擇活動商品 !");
            	else if(json_data.msg == 'product_already_prom')
            		alert("所選商品跟其他優惠活動的商品重複 !");
            	else if(json_data.msg == 'time_error')
            		alert("活動時間錯誤，請填寫或是輸入正確時間 !");
            	else if(json_data.msg == 'no_promotion')
            		alert("此活動已經不存在 !");
            	else
                	alert("建立優惠活動失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };



    PromotionevtHelper.prototype.getPromotionById = function(id) {

        var _self = (event.data) ? event.data : this;
        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_promotionevt/get_promotion",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.promotionevt-edit .state').val('update');

                _self.editView.find('input[name="promotion_id"]').val(json_data.data.promotion_id);
        		_self.editView.find('input[name="promotion_name"]').val(json_data.data.name);
        		_self.editView.find('.img-cover').attr('src', json_data.data.cover_img);


        		if(json_data.data.type == 'discount') {
        			_self.editView.find('select[name="type"]').val('discount');
        			_self.editView.find('.promotion-rule-list .in-sub.value').html('折扣');
	        		_self.editView.find('.promotion-rule-list input[name="value"]').attr('placeholder', '請輸入折扣，ex: 9折 請輸入 90');
        		} else if(json_data.data.type == 'special_price') {
        			_self.editView.find('select[name="type"]').val('special_price');
        			_self.editView.find('.promotion-rule-list .in-sub.value').html('優惠價');
	        		_self.editView.find('.promotion-rule-list input[name="value"]').attr('placeholder', '請輸入優惠價');
        		}


        		for (var i = 0; i < json_data.data.rule_list.length; i++) {
        			
        			var v_str = '';

			        if(json_data.data.type == 'discount')
			        	v_str = '折';
			        else if(json_data.data.type == 'special_price')
			        	v_str = '元';

			        var $tb = _self.rootView.find('.promotion-rule-list tbody');
			        var $tr = '<tr id="prom-role' + _self.role_counter + '">'
		               	+ '<td class="text-left" colspan="4">'
		                + '購買商品滿 <b>' + json_data.data.rule_list[i].quantity + '</b> 件， <b>' + json_data.data.rule_list[i].value + '</b> ' + v_str
		                + '<input type="hidden" name="role[' + _self.role_counter + '][quantity]" value="' + json_data.data.rule_list[i].quantity + '">'
		                + '<input type="hidden" name="role[' + _self.role_counter + '][value]" value="' + json_data.data.rule_list[i].value + '">'
		                + '</td><td class="text-left desc"><button type="button" onclick="$(\'#prom-role' 
		                + _self.role_counter + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
		                + '<i class="fa fa-minus-circle"></i></button></td>'
		                + '</tr>';


		            $tb.append($tr);

		      //       if($preElement == '')
				    //     $tb.prepend($tr);
				    // else
				    // 	$preElement.after($tr);

				    _self.role_counter++;
        		}





				if(json_data.data.for_all_product == 1) {
		        	_self.editView.find('input[name="all_product"]').trigger( "click" );
		        }

        		/*if(_self.editView.find('input[name="all_product"]').is(':checked')) {
		        	$(this).trigger( "click" );
		        }

		        json_data.data.for_all_product*/

        		

        		for (var i = 0; i < json_data.data.product_list.length; i++) {

        			var $tb = _self.editView.find('.product-list tbody');
			        var $tr = '<tr id="op-pro-row' + _self.product_counter
	                	+ '"><td class="text-left">'
		                + '<img class="thumb" src="'
		                + json_data.data.product_list[i].cover_image + '">'
		                + '<input type="hidden" name="product[' 
		                + _self.product_counter + '][product_id]" value="'
		                + json_data.data.product_list[i].product_id + '">'
		                + '</td><td class="text-left">'
		                + json_data.data.product_list[i].name
		                + '</td><td class="text-left desc">'
		                + json_data.data.product_list[i].price
		                + '</td><td class="text-left desc">'
		                + '<input class="form-control" name="product[' 
		                + _self.product_counter + '][order]" value="' + json_data.data.product_list[i].order + '" />'
		                + '</td><td class="text-left desc">'
		                + '<button type="button" onclick="$(\'#op-pro-row' + _self.product_counter
		                + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
		                + '<i class="fa fa-minus-circle"></i>'
                        + '</button>'
		                + '</td></tr>';


		            $tb.append($tr);


			       // _self.editView.find( ".product-list input[name='product_id']" ).val('');

			        _self.product_counter++;
        		}
        		









        		_self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
        		_self.editView.find('input[name="end_time"]').val(json_data.data.end_time);
        		_self.editView.find('textarea[name="remarks"]').val(json_data.data.remarks);



              //  _self.editView.find('input[name="create_user"]').val(json_data.data.create_user);
                _self.editView.find('input[name="edit_time"]').val(json_data.data.last_edit_time);
                _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);


                $("#promotionevt-page .promotionevt-edit").show();
                $("#promotionevt-page .promotionevt-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }



    PromotionevtHelper.prototype.deletePromotionById = function(id) {

        var _self = (event.data) ? event.data : this;

        $.ajax({
	        type: "POST",
	        url: "admin_promotionevt/delete_promotion",
	        data: {'promotion_id': id}
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {
	            _self.getPromotionevtList(20, 1);
	            alert("刪除優惠活動·成功 !");
	        } else {
	            alert("發生錯誤，請檢查網路或重新載入網頁");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
    }

    


    PromotionevtHelper.prototype.editorInit = function() {

        this.editView.find('input[name="promotion_id"]').val('');
        this.editView.find('input[name="promotion_name"]').val('');

        this.editView.find('select[name="type"]').val('discount');
        this.editView.find('.promotion-rule-list .in-sub.value').html('折扣');
	    this.editView.find('.promotion-rule-list input[name="value"]').attr('placeholder', '請輸入折扣，ex: 9折 請輸入 90');


	    this.editView.find('.img-cover').attr('src', '');

        if(this.editView.find('input[name="all_product"]').is(':checked')) {
        	//$(this).trigger( "click" );

        	this.editView.find('input[name="all_product"]').trigger( "click" );
        	//this.editView.find(".product-list").show();
        }


        //this.editView.find('input[name="all_product"]').

        this.editView.find('.promotion-rule-list tbody').html('');
        this.editView.find('.product-list tbody').html('');




        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('textarea[name="remarks"]').val('');
        this.editView.find('input[name="edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');



/*
        form_data.append("imgfile", file_data);

	
        form_data.append("type", _self.editView.find('select[name="type"]').val());*/

        this.role_counter = 0;
		this.product_counter = 0;
        

        this.editView.show();
        this.listView.hide();
    };




    promotionevtHelper = new PromotionevtHelper();
    promotionevtHelper.getPromotionevtList(20, nowPromotionevtPage);
   // promotionevtHelper.getPostCate();

})(jQuery, this, 0);

