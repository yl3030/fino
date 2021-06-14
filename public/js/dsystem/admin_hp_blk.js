var nowHpBlkPage = 1;

(function ($, window, i) {

    var HpBlkHelper = function(){
        this.rootView = $('#hp-blk-page');
        this.form = $('#hp_blk_form');
        this.listView = this.rootView.find('.hp-blk-list');
        this.editView = this.rootView.find('.hp-blk-edit');
        this.editBtn = this.rootView.find('.return');
        this.createBtn = this.rootView.find('.create');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');
        this.product_counter = 0;

        this.editView.find( ".datepicker" ).datepicker({ 
        	dateFormat: 'yy-mm-dd'
        });


        this.editView.find('select[name="type"]').on('change', this, function(event){
        	
        	var _self = (event.data) ? event.data : this;

        	if($(this).val() == 'custom') {

        		_self.editView.find('.product-list').show();
        		_self.editView.find('.count').hide();
        		
			} else if($(this).val() == 'newest') {

				_self.editView.find('.product-list').hide();
				_self.editView.find('.count').show();
				
			}
        });


        this.editView.find(".product-list .add-product").on('click', this, function(event){

         	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

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
		                + json_data.data.product_id
		                + '</td><td class="text-left desc">'
		                + '<input class="form-control" name="product[' 
		                + _self.product_counter + '][order]" value="' + order + '" />'
		                + '</td><td class="text-left desc">'
		                + '<button type="button" onclick="$(\'#op-pro-row' + _self.product_counter
		                + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger">'
		                + '<i class="fa fa-minus-circle"></i>'
                        + '</button>'
		                + '</td></tr>';


		           // if($preElement == '')
				        $tb.prepend($tr);
				  //  else
				    	//$preElement.after($tr);


			        _self.editView.find( ".product-list input[name='product_id']" ).val('');

			        _self.product_counter++;

	            }else{
	            	alert('不存在此商品!!');
	            }
	        });
        });


        //$('#hp-blk-page .create').click(function (){

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
                _self.createHpBlk();
            else
                _self.updateHpBlk();
        });
    };


    HpBlkHelper.prototype.getHpBlkList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowHpBlkPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_hp_blk/hpblk_list",
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
                    _self.getHpBlkList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.hpblk.length; i++)
            {   
            	if(json_data.data.hpblk[i].type == 'custom')
            		json_data.data.hpblk[i].type = '自選商品';
            	else if(json_data.data.hpblk[i].type == 'newest')
            		json_data.data.hpblk[i].type = '最新商品';

            	if(json_data.data.hpblk[i].is_active == 1)
            		json_data.data.hpblk[i].is_active = '顯示';
            	else
            		json_data.data.hpblk[i].is_active = '隱藏';

                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' + json_data.data.hpblk[i].hpblk_id + '</td>'
                            + '<td class="text-left">' + json_data.data.hpblk[i].title + '</td>'
                            + '<td class="text-left desc">' + json_data.data.hpblk[i].type + '</td>'
                            + '<td class="text-left desc">' + json_data.data.hpblk[i].rank + '</td>'
                            + '<td class="text-left desc">' + json_data.data.hpblk[i].start_time
                            + ' ~ ' + json_data.data.hpblk[i].end_time
                            + '</td>'
                            + '<td class="text-left desc">'
                            + json_data.data.hpblk[i].is_active
                            + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-hp-blk-id="' 
                            + json_data.data.hpblk[i].hpblk_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-hp-blk-id="' 
                            + json_data.data.hpblk[i].hpblk_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    _self.deleteHpBlkById($(this).attr('data-hp-blk-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.getHpBlkById($(this).attr('data-hp-blk-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    HpBlkHelper.prototype.createHpBlk = function() {
        
        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        form_data.append("title", _self.editView.find('input[name="title"]').val());
        form_data.append("rank", _self.editView.find('input[name="rank"]').val());
        form_data.append("type", _self.editView.find('select[name="type"]').val());

        form_data.append("count", _self.editView.find('input[name="count"]').val());
        form_data.append("is_active", _self.editView.find('select[name="is_active"]').val());

        /*if(_self.editView.find('select[name="type"]').val() == 'newest') {
        	
        	form_data.append("all_product", "1");

        } else */

        if(_self.editView.find('select[name="type"]').val() == 'custom') {
        	//form_data.append("all_product", "0");

        	_self.editView.find('.product-list tbody input[name^="product"]').each(function() {
		    	form_data.append($(this).attr("name"), $(this).val());
		    });
        }

        form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
        form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
        form_data.append("remarks", _self.editView.find('input[name="remarks"]').val());


        $.ajax({
            url: "admin_hp_blk/insert_hpblk",
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
                alert("建立首頁區塊成功 !");

                _self.getHpBlkList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {

            	if(json_data.msg == 'incorrent')
            		alert("title或 上架商品 沒設定 !");
            	else if(json_data.msg == 'no_product')
            		alert("請選擇上架商品 !");
            	else if(json_data.msg == 'no_count')
            		alert("最新商品的數量沒有填 !");
            	else if(json_data.msg == 'time_error')
            		alert("下架時間必須大於等於上架時間 !");
            	else
                	alert("建立首頁區塊失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    HpBlkHelper.prototype.updateHpBlk = function() {

        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        form_data.append("hpblk_id", _self.editView.find('input[name="hpblk_id"]').val());


        form_data.append("title", _self.editView.find('input[name="title"]').val());
        form_data.append("rank", _self.editView.find('input[name="rank"]').val());
        form_data.append("type", _self.editView.find('select[name="type"]').val());

        form_data.append("count", _self.editView.find('input[name="count"]').val());
        form_data.append("is_active", _self.editView.find('select[name="is_active"]').val());

        if(_self.editView.find('select[name="type"]').val() == 'custom') {
        	_self.editView.find('.product-list tbody input[name^="product"]').each(function() {
		    	form_data.append($(this).attr("name"), $(this).val());
		    });
        }

        form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
        form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
        form_data.append("remarks", _self.editView.find('input[name="remarks"]').val());

        $.ajax({
            url: "admin_hp_blk/update_hpblk",
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
                alert("修改首頁區塊成功 !");
                
                _self.getHpBlkList(20, nowHpBlkPage);
                _self.listView.show();
                _self.editView.hide();
            } else {

                if(json_data.msg == 'incorrent')
            		alert("title或 上架商品 沒設定 !");
            	else if(json_data.msg == 'no_product')
            		alert("請選擇上架商品 !");
            	else if(json_data.msg == 'no_count')
            		alert("最新商品的數量沒有填 !");
            	else if(json_data.msg == 'time_error')
            		alert("下架時間必須大於等於上架時間 !");
            	else if(json_data.msg == 'no_hpblk')
            		alert("此區塊已經不存在 !");
            	else
                	alert("建立首頁區塊失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };



    HpBlkHelper.prototype.getHpBlkById = function(id) {

        var _self = (event.data) ? event.data : this;
        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_hp_blk/get_hpblk",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.hp-blk-edit .state').val('update');

                _self.editView.find('input[name="hpblk_id"]').val(json_data.data.hpblk_id);
        		_self.editView.find('input[name="title"]').val(json_data.data.title);


        		if(json_data.data.type == 'custom') {
        			_self.editView.find('select[name="type"]').val('custom');
	        		_self.editView.find('.product-list').show();
	        		_self.editView.find('.count').hide();
				} else if(json_data.data.type == 'newest') {
					_self.editView.find('select[name="type"]').val('newest');
					_self.editView.find('.product-list').hide();
					_self.editView.find('.count').show();
				}
        		

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
			        _self.product_counter++;
        		}
        		

        		_self.editView.find('input[name="rank"]').val(json_data.data.rank);

        		_self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
        		_self.editView.find('input[name="end_time"]').val(json_data.data.end_time);
        		_self.editView.find('input[name="remarks"]').val(json_data.data.remarks);
        		_self.editView.find('input[name="count"]').val(json_data.data.count);
        		
        		_self.editView.find('select[name="is_active"]').val(json_data.data.is_active);

              //  _self.editView.find('input[name="create_user"]').val(json_data.data.create_user);
                _self.editView.find('input[name="edit_time"]').val(json_data.data.last_edit_time);
                _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);


                $("#hp-blk-page .hp-blk-edit").show();
                $("#hp-blk-page .hp-blk-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }



    HpBlkHelper.prototype.deleteHpBlkById = function(id) {

        var _self = (event.data) ? event.data : this;

        $.ajax({
	        type: "POST",
	        url: "admin_hp_blk/delete_hpblk",
	        data: {'hpblk_id': id}
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {
	            _self.getHpBlkList(20, 1);
	            alert("刪除首頁區塊·成功 !");
	        } else {
	            alert("發生錯誤，請檢查網路或重新載入網頁");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
    }

    


    HpBlkHelper.prototype.editorInit = function() {

        this.editView.find('input[name="hp_blk_id"]').val('');
        this.editView.find('input[name="title"]').val('');
        this.editView.find('input[name="rank"]').val('');
        this.editView.find('input[name="count"]').val('');
        
        this.editView.find('select[name="type"]').val('custom');
        this.editView.find('select[name="is_active"]').val('1');
        
        this.editView.find('.product-list').show();
        this.editView.find('input[name="count"]').hide();
	   
        this.editView.find('.product-list tbody').html('');

        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('input[name="remarks"]').val('');
        this.editView.find('input[name="edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');


		this.product_counter = 0;

        this.editView.show();
        this.listView.hide();
    };

    hpblkHelper = new HpBlkHelper();
    hpblkHelper.getHpBlkList(20, nowHpBlkPage);

})(jQuery, this, 0);


