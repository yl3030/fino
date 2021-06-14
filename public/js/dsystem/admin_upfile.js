var nowUpfilePage = 1;


$("#upfile_form").submit(function(e) {
    e.preventDefault();

    var file_data = $( '#upfile-page .upfile-edit input[name="up_file"]' ).prop("files")[0];

    var form_data = new FormData();
    form_data.append("upfile", file_data);
    form_data.append("file_desc", $('#upfile-page .upfile-edit textarea[name="file_desc"]').val());

    $.ajax({
        url: "admin_upfile/upfile_insert",
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
            alert("上傳檔案成功 !");

            get_upfile_list(20, 1);
            $("#upfile-page .upfile-edit").hide();
            $("#upfile-page .upfile-list").show();
        } else {
            if(json_data.msg == "ext_error")
                alert("不准上傳此檔案類型 !");
            else if(json_data.msg == "file_big")
                alert("檔案太大，須在 2M 內 !");
            else 
                alert("建立檔案失敗，請檢查資料都有輸入齊全 !");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
});

function get_upfile_list(num, start)
{
    nowUpfilePage = start;
    startCount = (start - 1) * 20;
    $.ajax({
        type: "POST",
        url: "admin_upfile/upfile_list",
        data: {
            'num': num, 
            'start': startCount
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('.upfile-list tbody').empty();
        $('#upfile-page .pagination').empty();
        $('#upfile-page .pagination li').unbind('click');

        if(json_data.data.count > 20)
        {
            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
            {
                if(i == start)
                {
                    $('#upfile-page .pagination').append(
                        '<li class="active"><a>' + i + '</a></li>');
                } else {
                    $('#upfile-page .pagination').append(
                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }
            }
            $('#upfile-page .pagination li').click(function (){
                if($(this).hasClass("active"))
                    return false;
                get_upfile_list(20, $(this).attr('role-data'));
                return false;
            });
        }

        for(var i = 0; i < json_data.data.upfile.length; i++)
        {   



            $('.upfile-list tbody').append('<tr><td class="text-center">'
                        + '<input type="checkbox" name="selected[]" value="2911"></td>'
                        + '<td class="text-left">' + (i + 1) + '</td>'
                        + '<td class="text-left">' + json_data.data.upfile[i].id + '</td>'
                        + '<td class="text-left"><a target="_blank" href="' + json_data.data.upfile[i].file_url + '">' 
                        + json_data.data.upfile[i].file_url + '</a></td>'
                        + '<td class="text-left desc">' + json_data.data.upfile[i].file_desc + '</td>'
                        + '<td class="text-right">'
                        + '<button type="button" data-upfile-id="' 
                        + json_data.data.upfile[i].id + '" class="btn btn-group delet">'
                        + '<i class="fa fa-trash"></i></button>'
                        + '</td>'
                        + '</tr>');
        }

        $('#upfile-page table tbody .delet').unbind('click');
        $('#upfile-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_upfile_by_id($(this).attr('data-upfile-id'));
            }
        });

        $('#upfile-page table tbody .update').unbind('click');
        $('#upfile-page table tbody .update').click(function (){
            get_upfile_by_id($(this).attr('data-upfile-id'));
        });



    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}


$('#upfile-page .return').click(function (){
    $("#upfile-page .upfile-edit").hide();
    $("#upfile-page .upfile-list").show();
    /*$('#upfile-page .img-select').val('');
    $('#upfile-page .img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');
    $('#upfile-page .preview-console').hide();*/
});









function delete_upfile_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_upfile/upfile_delete",
        data: {'id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            get_upfile_list(20, 1);
            alert("刪除檔案成功 !");
        } else {
            alert("發生錯誤，請檢查網路或重新載入網頁");
        }
    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {

    });
}



$('#upfile-page .create').click(function (){
    $( '#upfile-page .upfile-edit input[name="up_file"]' ).val('');
    $( '#upfile-page .upfile-edit input[name="filename"]' ).val('');
    $( '#upfile-page .upfile-edit textarea[name="file_desc"]' ).val('');

    $("#upfile-page .upfile-edit").show();
    $("#upfile-page .upfile-list").hide();
});



get_upfile_list(20, nowUpfilePage);




$( '#upfile-page .upfile-edit input[name="up_file"]' ).change(function() {


    if ($(this)[0].files && $(this)[0].files[0]) {
        var reader = new FileReader();
        reader.fileName = $(this)[0].files[0].name;
        reader.onload = function (e) {
            $( '#upfile-page .upfile-edit input[name="filename"]' ).val(e.target.fileName);
        };

        reader.readAsDataURL($(this)[0].files[0]);
    }
});

