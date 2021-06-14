var nowStorePage = 1;


(function ($, window, i) {

    var StoreHelper = function(){
        this.rootView = $('#store-page');
        this.form = $('#store_form');
        this.listView = this.rootView.find('.store-list');
        this.editView = this.rootView.find('.store-edit');
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
                _self.createStore();
            else
                _self.updateStore();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });



        this.city = Object.keys(tw_data);

		for (var i = 0; i < this.city.length; i++) {
			this.editView.find('select[name="city"]').append('<option value="' + this.city[i] + '">' + this.city[i] + '</option>');
		}


		this.editView.find('select[name="city"]').on('change', this, function(event) {

			var _self = (event.data) ? event.data : this;
			$val = _self.editView.find('select[name="city"]').val();
			_self.getZone($val);

		});





		this.editView.find('.getlatlng').on('click', this, function(event){
            var _self = (event.data) ? event.data : this;
            

            getAddrLatLng(
            	_self.editView.find('select[name="city"]').val()
            	+ _self.editView.find('select[name="zone"]').val()
            	+ _self.editView.find('input[name="address"]').val(), function(status, lat, lng){

            		if(status) {
	            		_self.editView.find('input[name="latitude"]').val(lat);
	            		_self.editView.find('input[name="longitude"]').val(lng);
	            	} else {
	            		alert('地址可能錯誤，請重新抓取');
	            	}
            });
        });
		
		



		

    };

    StoreHelper.prototype.getZone = function (name) {
		var zone = Object.keys(tw_data[name]);
		this.editView.find('select[name="zone"]').html('');
		for (var i = 0; i < zone.length; i++) {
	    	this.editView.find('select[name="zone"]').append('<option value="' + zone[i] + '">' + zone[i] + '</option>');
	    	//tw_data[name][zone[i]]
	    }
	};

    StoreHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < storeCateJson.length; i++) {
            if(storeCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < storeCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + storeCateJson[i].sub_cate[k].category_id + '">' 
                    + storeCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    StoreHelper.prototype.yyyyyy = function(event) {
        var _self = (event.data) ? event.data : this;
        _self.editView.hide();
        _self.listView.show();
    };

    StoreHelper.prototype.getStoreList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowStorePage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_store/store_list",
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
                    _self.getStoreList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.store.length; i++)
            {   
                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left"><img class="thumb" src="' 
                            + json_data.data.store[i].photo_mid_url + '"></td>'
                            + '<td class="text-left">' + json_data.data.store[i].store_id + '</td>'
                            + '<td class="text-left">' + json_data.data.store[i].name + '</td>'
                            + '<td class="text-left desc">' + json_data.data.store[i].city 
                            + json_data.data.store[i].zone + json_data.data.store[i].address + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-store-id="' 
                            + json_data.data.store[i].store_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-store-id="' 
                            + json_data.data.store[i].store_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    delete_store_by_id($(this).attr('data-store-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.get_store_by_id($(this).attr('data-store-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    StoreHelper.prototype.createStore = function() {
        
        var _self = (event.data) ? event.data : this;
        var file_data = $("#store-page .img-select").prop("files")[0];

        var form_data = new FormData();
        form_data.append("storefile", file_data);

        form_data.append("name", _self.editView.find('input[name="name"]').val());
        form_data.append("link", _self.editView.find('input[name="link"]').val());

        form_data.append("excerpt", _self.editView.find('textarea[name="store_excerpt"]').val());


        form_data.append("lat", _self.editView.find('input[name="latitude"]').val());
        form_data.append("lng", _self.editView.find('input[name="longitude"]').val());


       /* form_data.append("title", _self.editView.find('input[name="name"]').val());
        form_data.append("title", _self.editView.find('input[name="name"]').val());
        form_data.append("title", _self.editView.find('input[name="name"]').val());
        form_data.append("title", _self.editView.find('input[name="name"]').val());*/


        


        form_data.append("zipcode", tw_data[_self.editView.find('select[name="city"]').val()][_self.editView.find('select[name="zone"]').val()]);
		form_data.append("addr", _self.editView.find('input[name="address"]').val());






		form_data.append("store_content", CKEDITOR.instances.store_content.getData());







        // if(_self.editView.find('select[name="sub-cate"]').val() == null)
        //     form_data.append("category_id", '');
        // else
        //     form_data.append("category_id", _self.editView.find('select[name="sub-cate"]').val());


        // var tags = '';
        // for (var i = 0; i < store_tag_arr.length; i++) {
        //     if(i > 0)
        //         tags += ',';
        //     tags += store_tag_arr[i];
        // }

        // form_data.append("tags", tags);
    

        


        $.ajax({
            url: "admin_store/store_insert",
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
                alert("建立通路成功 !");

                _self.getStoreList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("建立通路失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    StoreHelper.prototype.updateStore = function() {
        var _self = (event.data) ? event.data : this;
        // var tags = '';
        // for (var i = 0; i < store_tag_arr.length; i++) {
        //     if(i > 0)
        //         tags += ',';
        //     tags += store_tag_arr[i];
        // }


        var form_data = new FormData();

        form_data.append("id", _self.editView.find('input[name="store_id"]').val());
        form_data.append("name", _self.editView.find('input[name="name"]').val());
        form_data.append("link", _self.editView.find('input[name="link"]').val());
        form_data.append("excerpt", _self.editView.find('textarea[name="store_excerpt"]').val());
        form_data.append("lat", _self.editView.find('input[name="latitude"]').val());
        form_data.append("lng", _self.editView.find('input[name="longitude"]').val());

        form_data.append("zipcode", tw_data[_self.editView.find('select[name="city"]').val()][_self.editView.find('select[name="zone"]').val()]);
		form_data.append("addr", _self.editView.find('input[name="address"]').val());

		form_data.append("store_content", CKEDITOR.instances.store_content.getData());



        $.ajax({
            url: "admin_store/store_update",
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
                alert("修改通路成功 !");
                
                _self.getStoreList(20, nowStorePage);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("修改通路失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    StoreHelper.prototype.getPostCate = function() {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_store/store_cate_list",
            data: {}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                storeCateJson = json_data.data;

                //options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';
                options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';

                for(var i = 0; i < storeCateJson.length; i++) {
                    options += '<option value="' + storeCateJson[i].category_id + '">' 
                        + storeCateJson[i].name + '</option>';
                }

                _self.editView.find('select[name="main-cate"]').html(options);

                sub_options = '';
                for(var i = 0; i < storeCateJson.length; i++) {
                    if(storeCateJson[i].category_id == _self.editView.find('select[name="main-cate"]').val()) {
                        for(var k = 0; k < storeCateJson[i].sub_cate.length; k++) {
                            sub_options += '<option value="' + storeCateJson[i].sub_cate[k].category_id + '">' 
                            + storeCateJson[i].sub_cate[k].name + '</option>';
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

    StoreHelper.prototype.get_store_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        $.ajax({
            type: "POST",
            url: "admin_store/get_store_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.store-edit .state').val('update');
                _self.editView.find('input[name="store_id"]').val(json_data.data.store_id);

                _self.editView.find('input[name="name"]').val(json_data.data.name);
                _self.editView.find('input[name="link"]').val(json_data.data.link);
                _self.editView.find('textarea[name="store_excerpt"]').val(json_data.data.excerpt);


                _self.editView.find('input[name="latitude"]').val(json_data.data.lat);
                _self.editView.find('input[name="longitude"]').val(json_data.data.lng);
                _self.editView.find('input[name="address"]').val(json_data.data.address);




                if(tw_data[json_data.data.city]){
	                _self.editView.find('select[name="city"]').val(json_data.data.city);
	                _self.getZone(json_data.data.city);
	                _self.editView.find('select[name="zone"]').val(json_data.data.zone);
	            }



             //   _self.editView.find('select[name="main-cate"]').val(json_data.data.parent_id);
               // _self.getSubCate();
              //  _self.editView.find('select[name="sub-cate"]').val(json_data.data.category_id);


                // store_tag_arr = [];
                // for (var i = 0; i < json_data.data.tags.length; i++) {
                //     store_tag_arr[i] = json_data.data.tags[i].name;
                // }

                // show_store_tag();

                $("#store-page .img-cover").attr('src', json_data.data.photo_big_url);

                CKEDITOR.instances.store_content.setData(json_data.data.content);

                _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);

                $("#store-page .store-edit").show();
                $("#store-page .store-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }


    StoreHelper.prototype.editorInit = function() {

        this.editView.find('input[name="store_id"]').val('');
        this.editView.find('input[name="name"]').val('');
        this.editView.find('input[name="link"]').val('');
        this.editView.find('textarea[name="store_excerpt"]').val('');

        this.editView.find('input[name="latitude"]').val('');
        this.editView.find('input[name="longitude"]').val('');
        this.editView.find('input[name="address"]').val('');

        this.editView.find('input[name="create_time"]').val('');

        // if(tw_data[json_data.data.city]){
        //     _self.editView.find('select[name="city"]').val(json_data.data.city);
        //     _self.getZone(json_data.data.city);
        //     _self.editView.find('select[name="zone"]').val(json_data.data.zone);
        // }

        $("#store-page .img-cover").attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
        CKEDITOR.instances.store_content.setData('');

        this.editView.show();
        this.listView.hide();
    };




    storeHelper = new StoreHelper();
    storeHelper.getStoreList(20, nowStorePage);
   // storeHelper.getPostCate();

})(jQuery, this, 0);





function delete_store_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_store/store_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            storeHelper.getStoreList(20, 1);
            alert("刪除通路·成功 !");
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

$('#store-page .create').click(function (){

    $('.store-edit .state').val('insert');
    storeHelper.editorInit();
    
});



$("#store-page .tag-media").click(function(e) {
    $('#media-dt-pop').fadeIn();

    $('#media-dt-pop .media-box').html('');
    is_photo_pool_loading = false;
    photo_pool_count = 1;
    photo_pool_hash = new Object();
    get_photo_pool_list(20, photo_pool_count);
});






$( "#store-page .img-select" ).change(function() {

    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('.store-edit .state').val() == 'insert')
            {
                $('.store-edit .img-cover').attr('src', e.target.result);
            } else {
                $('#store-page .img-preview').attr('src', e.target.result);

                $('#store-page .preview-console').show();
            }
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});








$('#store-page .cancel-img').click(function (){
    $('#store-page .img-select').val('');
    $('#store-page .preview-console').hide();
});


$("#store-page .upload-img").click(function(){
    var imgVal = $('#store-page .img-select').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#store-page .img-select").prop("files")[0];
    var form_data = new FormData();
    form_data.append("storefile", file_data)
    form_data.append("store_id", $('.store-edit input[name="store_id"]').val())
    $.ajax({
        url: "admin_store/photo",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#store-page .store-edit .img-cover").attr("src", json.data.photo_big_url);
            alert('圖片上傳成功 !');
            $('#store-page .img-select').val('');
            $('#store-page .preview-console').hide();
            storeHelper.getStoreList(20, nowStorePage);
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



initCkeditor('store_content');
//initCkeditor('store_content_tw');
//initCkeditor('store_content_en');



var store_tag_arr = [];
$('#store-page .tag-add-con .tag-add').click(function (){
    var new_tags = $('#new-store-tag').val();
    var arr = new_tags.split(",");

    for(var i = 0, k = store_tag_arr.length; i < arr.length; i++) {
        arr[i] = arr[i].replace(/\s\s+/g, ' ').trim();

        if((arr[i] != '') && (store_tag_arr.indexOf(arr[i]) == -1)) {
            store_tag_arr[k] = arr[i];
            k++;
        }
    }

    show_store_tag();
    $('#new-store-tag').val('');
});

function show_store_tag()
{
    $(".tag-list").html('');
    for(var i = 0; i < store_tag_arr.length; i++) {
        $(".tag-list").append('<span><button type="button" class="remove-btn" role-data="' + i + '">' +
        '<i class="fa fa-remove"></i></button>' + store_tag_arr[i] + '</span>');
    }

    $(".tag-list > span .remove-btn").unbind('click');
    $(".tag-list > span .remove-btn").click(function (){
        store_tag_arr.splice($(this).attr('role-data'), 1);
        show_store_tag();
    });
}













// var city = Object.keys(tw_data);

// for (var i = 0; i < city.length; i++) {
// 	$('select[name="city"]').append('<option value="' + city[i] + '">' + city[i] + '</option>');
// }


// var cityVal = '<?php echo $user_info['city']; ?>';
// var zoneVal = '<?php echo $user_info['zone']; ?>';



if(cityVal == ''){
	$('select[name="city"]').val('臺北市');
	getZone('臺北市');
}else{
	$('select[name="city"]').val(cityVal);
	getZone(cityVal);
	if(zoneVal != '')
		$('select[name="zone"]').val(zoneVal);
}




