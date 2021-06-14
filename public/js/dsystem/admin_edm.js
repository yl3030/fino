var nowEdmPage = 1;


(function ($, window, i) {

    var EdmHelper = function(){
        this.rootView = $('#edm-page');
        this.form = $('#edm_form');
        this.listView = this.rootView.find('.edm-list');
        this.editView = this.rootView.find('.edm-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');
        this.user_counter = 0;

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
                _self.createEdm();
            else
                _self.updateEdm();
        });
    };

    EdmHelper.prototype.getEdmList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowEdmPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_edm/edm_list",
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
                    _self.getEdmList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.edm.length; i++)
            {   
            	if(json_data.data.edm[i].is_active == 1)
            		json_data.data.edm[i].is_active = '開啟';
            	else
            		json_data.data.edm[i].is_active = '關閉';


                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' + json_data.data.edm[i].edm_id + '</td>'
                            + '<td class="text-left">' + json_data.data.edm[i].name + '</td>'
                            + '<td class="text-left">' + json_data.data.edm[i].is_active + '</td>'
                            + '<td class="text-left"><a target="_blank" href="'
                            + base_url + 'edm/' + json_data.data.edm[i].slug + '">前往 EDM</a></td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-edm-id="' 
                            + json_data.data.edm[i].edm_id + '" class="btn btn-group delet">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<a title="修改問題" class="btn btn-gold update" data-edm-id="' 
                            + json_data.data.edm[i].edm_id + '">'
                            + '<i class="fa fa-pencil"></i></a>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delet').unbind('click');
            _self.tableView.find('.delet').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    _self.deleteEdmById($(this).attr('data-edm-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                _self.get_edm_by_id($(this).attr('data-edm-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };


    EdmHelper.prototype.createEdm = function() {
        
        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        form_data.append("edm_name", $('.edm-edit input[name="edm_name"]').val());
        form_data.append("is_active", $('.edm-edit select[name="is_active"]').val());
        form_data.append("edm_content", CKEDITOR.instances.edm_content.getData());
        form_data.append("remarks", $('.edm-edit textarea[name="remarks"]').val());

        $.ajax({
            url: "admin_edm/edm_insert",
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
                alert("建立 EDM 成功 !");

                _self.getEdmList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
            	if(json_data.msg == 'no_user')
            		alert("請選擇用戶 !");
            	else if(json_data.msg == 'discount_err')
            		alert("折扣不得小於 7折(70以下)，或是金額不得小於等於 0!");
            	else if(json_data.msg == 'code_short')
            		alert("票卷序號至少12個字喔 !");
            	else
                	alert("建立 EDM 失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    EdmHelper.prototype.updateEdm = function() {
        var _self = (event.data) ? event.data : this;
        
        var form_data = new FormData();

        form_data.append("edm_id", $('.edm-edit input[name="edm_id"]').val());
        form_data.append("edm_name", $('.edm-edit input[name="edm_name"]').val());
        form_data.append("is_active", $('.edm-edit select[name="is_active"]').val());
        form_data.append("edm_content", CKEDITOR.instances.edm_content.getData());
        form_data.append("remarks", $('.edm-edit textarea[name="remarks"]').val());

        $.ajax({
            url: "admin_edm/edm_update",
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
                alert("修改 EDM 成功 !");
                
                _self.getEdmList(20, nowEdmPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
            	if(json_data.msg == 'code_short')
            		alert("票卷序號至少12個字喔 !");
            	else
                	alert("修改 EDM 失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };

    EdmHelper.prototype.get_edm_by_id = function(id) {
        var _self = (event.data) ? event.data : this;

        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_edm/get_edm_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.edm-edit .state').val('update');

                _self.editView.find('input[name="edm_id"]').val(json_data.data.edm_id);

        		_self.editView.find('input[name="edm_name"]').val(json_data.data.name);
        		_self.editView.find('textarea[name="remarks"]').val(json_data.data.remarks);

        		CKEDITOR.instances.edm_content.setData(json_data.data.edm_content);

        		_self.editView.find('select[name="is_active"]').val(json_data.data.is_active);

        		_self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
        		_self.editView.find('input[name="end_time"]').val(json_data.data.end_time);
        		
                _self.editView.find('input[name="last_edit_time"]').val(json_data.data.last_edit_time);
                _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);

                $("#edm-page .edm-edit").show();
                $("#edm-page .edm-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }



    EdmHelper.prototype.deleteEdmById = function(id) {

        var _self = (event.data) ? event.data : this;

        $.ajax({
	        type: "POST",
	        url: "admin_edm/edm_delete",
	        data: {'id': id}
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	        if(json_data.result == "success")
	        {
	            _self.getEdmList(20, 1);
	            alert("刪除 EDM ·成功 !");
	        } else {
	            alert("發生錯誤，請檢查網路或重新載入網頁");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
    }

    


    EdmHelper.prototype.editorInit = function() {

        this.editView.find('input[name="edm_id"]').val('');
        this.editView.find('input[name="edm_name"]').val('');
        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('textarea[name="remarks"]').val('');
        this.editView.find('input[name="last_edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');

        this.editView.find('select[name="is_active"]').val(1);

        CKEDITOR.instances.edm_content.setData('');
    };




    edmHelper = new EdmHelper();
    edmHelper.getEdmList(20, nowEdmPage);
   // edmHelper.getPostCate();

})(jQuery, this, 0);





$('#edm-page .create').click(function (){

    $('.edm-edit .state').val('insert');
    edmHelper.editorInit();
    $("#edm-page .edm-edit").show();
    $("#edm-page .edm-list").hide();
    
});






if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
    CKEDITOR.tools.enableHtml5Elements( document );

CKEDITOR.config.height = 450;
CKEDITOR.config.width = 'auto';



initCkeditor('edm_content');
