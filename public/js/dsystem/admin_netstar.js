var nowNetstarPage = 1;


(function ($, window, i) {

    var NetstarHelper = function(){
        this.rootView = $('#netstar-page');
        this.form = $('#netstar_form');
        this.listView = this.rootView.find('.netstar-list');
        this.editView = this.rootView.find('.netstar-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');

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
                _self.createNetstar();
            else
                _self.updateNetstar();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });

    };

    NetstarHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < netstarCateJson.length; i++) {
            if(netstarCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < netstarCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + netstarCateJson[i].sub_cate[k].category_id + '">' 
                    + netstarCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    NetstarHelper.prototype.yyyyyy = function(event) {
        var _self = (event.data) ? event.data : this;
        _self.editView.hide();
        _self.listView.show();
    };

    NetstarHelper.prototype.getNetstarList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowNetstarPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_netstar/netstar_list",
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
                    _self.getNetstarList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.netstar.length; i++)
            {   
            	if(json_data.data.netstar[i].fino_apr == 0)
            		fino_apr_chk = '';
            	else
            		fino_apr_chk = 'checked';


            	if(json_data.data.netstar[i].fino_apr == 0)
            		hors_apr_chk = '...';
            	else {
	            	if(json_data.data.netstar[i].hors_apr == 0)
	            		hors_apr_chk = '審核中';
	            	else if(json_data.data.netstar[i].hors_apr == 1)
	            		hors_apr_chk = '通過';
	            	else if(json_data.data.netstar[i].hors_apr == -1)
	            		hors_apr_chk = '未通過';
	            }


                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            // + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' 
                            + json_data.data.netstar[i].netstar_id 
                            + '<input type="hidden" name="netstar_id" value="' 
                            + json_data.data.netstar[i].netstar_id + '"></td>'
                            + '<td class="text-left">' + json_data.data.netstar[i].channel_name + '</td>'
                            + '<td class="text-left"><a target="_blank" href="' 
                            + json_data.data.netstar[i].channel_url + '">前往頻道</a></td>'
                            + '<td class="text-left">' + json_data.data.netstar[i].channel_description.substring(0, 15) + '...</td>'
                            // + '<td class="text-left">' + json_data.data.netstar[i].publish_date + '</td>'



                            + '<td class="text-left"><label class="chk-container">'
								  	+ '<input type="checkbox" ' + fino_apr_chk + ' name="fino_apr" value="1">'
								  	+ '<span class="chk-checkmark"></span>'
								+ '</label></td>'

							+ '<td class="text-left">' + hors_apr_chk + '</td>'
                            

                            + '<td class="text-right" style="position: relative">'
                            + '<button type="button" data-netstar-id="' 
                            + json_data.data.netstar[i].netstar_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-netstar-id="' 
                            + json_data.data.netstar[i].netstar_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '<div class="up-success" style="display: none;">已儲存更新</div>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('input[name="fino_apr"]').unbind('change');
            _self.tableView.find('input[name="fino_apr"]').on('change', this, function(event){

            	$p = $(this).closest('tr');

            	var form_data = new FormData();

            	if($(this).prop( "checked" ))
		        	form_data.append("fino_apr", 1);
		        else
		        	form_data.append("fino_apr", 0);


		        //alert($p.find('input[name="netstar_id"]').val());

		        form_data.append("netstar_id", $p.find('input[name="netstar_id"]').val());
		        
		        _self.approveNetstar(form_data, $p.find('.up-success'));
            	/*var form_data = new FormData();

            	if($p.find('input[name="price"]').val().trim() == '') {
            		$p.find('.price-error').html('價格為必填');
					$p.find('.price-error').show();
					return;
            	} else if (is_numeric($p.find('input[name="price"]').val()) && $p.find('input[name="price"]').val() > 0) {
				    form_data.append("price", $p.find('input[name="price"]').val());
				    $p.find('.price-error').hide();
				} else {
					$p.find('.price-error').html('請輸入正確價格');
					$p.find('.price-error').show();
					return;
				}

				if($p.find('input[name="sale_price"]').val().trim() == '') {
            		
            	} else if (is_numeric($p.find('input[name="sale_price"]').val()) && $p.find('input[name="sale_price"]').val() > 0) {
				    form_data.append("sale_price", $p.find('input[name="sale_price"]').val());
				    $p.find('.price-error').hide();
				} else {
					$p.find('.price-error').html('請輸入正確價格');
					$p.find('.price-error').show();
					return;
				}

				if($p.find('input[name="stock"]').val().trim() == '') {
            		$p.find('.stock-error').html('庫存為必填');
					$p.find('.stock-error').show();
					return;
            	} else if (is_numeric($p.find('input[name="stock"]').val()) && $p.find('input[name="stock"]').val() >= 0) {
				    form_data.append("quantity", $p.find('input[name="stock"]').val());
				    $p.find('.stock-error').hide();
				} else {
					$p.find('.stock-error').html('請輸入正確庫存數量');
					$p.find('.stock-error').show();
					return;
				}

		        form_data.append("product_id", $p.find('input.pid').val());
		       // form_data.append("quantity", $p.find('input[name="stock"]').val());
		        form_data.append("status", $p.find('select[name="status"]').val());
            	_self.approveNetstar(form_data, $p.find('.up-success'));*/

	        });

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    delete_netstar_by_id($(this).attr('data-netstar-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.get_netstar_by_id($(this).attr('data-netstar-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };

    NetstarHelper.prototype.approveNetstar = function(form_data, view) {
        
        var _self = (event.data) ? event.data : this;

        $.ajax({
            url: "admin_netstar/approve",
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
                view.fadeIn();

               	setTimeout(function() {
				  	view.fadeOut();
				}, 1500);
            } else {
                alert("建立活動失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };

    NetstarHelper.prototype.createNetstar = function() {
        
        var _self = (event.data) ? event.data : this;
        var file_data = $("#netstar-page .img-select").prop("files")[0];

        var form_data = new FormData();
        form_data.append("netstarfile", file_data);
        form_data.append("title", $('.netstar-edit .netstar_title').val());
        form_data.append("excerpt", $('.netstar-edit .netstar_excerpt').val());



		form_data.append("address", $('.netstar-edit input[name="address"]').val());

        form_data.append("start_time", $('.netstar-edit input[name="start_time"]').val());
        form_data.append("end_time", $('.netstar-edit input[name="end_time"]').val());


        if(_self.editView.find('select[name="sub-cate"]').val() == null)
            form_data.append("category_id", '');
        else
            form_data.append("category_id", _self.editView.find('select[name="sub-cate"]').val());


        var tags = '';
        for (var i = 0; i < netstar_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += netstar_tag_arr[i];
        }

        form_data.append("tags", tags);
    

        form_data.append("netstar_content", CKEDITOR.instances.netstar_content.getData());
      //  form_data.append("netstar_content_tw", CKEDITOR.instances.netstar_content_tw.getData());
     //   form_data.append("netstar_content_en", CKEDITOR.instances.netstar_content_en.getData());


        $.ajax({
            url: "admin_netstar/netstar_insert",
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
                alert("建立活動成功 !");

                _self.getNetstarList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("建立活動失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    NetstarHelper.prototype.updateNetstar = function() {
        var _self = (event.data) ? event.data : this;
        var tags = '';
        for (var i = 0; i < netstar_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += netstar_tag_arr[i];
        }

        $.ajax({
            type: "POST",
            url: "admin_netstar/netstar_update",
            data: { 
                id: $('.netstar-edit .netstar_id').val(),
                title: $('.netstar-edit .netstar_title').val(),
                excerpt: $('.netstar-edit .netstar_excerpt').val(),
                category_id: _self.editView.find('select[name="sub-cate"]').val(),
                netstar_content: CKEDITOR.instances.netstar_content.getData(),
                address: _self.editView.find('input[name="address"]').val(),
                start_time: _self.editView.find('input[name="start_time"]').val(),
                end_time: _self.editView.find('input[name="end_time"]').val(),
                tags: tags
            }

        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("修改活動成功 !");
                
                _self.getNetstarList(20, nowNetstarPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("修改活動失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    NetstarHelper.prototype.getPostCate = function() {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_netstar/netstar_cate_list",
            data: {}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                netstarCateJson = json_data.data;

                //options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';
                options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';

                for(var i = 0; i < netstarCateJson.length; i++) {
                    options += '<option value="' + netstarCateJson[i].category_id + '">' 
                        + netstarCateJson[i].name + '</option>';
                }

                _self.editView.find('select[name="main-cate"]').html(options);

                sub_options = '';
                for(var i = 0; i < netstarCateJson.length; i++) {
                    if(netstarCateJson[i].category_id == _self.editView.find('select[name="main-cate"]').val()) {
                        for(var k = 0; k < netstarCateJson[i].sub_cate.length; k++) {
                            sub_options += '<option value="' + netstarCateJson[i].sub_cate[k].category_id + '">' 
                            + netstarCateJson[i].sub_cate[k].name + '</option>';
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

    NetstarHelper.prototype.get_netstar_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        $.ajax({
            type: "POST",
            url: "admin_netstar/get_netstar_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.netstar-edit .state').val('update');
                $('.netstar-edit .netstar_id').val(json_data.data.netstar_id);

                $("#netstar-page .inner-panel .netstar_title").val(json_data.data.title);
                $("#netstar-page .inner-panel .netstar_excerpt").val(json_data.data.excerpt);

                
                _self.editView.find('input[name="netstar_id"]').val(json_data.data.netstar_id);
                _self.editView.find('input[name="media_name"]').val(json_data.data.media_name);
				_self.editView.find('input[name="channel_name"]').val(json_data.data.channel_name);
				_self.editView.find('input[name="channel_url"]').val(json_data.data.channel_url);
				_self.editView.find('textarea[name="channel_description"]').val(json_data.data.channel_description);

				
                _self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
                _self.editView.find('input[name="end_time"]').val(json_data.data.end_time);


                _self.editView.find('select[name="main-cate"]').val(json_data.data.parent_id);
               // _self.getSubCate();
                _self.editView.find('select[name="sub-cate"]').val(json_data.data.category_id);


                // netstar_tag_arr = [];
                // for (var i = 0; i < json_data.data.tags.length; i++) {
                //     netstar_tag_arr[i] = json_data.data.tags[i].name;
                // }

                // show_netstar_tag();

                $("#netstar-page .img-cover").attr('src', json_data.data.cover_photo);

                //CKEDITOR.instances.netstar_content.setData(json_data.data.content);

                $("#netstar-page .inner-panel .edit_time").val(json_data.data.last_edit_time);
                $("#netstar-page .inner-panel .create_time").val(json_data.data.create_time);

                $("#netstar-page .netstar-edit").show();
                $("#netstar-page .netstar-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }


    NetstarHelper.prototype.editorInit = function() {

        this.editView.find('.netstar_title').val('');
        this.editView.find('.netstar_excerpt').val('');
        this.editView.find('input[name="address"]').val('');
        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('.netstar_id').val('');

        netstar_tag_arr = [];
        this.editView.find(".tag-list").html('');

        this.editView.find('.edit_time').val('');
        this.editView.find('.create_time').val('');
        this.editView.find('select[name="main-cate"]').val('');
        this.editView.find('select[name="sub-cate"]').val('');
        this.editView.find('.img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');

        CKEDITOR.instances.netstar_content.setData('');

        
        this.editView.show();
        this.listView.hide();
    };




    netstarHelper = new NetstarHelper();
    netstarHelper.getNetstarList(20, nowNetstarPage);
   // netstarHelper.getPostCate();

})(jQuery, this, 0);




/*function get_netstar_list(num, start)
{
    nowNetstarPage = start;
    startCount = (start - 1) * 20;
    $.ajax({
        type: "POST",
        url: "admin_netstar/netstar_list",
        data: {
            'num': num, 
            'start': startCount
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('.netstar-list tbody').empty();
        $('#netstar-page .pagination').empty();
        $('#netstar-page .pagination li').unbind('click');

        if(json_data.data.count > 20)
        {
            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
            {
                if(i == start)
                {
                    $('#netstar-page .pagination').append(
                        '<li class="active"><a>' + i + '</a></li>');
                } else {
                    $('#netstar-page .pagination').append(
                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }
            }
            $('#netstar-page .pagination li').click(function (){
                if($(this).hasClass("active"))
                    return false;
                netstarHelper.getNetstarList(20, $(this).attr('role-data'));
                return false;
            });
        }

        for(var i = 0; i < json_data.data.netstar.length; i++)
        {   



            $('.netstar-list tbody').append('<tr><td class="text-center">'
                        + '<input type="checkbox" name="selected[]" value="2911"></td>'
                        + '<td class="text-left">' + (i + 1) + '</td>'
                        + '<td class="text-left"><img class="thumb" src="' 
                        + json_data.data.netstar[i].cover_photo_small + '"></td>'
                        + '<td class="text-left">' + json_data.data.netstar[i].id + '</td>'
                        + '<td class="text-left">' + json_data.data.netstar[i].title + '</td>'
                        + '<td class="text-left desc">' + json_data.data.netstar[i].excerpt + '</td>'
                        + '<td class="text-right">'
                        + '<button type="button" data-netstar-id="' 
                        + json_data.data.netstar[i].id + '" class="btn btn-group delet">'
                        + '<i class="fa fa-trash"></i></button>'
                        + '<a title="修改問題" class="btn btn-gold update" data-netstar-id="' 
                        + json_data.data.netstar[i].id + '">'
                        + '<i class="fa fa-pencil"></i></a>'
                        + '</td>'
                        + '</tr>');
        }

        $('#netstar-page table tbody .delet').unbind('click');
        $('#netstar-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_netstar_by_id($(this).attr('data-netstar-id'));
            }
        });

        $('#netstar-page table tbody .update').unbind('click');
        $('#netstar-page table tbody .update').click(function (){
            _self.get_netstar_by_id($(this).attr('data-netstar-id'));
        });



    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}
*/









function delete_netstar_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_netstar/netstar_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            netstarHelper.getNetstarList(20, 1);
            alert("刪除活動·成功 !");
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

$('#netstar-page .create').click(function (){

    $('.netstar-edit .state').val('insert');
    netstarHelper.editorInit();
    
});



$("#netstar-page .tag-media").click(function(e) {
    $('#media-dt-pop').fadeIn();

    $('#media-dt-pop .media-box').html('');
    is_photo_pool_loading = false;
    photo_pool_count = 1;
    photo_pool_hash = new Object();
    get_photo_pool_list(20, photo_pool_count);
});






$( "#netstar-page .img-select" ).change(function() {

    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('.netstar-edit .state').val() == 'insert')
            {
                $('.netstar-edit .img-cover').attr('src', e.target.result);
            } else {
                $('#netstar-page .img-preview').attr('src', e.target.result);

                $('#netstar-page .preview-console').show();
            }
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});








$('#netstar-page .cancel-img').click(function (){
    $('#netstar-page .img-select').val('');
    $('#netstar-page .preview-console').hide();
});


$("#netstar-page .upload-img").click(function(){
    var imgVal = $('#netstar-page .img-select').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#netstar-page .img-select").prop("files")[0];
    var form_data = new FormData();
    form_data.append("netstarfile", file_data)
    form_data.append("netstar_id", $('.netstar-edit .netstar_id').val())
    $.ajax({
        url: "admin_netstar/photo",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#netstar-page .netstar-edit .img-cover").attr("src", json.data.cover_photo);
            alert('圖片上傳成功 !');
            $('#netstar-page .img-select').val('');
            $('#netstar-page .preview-console').hide();
            netstarHelper.getNetstarList(20, nowNetstarPage);
        } else {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }
    }).fail(function( jqXHR, textStatus  ) {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    });
});





if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
    CKEDITOR.tools.enableHtml5Elements( document );

CKEDITOR.config.height = 450;
CKEDITOR.config.width = 'auto';



initCkeditor('netstar_content');
//initCkeditor('netstar_content_tw');
//initCkeditor('netstar_content_en');



var netstar_tag_arr = [];
$('#netstar-page .tag-add-con .tag-add').click(function (){
    var new_tags = $('#new-netstar-tag').val();
    var arr = new_tags.split(",");

    for(var i = 0, k = netstar_tag_arr.length; i < arr.length; i++) {
        arr[i] = arr[i].replace(/\s\s+/g, ' ').trim();

        if((arr[i] != '') && (netstar_tag_arr.indexOf(arr[i]) == -1)) {
            netstar_tag_arr[k] = arr[i];
            k++;
        }
    }

    show_netstar_tag();
    $('#new-netstar-tag').val('');
});

function show_netstar_tag()
{
    $(".tag-list").html('');
    for(var i = 0; i < netstar_tag_arr.length; i++) {
        $(".tag-list").append('<span><button type="button" class="remove-btn" role-data="' + i + '">' +
        '<i class="fa fa-remove"></i></button>' + netstar_tag_arr[i] + '</span>');
    }

    $(".tag-list > span .remove-btn").unbind('click');
    $(".tag-list > span .remove-btn").click(function (){
        netstar_tag_arr.splice($(this).attr('role-data'), 1);
        show_netstar_tag();
    });
}



