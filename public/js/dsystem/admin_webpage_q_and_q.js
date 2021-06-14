
$(".webpage-q-and-a-form").submit(function(e) {
    e.preventDefault();

    var content;
    if($(this).find('.lang').val() == 'tw')
        content = CKEDITOR.instances.webpage_q_and_a_content_tw.getData();
    else if($(this).find('.lang').val() == 'jp')
        content = CKEDITOR.instances.webpage_q_and_a_content_jp.getData();
    else if($(this).find('.lang').val() == 'en')
        content = CKEDITOR.instances.webpage_q_and_a_content_en.getData();

    //return;

    $.ajax({
        type: "POST",
        url: "admin_webpage_q_and_a/update_page_cotent",
        data: {
            page_content: content,
            lang: $(this).find('.lang').val()
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            alert("修改頁面成功 !");
            /*
            get_post_list(20, nowPagePost);
            $("#post-page .post-edit").hide();
            $("#post-page .post-list").show();*/
        } else {
            alert("修改頁面失敗，請檢查資料都有輸入齊全 !");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
});


$("#webpage-q-and-a-page .tag-media").click(function(e) {
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




/*CKEDITOR.on("instanceReady",function() {
    get_webpage_q_and_a_content();
});*/


get_webpage_q_and_a_content();




//initWebpageJobEditor();

function get_webpage_q_and_a_content () {
	//alert('gggg');
    $.ajax({
        type: "POST",
        url: "admin_webpage_q_and_a/get_page_cotent"
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            for (var i = 0; i < json_data.data.length; i++) {
                if(json_data.data[i].lang == 'tw') {
                    $('#webpage_q_and_a_content_tw').html(json_data.data[i].webpage_content);
                } else if(json_data.data[i].lang == 'jp') {
                    $('#webpage_q_and_a_content_jp').html(json_data.data[i].webpage_content);
                } else if(json_data.data[i].lang == 'en') {
                    $('#webpage_q_and_a_content_en').html(json_data.data[i].webpage_content);
                }
            }

            initCkeditor('webpage_q_and_a_content_tw');
            initCkeditor('webpage_q_and_a_content_jp');
            initCkeditor('webpage_q_and_a_content_en');

        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}



