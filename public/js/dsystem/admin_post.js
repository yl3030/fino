var nowPostPage = 1;

(function ($, window, i) {

    var PostHelper = function(){
        this.rootView = $('#post-page');
        this.form = $('#post_form');
        this.listView = this.rootView.find('.post-list');
        this.editView = this.rootView.find('.post-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');


        this.editBtn.on('click', this, function(event){
            var _self = (event.data) ? event.data : this;
            _self.editView.hide();
            _self.listView.show();
        });

        this.form.on('submit', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;
            /*_self.editView.hide();
            _self.listView.show();*/


            if(_self.state.val() == 'insert')
                _self.createPost();
            else
                _self.updatePost();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });

    };

    PostHelper.prototype.getSubCate = function() {
        sub_options = '';
        for(var i = 0; i < postCateJson.length; i++) {
            if(postCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
                for(var k = 0; k < postCateJson[i].sub_cate.length; k++) {
                    sub_options += '<option value="' + postCateJson[i].sub_cate[k].category_id + '">' 
                    + postCateJson[i].sub_cate[k].name + '</option>';
                }
            }
        }

        this.editView.find('select[name="sub-cate"]').html(sub_options);
    };

    PostHelper.prototype.getPostList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowPostPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_post/post_list",
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
                    _self.getPostList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.post.length; i++)
            {   
                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left"><img class="thumb" src="' 
                            + json_data.data.post[i].cover_photo_small + '"></td>'
                            + '<td class="text-left">' + json_data.data.post[i].id + '</td>'
                            + '<td class="text-left">' + json_data.data.post[i].title + '</td>'
                            + '<td class="text-left desc">' + json_data.data.post[i].excerpt + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-post-id="' 
                            + json_data.data.post[i].id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-post-id="' 
                            + json_data.data.post[i].id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    delete_post_by_id($(this).attr('data-post-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.get_post_by_id($(this).attr('data-post-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    PostHelper.prototype.createPost = function() {
        
        var _self = (event.data) ? event.data : this;
        var file_data = $("#post-page .img-select").prop("files")[0];

        var form_data = new FormData();
        form_data.append("postfile", file_data);
        form_data.append("title", $('.post-edit .post_title').val());
        form_data.append("excerpt", $('.post-edit .post_excerpt').val());


        if(_self.editView.find('select[name="sub-cate"]').val() == null)
            form_data.append("category_id", '');
        else
            form_data.append("category_id", _self.editView.find('select[name="sub-cate"]').val());

        if($('.post-edit input[name="author_id"]').val() == undefined)
        	author_id = 0;
        else
        	author_id = $('.post-edit input[name="author_id"]').val();

        form_data.append("author_id", author_id);


        var tags = '';
        for (var i = 0; i < post_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += post_tag_arr[i];
        }

        form_data.append("tags", tags);
    

        form_data.append("post_content_myanmar", CKEDITOR.instances.post_content_myanmar.getData());
      //  form_data.append("post_content_tw", CKEDITOR.instances.post_content_tw.getData());
     //   form_data.append("post_content_en", CKEDITOR.instances.post_content_en.getData());


        $.ajax({
            url: "admin_post/post_insert",
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
                alert("建立文章成功 !");

                _self.getPostList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("建立文章失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    PostHelper.prototype.updatePost = function() {
        var _self = (event.data) ? event.data : this;
        var tags = '';
        for (var i = 0; i < post_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += post_tag_arr[i];
        }

        if($('.post-edit input[name="author_id"]').val() == undefined)
        	author_id = 0;
        else
        	author_id = $('.post-edit input[name="author_id"]').val();

        $.ajax({
            type: "POST",
            url: "admin_post/post_update",
            data: { 
                id: $('.post-edit .post_id').val(),
                title: $('.post-edit .post_title').val(),
                excerpt: $('.post-edit .post_excerpt').val(),
                category_id: _self.editView.find('select[name="sub-cate"]').val(),
                author_id: author_id,
                post_content_myanmar: CKEDITOR.instances.post_content_myanmar.getData(),
                tags: tags
            }

        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("修改文章成功 !");
                
                _self.getPostList(20, nowPostPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("修改文章失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    PostHelper.prototype.getPostCate = function() {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_post_cate/post_cate_list",
            data: {}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                postCateJson = json_data.data;

                //options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';
                options = '<option selected="" disabled="" hidden="" value="">請選擇...</option>';

                for(var i = 0; i < postCateJson.length; i++) {
                    options += '<option value="' + postCateJson[i].category_id + '">' 
                        + postCateJson[i].name + '</option>';
                }

                _self.editView.find('select[name="main-cate"]').html(options);

                sub_options = '';
                for(var i = 0; i < postCateJson.length; i++) {
                    if(postCateJson[i].category_id == _self.editView.find('select[name="main-cate"]').val()) {
                        for(var k = 0; k < postCateJson[i].sub_cate.length; k++) {
                            sub_options += '<option value="' + postCateJson[i].sub_cate[k].category_id + '">' 
                            + postCateJson[i].sub_cate[k].name + '</option>';
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

    PostHelper.prototype.get_post_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        $.ajax({
            type: "POST",
            url: "admin_post/get_post_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.post-edit .state').val('update');
                $('.post-edit .post_id').val(json_data.data.id);

                $("#post-page .inner-panel .post_title").val(json_data.data.title);
                $("#post-page .inner-panel .post_excerpt").val(json_data.data.excerpt);


                _self.editView.find('select[name="main-cate"]').val(json_data.data.parent_id);
                _self.getSubCate();
                _self.editView.find('select[name="sub-cate"]').val(json_data.data.category_id);


                post_tag_arr = [];
                for (var i = 0; i < json_data.data.tags.length; i++) {
                    post_tag_arr[i] = json_data.data.tags[i].name;
                }

                show_post_tag();


            	if(json_data.data.author) {

		            $('#post-page .author-con input[name="author_name"]').val(json_data.data.author.name);

		            if(json_data.data.author.photo == '')
		            	json_data.data.author.photo = 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png';

		            $('#post-page .author-con table tbody').html('<tr><td class="text-left">'
			                		+ '<a class="img-thumbnail">'
			                		+ '<img src="' + json_data.data.author.photo + '">'
			                		+ '<input type="hidden" name="author_id" value="' + json_data.data.author.author_id + '" />'
			                		+ '</a></td><td class="text-left" colspan="3">'
			                		+ '<div class="name">' + json_data.data.author.name + '</div>'
			                		+ '<div class="title">' + json_data.data.author.title + '</div>'
			                		+ '</td>'
			                		+ '<td class="text-left desc">'
			                		+ '<button type="button" onclick="$(this).parent().parent().remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i></button>'
			                		+ '</td>'
			                	+ '</tr>');

            	} else {
	                $('#post-page .author-con input[name="author_name"]').val('');
	        		$('#post-page .author-con table tbody').html('');
	        	}


                $("#post-page .img-cover").attr('src', json_data.data.cover_photo);

                CKEDITOR.instances.post_content_myanmar.setData(json_data.data.post_content);

                $("#post-page .inner-panel .edit_time").val(json_data.data.last_edit_time);
                $("#post-page .inner-panel .create_time").val(json_data.data.create_time);

                $("#post-page .post-edit").show();
                $("#post-page .post-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }



    







    PostHelper.prototype.editorInit = function() {



        this.editView.find('.post_title').val('');
        this.editView.find('.post_excerpt').val('');
        this.editView.find('.post_id').val('');

        post_tag_arr = [];
        this.editView.find(".tag-list").html('');

        this.editView.find('.edit_time').val('');
        this.editView.find('.create_time').val('');
        this.editView.find('select[name="main-cate"]').val('');
        this.editView.find('select[name="sub-cate"]').val('');
        this.editView.find('.img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');



        $('#post-page .author-con input[name="author_name"]').val('');
        $('#post-page .author-con table tbody').html('');
       


        CKEDITOR.instances.post_content_myanmar.setData('');


       // CKEDITOR.instances.post_content_tw.setData('');
      //  CKEDITOR.instances.post_content_en.setData('');
        //CKEDITOR.instances.post_content.setData( '' );

        
        this.editView.show();
        this.listView.hide();
    };





   // alert('sdfadsf jasif jsdiof ');



    postHelper = new PostHelper();
    postHelper.getPostList(20, nowPostPage);
    postHelper.getPostCate();

})(jQuery, this, 0);







function get_post_list(num, start)
{
    nowPostPage = start;
    startCount = (start - 1) * 20;
    $.ajax({
        type: "POST",
        url: "admin_post/post_list",
        data: {
            'num': num, 
            'start': startCount
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('.post-list tbody').empty();
        $('#post-page .pagination').empty();
        $('#post-page .pagination li').unbind('click');

        if(json_data.data.count > 20)
        {
            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
            {
                if(i == start)
                {
                    $('#post-page .pagination').append(
                        '<li class="active"><a>' + i + '</a></li>');
                } else {
                    $('#post-page .pagination').append(
                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }
            }
            $('#post-page .pagination li').click(function (){
                if($(this).hasClass("active"))
                    return false;
                get_post_list(20, $(this).attr('role-data'));
                return false;
            });
        }

        for(var i = 0; i < json_data.data.post.length; i++)
        {   



            $('.post-list tbody').append('<tr><td class="text-center">'
                        + '<input type="checkbox" name="selected[]" value="2911"></td>'
                        + '<td class="text-left">' + (i + 1) + '</td>'
                        + '<td class="text-left"><img class="thumb" src="' 
                        + json_data.data.post[i].cover_photo_small + '"></td>'
                        + '<td class="text-left">' + json_data.data.post[i].id + '</td>'
                        + '<td class="text-left">' + json_data.data.post[i].title + '</td>'
                        + '<td class="text-left desc">' + json_data.data.post[i].excerpt + '</td>'
                        + '<td class="text-right">'
                        + '<button type="button" data-post-id="' 
                        + json_data.data.post[i].id + '" class="btn btn-group delet">'
                        + '<i class="fa fa-trash"></i></button>'
                        + '<a title="修改問題" class="btn btn-gold update" data-post-id="' 
                        + json_data.data.post[i].id + '">'
                        + '<i class="fa fa-pencil"></i></a>'
                        + '</td>'
                        + '</tr>');
        }

        $('#post-page table tbody .delet').unbind('click');
        $('#post-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_post_by_id($(this).attr('data-post-id'));
            }
        });

        $('#post-page table tbody .update').unbind('click');
        $('#post-page table tbody .update').click(function (){
            _self.get_post_by_id($(this).attr('data-post-id'));
        });



    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}










function delete_post_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_post/post_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            postHelper.getPostList(20, 1);
            alert("刪除文章·成功 !");
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

$('#post-page .create').click(function (){

    $('.post-edit .state').val('insert');
    


   // alert('sdfadsf jasif jsdiof ');



    postHelper.editorInit();


   // CKEDITOR.instances.post_content_tw.setData('');
  //  CKEDITOR.instances.post_content_en.setData('');
    //CKEDITOR.instances.post_content.setData( '' );


  //  $('#post-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
    
});



//get_post_list(20, nowPostPage);





$("#post-page .tag-media").click(function(e) {
    $('#media-dt-pop').fadeIn();

    $('#media-dt-pop .media-box').html('');
    is_photo_pool_loading = false;
    photo_pool_count = 1;
    photo_pool_hash = new Object();
    get_photo_pool_list(20, photo_pool_count);
});






$( "#post-page .img-select" ).change(function() {

    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('.post-edit .state').val() == 'insert')
            {
                $('.post-edit .img-cover').attr('src', e.target.result);
            } else {
                $('#post-page .img-preview').attr('src', e.target.result);

                $('#post-page .preview-console').show();
            }
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});








$('#post-page .cancel-img').click(function (){
    $('#post-page .img-select').val('');
    //$('#post-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
    $('#post-page .preview-console').hide();
});


$("#post-page .upload-img").click(function(){
    var imgVal = $('#post-page .img-select').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#post-page .img-select").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append("postfile", file_data)              // Appending parameter named file with properties of file_field to form_data
    form_data.append("post_id", $('.post-edit .post_id').val())                // Adding extra parameters to form_data
    $.ajax({
        url: "admin_post/photo",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         // Setting the data attribute of ajax with file_data
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#post-page .post-edit .img-cover").attr("src", json.data.cover_photo);
            alert('圖片上傳成功 !');
            $('#post-page .img-select').val('');
            $('#post-page .preview-console').hide();
            get_post_list(20, nowPostPage);
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



initCkeditor('post_content_myanmar');
//initCkeditor('post_content_tw');
//initCkeditor('post_content_en');



var post_tag_arr = [];
$('#post-page .tag-add-con .tag-add').click(function (){
    var new_tags = $('#new-post-tag').val();
    var arr = new_tags.split(",");

    for(var i = 0, k = post_tag_arr.length; i < arr.length; i++) {
        arr[i] = arr[i].replace(/\s\s+/g, ' ').trim();
        // alert("|" + arr[i] + "|");

        if((arr[i] != '') && (post_tag_arr.indexOf(arr[i]) == -1)) {
            post_tag_arr[k] = arr[i];
            //alert(arr[i] + '   (' + k);
            k++;
            //tag_arr.splice(i, 1);
        }
    }

    show_post_tag();
    $('#new-post-tag').val('');
});

function show_post_tag()
{
    $(".tag-list").html('');
    for(var i = 0; i < post_tag_arr.length; i++) {
        $(".tag-list").append('<span><button type="button" class="remove-btn" role-data="' + i + '">' +
        '<i class="fa fa-remove"></i></button>' + post_tag_arr[i] + '</span>');
    }

    $(".tag-list > span .remove-btn").unbind('click');
    $(".tag-list > span .remove-btn").click(function (){
        //alert($(this).attr('role-data'));

        post_tag_arr.splice($(this).attr('role-data'), 1);
        show_post_tag();
    });
}













$('#post-page .author-con input[name="author_name"]').keyup(function(e){
    if($(this).val().trim() != '')
        get_author_list($(this).val());
    else
        $('#post-page .author-con .suggest-content').hide();
});

function get_author_list(author_name)
{
    $.ajax({
        type: "POST",
        url: "admin_post/get_author_list_by_txt",
        data: {'author_name': author_name}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('#post-page .author-con .suggest-content ul').html('');

        for(var i = 0; i < json_data.data.length; i++)
        {  
            $('#post-page .author-con .suggest-content ul').append("<li role-data='" + JSON.stringify(json_data.data[i]) + "'>"
                        + json_data.data[i].name + '</li>');
        }

        $('#post-page .author-con .suggest-content ul li').unbind('click');
        $('#post-page .author-con .suggest-content ul li').click(function (){
            //event.stopPropagation();
            author = JSON.parse($(this).attr('role-data'));

            $('#post-page .author-con input[name="author_name"]').val($(this).html());
           // $('#post-page .author-con input[name="author_id"]').val(author.author_id);
            

            if(author.photo == '')
            	author.photo = 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png';

            $('#post-page .author-con table tbody').html('<tr><td class="text-left">'
	                		+ '<a class="img-thumbnail">'
	                		+ '<img src="' + author.photo + '">'
	                		+ '<input type="hidden" name="author_id" value="' + author.author_id + '" />'
	                		+ '</a></td><td class="text-left" colspan="3">'
	                		+ '<div class="name">' + author.name + '</div>'
	                		+ '<div class="title">' + author.title + '</div>'
	                		+ '</td>'
	                		+ '<td class="text-left desc">'
	                		+ '<button type="button" onclick="$(this).parent().parent().remove();" data-toggle="tooltip" title="移除" class="btn btn-danger"><i class="fa fa-minus-circle"></i></button>'
	                		+ '</td>'
	                	+ '</tr>');





           // alert($(this).attr('data-id'));
        });

        if(json_data.data.length > 0)
            $('#post-page .author-con .suggest-content').show();
        else
            $('#post-page .author-con .suggest-content').hide();


    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

















// Helper function to get parameters from the query string.
function getUrlParam( paramName ) {
    var reParam = new RegExp( '(?:[\?&]|&)' + paramName + '=([^&]+)', 'i' );
    var match = window.location.search.match( reParam );

    return ( match && match.length > 1 ) ? match[1] : null;
}
// Simulate user action of selecting a file to be returned to CKEditor.
function returnFileUrl() {

	CKEDITOR.instances.post_content_myanmar.insertHtml('<img src="https://ecdemo.s3.amazonaws.com/p/img_pool/mHcosO_luxury-sports-car-1043632.jpg">');
	//CKEDITOR.instances.post_content_myanmar
//	CKEDITOR.instances.post_content_myanmar.setData(json_data.data.post_content);

	return;
	alert('fsfsdfdsfdfdsfdsfsdf');

    var funcNum = getUrlParam( 'CKEditorFuncNum' );
    var fileUrl = 'http://c.cksource.com/a/1/img/sample.jpg';
    //window.opener.
    CKEDITOR.tools.callFunction( funcNum, fileUrl, function() {
        // Get the reference to a dialog window.
        var dialog = this.getDialog();
        // Check if this is the Image Properties dialog window.
        if ( dialog.getName() == 'image' ) {
            // Get the reference to a text field that stores the "alt" attribute.
            var element = dialog.getContentElement( 'info', 'txtAlt' );
            // Assign the new value.
            if ( element )
                element.setValue( 'alt text' );
        }
        // Return "false" to stop further execution. In such case CKEditor will ignore the second argument ("fileUrl")
        // and the "onSelect" function assigned to the button that called the file manager (if defined).
        // return false;
    } );
    window.close();
}


/*(function ($, window, i) {
    $.fn.davidSlider = function (options) {

        var settings = $.extend({
            "auto": true,             
            "speed": 500,            
            "timeout": 4000,        
            "pager": false,
            "namespace": "dw",    
        }, options);

        return this.each(function () {

        // Index for namespacing
            i++;

            var $this = $(this),


            // Helpers
            index = 0,
            slide_width = $this.width();
            $slide_box = $this.find('.slides_da');
            $slide = $slide_box.children(),
            length = $slide.length,
            animTime = parseFloat(settings.speed),
            waitTime = parseFloat(settings.timeout),
            maxw = parseFloat(settings.maxwidth),
            isAnimat = false,

            // Namespacing
            namespace = settings.namespace,
            namespaceIdx = namespace + i,

            // Classes
            navClass = namespace + "_nav " + namespaceIdx + "_nav",
            activeClass = namespace + "_here",
            visibleClass = namespaceIdx + "_on",
            slideClassPrefix = namespaceIdx + "_s",

            // Pager
            $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),

            // Fading animation
            slideTo = function (idx) {
                isAnimat = true;
                $slide_box.css('transform', 'translate3d(-' + (slide_width * idx) + 'px, 0px, 0px)');
                index = idx;
                setTimeout(function () {
                    settings.after(idx);
                    isAnimat = false;
                }, animTime);
            },


            init = function(){
                $slide_box.css({
                    "-webkit-transition": "none",
                    "-moz-transition": "none",
                    "-o-transition": "none",
                    "transition": "none"
                });

                slide_width = $this.width();

                $slide.each(function(index) {
                    $(this).css('width', slide_width + 'px');
                });

                $slide_box.each(function(index) {
                    $(this).css('width', (slide_width * length) + 'px');
                });
            
                $slide_box.css('transform', 'translate3d(-' + (slide_width * index) + 'px, 0px, 0px)');
                $slide_box.css({
                    "-webkit-transition": "all " + animTime + "ms ease-in-out",
                    "-moz-transition": "all " + animTime + "ms ease-in-out",
                    "-o-transition": "all " + animTime + "ms ease-in-out",
                    "transition": "all " + animTime + "ms ease-in-out"
                });
            };


            
            settings.init(length);
            
            init();
            



            if (length > 1) {

                if (settings.nav) {
                    //alert('sdfdsfsdf');
                    var navMarkup =
                        "<a href='#' class='" + navClass + " prev'>" + settings.prevText + "</a>" +
                        "<a href='#' class='" + navClass + " next'>" + settings.nextText + "</a>";

                    // Inject navigation
                    if (options.navContainer) {
                        $(settings.navContainer).append(navMarkup);
                    } else {
                        $slide_box.after(navMarkup);
                    }

                    var $trigger = $("." + namespaceIdx + "_nav"),
                    $prev = $trigger.filter(".prev");

                    // Click event handler
                    $trigger.bind("click", function (e) {
                        e.preventDefault();

                        if(isAnimat)
                            return;


                        var idx = index,
                            prevIdx = idx - 1 >= 0 ? index - 1 : length - 1,
                            nextIdx = idx + 1 < length ? index + 1 : 0;

                        // Go to slide
                        slideTo($(this)[0] === $prev[0] ? prevIdx : nextIdx);

                    });

                    if (settings.pauseControls) {
                        $trigger.hover(function () {
                            clearInterval(rotate);
                        }, function () {
                            restartCycle();
                        });
                    }
                }
            }

            $( window ).resize(function() {
                init();
            });

        });

    };
})(jQuery, this, 0);

$('.davidw_slider').davidSlider({
    'nav': true,
    'prevText': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
    'nextText': '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    'speed': 250,
    'after': function (index){
        index++;
        $(".sl-count .n-c").html(index);
    },
    'init': function (index){
        $(".sl-count .total").html(index);

        if(index > 1)
            $(".sl-count").css('display', 'inline-block');
    }
});*/

