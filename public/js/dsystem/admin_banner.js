var nowBannerPage = 1;


(function ($, window, i) {

    var BannerHelper = function(){
        this.rootView = $('#banner-page');
        this.form = $('#banner_form');
        this.listView = this.rootView.find('.banner-list');
        this.editView = this.rootView.find('.banner-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');

       /* this.editView.find( ".datepicker" ).datepicker({ 
        	dateFormat: 'yy-mm-dd'
        });*/
        this.editView.find( ".datepicker" ).datetimepicker({ 
            dateFormat: 'yy-mm-dd',
            timeFormat: "HH:mm:ss"
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
                _self.createBanner();
            else
                _self.updateBanner();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });

    };

    BannerHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < bannerCateJson.length; i++) {
            if(bannerCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < bannerCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + bannerCateJson[i].sub_cate[k].category_id + '">' 
                    + bannerCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    BannerHelper.prototype.yyyyyy = function(event) {
        var _self = (event.data) ? event.data : this;
        _self.editView.hide();
        _self.listView.show();
    };

    BannerHelper.prototype.getBannerList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowBannerPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_banner/banner_list",
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
                    _self.getBannerList(20, $(this).attr('role-data'));
                    return false;
                });
            }


            for(var i = 0; i < json_data.data.banner.length; i++)
            {   
                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left"><img class="thumb" src="' 
                            + json_data.data.banner[i].banner_img_small + '"></td>'
                            + '<td class="text-left">' + json_data.data.banner[i].banner_name + '</td>'
                            + '<td class="text-left">' + json_data.data.banner[i].locate + '</td>'
                            + '<td class="text-left desc">' + json_data.data.banner[i].link + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-banner-id="' 
                            + json_data.data.banner[i].banner_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-banner-id="' 
                            + json_data.data.banner[i].banner_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    delete_banner_by_id($(this).attr('data-banner-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.get_banner_by_id($(this).attr('data-banner-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    BannerHelper.prototype.createBanner = function() {
        
        var _self = (event.data) ? event.data : this;
        var file_data = $("#banner-page .img-select").prop("files")[0];

        var form_data = new FormData();
        form_data.append("bannerfile", file_data);


        /*banner_id
        banner_name
        locate
        link
        remarks
        edit_time
        create_time*/

        form_data.append("banner_name", _self.editView.find('input[name="banner_name"]').val());
        form_data.append("locate", _self.editView.find('select[name="locate"]').val());
        form_data.append("link", _self.editView.find('input[name="link"]').val());
        form_data.append("remarks", _self.editView.find('textarea[name="remarks"]').val());

        form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
        form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
        form_data.append("active", _self.editView.find('select[name="active"]').val());


        $.ajax({
            url: "admin_banner/banner_insert",
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
                alert("建立 Banner 成功 !");

                _self.getBannerList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("建立 Banner 失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    BannerHelper.prototype.updateBanner = function() {
       
        var _self = (event.data) ? event.data : this;
        var file_data = $("#banner-page .img-select").prop("files")[0];

        var form_data = new FormData();
        form_data.append("bannerfile", file_data);

        /*banner_id
        banner_name
        locate
        link
        remarks
        edit_time
        create_time*/

        form_data.append("banner_id", _self.editView.find('input[name="banner_id"]').val());
        form_data.append("banner_name", _self.editView.find('input[name="banner_name"]').val());
        form_data.append("locate", _self.editView.find('select[name="locate"]').val());
        form_data.append("link", _self.editView.find('input[name="link"]').val());
        form_data.append("remarks", _self.editView.find('textarea[name="remarks"]').val());

        form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
        form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
        form_data.append("active", _self.editView.find('select[name="active"]').val());


        $.ajax({
            url: "admin_banner/banner_update",
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
                alert("修改 Banner 成功 !");
                
                _self.getBannerList(20, nowBannerPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("修改 Banner 失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };

    BannerHelper.prototype.get_banner_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        $.ajax({
            type: "POST",
            url: "admin_banner/get_banner_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.banner-edit .state').val('update');

                _self.editView.find('input[name="banner_id"]').val(json_data.data.banner_id);
		        _self.editView.find('input[name="banner_name"]').val(json_data.data.banner_name);
		        _self.editView.find('select[name="locate"]').val(json_data.data.locate);
		        _self.editView.find('input[name="link"]').val(json_data.data.link);
		        _self.editView.find('textarea[name="remarks"]').val(json_data.data.remarks);
		        _self.editView.find('input[name="edit_time"]').val(json_data.data.edit_time);
		        _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);

                _self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
                _self.editView.find('input[name="end_time"]').val(json_data.data.end_time);
                _self.editView.find('select[name="active"]').val(json_data.data.active);

		        _self.editView.find('.img-cover').attr('src', json_data.data.banner_img);


                $("#banner-page .banner-edit").show();
                $("#banner-page .banner-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }


    BannerHelper.prototype.editorInit = function() {

        this.editView.find('input[name="banner_id"]').val('');
        this.editView.find('input[name="banner_name"]').val('');
        this.editView.find('select[name="locate"]').val('homepage');
        this.editView.find('input[name="link"]').val('');
        this.editView.find('textarea[name="remarks"]').val('');
        this.editView.find('input[name="edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');



        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('select[name="active"]').val(1);






        this.editView.find('.img-cover').attr('src', 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/static/p/banner_holder.jpg');

        
        this.editView.show();
        this.listView.hide();
    };




    bannerHelper = new BannerHelper();
    bannerHelper.getBannerList(20, nowBannerPage);

})(jQuery, this, 0);




function delete_banner_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_banner/banner_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            bannerHelper.getBannerList(20, 1);
            alert("刪除 Banner ·成功 !");
        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}


$('#banner-page .create').click(function (){

    $('.banner-edit .state').val('insert');
    bannerHelper.editorInit();
    
});







$( "#banner-page .img-select" ).change(function() {

    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('.banner-edit .state').val() == 'insert')
            {
                $('.banner-edit .img-cover').attr('src', e.target.result);
            } else {
                $('#banner-page .img-preview').attr('src', e.target.result);

                $('#banner-page .preview-console').show();
            }
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});








$('#banner-page .cancel-img').click(function (){
    $('#banner-page .img-select').val('');
    $('#banner-page .preview-console').hide();
});


$("#banner-page .upload-img").click(function(){
    var imgVal = $('#banner-page .img-select').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#banner-page .img-select").prop("files")[0];
    var form_data = new FormData();
    form_data.append("bannerfile", file_data)
    form_data.append("banner_id", $('.banner-edit input[name="banner_id"]').val())
    $.ajax({
        url: "admin_banner/photo",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#banner-page .banner-edit .img-cover").attr("src", json.data.banner_img);
            alert('圖片上傳成功 !');
            $('#banner-page .img-select').val('');
            $('#banner-page .preview-console').hide();
            bannerHelper.getBannerList(20, nowBannerPage);
        } else {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }
    }).fail(function( jqXHR, textStatus  ) {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    });
});



