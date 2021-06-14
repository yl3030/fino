var nowProductPage = 1;


$(window).click(function() {
	if(productHelper) {
		productHelper.category_panel.hide();
	}
});


(function ($, window, i) {

    var ProductHelper = function(){
        this.rootView = $('#product-page');
        this.form = $('#product_form');
        this.listView = this.rootView.find('.product-list');
        this.editView = this.rootView.find('.product-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');
        this.tag_add = this.editView.find('.tag-add-con .tag-add');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.product-list .pagination');

        this.searchBtn = this.rootView.find('.search-console .search');

        this.category_selector = this.editView.find('.category-selector');
        this.category_panel = this.editView.find('.category_panel');

        this.product_tag_arr = [];

		this.product_spec_count = 0;
        this.option_count = 0;
        this.recommand_count = 0;
        this.gift_count = 0;


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
            nowProductPage = 1;
            _self.getProductList(20, nowProductPage);
        });







		this.tag_add.on('click', this, function(event){
			var _self = (event.data) ? event.data : this;
		    var new_tags = $('#new-product-tag').val();
		    var arr = new_tags.split(",");

		    for(var i = 0, k = _self.product_tag_arr.length; i < arr.length; i++) {
		        arr[i] = arr[i].replace(/\s\s+/g, ' ').trim();
		        // alert("|" + arr[i] + "|");

		        if((arr[i] != '') && (_self.product_tag_arr.indexOf(arr[i]) == -1)) {
		            _self.product_tag_arr[k] = arr[i];
		            //alert(arr[i] + '   (' + k);
		            k++;
		            //tag_arr.splice(i, 1);
		        }
		    }

		    _self.showProductTag();
		    $('#new-product-tag').val('');
		});








        this.form.on('submit', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;
            /*_self.editView.hide();
            _self.listView.show();*/


            if(_self.state.val() == 'insert')
                _self.createProduct();
            else
                _self.updateProduct();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });






        this.editView.find('.product-spec tfoot button').on('click', this, function(event){
        	var _self = (event.data) ? event.data : this;
        	_self.editView.find('.product-spec tbody').append('<tr id="product-spec' + _self.product_spec_count + '">'
			        + '<td class="text-right"><input type="text" name="product_spec[' + _self.product_spec_count + ']" placeholder="請輸入規格" class="form-control"></td>'
                    + '<td class="text-right"><input type="text" name="product_spec_rank[' + _self.product_spec_count + ']" placeholder="請輸入排序" class="form-control"></td>'
                    + '<td class="text-right"><input type="text" name="product_spec_add_price[' + _self.product_spec_count + ']" placeholder="請輸入加價金額" class="form-control"></td>'
			        + '<td class="text-right bn"><button type="button" onclick="$(\'#product-spec' + _self.product_spec_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
			        + '</button></td></tr>');

            _self.product_spec_count++;
        });








        $('#product-thumb-image').on('click', this, function(event){
            event.preventDefault();
            //var _self = (event.data) ? event.data : this;

            productImageHelper.targetImageId = $(this).attr('id');

            productImageHelper.nowFolderId = 0;
            productImageHelper.page = 1;
            productImageHelper.open();
        });

        $('#product-images tfoot button').on('click', this, function(event){
            $('#product-images tbody').append('<tr id="image-row' + productImageHelper.imageNum + '">'
                + '<td class="text-left">'
                + '<a href="" id="product-thumb-image' + productImageHelper.imageNum + '" data-toggle="image" class="img-thumbnail">'
                + '<img src="https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png" alt="" title=""></a>'
                + '<input type="hidden" name="product_image[' + productImageHelper.imageNum + '][image]" value="" id="input-image0">'
                + '</td><td class="text-right">'
                + '<input type="text" name="product_image[' + productImageHelper.imageNum + '][sort_order]" value="" placeholder="排序(Sort Order)" class="form-control">'
                + '</td><td class="text-left">'
                + '<button type="button" onclick="$(\'#image-row' + productImageHelper.imageNum + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
                + '</button></td></tr>');


            $('#product-thumb-image' + productImageHelper.imageNum).on('click', this, function(event){
                event.preventDefault();

                productImageHelper.targetImageId = $(this).attr('id');

                productImageHelper.nowFolderId = 0;
                productImageHelper.page = 1;
                productImageHelper.open();
            });

            productImageHelper.imageNum++;
            //alert("fsfdsfdsfdsf");
        });




        


        this.editView.find('.gifts-product tfoot button').on('click', this, function(event){

        	//alert('sdf');
        	var _self = (event.data) ? event.data : this;
        	_self.editView.find('.gifts-product tbody').append('<tr id="gifts-product' + _self.gift_count + '">'//請輸入 商品ID 或 商品名稱
			        + '<td class="text-right">'
			        + '<input type="text" name="gift_product_id[' + _self.gift_count + '][id]" placeholder="請輸入 商品ID" class="form-control">'
			        + '</td>'
			        + '<td class="text-right">'
			        + '<select name="gift_product_id[' + _self.gift_count + '][is_accumulate]"><option value="0">不可累計</option><option value="1">可累計</option></select>'
			        + '</td>'
			        + '<td class="text-right bn"><button type="button" onclick="$(\'#gifts-product' + _self.gift_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
			        + '</button></td></tr>');

            _self.gift_count++;
        });







        this.editView.find('.recommand-product tfoot button').on('click', this, function(event){

        	//alert('sdf');
        	var _self = (event.data) ? event.data : this;
        	_self.editView.find('.recommand-product tbody').append('<tr id="recommand-product' + _self.recommand_count + '">'//請輸入 商品ID 或 商品名稱
			        + '<td class="text-right">'
			        + '<input type="text" name="recommand_product_id[' + _self.recommand_count + ']" placeholder="請輸入 商品ID" class="form-control">'
			        + '</td>'
			        + '<td class="text-right bn"><button type="button" onclick="$(\'#recommand-product' + _self.recommand_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
			        + '</button></td></tr>');

            _self.recommand_count++;
        });

        this.editView.find('.option-product tfoot button').on('click', this, function(event){

        	//alert('sdf');
        	var _self = (event.data) ? event.data : this;
        	_self.editView.find('.option-product tbody').append('<tr id="option-product' + _self.option_count + '">'
			        + '<td class="text-right">'
			        + '<input type="text" name="option_product_id[' + _self.option_count + ']" placeholder="請輸入 商品ID" class="form-control">'
			        + '</td>'
			        + '<td class="text-right bn"><button type="button" onclick="$(\'#option-product' + _self.option_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
			        + '</button></td></tr>');

            _self.option_count++;

       	});
    };








    ProductHelper.prototype.showProductTag = function() {
    	var _self = (event.data) ? event.data : this;

	    this.editView.find(".tag-list").html('');
	    for(var i = 0; i < this.product_tag_arr.length; i++) {
	        this.editView.find(".tag-list").append('<span><button type="button" class="remove-btn" role-data="' + i + '">' +
	        '<i class="fa fa-remove"></i></button>' + this.product_tag_arr[i] + '</span>');
	    }

	    this.editView.find(".tag-list > span .remove-btn").unbind('click');
	    this.editView.find(".tag-list > span .remove-btn").click(function (){
	        _self.product_tag_arr.splice($(this).attr('role-data'), 1);
	        _self.showProductTag();
	    });
	}







    ProductHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < productCateJson.length; i++) {
            if(productCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < productCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + productCateJson[i].sub_cate[k].category_id + '">' 
                    + productCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    ProductHelper.prototype.getProductList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowProductPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_product/product_list",
            data: {
                'num': num, 
                'start': startCount,
                'keywords': _self.rootView.find('.search-console input[name="keywords"]').val(),
                'product_type': _self.rootView.find('.search-console select[name="product_type"]').val(),
                'status': _self.rootView.find('.search-console select[name="status"]').val()
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
                    _self.getProductList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.product.length; i++)
            {   
                if(json_data.data.product[i].cover_image == '')
                    json_data.data.product[i].cover_image = 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png';

                if(json_data.data.product[i].status == 1)
                	json_data.data.product[i].status = '上架中';
                else
                	json_data.data.product[i].status = '已下架';


                if(json_data.data.product[i].sale_price > 0) {
                	price = '<b>' + json_data.data.product[i].sale_price  + ' NTD</b><br><s>' 
                	+ json_data.data.product[i].price + ' NTD</s>';
                }else{
                	price = '<b>' + json_data.data.product[i].price + ' NTD<b>';
                }



                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' + json_data.data.product[i].product_id + '</td>'
                            + '<td class="text-left"><img class="thumb" src="' 
                            + json_data.data.product[i].cover_image + '"></td>'
                            + '<td class="text-left">' + json_data.data.product[i].name + '</td>'
							+ '<td class="text-left desc">' + json_data.data.product[i].quantity + '</td>'
                            + '<td class="text-left desc">' + price + '</td>'
                            + '<td class="text-left">' + json_data.data.product[i].status + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-product-id="' 
                            + json_data.data.product[i].product_id + '" class="btn btn-group delete">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<button title="修改商品" class="btn btn-gold update" data-product-id="' 
                            + json_data.data.product[i].product_id + '">'
                            + '<i class="fa fa-pencil"></i></button>'

                            + '<a title="複製商品" class="btn btn-gold copy" data-product-id="' 
                            + json_data.data.product[i].product_id + '">'
                            + '<i class="fa fa-copy"></i></a>'

                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delete').unbind('click');
            _self.tableView.find('.delete').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    delete_product_by_id($(this).attr('data-product-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                $('.product-edit h1').html('商品編輯');
                _self.get_product_by_id($(this).attr('data-product-id'));
            });

            _self.tableView.find('.copy').unbind('click');
            _self.tableView.find('.copy').click(function (){
                var r = confirm("確定要複製這筆商品資料嗎 ?");
                if (r == true) {
                	//alert('功能製作中...');
                    _self.productCopy($(this).attr('data-product-id'));
                }
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };

    ProductHelper.prototype.productCopy = function(id) {
        var _self = (event.data) ? event.data : this;
        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_product/product_copy",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("複製商品資料成功 !");

                nowProductPage = 1;
                _self.getProductList(20, nowProductPage);

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }



    ProductHelper.prototype.createProduct = function() {
        
        var _self = (event.data) ? event.data : this;


        var form_data = new FormData();
        form_data.append("name", _self.editView.find('input[name="name"]').val());
        form_data.append("excerpt", _self.editView.find('textarea[name="excerpt"]').val());
        form_data.append("price", _self.editView.find('input[name="price"]').val());



        form_data.append("product_type", _self.editView.find('input[name="product_type"]:checked').val());
        form_data.append("sale_price", _self.editView.find('input[name="sale_price"]').val());


        
        form_data.append("category_id", _self.editView.find('input[name="category_id"]').val());

        var tags = '';
        for (var i = 0; i < _self.product_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += _self.product_tag_arr[i];
        }
        form_data.append("tags", tags);


        form_data.append("sku", _self.editView.find('input[name="sku"]').val());
        form_data.append("quantity", _self.editView.find('input[name="quantity"]').val());
        form_data.append("length", _self.editView.find('input[name="length"]').val());
        form_data.append("width", _self.editView.find('input[name="width"]').val());
        form_data.append("height", _self.editView.find('input[name="height"]').val());
        form_data.append("weight", _self.editView.find('input[name="weight"]').val());
        form_data.append("status", _self.editView.find('select[name="status"]').val());



        form_data.append("product_title", _self.editView.find('input[name="product_title"]').val());
        form_data.append("product_desc", _self.editView.find('textarea[name="product_desc"]').val());
        form_data.append("keywords", _self.editView.find('input[name="keywords"]').val());



        _self.editView.find('input[name^="product_spec"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });




        form_data.append("main_image", _self.editView.find('input[name="main_image"]').val());
        
        _self.editView.find('input[name^="product_image"]').each(function() {
            

            form_data.append($(this).attr("name"), $(this).val());

            
        });




        _self.editView.find('input[name^="option_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
           // op += $(this).val() + ',';
        });

        _self.editView.find('input[name^="recommand_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
          //  rp += $(this).val() + ',';
        });

        _self.editView.find('input[name^="gift_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });

        _self.editView.find('select[name^="gift_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });

        



    
        form_data.append("product_content", CKEDITOR.instances.product_content.getData());

        $.ajax({
            url: "admin_product/product_insert",
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

                _self.getProductList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
            	if(json_data.msg == "not_free")
            		alert("請輸入商品售價，不得為 0 !");
            	else
                	alert("建立商品失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    ProductHelper.prototype.updateProduct = function() {
        var _self = (event.data) ? event.data : this;
        var tags = '';
        for (var i = 0; i < _self.product_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += _self.product_tag_arr[i];
        }

        var form_data = new FormData();
        form_data.append("product_id", _self.editView.find('.product_id').val());
        form_data.append("name", _self.editView.find('input[name="name"]').val());
        form_data.append("excerpt", _self.editView.find('textarea[name="excerpt"]').val());


        form_data.append("category_id", _self.editView.find('input[name="category_id"]').val());
        form_data.append("tags", tags);


        form_data.append("price", _self.editView.find('input[name="price"]').val());

        form_data.append("product_type", _self.editView.find('input[name="product_type"]:checked').val());
        form_data.append("sale_price", _self.editView.find('input[name="sale_price"]').val());


        form_data.append("sku", _self.editView.find('input[name="sku"]').val());
        form_data.append("quantity", _self.editView.find('input[name="quantity"]').val());
        form_data.append("length", _self.editView.find('input[name="length"]').val());
        form_data.append("width", _self.editView.find('input[name="width"]').val());
        form_data.append("height", _self.editView.find('input[name="height"]').val());
        form_data.append("weight", _self.editView.find('input[name="weight"]').val());
        form_data.append("status", _self.editView.find('select[name="status"]').val());



        form_data.append("product_title", _self.editView.find('input[name="product_title"]').val());
        form_data.append("product_desc", _self.editView.find('textarea[name="product_desc"]').val());
        form_data.append("keywords", _self.editView.find('input[name="keywords"]').val());

        _self.editView.find('input[name^="product_spec"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });


        form_data.append("main_image", _self.editView.find('input[name="main_image"]').val());

        _self.editView.find('input[name^="product_image"]').each(function() {
            
            form_data.append($(this).attr("name"), $(this).val());
            
        });


        _self.editView.find('input[name^="option_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });

        _self.editView.find('input[name^="recommand_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });

        _self.editView.find('input[name^="gift_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });

        _self.editView.find('select[name^="gift_product_id"]').each(function() {
            form_data.append($(this).attr("name"), $(this).val());
        });
    

        form_data.append("product_content", CKEDITOR.instances.product_content.getData());

        $.ajax({
            url: "admin_product/product_update",
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
               // alert("修改商品成功 !");
                
                var r = confirm("修改商品成功，是否要繼續編輯 ?");
                _self.getProductList(20, nowProductPage);
	            if (r != true) {
	                _self.listView.show();
               		_self.editView.hide();
	            }
               
            } else {
                alert("修改商品失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    ProductHelper.prototype.getProductCate = function(category_id) {
        var _self = (event.data) ? event.data : this;

        //category_id
        


        $.ajax({
	        type: "POST",
	        url: "admin_product_cate/cate_list",
	        data: {
	            'cate_id': category_id
	        }
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	       // $( "#product-cate-page .parent-cate .cate-structure" ).html(json_data.data.parent_structure);
	       // $('#product-cate-page .panel input[name="parent_cate_id"]').val(json_data.data.parent_cate_id);

	       	_self.category_selector.html(json_data.data.parent_structure);
	        _self.editView.find('input[name="category_id"]').val(json_data.data.parent_cate_id);


	        _self.editView.find('.category_panel .panel-body').empty();
	        for(var i = 0; i < json_data.data.cate_list.length; i++)
	        {   
	            _self.editView.find('.category_panel .panel-body').append('<div class="cate-b" role-data="'
	                        + json_data.data.cate_list[i].product_category_id + '">'
	                        + '<span>' + json_data.data.cate_list[i].name + '</span></div>');
	        }



	        _self.editView.find('.category_panel .back-cate-parent').attr('role-data', json_data.data.last_cate_id);


	        //_self.category_selector
	        if(json_data.data.cate_list.length == 0)
        		_self.category_panel.hide();



	        _self.editView.find('.category_panel .cate-b').unbind('click');
	        _self.editView.find('.category_panel .cate-b').click(function (){
	            $('#product-cate-page .panel-body .cate-b').removeClass('active');
	            $(this).addClass('active');

	            _self.getProductCate($(this).attr('role-data'));
	        });


	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {
	        
	    });
    };

    ProductHelper.prototype.get_product_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_product/get_product_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                _self.editView.find('.state').val('update');
                _self.editView.find('.product_id').val(json_data.data.product_id);


                _self.editView.find('input[name="name"]').val(json_data.data.name);
                _self.editView.find('textarea[name="excerpt"]').val(json_data.data.excerpt);
                _self.editView.find('input[name="price"]').val(json_data.data.price);


                _self.editView.find('input[name="product_type"][value="' + json_data.data.product_type + '"]').prop("checked", true);


                if(json_data.data.sale_price > 0)
                	_self.editView.find('input[name="sale_price"]').val(json_data.data.sale_price);
                else
                	_self.editView.find('input[name="sale_price"]').val('');


                
                _self.category_selector.html(json_data.data.parent_structure);
                _self.editView.find('input[name="category_id"]').val(json_data.data.parent_cate_id);
                _self.editView.find('.category_panel .back-cate-parent').attr('role-data', json_data.data.last_cate_id);

                _self.getProductCate(json_data.data.parent_cate_id);






                _self.product_tag_arr = [];
                for (var i = 0; i < json_data.data.tags.length; i++) {
                    _self.product_tag_arr[i] = json_data.data.tags[i].name;
                }

                _self.showProductTag();
              




                _self.editView.find('input[name="sku"]').val(json_data.data.sku);
                _self.editView.find('input[name="quantity"]').val(json_data.data.quantity);
                _self.editView.find('input[name="length"]').val(json_data.data.length);
                _self.editView.find('input[name="width"]').val(json_data.data.width);
                _self.editView.find('input[name="height"]').val(json_data.data.height);
                _self.editView.find('select[name="status"]').val(json_data.data.status);
                _self.editView.find('input[name="weight"]').val(json_data.data.weight);


                _self.editView.find('input[name="product_title"]').val(json_data.data.page_title);
                _self.editView.find('textarea[name="product_desc"]').val(json_data.data.page_description);
                _self.editView.find('input[name="keywords"]').val(json_data.data.keywords);


                _self.editView.find('input[name="edit_time"]').val(json_data.data.date_modified);
                _self.editView.find('input[name="create_time"]').val(json_data.data.date_added);


              //  CKEDITOR.instances.product_content.setData(json_data.data.description);
                CKEDITOR.instances.product_content.setData(json_data.data.description);





                for(var i = 0; i < json_data.data.images.length; i++) {

                    if(json_data.data.images[i].is_cover == 1) {
                        $('#product-thumb-image + input').val(json_data.data.images[i].image_id);
                        $('#product-thumb-image img').attr('src', 
                            json_data.data.images[i].image_small);

                    } else {

                        $('#product-images tbody').append('<tr id="image-row' + productImageHelper.imageNum + '">'
                            + '<td class="text-left">'
                            + '<a href="" id="product-thumb-image' + productImageHelper.imageNum + '" data-toggle="image" class="img-thumbnail">'
                            + '<img src="' + json_data.data.images[i].image_small + '" alt="" title=""></a>'
                            + '<input type="hidden" name="product_image[' + productImageHelper.imageNum + '][image]" value="'
                            + json_data.data.images[i].image_id + '" id="input-image0">'
                            + '</td><td class="text-right">'
                            + '<input type="text" name="product_image[' + productImageHelper.imageNum + '][sort_order]" value="' 
                            + json_data.data.images[i].order 
                            + '" placeholder="排序(Sort Order)" class="form-control">'
                            + '</td><td class="text-left">'
                            + '<button type="button" onclick="$(\'#image-row' + productImageHelper.imageNum + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
                            + '</button></td></tr>');

                        productImageHelper.imageNum++;
                    }
                }








                

                _self.product_spec_count = 0;
                for(var i = 0; i < json_data.data.product_spec.length; i++) {

                	if(json_data.data.product_spec[i].add_price == 0)
                		json_data.data.product_spec[i].add_price = '';

                    _self.editView.find('.product-spec tbody').append('<tr id="product-spec' + _self.product_spec_count + '">'
				        + '<td class="text-right"><input type="text" value="' + json_data.data.product_spec[i].spec + '" name="product_spec[' + _self.product_spec_count + ']" placeholder="請輸入規格" class="form-control"></td>'
	                    + '<td class="text-right"><input type="text" value="' + json_data.data.product_spec[i].rank + '" name="product_spec_rank[' + _self.product_spec_count + ']" placeholder="請輸入排序" class="form-control"></td>'
	                    + '<td class="text-right"><input type="text" value="' + json_data.data.product_spec[i].add_price + '" name="product_spec_add_price[' + _self.product_spec_count + ']" placeholder="請輸入加價金額" class="form-control"></td>'
				        + '<td class="text-right bn"><button type="button" onclick="$(\'#product-spec' + _self.product_spec_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
				        + '</button></td></tr>');

                    _self.product_spec_count++;
                }




                _self.option_count = 0;
                for(var i = 0; i < json_data.data.option_product_id.length; i++) {
		        	_self.editView.find('.option-product tbody').append('<tr id="option-product' + _self.option_count + '">'
					        + '<td class="text-right">'
					        + '<input type="text" name="option_product_id[' + _self.option_count + ']" value="' + json_data.data.option_product_id[i].option_product_id + '" placeholder="請輸入 商品ID" class="form-control">'
					        + '</td>'
					        + '<td class="text-right bn"><button type="button" onclick="$(\'#option-product' + _self.option_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
					        + '</button></td></tr>');
		        	_self.option_count++;
                }



                _self.recommand_count = 0;
                for(var i = 0; i < json_data.data.recommand_product_id.length; i++) {
                    _self.editView.find('.recommand-product tbody').append('<tr id="recommand-product' + _self.recommand_count + '">'//請輸入 商品ID 或 商品名稱
					        + '<td class="text-right">'
					        + '<input type="text" name="recommand_product_id[' + _self.recommand_count + ']" value="' + json_data.data.recommand_product_id[i].recommand_product_id + '" placeholder="請輸入 商品ID" class="form-control">'
					        + '</td>'
					        + '<td class="text-right bn"><button type="button" onclick="$(\'#recommand-product' + _self.recommand_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
					        + '</button></td></tr>');
                    _self.recommand_count++;
                }

                


                _self.gift_count = 0;
                for(var i = 0; i < json_data.data.gift_product_id.length; i++) {

                	if(json_data.data.gift_product_id[i].is_accumulate == 1) {
                		option = '<option value="0">不可累計</option><option selected="selected" value="1">可累計</option>';
                	} else {
                		option = '<option selected="selected" value="0">不可累計</option><option value="1">可累計</option>';
                	}

                    _self.editView.find('.gifts-product tbody').append('<tr id="gifts-product' + _self.gift_count + '">'//請輸入 商品ID 或 商品名稱
					        + '<td class="text-right">'
					        + '<input type="text" name="gift_product_id[' + _self.gift_count + '][id]" value="' + json_data.data.gift_product_id[i].gift_product_id + '" placeholder="請輸入 商品ID" class="form-control">'
					        + '</td>'
					        + '<td class="text-right">'
					        + '<select name="gift_product_id[' + _self.gift_count + '][is_accumulate]">' + option + '</select>'
					        + '</td>'
					        + '<td class="text-right bn"><button type="button" onclick="$(\'#gifts-product' + _self.gift_count + '\').remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
					        + '</button></td></tr>');
                    _self.gift_count++;
                }




                for(var i = 0; i < json_data.data.fav_user_list.length; i++)
	            {   
	                if(json_data.data.fav_user_list[i].photo == '')
	                    json_data.data.fav_user_list[i].photo = 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png';

	                if(json_data.data.fav_user_list[i].gender == 'female')
	                	json_data.data.fav_user_list[i].gender = '女生';
	                else if(json_data.data.fav_user_list[i].gender == 'male')
	                	json_data.data.fav_user_list[i].gender = '男生';

	                _self.editView.find('.fav-user-list tbody').append('<tr>'
	                            + '<td class="text-left">' + json_data.data.fav_user_list[i].id + '</td>'
	                            + '<td class="text-center"><img class="user-thumb" src="' 
	                            + json_data.data.fav_user_list[i].photo + '"></td>'
	                            + '<td class="text-left">' + json_data.data.fav_user_list[i].name + '</td>'
	                            + '<td class="text-left">' + json_data.data.fav_user_list[i].email + '</td>'
	                            + '<td class="text-left">' + json_data.data.fav_user_list[i].gender + '</td>'
	                            + '</tr>');
	            }












                              

                $("#product-page .product-edit").show();
                $("#product-page .product-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }







    ProductHelper.prototype.editorInit = function() {

        $("a[href='#product-general-info']").trigger("click");
        $('#product-thumb-image + input').val('');
        $('#product-thumb-image img').attr('src', 
            'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png');
        $('#product-images tbody').html('');

        $('#product-page .product-spec tbody').html('');
        $('#product-page .option-product tbody').html('');
        $('#product-page .recommand-product tbody').html('');
        $('#product-page .gifts-product tbody').html('');
        
        this.editView.find('.fav-user-list tbody').html('');



        productImageHelper.imageNum = 0;


        this.editView.find(".tag-list").html('');
        this.product_tag_arr = [];


        this.editView.find('input[name="name"]').val('');
        this.editView.find('textarea[name="excerpt"]').val('');
        this.editView.find('input[name="price"]').val('');


        this.editView.find('input[name="product_type"][value="1"]').prop("checked", true);






        this.editView.find('input[name="sale_price"]').val('');

        this.editView.find('input[name="sku"]').val('');
        this.editView.find('input[name="quantity"]').val('');
        this.editView.find('input[name="length"]').val('');
        this.editView.find('input[name="width"]').val('');
        this.editView.find('input[name="height"]').val('');
        this.editView.find('input[name="weight"]').val('');
        this.editView.find('select[name="status"]').val('');
        this.editView.find('input[name="edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');


        CKEDITOR.instances.product_content.setData('');
    };





   // alert('sdfadsf jasif jsdiof ');



    productHelper = new ProductHelper();
    productHelper.getProductList(20, nowProductPage);


    productHelper.getProductCate(productHelper.editView.find('input[name="category_id"]').val());

    productHelper.editView.find('.category_panel .back-cate-parent').click(function(){
    	productHelper.getProductCate($(this).attr('role-data'));
    });
   // productHelper.getProductCate();

  //  alert('fsfdsdsfd');

})(jQuery, this, 0);







function get_product_list(num, start)
{
    nowProductPage = start;
    startCount = (start - 1) * 20;
    $.ajax({
        type: "POST",
        url: "admin_product/product_list",
        data: {
            'num': num, 
            'start': startCount
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('.product-list tbody').empty();
        $('#product-page .pagination').empty();
        $('#product-page .pagination li').unbind('click');

        if(json_data.data.count > 20)
        {
            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
            {
                if(i == start)
                {
                    $('#product-page .pagination').append(
                        '<li class="active"><a>' + i + '</a></li>');
                } else {
                    $('#product-page .pagination').append(
                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }
            }
            $('#product-page .pagination li').click(function (){
                if($(this).hasClass("active"))
                    return false;
                get_product_list(20, $(this).attr('role-data'));
                return false;
            });
        }

        for(var i = 0; i < json_data.data.product.length; i++)
        {   
            $('.product-list tbody').append('<tr><td class="text-center">'
                        + '<input type="checkbox" name="selected[]" value="2911"></td>'
                        + '<td class="text-left">' + (i + 1) + '</td>'
                        + '<td class="text-left"><img class="thumb" src="' 
                        + json_data.data.product[i].cover_photo_small + '"></td>'
                        + '<td class="text-left">' + json_data.data.product[i].id + '</td>'
                        + '<td class="text-left">' + json_data.data.product[i].title + '</td>'
                        + '<td class="text-left desc">' + json_data.data.product[i].excerpt + '</td>'
                        + '<td class="text-right">'
                        + '<button type="button" data-product-id="' 
                        + json_data.data.product[i].id + '" class="btn btn-group delet">'
                        + '<i class="fa fa-trash"></i></button>'
                        + '<a title="修改問題" class="btn btn-gold update" data-product-id="' 
                        + json_data.data.product[i].id + '">'
                        + '<i class="fa fa-pencil"></i></a>'
                        + '</td>'
                        + '</tr>');
        }

        $('#product-page table tbody .delet').unbind('click');
        $('#product-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_product_by_id($(this).attr('data-product-id'));
            }
        });

        $('#product-page table tbody .update').unbind('click');
        $('#product-page table tbody .update').click(function (){
            _self.get_product_by_id($(this).attr('data-product-id'));
        });



    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}










function delete_product_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_product/product_delete",
        data: {'product_id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            productHelper.getProductList(20, 1);
            alert("刪除商品·成功 !");
        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
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

$('#product-page .create').click(function (){

    $('.product-edit .state').val('insert');
    


    $('.product-edit h1').html('商品建立');

   // alert('sdfadsf jasif jsdiof ');



    productHelper.editorInit();
    productHelper.editView.show();
    productHelper.listView.hide();


   // CKEDITOR.instances.post_content_tw.setData('');
  //  CKEDITOR.instances.post_content_en.setData('');
    //CKEDITOR.instances.post_content.setData( '' );


  //  $('#post-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
    
});



//get_post_list(20, nowProductPage);





$("#product-page .tag-media").click(function(e) {
    $('#media-dt-pop').fadeIn();

    $('#media-dt-pop .media-box').html('');
    is_photo_pool_loading = false;
    photo_pool_count = 1;
    photo_pool_hash = new Object();
    get_photo_pool_list(20, photo_pool_count);
});









if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
    CKEDITOR.tools.enableHtml5Elements( document );

CKEDITOR.config.height = 450;
CKEDITOR.config.width = 'auto';



initCkeditor('product_content');
//initCkeditor('post_content_tw');
//initCkeditor('post_content_en');



var product_tag_arr = [];
$('.product-tag-add-con .tag-add').click(function (){
    var new_tags = $('#new-product-tag').val();
    var arr = new_tags.split(",");

    for(var i = 0, k = product_tag_arr.length; i < arr.length; i++) {
        arr[i] = arr[i].replace(/\s\s+/g, ' ').trim();
        // alert("|" + arr[i] + "|");

        if((arr[i] != '') && (product_tag_arr.indexOf(arr[i]) == -1)) {
            product_tag_arr[k] = arr[i];
            //alert(arr[i] + '   (' + k);
            k++;
            //tag_arr.splice(i, 1);
        }
    }

    show_product_tag();
    $('#new-product-tag').val('');
});

function show_product_tag()
{
    $(".tag-list").html('');
    for(var i = 0; i < product_tag_arr.length; i++) {
        $(".tag-list").append('<span><button type="button" class="remove-btn" role-data="' + i + '">' +
        '<i class="fa fa-remove"></i></button>' + product_tag_arr[i] + '</span>');
    }

    $(".tag-list > span .remove-btn").unbind('click');
    $(".tag-list > span .remove-btn").click(function (){
        //alert($(this).attr('role-data'));

        product_tag_arr.splice($(this).attr('role-data'), 1);
        show_product_tag();
    });
}

