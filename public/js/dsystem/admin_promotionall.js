var nowPromotionallPage = 1;


(function ($, window, i) {

    var PromotionallHelper = function(){
        this.rootView = $('#promotionall-page');
        this.form = $('#promotionall_form');
        this.listView = this.rootView.find('.promotionall-list');
        this.editView = this.rootView.find('.promotionall-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');

        this.product_counter = 0;

        this.editView.find( ".datepicker" ).datepicker({ 
        	dateFormat: 'yy-mm-dd'
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
                _self.createPromotionall();
            else
                _self.updatePromotionall();
        });


        $('#consume-feedback .save').on('click', this, function(event){
	    	
	    	event.stopPropagation();
	        var _self = (event.data) ? event.data : this;

	        var form_data = new FormData();

	        form_data.append("bonus_precent", _self.rootView.find('#consume-feedback input[name="bonus_precent"]').val());
	        form_data.append("discount_precent", _self.rootView.find('#consume-feedback input[name="discount_precent"]').val());

	        $.ajax({
	            url: "admin_promotionall/save_bouns_dis",
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
	                alert("儲存成功 !");
	            } else {
	            	if(json_data.msg == 'code_short')
	            		alert("票卷序號至少12個字喔 !");
	            	else
	                	alert("儲存失敗，請檢查資料都有輸入齊全 !");
	            }
	        }).fail(function() {
	            alert( "發生錯誤，請檢查網路或重新載入網頁" );
	        }).always(function() {

	        });	    	
	    });


	    $('#consume-gift .save').on('click', this, function(event){

	    	event.stopPropagation();
	        var _self = (event.data) ? event.data : this;

	        var form_data = new FormData();

	        _self.rootView.find('#consume-gift .pro-accum-list tbody input[name^="product"]').each(function() {
	    		form_data.append($(this).attr("name"), $(this).val());
	        });

			form_data.append("order_gift", _self.rootView.find('#consume-gift input[name="order_gift"]').val());

	        $.ajax({
	            url: "admin_promotionall/save_consume_gift",
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
	                alert("儲存成功 !");
	            } else {
	            	if(json_data.msg == 'code_short')
	            		alert("票卷序號至少12個字喔 !");
	            	else
	                	alert("儲存失敗，請檢查資料都有輸入齊全 !");
	            }
	        }).fail(function() {
	            alert( "發生錯誤，請檢查網路或重新載入網頁" );
	        }).always(function() {

	        });	
	    });
        

        this.rootView.find("#consume-gift input[name='order_gift']").on('focusout', this, function(event){

        	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

           // alert($(this).val());

            $.ajax({
	            type: "POST",
	            url: "admin_product/get_product_by_id",
	            data: {'id': $(this).val()}
	        }).done(function( json_data ) {
	            if(!auth_response_pre_processer(json_data))
	                return;

	            if(json_data.result == "success")
	            {
	            	//alert('有商品');

	            	var $tb = _self.rootView.find('#consume-gift .order-gift tbody');
	            	$tb.html('');

				    $tb.append('<tr id="order-gift-tr"><td class="text-left">'
		                + '<img class="thumb" src="'
		                + json_data.data.cover_image + '">'
		                + '</td><td class="text-left">'
		                + json_data.data.name
		                + '</td><td class="text-left desc">'
		                + json_data.data.price
		                + '</td><td class="text-left desc">'
		                + '<button type="button" onclick="$(\'#order-gift-tr\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
		                + '<i class="fa fa-minus-circle"></i>'
                        + '</button>'
		                + '</td></tr>');
			        
	            }else{
	            	//alert('不存在此商品!!');
	            	_self.rootView.find('#consume-gift .order-gift tbody').html('');
	            }
	        });

        });


        this.rootView.find("#consume-gift .add-product").on('click', this, function(event){
         	event.stopPropagation();
            var _self = (event.data) ? event.data : this;
            var amount = _self.rootView.find( "#consume-gift input[name='amount']" ).val();
            var can_accum = _self.rootView.find( "#consume-gift select[name='can_accum']" ).val();

            if(is_numeric(amount)) {
            	if(amount < 0) {
            		alert('金額輸入錯誤!!');
            		return;
            	}

            	amount = parseInt(amount);
            } else {
            	alert('金額輸入錯誤!!');
            	return;
            }

            $.ajax({
	            type: "POST",
	            url: "admin_product/get_product_by_id",
	            data: {'id': _self.rootView.find( "#consume-gift input[name='product_id']" ).val()}
	        }).done(function( json_data ) {
	            if(!auth_response_pre_processer(json_data))
	                return;

	            if(json_data.result == "success")
	            {
	            	var is_added = false;
	            	var $preElement = '';
	            	_self.rootView.find("#consume-gift .pro-accum-list tbody input[name*='amount']").each(function() {

	            		if(amount > $(this).val()){
	            			$preElement = $(this).parent().parent();
	            		}

	            		if($(this).val() == amount) {
	            			alert('累計金額不可以重複!!');
	            			is_added = true;
	            			return;
	            		}

			        });

			        if(is_added)
			        	return;
			        

			        var can_accum_str = "";

			        if(can_accum == 1)
			        	can_accum_str = "可累計";
			        else
			        	can_accum_str = "不可累計";

			        var $tb = _self.rootView.find('#consume-gift .pro-accum-list tbody');
			        var $tr = '<tr id="op-pro-row' + _self.product_counter
	                	+ '"><td class="text-left">'
		                + '<img class="thumb" src="'
		                + json_data.data.cover_image + '">'
		                + '<input type="hidden" name="product[' 
		                + _self.product_counter + '][product_id]" value="'
		                + json_data.data.product_id + '">'
		                + '</td><td class="text-left">'
		                + json_data.data.name
		                /*+ '<input class="form-control" name="product[' 
		                + _self.product_counter + '][name]" placeholder="請輸入商品名稱" value="'
		                + json_data.data.name + '" />'*/
		                + '</td><td class="text-left desc">'
		                + amount
		                + '<input class="form-control" type="hidden" name="product[' 
		                + _self.product_counter + '][amount]" value="'
		                + amount + '" />'
		                + '</td><td class="text-left desc">'
		                + can_accum_str
		                + '<input class="form-control" type="hidden" name="product[' 
		                + _self.product_counter + '][can_accum]" value="' + can_accum + '" />'
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


			        _self.rootView.find( "#consume-gift input[name='product_id']" ).val('');
			        _self.rootView.find( "#consume-gift input[name='amount']" ).val('');
			        _self.rootView.find( "#consume-gift select[name='can_accum']" ).val(0);

			        _self.product_counter++;

	            }else{
	            	alert('不存在此商品!!');
	            }
	        });
        });
    };





    PromotionallHelper.prototype.getWebsitePromotion = function(id) {
        var _self = (event.data) ? event.data : this;
        $.ajax({
            type: "POST",
            url: "admin_promotionall/get_webpromotion",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
            	if(json_data.data.bonus_precent)
            		if(json_data.data.bonus_precent.percentage != 0)
            			_self.rootView.find('#consume-feedback input[name="bonus_precent"]').val(json_data.data.bonus_precent.percentage);
            	else
            		_self.rootView.find('#consume-feedback input[name="bonus_precent"]').val('');

            	if(json_data.data.dis_precent)
            		if(json_data.data.dis_precent.percentage != 0)
	       				_self.rootView.find('#consume-feedback input[name="discount_precent"]').val(json_data.data.dis_precent.percentage);
	       		else
	       			_self.rootView.find('#consume-feedback input[name="discount_precent"]').val('');








	       		if(json_data.data.order_gift) {
	       			if(json_data.data.order_gift.pid != '') {
	       				_self.rootView.find('#consume-gift input[name="order_gift"]').val(json_data.data.order_gift.pid);

	       				var $tb = _self.rootView.find('#consume-gift .order-gift tbody');
		            	$tb.html('');

					    $tb.append('<tr id="order-gift-tr"><td class="text-left">'
			                + '<img class="thumb" src="'
			                + json_data.data.order_gift.cover_image + '">'
			                + '</td><td class="text-left">'
			                + json_data.data.order_gift.name
			                + '</td><td class="text-left desc">'
			                + json_data.data.order_gift.price
			                + '</td><td class="text-left desc">'
			                + '<button type="button" onclick="$(\'#order-gift-tr\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
			                + '<i class="fa fa-minus-circle"></i>'
	                        + '</button>'
			                + '</td></tr>');
	       			}
	       		} else {
	       			_self.rootView.find('#consume-gift input[name="order_gift"]').val('');
	       		}











	       		for (var i = 0; i < json_data.data.pro_accum_list.length; i++) {

	       			if(json_data.data.pro_accum_list[i].pid != ''){

		       			var can_accum_str = "";

				        if(json_data.data.pro_accum_list[i].can_accumulate == 1)
				        	can_accum_str = "可累計";
				        else
				        	can_accum_str = "不可累計";

				        var $tb = _self.rootView.find('#consume-gift .pro-accum-list tbody');
				        var $tr = '<tr id="op-pro-row' + _self.product_counter
		                	+ '"><td class="text-left">'
			                + '<img class="thumb" src="'
			                + json_data.data.pro_accum_list[i].cover_image + '">'
			                + '<input type="hidden" name="product[' 
			                + _self.product_counter + '][product_id]" value="'
			                + json_data.data.pro_accum_list[i].pid + '">'
			                + '</td><td class="text-left">'
			                + json_data.data.pro_accum_list[i].name
			                + '</td><td class="text-left desc">'
			                + json_data.data.pro_accum_list[i].accumulated_costs
			                + '<input class="form-control" type="hidden" name="product[' 
			                + _self.product_counter + '][amount]" value="'
			                + json_data.data.pro_accum_list[i].accumulated_costs + '" />'
			                + '</td><td class="text-left desc">'
			                + can_accum_str
			                + '<input class="form-control" type="hidden" name="product[' 
			                + _self.product_counter + '][can_accum]" value="' + json_data.data.pro_accum_list[i].can_accumulate + '" />'
			                + '</td><td class="text-left desc">'
			                + '<button type="button" onclick="$(\'#op-pro-row' + _self.product_counter
			                + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
			                + '<i class="fa fa-minus-circle"></i>'
		                    + '</button>'
			                + '</td></tr>';


			            $tb.append($tr);

			            _self.product_counter++;
			        }
	       		}

	       		










                /*$('.promotionall-edit .state').val('update');

                _self.editView.find('input[name="promotionall_id"]').val(json_data.data.promotionall_id);

        		_self.editView.find('input[name="promotionall_name"]').val(json_data.data.promotionall_name);
        		_self.editView.find('input[name="code"]').val(json_data.data.code);
        		_self.editView.find('select[name="count"]').val(json_data.data.count);
        		_self.editView.find('select[name="discount_type"]').val(json_data.data.discount_type);
        		_self.editView.find('input[name="discount_val"]').val(json_data.data.discount_val);
        		_self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
        		_self.editView.find('input[name="end_time"]').val(json_data.data.end_time);
        		_self.editView.find('textarea[name="remarks"]').val(json_data.data.remarks);
                _self.editView.find('input[name="create_user"]').val(json_data.data.create_user);
                _self.editView.find('input[name="edit_time"]').val(json_data.data.edit_time);
                _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);


                $("#promotionall-page .promotionall-edit").show();
                $("#promotionall-page .promotionall-list").hide();*/

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }


    promotionallHelper = new PromotionallHelper();
    promotionallHelper.getWebsitePromotion();
   // promotionallHelper.getPostCate();

})(jQuery, this, 0);
