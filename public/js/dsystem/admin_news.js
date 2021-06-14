var nowNewsPage = 1;


$("#news_form").submit(function(e) {
    e.preventDefault();

    if($('.news-edit .state').val() == 'insert')
    {
        /*var file_data = $("#news-page .img-select").prop("files")[0];   // Getting the properties of file from file field



        var tag_id_arr = '';
        $('.news-edit .tag-con').children('.tag').each(function () {
            tag_id_arr += '(' + $(this).attr('data-id') + ')';
        });


        var file_data = $("#news-page .img-select").prop("files")[0];*/
        var form_data = new FormData();
        //form_data.append("newsfile", file_data);
        form_data.append("title", $('.news-edit .news_title').val());
        form_data.append("excerpt", $('.news-edit .news_excerpt').val());
        form_data.append("news_content", CKEDITOR.instances.news_content.getData());



        $.ajax({
            url: "admin_news/news_insert",
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,                         // Setting the data attribute of ajax with file_data
            type: 'post'


            /*type: "POST",
            url: "admin_post/post_insert",
            data: { 
                postfile: file_data,
                post_title: $('.post-edit .post_title').val(),
                post_excerpt: $('.post-edit .post_excerpt').val(),
                post_content: CKEDITOR.instances.post_content.getData()
            }*/

            //data: $("#post_form").serialize()
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("建立 NEWS 成功 !");

                get_news_list(20, 1);
                $("#news-page .news-edit").hide();
                $("#news-page .news-list").show();
            } else {
                alert("建立 NEWS 失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    } else {

        $.ajax({
            type: "POST",
            url: "admin_news/news_update",
            data: { 
                id: $('.news-edit .news_id').val(),
                title: $('.news-edit .news_title').val(),
                excerpt: $('.news-edit .news_excerpt').val(),
                news_content: CKEDITOR.instances.news_content.getData()
            }

           // data: $("#post_form").serialize()
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("修改 NEWS 成功 !");
                
                get_news_list(20, nowNewsPage);
                $("#news-page .news-edit").hide();
                $("#news-page .news-list").show();
            } else {
                alert("修改問題失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }
});

function get_news_list(num, start)
{
    nowNewsPage = start;
    startCount = (start - 1) * 20;
    $.ajax({
        type: "POST",
        url: "admin_news/news_list",
        data: {
            'num': num, 
            'start': startCount
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('.news-list tbody').empty();
        $('#news-page .pagination').empty();
        $('#news-page .pagination li').unbind('click');

        if(json_data.data.count > 20)
        {
            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
            {
                if(i == start)
                {
                    $('#news-page .pagination').append(
                        '<li class="active"><a>' + i + '</a></li>');
                } else {
                    $('#news-page .pagination').append(
                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }
            }
            $('#news-page .pagination li').click(function (){
                if($(this).hasClass("active"))
                    return false;
                get_news_list(20, $(this).attr('role-data'));
                return false;
            });
        }

        for(var i = 0; i < json_data.data.news.length; i++)
        {   



            $('.news-list tbody').append('<tr><td class="text-center">'
                        + '<input type="checkbox" name="selected[]" value="2911"></td>'
                        + '<td class="text-left">' + (i + 1) + '</td>'
                        + '<td class="text-left">' + json_data.data.news[i].id + '</td>'
                        + '<td class="text-left">' + json_data.data.news[i].title + '</td>'
                        + '<td class="text-left desc">' + json_data.data.news[i].excerpt + '</td>'
                        + '<td class="text-right">'
                        + '<button type="button" data-news-id="' 
                        + json_data.data.news[i].id + '" class="btn btn-group delet">'
                        + '<i class="fa fa-trash"></i></button>'
                        + '<a title="修改問題" class="btn btn-gold update" data-news-id="' 
                        + json_data.data.news[i].id + '">'
                        + '<i class="fa fa-pencil"></i></a>'
                        + '</td>'
                        + '</tr>');
        }

        $('#news-page table tbody .delet').unbind('click');
        $('#news-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_news_by_id($(this).attr('data-news-id'));
            }
        });

        $('#news-page table tbody .update').unbind('click');
        $('#news-page table tbody .update').click(function (){
            get_news_by_id($(this).attr('data-news-id'));
        });



    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

function get_news_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_news/get_news_by_id",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            $('.news-edit .state').val('update');
            $('.news-edit .news_id').val(json_data.data.id);

            $("#news-page .inner-panel .news_title").val(json_data.data.title);
            $("#news-page .inner-panel .news_excerpt").val(json_data.data.excerpt);

            CKEDITOR.instances.news_content.setData(json_data.data.news_content);

            $("#news-page .inner-panel .create_time").val(json_data.data.create_time);

            $("#news-page .news-edit").show();
            $("#news-page .news-list").hide();

        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}

$('#news-page .return').click(function (){
    $("#news-page .news-edit").hide();
    $("#news-page .news-list").show();
    /*$('#news-page .img-select').val('');
    $('#news-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
    $('#news-page .preview-console').hide();*/
});









function delete_news_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_news/news_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            get_news_list(20, 1);
            alert("刪除NEWS成功 !");
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

$('#news-page .create').click(function (){

    $('.news-edit .state').val('insert');
    $("#news-page .inner-panel .news_title").val('');
    $("#news-page .inner-panel .news_excerpt").val('');
    $('.news-edit .news_id').val('');
    CKEDITOR.instances.news_content.setData('');
    //CKEDITOR.instances.news_content.setData( '' );

    $("#news-page .inner-panel .create_time").val('');

  //  $('#news-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
    
    $("#news-page .news-edit").show();
    $("#news-page .news-list").hide();

   // $('#news-page .preview-console').hide();
});



get_news_list(20, nowNewsPage);





$("#news-page .tag-media").click(function(e) {
    $('#media-dt-pop').fadeIn();

    $('#media-dt-pop .media-box').html('');
    is_photo_pool_loading = false;
    photo_pool_count = 1;
    photo_pool_hash = new Object();
    get_photo_pool_list(20, photo_pool_count);
});

/*function readURL(input) {
   // alert('')
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('.news-edit .state').val() == 'insert')
            {
                $('.news-edit .img-cover').attr('src', e.target.result);
            } else {
                $('#news-page .img-preview').attr('src', e.target.result);

                $('#news-page .preview-console').show();
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
}*/

/*$('#news-page .cancel-img').click(function (){
    $('#news-page .img-select').val('');
    //$('#news-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
    $('#news-page .preview-console').hide();
});
*/

/*$("#news-page .upload-img").click(function(){
    var imgVal = $('#news-page .img-select').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#news-page .img-select").prop("files")[0];   // Getting the properties of file from file field
    var form_data = new FormData();                  // Creating object of FormData class
    form_data.append("newsfile", file_data)              // Appending parameter named file with properties of file_field to form_data
    form_data.append("news_id", $('.news-edit .news_id').val())                // Adding extra parameters to form_data
    $.ajax({
        url: "admin_news/photo",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         // Setting the data attribute of ajax with file_data
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#news-page .news-edit .img-cover").attr("src", json.data.news_cover);
            alert('圖片上傳成功 !');
        } else {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }
    }).fail(function( jqXHR, textStatus  ) {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    });
});*/





if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
    CKEDITOR.tools.enableHtml5Elements( document );

CKEDITOR.config.height = 450;
CKEDITOR.config.width = 'auto';



initCkeditor('news_content');
/*CKEDITOR.instances.post_content.on( 'change', function( evt ) {
    // getData() returns CKEditor's HTML content.
    $('#post_content').html(evt.editor.getData());
    //console.log( 'Total bytes: ' + evt.editor.getData().length );
});*/