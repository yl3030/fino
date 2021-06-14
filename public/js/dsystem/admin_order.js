var nowOrderPage = 1;


$(window).click(function() {
	if(orderHelper) {
		orderHelper.category_panel.hide();
	}
});


(function ($, window, i) {

    var OrderHelper = function(){
        this.rootView = $('#order-page');
        this.form = $('#order_form');
        this.listView = this.rootView.find('.order-list');
        this.editView = this.rootView.find('.order-edit');
        this.editBtn = this.rootView.find('.return');

        this.clearBtn = this.rootView.find('.search-console .clear');
        this.exportBtn = this.rootView.find('.search-console .export');
        this.searchBtn = this.rootView.find('.search-console .search');
        this.state = this.editView.find('.state');
        this.tag_add = this.editView.find('.tag-add-con .tag-add');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');
        this.orderProductList = this.editView.find('.order-product-list tbody');
        this.orderProductFoot = this.editView.find('.order-product-list tfoot');
        

        this.category_selector = this.editView.find('.category-selector');
        this.category_panel = this.editView.find('.category_panel');

        this.order_tag_arr = [];
        this.is_cash_on_delivery = 0;


        this.editBtn.on('click', this, function(event){
            var _self = (event.data) ? event.data : this;
            _self.editView.hide();
            _self.listView.show();
        });


        this.category_selector.on('click', this, function(event){
        	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

            _self.category_panel.show();
        });

        this.category_panel.on('click', this, function(event){
        	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

            _self.category_panel.show();
        });


        this.searchBtn.on('click', this, function(event){
        	event.stopPropagation();

        	var _self = (event.data) ? event.data : this;
            nowOrderPage = 1;
            _self.getOrderList(20, nowOrderPage);
        });


        this.clearBtn.on('click', this, function(event){
        	event.stopPropagation();

        	var _self = (event.data) ? event.data : this;
            _self.rootView.find('.search-console input[name="start_time"]').val('');
            _self.rootView.find('.search-console input[name="end_time"]').val('');
            _self.rootView.find('.search-console select[name="order_state"]').val('');
        });

        this.exportBtn.on('click', this, function(event){
        	event.stopPropagation();

        	var _self = (event.data) ? event.data : this;
          
            _self.exportOrderList(20, nowOrderPage);
        }); 

        /*this.editView.find('input[name="shipping_status"][value="0"]').prop('checked', true);
		$('input[type=radio][name=bedStatus]').change(function() {
	        if (this.value == 'allot') {
	            alert("Allot Thai Gayo Bhai");
	        }
	        else if (this.value == 'transfer') {
	            alert("Transfer Thai Gayo");
	        }
	    });*/

	    this.editView.find('input[name="shipping_status"]').on('change', this, function(event){
        	var _self = (event.data) ? event.data : this;


        	if(_self.editView.find('input[name="shipping_status"]:checked').val() == 0) {
        		_self.editView.find('.shipping_info_blk').hide();
        		_self.editView.find('.order_cancel_blk').hide();
        		_self.editView.find('.shipping_info_blk .arrival_time').hide();
        	} else if(_self.editView.find('input[name="shipping_status"]:checked').val() == 99) {

        		_self.editView.find('.order_cancel_blk').show();

        	} else if((_self.editView.find('input[name="is_already_paid"]').val() == 0) 
        		&& (_self.editView.find('input[name="shipping_status"]:checked').val() != 0) && (_self.is_cash_on_delivery == 0)) {
        		alert('未付款前不可出貨!');
        		_self.editView.find('input[name="shipping_status"][value="0"]').prop('checked', true);
        		_self.editView.find('.shipping_info_blk').hide();
        		_self.editView.find('.shipping_info_blk .arrival_time').hide();
        	} else {

        		if(_self.editView.find('input[name="shipping_status"]:checked').val() == 1)
        			_self.editView.find('.shipping_info_blk .arrival_time').hide();
        		else if(_self.editView.find('input[name="shipping_status"]:checked').val() == 2)
        			_self.editView.find('.shipping_info_blk .arrival_time').show();

        		_self.editView.find('.shipping_info_blk').show();
        		
        	}

        });




       // $( "#activity-page .datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' });

        this.editView.find( ".datepicker" ).datetimepicker({ 
        	dateFormat: 'yy-mm-dd',
        	timeFormat: "HH:mm:ss"
        });

        this.rootView.find( ".datepicker" ).datetimepicker({ 
        	dateFormat: 'yy-mm-dd',
        	timeFormat: "HH:mm:ss"/*,
        	beforeShow: function(input, inst)
		    {
		        inst.dpDiv.css({marginTop: input.offsetHeight + 'px'});
		    }*/
        });





        this.form.on('submit', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;
            /*_self.editView.hide();
            _self.listView.show();*/


            if(_self.state.val() == 'update')
            	_self.updateOrder();
                //_self.createOrder();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });



        $('#order-images tfoot button').on('click', this, function(event){
            $('#order-images tbody').append('<tr id="image-row' + orderImageHelper.imageNum + '">'
                + '<td class="text-left">'
                + '<a href="" id="order-thumb-image' + orderImageHelper.imageNum + '" data-toggle="image" class="img-thumbnail">'
                + '<img src="https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png" alt="" title=""></a>'
                + '<input type="hidden" name="order_image[' + orderImageHelper.imageNum + '][image]" value="" id="input-image0">'
                + '</td><td class="text-right">'
                + '<input type="text" name="order_image[' + orderImageHelper.imageNum + '][sort_order]" value="" placeholder="排序(Sort Order)" class="form-control">'
                + '</td><td class="text-left">'
                + '<button type="button" onclick="$(\'#image-row' + orderImageHelper.imageNum + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
                + '</button></td></tr>');


            $('#order-thumb-image' + orderImageHelper.imageNum).on('click', this, function(event){
                event.preventDefault();

                orderImageHelper.targetImageId = $(this).attr('id');

                orderImageHelper.nowFolderId = 0;
                orderImageHelper.page = 1;
                orderImageHelper.open();
            });

            orderImageHelper.imageNum++;
            //alert("fsfdsfdsfdsf");
        });
    };








    OrderHelper.prototype.showOrderTag = function() {
    	var _self = (event.data) ? event.data : this;

	    this.editView.find(".tag-list").html('');
	    for(var i = 0; i < this.order_tag_arr.length; i++) {
	        this.editView.find(".tag-list").append('<span><button type="button" class="remove-btn" role-data="' + i + '">' +
	        '<i class="fa fa-remove"></i></button>' + this.order_tag_arr[i] + '</span>');
	    }

	    this.editView.find(".tag-list > span .remove-btn").unbind('click');
	    this.editView.find(".tag-list > span .remove-btn").click(function (){
	        _self.order_tag_arr.splice($(this).attr('role-data'), 1);
	        _self.showOrderTag();
	    });
	}







    OrderHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < orderCateJson.length; i++) {
            if(orderCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < orderCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + orderCateJson[i].sub_cate[k].category_id + '">' 
                    + orderCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    OrderHelper.prototype.getOrderList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowOrderPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_order/order_list",
            data: {
                'num': num, 
                'start': startCount,
                'start_time': _self.rootView.find('.search-console input[name="start_time"]').val(),
                'end_time': _self.rootView.find('.search-console input[name="end_time"]').val(),
                'order_state': _self.rootView.find('.search-console select[name="order_state"]').val()
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
                    _self.getOrderList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.order.length; i++)
            {   
                if(json_data.data.order[i].cover_image == '')
                    json_data.data.order[i].cover_image = 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png';

                if(json_data.data.order[i].is_already_paid == 1)
                	status = '已付款';
                else
                	status = '未付款';

                if(json_data.data.order[i].shipping_method == 'cash_on_delivery')
		    		status = '貨到付款';



                if(json_data.data.order[i].shipping_status == 0) 
            		shipping_status = '未出貨';
            	else if(json_data.data.order[i].shipping_status == 1)
            		shipping_status = '已出貨';
            	else if(json_data.data.order[i].shipping_status == 2)
            		shipping_status = '已送達';
            	else if(json_data.data.order[i].shipping_status == 99)
            		shipping_status = '訂單取消';



                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' + json_data.data.order[i].order_id + '</td>'
                            + '<td class="text-left">' + json_data.data.order[i].customer_id + '</td>'
                            + '<td class="text-left">' + json_data.data.order[i].shipping_firstname + ' ' 
                            + json_data.data.order[i].shipping_lastname + '</td>'
                            + '<td class="text-left">' + json_data.data.order[i].telephone + '</td>'
                            + '<td class="text-left desc">' + json_data.data.order[i].total + '</td>'
                            + '<td class="text-left">' + json_data.data.order[i].date_added + '</td>'
                            + '<td class="text-left">' + status + '</td>'
                            + '<td class="text-left">' + shipping_status + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-order-id="' 
                            + json_data.data.order[i].order_id + '" class="btn btn-group delete">'
                            + '<i class="fa fa-trash"></i></button>'


                            + '<button type="button" data-order-id="' 
                            + json_data.data.order[i].order_id + '" class="btn btn-group hide-o">'
                            + '<i class="fa fa-eye-slash"></i></button>'



                            + '<a title="修改問題" class="btn btn-gold update" data-order-id="' 
                            + json_data.data.order[i].order_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delete').unbind('click');
            _self.tableView.find('.delete').click(function (){
                var r = confirm("確定要刪除這筆訂單嗎 ?");
                if (r == true) {
                	var r = confirm("確定真的真的確定要刪除這筆訂單嗎(刪除後資料都會不見喔) ?");
                	if (r == true) {
	                    _self.deleteOrderById($(this).attr('data-order-id'));
	                }
                }
            });

            _self.tableView.find('.hide-o').unbind('click');
	        _self.tableView.find('.hide-o').click(function (){
	            var r = confirm("確定要隱藏這筆資料嗎 ?");
	            if (r == true) {
	                _self.hide_order($(this).attr('data-order-id'));
	            }
	        });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
               // $('.order-edit h1').html('商品編輯');
                _self.get_order_by_id($(this).attr('data-order-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    OrderHelper.prototype.exportOrderList = function(num, start) {
        var _self = (event.data) ? event.data : this;


        submitFORM('admin_order/excel_test_xlsx', {
        		'start_time': _self.rootView.find('.search-console input[name="start_time"]').val(),
                'end_time': _self.rootView.find('.search-console input[name="end_time"]').val(),
                'order_state': _self.rootView.find('.search-console select[name="order_state"]').val()
        }, 'POST');


        return;
    };


    OrderHelper.prototype.createOrder = function() {
        
        var _self = (event.data) ? event.data : this;


        var form_data = new FormData();
        form_data.append("name", _self.editView.find('input[name="name"]').val());
        form_data.append("excerpt", _self.editView.find('textarea[name="excerpt"]').val());
        form_data.append("price", _self.editView.find('input[name="price"]').val());

        
        form_data.append("category_id", _self.editView.find('input[name="category_id"]').val());

        var tags = '';
        for (var i = 0; i < _self.order_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += _self.order_tag_arr[i];
        }
        form_data.append("tags", tags);


        form_data.append("sku", _self.editView.find('input[name="sku"]').val());
        form_data.append("quantity", _self.editView.find('input[name="quantity"]').val());
        form_data.append("length", _self.editView.find('input[name="length"]').val());
        form_data.append("width", _self.editView.find('input[name="width"]').val());
        form_data.append("height", _self.editView.find('input[name="height"]').val());
        form_data.append("weight", _self.editView.find('input[name="weight"]').val());
        form_data.append("status", _self.editView.find('select[name="status"]').val());

        form_data.append("main_image", _self.editView.find('input[name="main_image"]').val());
        
        _self.editView.find('input[name^="order_image"]').each(function() {
            

            form_data.append($(this).attr("name"), $(this).val());

            
        });

   

        $.ajax({
            url: "admin_order/order_insert",
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
                alert("建立商品成功 !");

                _self.getOrderList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("建立商品失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


	OrderHelper.prototype.deleteOrderById = function(id) {
        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        form_data.append("order_id", id);

        $.ajax({
            url: "admin_order/order_delete",
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
                alert("刪除訂單成功 !");
                
                _self.getOrderList(20, nowOrderPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("刪除訂單失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    OrderHelper.prototype.updateOrder = function() {
        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        form_data.append("order_id", _self.editView.find('.order_id').val());
        form_data.append("order_cancel_comment", _self.editView.find('textarea[name="order_cancel_comment"]').val());
        form_data.append("shipping_status", _self.editView.find('input[name="shipping_status"]:checked').val());
        form_data.append("tracking_number", _self.editView.find('input[name="tracking_number"]').val());
        form_data.append("shipping_provider", _self.editView.find('select[name="shipping_provider"]').val());
        form_data.append("delivery_time", _self.editView.find('input[name="delivery_time"]').val());
        form_data.append("arrival_time", _self.editView.find('input[name="arrival_time"]').val());


        form_data.append("remark", _self.editView.find('textarea[name="remark"]').val());



        $.ajax({
            url: "admin_order/order_update",
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
                alert("修改訂單狀態成功 !");
                
                _self.getOrderList(20, nowOrderPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("修改訂單狀態失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };

    OrderHelper.prototype.get_order_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_order/get_order_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                _self.editView.find('.state').val('update');
                _self.editView.find('.order_id').val(json_data.data.order_id);


                _self.editView.find('input[name="name"]').val(json_data.data.name);
                _self.editView.find('textarea[name="excerpt"]').val(json_data.data.excerpt);
                _self.editView.find('input[name="price"]').val(json_data.data.price);

                
                _self.category_selector.html(json_data.data.parent_structure);
                _self.editView.find('input[name="category_id"]').val(json_data.data.parent_cate_id);
                _self.editView.find('.category_panel .back-cate-parent').attr('role-data', json_data.data.last_cate_id);

               
                _self.orderProductList.html('');
                for(var i = 0; i < json_data.data.products_in_order.length; i++)
		        {   
		            _self.orderProductList.append('<tr>'
		                        + '<td class="text-left">' + json_data.data.products_in_order[i].product_id + '</td>'
		                        + '<td class="text-left"><img class="thumb" src="' 
		                        + json_data.data.products_in_order[i].cover_image + '"></td>'
		                        + '<td class="text-left">' + json_data.data.products_in_order[i].name + '</td>'
		                        + '<td class="text-left">' + json_data.data.products_in_order[i].quantity + '</td>'
		                        + '<td class="text-left desc">' + json_data.data.products_in_order[i].total + '</td>'
		                        + '</tr>');
		        }

		        _self.orderProductList.append('<tr>'
		                        + '<td class="text-left" colspan="3">運費</td>'
		                        + '<td class="text-left">1</td>'
		                        + '<td class="text-left desc">' + json_data.data.shipping_cost + '</td>'
		                        + '</tr>');

		        _self.orderProductFoot.find('.total').html(json_data.data.total);


		        _self.editView.find('input[name="order_id"]').val(json_data.data.order_id);
		        _self.editView.find('input[name="order_ep_id"]').val(json_data.data.tp_MerchantOrderNo);
		        _self.editView.find('input[name="customer_name"]').val(json_data.data.shipping_firstname + json_data.data.shipping_lastname);
		        _self.editView.find('input[name="customer_phone"]').val(json_data.data.telephone);
		        _self.editView.find('input[name="customer_addr"]').val(json_data.data.shipping_city + ' ' + json_data.data.shipping_zone + ' ' + json_data.data.shipping_address);
		        _self.editView.find('input[name="receipt_addr"]').val(json_data.data.receipt_city + ' ' + json_data.data.receipt_zone + ' ' + json_data.data.receipt_address);
		        
		        _self.editView.find('textarea[name="comment"]').val(json_data.data.comment);
		        _self.editView.find('textarea[name="order_cancel_comment"]').val(json_data.data.order_cancel_comment);
		        

                _self.editView.find('input[name="sku"]').val(json_data.data.sku);
                _self.editView.find('input[name="quantity"]').val(json_data.data.quantity);
                _self.editView.find('input[name="length"]').val(json_data.data.length);
                _self.editView.find('input[name="width"]').val(json_data.data.width);
                _self.editView.find('input[name="height"]').val(json_data.data.height);
                _self.editView.find('select[name="status"]').val(json_data.data.status);
                _self.editView.find('input[name="weight"]').val(json_data.data.weight);

                _self.editView.find('input[name="edit_time"]').val(json_data.data.date_modified);
                _self.editView.find('input[name="create_time"]').val(json_data.data.date_added);






                if(json_data.data.tp_PaymentType == 'WebATM_TAISHIN')
		    		paymentType = '台新銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_ESUN')
		    		paymentType = '玉山銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == ' WebATM_BOT')
		    		paymentType = '台灣銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_FUBON')
		    		paymentType = '台北富邦 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_CHINATRUST')
		    		paymentType = '中國信託 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_FIRST')
		    		paymentType = '第一銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_CATHAY')
		    		paymentType = '國泰世華 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_MEGA')
		    		paymentType = '兆豐銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_LAND')
		    		paymentType = '土地銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_TACHONG')
		    		paymentType = '大眾銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'WebATM_SINOPAC')
		    		paymentType = '永豐銀行 WebATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_TAISHIN')
		    		paymentType = '台新銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_ESUN')
		    		paymentType = '玉山銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_BOT')
		    		paymentType = '台灣銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_FUBON')
		    		paymentType = '台北富邦 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_CHINATRUST')
		    		paymentType = '中國信託 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_FIRST')
		    		paymentType = '第一銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_LAND')
		    		paymentType = '土地銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_ESUN')
		    		paymentType = '玉山銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_CATHAY')
		    		paymentType = '國泰世華銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'ATM_TACHONG')
		    		paymentType = '大眾銀行 ATM';
		    	else if(json_data.data.tp_PaymentType == 'CVS_CVS')
		    		paymentType = '超商代碼繳款';
		    	else if(json_data.data.tp_PaymentType == 'CVS_OK')
		    		paymentType = 'OK 超商代碼繳款';
		    	else if(json_data.data.tp_PaymentType == 'CVS_FAMILY')
		    		paymentType = '全家超商代碼繳款';
		    	else if(json_data.data.tp_PaymentType == 'CVS_HILIFE')
		    		paymentType = '萊爾富超商代碼繳款';
		    	else if(json_data.data.tp_PaymentType == 'CVS_IBON')
		    		paymentType = '7-11 ibon 代碼繳款';
		    	else if(json_data.data.tp_PaymentType == 'BARCODE_BARCODE')
		    		paymentType = '超商條碼繳款';
		    	else if(json_data.data.tp_PaymentType == 'Credit_CreditCard')
		    		paymentType = '信用卡';
		    	else if(json_data.data.tp_PaymentType == 'AndroidPay')
		    		paymentType = 'AndroidPay';
		    	else
		    		paymentType = '未知，請查詢綠界後台!!';


		    	if(json_data.data.shipping_method == 'cash_on_delivery'){
		    		paymentType = '貨到付款';
                    _self.is_cash_on_delivery = 1;
                }else
                    _self.is_cash_on_delivery = 0;



                _self.editView.find('input[name="pay_method"]').val(paymentType);


                if(json_data.data.is_already_paid == 1)
                	status = '已付款';
                else
                	status = '未付款';

                _self.editView.find('input[name="order_state"]').val(status);
                _self.editView.find('input[name="is_already_paid"]').val(json_data.data.is_already_paid);

                
                _self.editView.find('textarea[name="remark"]').val(json_data.data.remark);



		        _self.editView.find('input[name="shipping_status"][value="' + json_data.data.shipping_status + '"]').prop('checked', true);
                _self.editView.find('select[name="shipping_provider"]').val(json_data.data.shipping_provider);
                _self.editView.find('input[name="tracking_number"]').val(json_data.data.tracking_number);

		        if(json_data.data.delivery_time != '0000-00-00 00:00:00')
		        	_self.editView.find('input[name="delivery_time"]').val(json_data.data.delivery_time);
		    	if(json_data.data.arrival_time != '0000-00-00 00:00:00')
		        	_self.editView.find('input[name="arrival_time"]').val(json_data.data.arrival_time);

               // _self.editView.find('.shipping_info_blk').show();	

            	if(json_data.data.shipping_status == 1) {
            		_self.editView.find('.shipping_info_blk').show();
            	} else if(json_data.data.shipping_status == 2) {
            		_self.editView.find('.shipping_info_blk').show();
        			_self.editView.find('.shipping_info_blk .arrival_time').show();
            	} else if(json_data.data.shipping_status == 99) {
            		_self.editView.find('.order_cancel_blk').show();
            	}
               	

                _self.editView.show();
                _self.listView.hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }


    OrderHelper.prototype.hide_order = function(id) {
        var _self = (event.data) ? event.data : this;
        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_order/hide_order",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {         
             	_self.getOrderList(20, nowOrderPage);
                _self.listView.show();
                _self.editView.hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }




    OrderHelper.prototype.editorInit = function() {

        $("a[href='#order-general-info']").trigger("click");
        $('#order-thumb-image + input').val('');
        $('#order-thumb-image img').attr('src', 
            'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png');
        $('#order-images tbody').html('');

        this.editView.find(".tag-list").html('');
        this.order_tag_arr = [];

        this.editView.find('input[name="name"]').val('');
        this.editView.find('textarea[name="excerpt"]').val('');
        this.editView.find('input[name="price"]').val('');
        this.editView.find('input[name="sku"]').val('');
        this.editView.find('input[name="quantity"]').val('');
        this.editView.find('input[name="length"]').val('');
        this.editView.find('input[name="width"]').val('');
        this.editView.find('input[name="height"]').val('');
        this.editView.find('input[name="weight"]').val('');
        this.editView.find('select[name="status"]').val('');
        this.editView.find('input[name="edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');

        this.editView.find('input[name="customer_addr"]').val('');
        this.editView.find('input[name="receipt_addr"]').val('');

        this.editView.find('textarea[name="comment"]').val('');
        this.editView.find('textarea[name="order_cancel_comment"]').val('');

        this.editView.find('input[name="pay_method"]').val('');
        this.editView.find('input[name="order_state"]').val('');
        this.editView.find('input[name="is_already_paid"]').val(0);
        this.editView.find('input[name="shipping_status"][value="0"]').prop('checked', true);

        this.editView.find('input[name="tracking_number"]').val('');
        this.editView.find('input[name="delivery_time"]').val('');
        this.editView.find('input[name="arrival_time"]').val('');


        this.editView.find('.shipping_info_blk').hide();
        this.editView.find('.order_cancel_blk').hide();
        this.editView.find('.shipping_info_blk .arrival_time').hide();
    };


    orderHelper = new OrderHelper();
    orderHelper.getOrderList(20, nowOrderPage);


})(jQuery, this, 0);


$('.close-btn').unbind('click');
$('.close-btn').click(function (){
    $("#" + $(this).attr('role-btn')).fadeOut(); 
});

