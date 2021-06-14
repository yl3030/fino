var nowActivityPage = 1;


(function ($, window, i) {

    var ActivityHelper = function(){
        this.rootView = $('#activity-page');
        this.form = $('#activity_form');
        this.listView = this.rootView.find('.activity-list');
        this.editView = this.rootView.find('.activity-edit');
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
                _self.createActivity();
            else
                _self.updateActivity();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });

    };

    ActivityHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < activityCateJson.length; i++) {
            if(activityCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < activityCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + activityCateJson[i].sub_cate[k].category_id + '">' 
                    + activityCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    ActivityHelper.prototype.yyyyyy = function(event) {
        var _self = (event.data) ? event.data : this;
        _self.editView.hide();
        _self.listView.show();
    };

    ActivityHelper.prototype.getActivityList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowActivityPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_activity/activity_list",
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
                    _self.getActivityList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.activity.length; i++)
            {   
                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left"><img class="thumb" src="' 
                            + json_data.data.activity[i].cover_photo_small + '"></td>'
                            + '<td class="text-left">' + json_data.data.activity[i].activity_id + '</td>'
                            + '<td class="text-left">' + json_data.data.activity[i].title + '</td>'
                            + '<td class="text-left desc">' + json_data.data.activity[i].excerpt + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-activity-id="' 
                            + json_data.data.activity[i].activity_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-activity-id="' 
                            + json_data.data.activity[i].activity_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    delete_activity_by_id($(this).attr('data-activity-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.get_activity_by_id($(this).attr('data-activity-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    ActivityHelper.prototype.createActivity = function() {
        
        var _self = (event.data) ? event.data : this;
        var file_data = $("#activity-page .img-select").prop("files")[0];

        var form_data = new FormData();
        form_data.append("activityfile", file_data);
        form_data.append("title", $('.activity-edit .activity_title').val());
        form_data.append("excerpt", $('.activity-edit .activity_excerpt').val());



		form_data.append("address", $('.activity-edit input[name="address"]').val());

        form_data.append("start_time", $('.activity-edit input[name="start_time"]').val());
        form_data.append("end_time", $('.activity-edit input[name="end_time"]').val());


        if(_self.editView.find('select[name="sub-cate"]').val() == null)
            form_data.append("category_id", '');
        else
            form_data.append("category_id", _self.editView.find('select[name="sub-cate"]').val());


        var tags = '';
        for (var i = 0; i < activity_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += activity_tag_arr[i];
        }

        form_data.append("tags", tags);
    

        form_data.append("activity_content", CKEDITOR.instances.activity_content.getData());
      //  form_data.append("activity_content_tw", CKEDITOR.instances.activity_content_tw.getData());
     //   form_data.append("activity_content_en", CKEDITOR.instances.activity_content_en.getData());


        $.ajax({
            url: "admin_activity/activity_insert",
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

                _self.getActivityList(20, 1);
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


    ActivityHelper.prototype.updateActivity = function() {
        var _self = (event.data) ? event.data : this;
        var tags = '';
        for (var i = 0; i < activity_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += activity_tag_arr[i];
        }

        $.ajax({
            type: "POST",
            url: "admin_activity/activity_update",
            data: { 
                id: $('.activity-edit .activity_id').val(),
                title: $('.activity-edit .activity_title').val(),
                excerpt: $('.activity-edit .activity_excerpt').val(),
                category_id: _self.editView.find('select[name="sub-cate"]').val(),
                activity_content: CKEDITOR.instances.activity_content.getData(),
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
                
                _self.getActivityList(20, nowActivityPage);
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


    ActivityHelper.prototype.getPostCate = function() {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_activity/activity_cate_list",
            data: {}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                activityCateJson = json_data.data;

                //options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';
                options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';

                for(var i = 0; i < activityCateJson.length; i++) {
                    options += '<option value="' + activityCateJson[i].category_id + '">' 
                        + activityCateJson[i].name + '</option>';
                }

                _self.editView.find('select[name="main-cate"]').html(options);

                sub_options = '';
                for(var i = 0; i < activityCateJson.length; i++) {
                    if(activityCateJson[i].category_id == _self.editView.find('select[name="main-cate"]').val()) {
                        for(var k = 0; k < activityCateJson[i].sub_cate.length; k++) {
                            sub_options += '<option value="' + activityCateJson[i].sub_cate[k].category_id + '">' 
                            + activityCateJson[i].sub_cate[k].name + '</option>';
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

    ActivityHelper.prototype.get_activity_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        $.ajax({
            type: "POST",
            url: "admin_activity/get_activity_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.activity-edit .state').val('update');
                $('.activity-edit .activity_id').val(json_data.data.activity_id);

                $("#activity-page .inner-panel .activity_title").val(json_data.data.title);
                $("#activity-page .inner-panel .activity_excerpt").val(json_data.data.excerpt);

				_self.editView.find('input[name="address"]').val(json_data.data.address);
                _self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
                _self.editView.find('input[name="end_time"]').val(json_data.data.end_time);


                _self.editView.find('select[name="main-cate"]').val(json_data.data.parent_id);
               // _self.getSubCate();
                _self.editView.find('select[name="sub-cate"]').val(json_data.data.category_id);


                activity_tag_arr = [];
                for (var i = 0; i < json_data.data.tags.length; i++) {
                    activity_tag_arr[i] = json_data.data.tags[i].name;
                }

                show_activity_tag();

                $("#activity-page .img-cover").attr('src', json_data.data.cover_photo);

                CKEDITOR.instances.activity_content.setData(json_data.data.content);

                $("#activity-page .inner-panel .edit_time").val(json_data.data.last_edit_time);
                $("#activity-page .inner-panel .create_time").val(json_data.data.create_time);

                $("#activity-page .activity-edit").show();
                $("#activity-page .activity-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }


    ActivityHelper.prototype.editorInit = function() {

        this.editView.find('.activity_title').val('');
        this.editView.find('.activity_excerpt').val('');
        this.editView.find('input[name="address"]').val('');
        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('.activity_id').val('');

        activity_tag_arr = [];
        this.editView.find(".tag-list").html('');

        this.editView.find('.edit_time').val('');
        this.editView.find('.create_time').val('');
        this.editView.find('select[name="main-cate"]').val('');
        this.editView.find('select[name="sub-cate"]').val('');
        this.editView.find('.img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');

        CKEDITOR.instances.activity_content.setData('');

        
        this.editView.show();
        this.listView.hide();
    };




    activityHelper = new ActivityHelper();
    activityHelper.getActivityList(20, nowActivityPage);
   // activityHelper.getPostCate();

})(jQuery, this, 0);




/*function get_activity_list(num, start)
{
    nowActivityPage = start;
    startCount = (start - 1) * 20;
    $.ajax({
        type: "POST",
        url: "admin_activity/activity_list",
        data: {
            'num': num, 
            'start': startCount
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('.activity-list tbody').empty();
        $('#activity-page .pagination').empty();
        $('#activity-page .pagination li').unbind('click');

        if(json_data.data.count > 20)
        {
            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
            {
                if(i == start)
                {
                    $('#activity-page .pagination').append(
                        '<li class="active"><a>' + i + '</a></li>');
                } else {
                    $('#activity-page .pagination').append(
                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }
            }
            $('#activity-page .pagination li').click(function (){
                if($(this).hasClass("active"))
                    return false;
                activityHelper.getActivityList(20, $(this).attr('role-data'));
                return false;
            });
        }

        for(var i = 0; i < json_data.data.activity.length; i++)
        {   



            $('.activity-list tbody').append('<tr><td class="text-center">'
                        + '<input type="checkbox" name="selected[]" value="2911"></td>'
                        + '<td class="text-left">' + (i + 1) + '</td>'
                        + '<td class="text-left"><img class="thumb" src="' 
                        + json_data.data.activity[i].cover_photo_small + '"></td>'
                        + '<td class="text-left">' + json_data.data.activity[i].id + '</td>'
                        + '<td class="text-left">' + json_data.data.activity[i].title + '</td>'
                        + '<td class="text-left desc">' + json_data.data.activity[i].excerpt + '</td>'
                        + '<td class="text-right">'
                        + '<button type="button" data-activity-id="' 
                        + json_data.data.activity[i].id + '" class="btn btn-group delet">'
                        + '<i class="fa fa-trash"></i></button>'
                        + '<a title="修改問題" class="btn btn-gold update" data-activity-id="' 
                        + json_data.data.activity[i].id + '">'
                        + '<i class="fa fa-pencil"></i></a>'
                        + '</td>'
                        + '</tr>');
        }

        $('#activity-page table tbody .delet').unbind('click');
        $('#activity-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_activity_by_id($(this).attr('data-activity-id'));
            }
        });

        $('#activity-page table tbody .update').unbind('click');
        $('#activity-page table tbody .update').click(function (){
            _self.get_activity_by_id($(this).attr('data-activity-id'));
        });



    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}
*/









function delete_activity_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_activity/activity_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            activityHelper.getActivityList(20, 1);
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

$('#activity-page .create').click(function (){

    $('.activity-edit .state').val('insert');
    activityHelper.editorInit();
    
});



$("#activity-page .tag-media").click(function(e) {
    $('#media-dt-pop').fadeIn();

    $('#media-dt-pop .media-box').html('');
    is_photo_pool_loading = false;
    photo_pool_count = 1;
    photo_pool_hash = new Object();
    get_photo_pool_list(20, photo_pool_count);
});






$( "#activity-page .img-select" ).change(function() {

    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('.activity-edit .state').val() == 'insert')
            {
                $('.activity-edit .img-cover').attr('src', e.target.result);
            } else {
                $('#activity-page .img-preview').attr('src', e.target.result);

                $('#activity-page .preview-console').show();
            }
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});








$('#activity-page .cancel-img').click(function (){
    $('#activity-page .img-select').val('');
    $('#activity-page .preview-console').hide();
});


$("#activity-page .upload-img").click(function(){
    var imgVal = $('#activity-page .img-select').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#activity-page .img-select").prop("files")[0];
    var form_data = new FormData();
    form_data.append("activityfile", file_data)
    form_data.append("activity_id", $('.activity-edit .activity_id').val())
    $.ajax({
        url: "admin_activity/photo",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#activity-page .activity-edit .img-cover").attr("src", json.data.cover_photo);
            alert('圖片上傳成功 !');
            $('#activity-page .img-select').val('');
            $('#activity-page .preview-console').hide();
            activityHelper.getActivityList(20, nowActivityPage);
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



initCkeditor('activity_content');
//initCkeditor('activity_content_tw');
//initCkeditor('activity_content_en');



var activity_tag_arr = [];
$('#activity-page .tag-add-con .tag-add').click(function (){
    var new_tags = $('#new-activity-tag').val();
    var arr = new_tags.split(",");

    for(var i = 0, k = activity_tag_arr.length; i < arr.length; i++) {
        arr[i] = arr[i].replace(/\s\s+/g, ' ').trim();

        if((arr[i] != '') && (activity_tag_arr.indexOf(arr[i]) == -1)) {
            activity_tag_arr[k] = arr[i];
            k++;
        }
    }

    show_activity_tag();
    $('#new-activity-tag').val('');
});

function show_activity_tag()
{
    $(".tag-list").html('');
    for(var i = 0; i < activity_tag_arr.length; i++) {
        $(".tag-list").append('<span><button type="button" class="remove-btn" role-data="' + i + '">' +
        '<i class="fa fa-remove"></i></button>' + activity_tag_arr[i] + '</span>');
    }

    $(".tag-list > span .remove-btn").unbind('click');
    $(".tag-list > span .remove-btn").click(function (){
        activity_tag_arr.splice($(this).attr('role-data'), 1);
        show_activity_tag();
    });
}



