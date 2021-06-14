
$( "#homepage_slider_form .datepicker" ).datetimepicker({ 
    dateFormat: 'yy-mm-dd',
    timeFormat: "HH:mm:ss"
});

$("#homepage_slider_form").submit(function(e) {
    e.preventDefault();

    if($('#homepage_slider_form input[name="state"]').val() == 'insert')
    {
        var file_data = $("#homepage_slider_form input[name='image_web']").prop("files")[0];

        var form_data = new FormData();
        form_data.append("homepageadfile", file_data);


        if($('#homepage_slider_form select[name="slider_position"]').val() == 'subslider') {
        	var mobile_file_data = $("#homepage_slider_form input[name='image_mobile']").prop("files")[0];
        	form_data.append("homepageadfilemobile", mobile_file_data);
        }


        form_data.append("slider_position", $('#homepage_slider_form select[name="slider_position"]').val());



        form_data.append("link", $('#homepage_slider_form input[name="link"]').val());
        form_data.append("rank", $('#homepage_slider_form input[name="rank"]').val());
        form_data.append("remarks", $('#homepage_slider_form input[name="remarks"]').val());
        form_data.append("start_time", $('#homepage_slider_form input[name="start_time"]').val());
        form_data.append("end_time", $('#homepage_slider_form input[name="end_time"]').val());

        $.ajax({
            url: "admin_homepage_slider/homepagead_insert",
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
                alert("建立頂部廣告成功 !");

                get_homepage_slider_list();
                $('#homepage-slider-page .homepage-slider-list').show();
				$('#homepage-slider-page .homepage-slider-edit').hide();
            } else {
            	if(json_data.msg == 'time_error')
            		alert("下架時間必須大於等於上架時間 !");
            	else
                	alert("建立頂部廣告失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    } else {

        $.ajax({
            type: "POST",
            url: "admin_homepage_slider/homepagead_update",
            data: { 
                id: $('#homepage_slider_form input[name="homepage_slider_id"]').val(),
                link: $('#homepage_slider_form input[name="link"]').val(),
                rank: $('#homepage_slider_form input[name="rank"]').val(),
				remarks: $('#homepage_slider_form input[name="remarks"]').val(),
				start_time: $('#homepage_slider_form input[name="start_time"]').val(),
				end_time: $('#homepage_slider_form input[name="end_time"]').val(),
				slider_position: $('#homepage_slider_form select[name="slider_position"]').val()
            }

           // data: $("#post_form").serialize()
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("修改頂部廣告成功 !");
                
                get_homepage_slider_list();
                $('#homepage-slider-page .homepage-slider-list').show();
				$('#homepage-slider-page .homepage-slider-edit').hide();
            } else {
            	if(json_data.msg == 'time_error')
            		alert("下架時間必須大於等於上架時間 !");
            	else
                	alert("修改問題失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }
});





$( "#homepage-slider-page input[name='image_web']" ).change(function() {

    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('#homepage_slider_form input[name="state"]').val() == 'insert')
            {
                $('#homepage_slider_form .image_web .img-cover').attr('src', e.target.result);
            } else {
                $('#homepage-slider-page .image_web .img-preview').attr('src', e.target.result);

                $('#homepage-slider-page .image_web .preview-console').show();
            }
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});

$('#homepage-slider-page .image_web .cancel-img').click(function (){
    $('#homepage_slider_form input[name="image_web"]').val('');
    $('#homepage_slider_form .image_web .preview-console').hide();
});

$("#homepage-slider-page .image_web .upload-img").click(function(){
    var imgVal = $('#homepage_slider_form input[name="image_web"]').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#homepage_slider_form input[name='image_web']").prop("files")[0];
    var form_data = new FormData();
    form_data.append("homepageadfile", file_data)
    form_data.append("homepagead_id", $('#homepage_slider_form input[name="homepage_slider_id"]').val())
    $.ajax({
        url: "admin_homepage_slider/photo",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         // Setting the data attribute of ajax with file_data
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#homepage_slider_form .image_web .img-cover").attr("src", json.data.cover_url);
            get_homepage_slider_list();
            alert('圖片修改成功 !');
            $('#homepage_slider_form input[name="image_web"]').val('');
            $('#homepage_slider_form .image_web .preview-console').hide();
        } else {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }
    }).fail(function( jqXHR, textStatus  ) {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    });
});



get_homepage_slider_list();

function get_homepage_slider_list()
{
    $.ajax({
        type: "POST",
        url: "admin_homepage_slider/homepagead_list"
    }).done(function( json_data ) {

        if(!auth_response_pre_processer(json_data))
            return;
        
        $('#homepage-slider-page .homepage-slider-list tbody').html('');

        for(var i = 0; i < json_data.data.length; i++)
        {   
            $('#homepage-slider-page .homepage-slider-list tbody').append('<tr><td class="text-center">'
	                + '<input type="checkbox" name="selected[]" value="2911"></td>'
	                + '<td class="text-left">' + json_data.data[i].id 
	                + '<input type="hidden" name="slider[][id]" value="' + json_data.data[i].id + '"></td>'
	                + '<td class="text-left"><img class="thumb-small" src="' 
	                + json_data.data[i].cover_url_thumb + '"></td>'
	                + '<td class="text-left">' + json_data.data[i].link + '</td>'
	                + '<td class="text-left desc">'
	                + json_data.data[i].rank + '</td>'
	                + '<td class="text-right">'
	                + '<button type="button" data-id="' 
	                + json_data.data[i].id + '" class="btn btn-group delet">'
	                + '<i class="fa fa-trash"></i></button>'
	                + '<a title="修改使用者" class="btn btn-gold update" data-id="' 
	                + json_data.data[i].id + '">'
	                + '<i class="fa fa-pencil"></i></a>'
	                + '</td></tr>');
        }

        $('#homepage-slider-page table tbody .delet').unbind('click');
        $('#homepage-slider-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_homepage_slider_by_id($(this).attr('data-id'));
            }
        });

        $('#homepage-slider-page table tbody .update').unbind('click');
        $('#homepage-slider-page table tbody .update').click(function (){
            get_homepage_slider($(this).attr('data-id'));
        });


    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}

function get_homepage_slider (id) {
    $.ajax({
        type: "POST",
        url: "admin_homepage_slider/get_homepagead_by_id",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            $('#homepage_slider_form input[name="state"]').val('update');
            $('#homepage_slider_form input[name="homepage_slider_id"]').val(json_data.data.id);

            $("#homepage_slider_form .image_web .img-cover").attr('src', json_data.data.cover_url);

            if(json_data.data.slider_position == 'subslider')
            	$('#homepage-slider-page .homepage-slider-edit .image_mobile').show();
            else
            	$('#homepage-slider-page .homepage-slider-edit .image_mobile').hide();

            $("#homepage_slider_form .image_mobile .img-cover").attr('src', json_data.data.cover_url_mobile);

            $('#homepage_slider_form select[name="slider_position"]').val(json_data.data.slider_position);
            $('#homepage_slider_form input[name="link"]').val(json_data.data.link);
            $('#homepage_slider_form input[name="rank"]').val(json_data.data.rank);
            $('#homepage_slider_form input[name="remarks"]').val(json_data.data.remarks);
            $('#homepage_slider_form input[name="start_time"]').val(json_data.data.start_time);
			$('#homepage_slider_form input[name="end_time"]').val(json_data.data.end_time);

            $('#homepage-slider-page .homepage-slider-list').hide();
			$('#homepage-slider-page .homepage-slider-edit').show();

        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}

function delete_homepage_slider_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_homepage_slider/homepagead_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            get_homepage_slider_list();
            alert("刪除置頂廣告成功 !");
        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}


$('#homepage-slider-page .create').click(function(){
	$('#homepage_slider_form input[name="state"]').val('insert');

	$('#homepage_slider_form input[name="link"]').val('');
    $('#homepage_slider_form input[name="rank"]').val('');
	$('#homepage_slider_form input[name="remarks"]').val('');
	$('#homepage_slider_form input[name="start_time"]').val('');
	$('#homepage_slider_form input[name="end_time"]').val('');


	$('#homepage-slider-page .homepage-slider-edit select[name="slider_position"]').val('mainslider');
	$('#homepage-slider-page .homepage-slider-edit .image_mobile').hide();


	$("#homepage_slider_form .img-cover").attr('src', '');

	$('#homepage-slider-page .homepage-slider-list').hide();
	$('#homepage-slider-page .homepage-slider-edit').show();
});

$('#homepage-slider-page .homepage-slider-edit .return').click(function(){
	$('#homepage-slider-page .homepage-slider-list').show();
	$('#homepage-slider-page .homepage-slider-edit').hide();
});
















$( "#homepage-slider-page input[name='image_mobile']" ).change(function() {

    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {

            if($('#homepage_slider_form input[name="state"]').val() == 'insert')
            {
                $('#homepage_slider_form .image_mobile .img-cover').attr('src', e.target.result);
            } else {
                $('#homepage-slider-page .image_mobile .img-preview').attr('src', e.target.result);

                $('#homepage-slider-page .image_mobile .preview-console').show();
            }
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});

$('#homepage-slider-page .image_mobile .cancel-img').click(function (){
    $('#homepage_slider_form input[name="image_mobile"]').val('');
    $('#homepage_slider_form .image_mobile .preview-console').hide();
});

$("#homepage-slider-page .image_mobile .upload-img").click(function(){
    var imgVal = $('#homepage_slider_form input[name="image_mobile"]').val();
    if(imgVal=='')
    { 
        alert("請先選擇圖片");
        return;
    }

    var file_data = $("#homepage_slider_form input[name='image_mobile']").prop("files")[0];
    var form_data = new FormData();
    form_data.append("homepageadfilemobile", file_data)
    form_data.append("homepagead_id", $('#homepage_slider_form input[name="homepage_slider_id"]').val())
    $.ajax({
        url: "admin_homepage_slider/photo_mobile",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         // Setting the data attribute of ajax with file_data
        type: 'post'
    }).done(function( json ) {

        if(json.result == 'success')
        {
            $("#homepage_slider_form .image_mobile .img-cover").attr("src", json.data.cover_url_mobile);
            get_homepage_slider_list();
            alert('圖片修改成功 !');
            $('#homepage_slider_form input[name="image_web"]').val('');
            $('#homepage_slider_form .image_mobile .preview-console').hide();
        } else {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }
    }).fail(function( jqXHR, textStatus  ) {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    });
});








$('#homepage-slider-page .homepage-slider-edit select[name="slider_position"]').on('change', this, function(event){

	if($(this).val() == 'subslider')
		$('#homepage-slider-page .homepage-slider-edit .image_mobile').show();
	else
		$('#homepage-slider-page .homepage-slider-edit .image_mobile').hide();

});
