
$("#webpage-job-form").submit(function(e) {
    e.preventDefault();

    $.ajax({
        type: "POST",
        url: "admin_webpage_job/update_page_cotent",
        data: {
            page_content: CKEDITOR.instances.webpage_job_content.getData()
        }

       // data: $("#post_form").serialize()
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


$("#webpage-job-page .tag-media").click(function(e) {
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

var initWebpageJobEditor = ( function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get( 'bbcode' );

	return function() {
		var editorElement = CKEDITOR.document.getById( 'webpage_job_content' );

		// :(((
		if ( isBBCodeBuiltIn ) {
			editorElement.setHtml(
				'Hello world!\n\n' +
				'I\'m an instance of [url=http://ckeditor.com]CKEditor[/url].'
			);
		}

		// Depending on the wysiwygare plugin availability initialize classic or inline editor.
		if ( wysiwygareaAvailable ) {
			CKEDITOR.replace( 'webpage_job_content' );
		} else {
			editorElement.setAttribute( 'contenteditable', 'true' );
			CKEDITOR.inline( 'webpage_job_content' );

			// TODO we can consider displaying some info box that
			// without wysiwygarea the classic editor may not work.
		}
	};

	function isWysiwygareaAvailable() {
		if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
			return true;
		}

		return !!CKEDITOR.plugins.get( 'wysiwygarea' );
	}
} )();

CKEDITOR.on("instanceReady",function() {
	get_webpage_job_content();
});

initWebpageJobEditor();

function get_webpage_job_content () {
	//alert('gggg');
    $.ajax({
        type: "POST",
        url: "admin_webpage_job/get_page_cotent"
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

      //  alert(json_data);
 //       alert(json_data);

     //   var obj = JSON.parse(json_data);
        if(json_data.result == "success")
        {
            CKEDITOR.instances.webpage_job_content.setData(json_data.data.webpage_content);
            //alert(json_data.data.webpage_content);

        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}



