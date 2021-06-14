var nowProjectPage = 1;


$(window).click(function() {
	if(projectHelper) {
		projectHelper.category_panel.hide();
	}
});


(function ($, window, i) {

    var ProjectHelper = function(){
        this.rootView = $('#project-page');
        this.form = $('#project_form');
        this.listView = this.rootView.find('.project-list');
        this.editView = this.rootView.find('.project-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.project-list .pagination');

        this.searchBtn = this.rootView.find('.search-console .search');

        this.category_selector = this.editView.find('.category-selector');
        this.category_panel = this.editView.find('.category_panel');

        this.projectCate;

        var _self = this;


        this.editBtn.on('click', this, function(event){
            var _self = (event.data) ? event.data : this;
            _self.editView.hide();
            _self.listView.show();
        });


        this.category_selector.on('click', this, function(event){
        	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

            _self.category_panel.show();
        });

        this.category_panel.on('click', this, function(event){
        	event.stopPropagation();
            var _self = (event.data) ? event.data : this;

            _self.category_panel.show();
        });

        this.searchBtn.on('click', this, function(event){
        	event.stopPropagation();

        	var _self = (event.data) ? event.data : this;
            nowProjectPage = 1;
            _self.getProjectList(20, nowProjectPage);
        });





        this.editView.find('.export').on('click', this, function(event){
        	
        	event.stopPropagation();

        	var _self = (event.data) ? event.data : this;
          
            _self.exportUserList();
        
        	//alert('fswefewf');
        });
        



        this.form.on('submit', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;
            /*_self.editView.hide();
            _self.listView.show();*/


            if(_self.state.val() == 'insert')
                _self.createProject();
            else
                _self.updateProject();
        });


        this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
            var _self = (event.data) ? event.data : this;
            _self.getSubCate();

        });


        this.editView.find(".datepicker").datepicker({ 
		    dateFormat: 'yy-mm-dd'
		});







        this.kolTB = this.editView.find('.kol-list tbody');
        this.kolPgn = this.editView.find('#tab-pjt-kol .pagination');
        this.kolList = this.editView.find('#tab-pjt-kol .kol-po-list ul');

        this.kolList.on('click', '.kol-po-item > .d-table', function(event){
			var kolItem = $(this).closest('.kol-po-item');
			kolItem.toggleClass('active');
		});

        this.kolList.on('click', '.kol-po-item .payment-list .confirm-paid', function(event){
			var kolItem = $(this).closest('.kol-po-item');
			var payItem = $(this).closest('tr');

			_self.payKol(kolItem.find('[name="contract_id"]').val(), $(this).attr('role'), kolItem, payItem);
		});
        

		this.tableBuilder = new TableBuilder(this.kolTB, this.kolPgn, 'id',
        	['photo', 'name', 'stage'],
        	['img', 'td', 'td'], function(roleData) {

        	_self.getKolList(20, roleData);
        });
    };



    ProjectHelper.prototype.payKol = function(contractId, step, kolItem, payItem) {

        var _self = this;

		var formData = new FormData();
		formData.append("contract_id", contractId);
		formData.append("step", step);

		postReq("admin_project/pay_kol", formData, function(json){

            kolItem.find('.d-tdbody .works').html(json.data.steps);

			if(json.data.is_paid == 0){
				payItem.find('td:nth-child(5)').html('--');
				payItem.find('td:nth-child(6)').html('尚未付款');
				payItem.find('.confirm-paid').html('確認付款');
				payItem.find('.confirm-paid').removeClass('active');
			}else{
				payItem.find('td:nth-child(5)').html(json.data.paid_day);
				payItem.find('td:nth-child(6)').html('已付款');
				payItem.find('.confirm-paid').html('取消已付款');
				payItem.find('.confirm-paid').addClass('active');
			}

        }, function(json){
        	if(json.msg == "cus_msg")
        		alert(json.msg_content);
        	else
				alert("網路連線錯誤，請重新嘗試 !");
        });
    };


    ProjectHelper.prototype.getKolList = function(num, start) {
        var _self = this;

        nowKolPage = start;
        startCount = (start - 1) * 20;

		var formData = new FormData();

		formData.append("num", num);
		formData.append("start", startCount);
		formData.append("project_id", _self.editView.find('.project_id').val());

		postReq("admin_project/kol_list", formData, function(json){

            // var kols = json.data.user;

            // for(var i = 0; i < kols.length; i++)
            // {   
            // 	if(kols[i].gender != '')
            //     	kols[i].gender = (kols[i].gender == 'male') ? '男' : '女';
            // 	else
            //     	kols[i].gender = '未填';
            // }

            _self.kolList.html(json.data.items);

            _self.tableBuilder.refresh('', json.data.count, start);

        }, function(json){
        	if(json.msg == "cus_msg")
        		alert(json.msg_content);
        	else
				alert("網路連線錯誤，請重新嘗試 !");
        });
    };


    // ProjectHelper.prototype.getSubCate = function() {
    //     sub_options = '';
    //     for(var i = 0; i < projectCateJson.length; i++) {
    //         if(projectCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
    //             for(var k = 0; k < projectCateJson[i].sub_cate.length; k++) {
    //                 sub_options += '<option value="' + projectCateJson[i].sub_cate[k].category_id + '">' 
    //                 + projectCateJson[i].sub_cate[k].name + '</option>';
    //             }
    //         }
    //     }

    //     this.editView.find('select[name="sub-cate"]').html(sub_options);
    // };

    ProjectHelper.prototype.getProjectList = function(num, start) {
        var _self = (event.data) ? event.data : this;

        nowProjectPage = start;
        startCount = (start - 1) * 20;
        $.ajax({
            type: "POST",
            url: "admin_project/project_list",
            data: {
                'num': num, 
                'start': startCount,
                'keywords': _self.rootView.find('.search-console input[name="keywords"]').val(),
                'project_type': _self.rootView.find('.search-console select[name="project_type"]').val(),
                'status': _self.rootView.find('.search-console select[name="status"]').val()
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
                    _self.getProjectList(20, $(this).attr('role-data'));
                    return false;
                });
            }

            for(var i = 0; i < json_data.data.project.length; i++)
            {   
                if(json_data.data.project[i].cover_image == '')
                    json_data.data.project[i].cover_image = 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png';

                if(json_data.data.project[i].status == 1)
                	json_data.data.project[i].status = '上架中';
                else
                	json_data.data.project[i].status = '已下架';


                // if(json_data.data.project[i].sale_price > 0) {
                // 	price = '<b>' + json_data.data.project[i].sale_price  + ' NTD</b><br><s>' 
                // 	+ json_data.data.project[i].price + ' NTD</s>';
                // }else{
                // 	price = '<b>' + json_data.data.project[i].price + ' NTD<b>';
                // }






                _self.tableView.append('<tr><td class="text-center">'
                            + '<input type="checkbox" name="selected[]" value="2911"></td>'
                            + '<td class="text-left">' + (i + 1) + '</td>'
                            + '<td class="text-left">' + json_data.data.project[i].project_id + '</td>'
                            + '<td class="text-left">' + json_data.data.project[i].name + '</td>'
							+ '<td class="text-left desc">' + json_data.data.project[i].project_name + '</td>'
							+ '<td class="text-left">$' + json_data.data.project[i].budget_start + 'K ~ $' 
							+ json_data.data.project[i].budget_end + 'K</td>'
                            + '<td class="text-left desc">' + json_data.data.project[i].recruit_dl + '</td>'
                            + '<td class="text-right">'
                            + '<button type="button" data-project-id="' 
                            + json_data.data.project[i].project_id + '" class="btn btn-group delete">'
                            + '<i class="fa fa-trash"></i></button>'
                            + '<button title="修改專案" class="btn btn-gold update" data-project-id="' 
                            + json_data.data.project[i].project_id + '">'
                            + '<i class="fa fa-pencil"></i></button>'
                            + '</td>'
                            + '</tr>');
            }

            _self.tableView.find('.delete').unbind('click');
            _self.tableView.find('.delete').click(function (){
                var r = confirm("確定要刪除這筆資料嗎 ?");
                if (r == true) {
                    delete_project_by_id($(this).attr('data-project-id'));
                }
            });

            _self.tableView.find('.update').unbind('click');
            _self.tableView.find('.update').click(function (){
                $('.project-edit h1').html('專案編輯');
                _self.getProject($(this).attr('data-project-id'));
            });

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };




    ProjectHelper.prototype.createProject = function() {
        
        var _self = (event.data) ? event.data : this;


        var form_data = new FormData();

        form_data.append("name", _self.editView.find('input[name="name"]').val());
        form_data.append("excerpt", _self.editView.find('textarea[name="excerpt"]').val());
        form_data.append("price", _self.editView.find('input[name="price"]').val());



        form_data.append("project_type", _self.editView.find('input[name="project_type"]:checked').val());
        form_data.append("sale_price", _self.editView.find('input[name="sale_price"]').val());


        
        form_data.append("category_id", _self.editView.find('input[name="category_id"]').val());

        var tags = '';
        for (var i = 0; i < _self.project_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += _self.project_tag_arr[i];
        }
        form_data.append("tags", tags);


        form_data.append("sku", _self.editView.find('input[name="sku"]').val());
        form_data.append("quantity", _self.editView.find('input[name="quantity"]').val());
        form_data.append("length", _self.editView.find('input[name="length"]').val());
        form_data.append("width", _self.editView.find('input[name="width"]').val());
        form_data.append("height", _self.editView.find('input[name="height"]').val());
        form_data.append("weight", _self.editView.find('input[name="weight"]').val());
        form_data.append("status", _self.editView.find('select[name="status"]').val());



        form_data.append("project_title", _self.editView.find('input[name="project_title"]').val());
        form_data.append("project_desc", _self.editView.find('textarea[name="project_desc"]').val());
        form_data.append("keywords", _self.editView.find('input[name="keywords"]').val());


    
        form_data.append("project_content", CKEDITOR.instances.project_content.getData());

        $.ajax({
            url: "admin_project/project_insert",
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
                alert("建立專案成功 !");

                _self.getProjectList(20, 1);
                _self.listView.show();
                _self.editView.hide();
            } else {
            	if(json_data.msg == "not_free")
            		alert("請輸入專案售價，不得為 0 !");
            	else
                	alert("建立專案失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    ProjectHelper.prototype.updateProject = function() {

        var _self = this;

        var formData = new FormData(_self.form[0]);

        // formData.append("project_id", _self.editView.find('.project_id').val());
        // formData.append("name", _self.editView.find('input[name="name"]').val());
        // formData.append("width", _self.editView.find('input[name="width"]').val());

        $.ajax({
            url: "admin_project/update",
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            type: 'post'
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
               	alert("修改專案成功 !");
                
                //var r = confirm("修改專案成功，是否要繼續編輯 ?");
                _self.getProjectList(20, nowProjectPage);
                _self.listView.show();
             	_self.editView.hide();
	            // if (r != true) {
	            //     _self.listView.show();
             //   		_self.editView.hide();
	            // }
               
            } else {
                alert("修改專案失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    ProjectHelper.prototype.getProjectCate = function() {

        var _self = (event.data) ? event.data : this;

        $.ajax({
	        type: "POST",
	        url: "admin_project/cate_list",
	        data: {
	            
	        }
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;

	       	_self.projectCate = json_data.data;
	 







	       	var options = '';

			options = '<option value="0" selected>不限</option>';

			for (i in _self.projectCate) {
				options += '<option value="' + _self.projectCate[i]['category_id'] + '">' 
					 	+ _self.projectCate[i]['name'] + '</option>';
			}

			_self.editView.find('select[name="main_cate"]').html(options);
			$('.sub-cate-con').hide();

			_self.editView.find('select[name="main_cate"]').on('change', function(e){
				_self.getSubCate($(this).val());
			});



	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {
	        
	    });
    };

    ProjectHelper.prototype.getProject = function(id) {
        var _self = (event.data) ? event.data : this;
        _self.editorInit();

        $.ajax({
            type: "POST",
            url: "admin_project/get_project_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                _self.editView.find('.state').val('update');
               // _self.editView.find('.project_id').val(json_data.data.project_id);


                _self.editView.find('input[name="name"]').val(json_data.data.name);
                _self.editView.find('textarea[name="excerpt"]').val(json_data.data.excerpt);
                _self.editView.find('input[name="price"]').val(json_data.data.price);


                _self.editView.find('input[name="project_type"][value="' + json_data.data.project_type + '"]').prop("checked", true);



                


                
     		
     			_self.editView.find('input[name="project_id"]').val(json_data.data.project_id);

     			_self.editView.find('input[name="business_name"]').val(json_data.data.business.name);
     			_self.editView.find('input[name="project_name"]').val(json_data.data.project_name);

     			_self.editView.find('input[name="recruit_dl"]').val(json_data.data.recruit_dl);
     			_self.editView.find('textarea[name="brief"]').val(json_data.data.brief);
     			//_self.editView.find('input[name="business_name"]').val(json_data.data.business_name);
     			_self.editView.find('input[name="budget_start"]').val(json_data.data.budget_start);
     			_self.editView.find('input[name="budget_end"]').val(json_data.data.budget_end);


     			_self.editView.find('select[name="main_cate"]').val(json_data.data.category_id);
     			


     			_self.getSubCate(json_data.data.category_id);
     			_self.editView.find('select[name="sub_cate"]').val(json_data.data.sub_category_id);




                _self.editView.find('input[name="last_edit_time"]').val(json_data.data.last_edit_time);
                _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);



                _self.getKolList(20, 1);

                //CKEDITOR.instances.project_content.setData(json_data.data.description);
   

                $("#project-page .project-edit").show();
                $("#project-page .project-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }

    ProjectHelper.prototype.getSubCate = function($cateId) {

    	if($cateId == 0)
    		return;

		options = '<option value="0" selected>不限</option>';

		for (i in this.projectCate[$cateId]['list']) {
	  		options += '<option value="' + this.projectCate[$cateId]['list'][i]['category_id'] + '">' 
	  		 		+ this.projectCate[$cateId]['list'][i]['name'] + '</option>';
		}

		if(this.projectCate[$cateId]['list'].length > 0)
			$('.sub-cate-con').show();
		else
			$('.sub-cate-con').hide();

		this.editView.find('select[name="sub_cate"]').html(options);
    };


    ProjectHelper.prototype.exportUserList = function() {
        var _self = this;

        // alert(_self.editView.find('input[name="project_id"]').val());
        // return;

        submitFORM('admin_project/kol_excel_txlsx', {
        	'project_id': _self.editView.find('input[name="project_id"]').val()
        }, 'POST');

        return;
    };


    ProjectHelper.prototype.editorInit = function() {

        $("a[href='#project-general-info']").trigger("click");
        $('#project-thumb-image + input').val('');
        $('#project-thumb-image img').attr('src', 
            'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/p/static/dymain-no-image200x200.png');
        $('#project-images tbody').html('');

        $('#project-page .project-spec tbody').html('');
        $('#project-page .option-project tbody').html('');
        $('#project-page .recommand-project tbody').html('');
        $('#project-page .gifts-project tbody').html('');
        
        this.editView.find('.fav-user-list tbody').html('');



        this.editView.find('input[name="name"]').val('');
        this.editView.find('textarea[name="excerpt"]').val('');
        this.editView.find('input[name="price"]').val('');


        this.editView.find('input[name="project_type"][value="1"]').prop("checked", true);






        this.editView.find('input[name="sale_price"]').val('');

        this.editView.find('input[name="sku"]').val('');
        this.editView.find('input[name="quantity"]').val('');
        this.editView.find('input[name="length"]').val('');
        this.editView.find('input[name="width"]').val('');
        this.editView.find('input[name="height"]').val('');
        this.editView.find('input[name="weight"]').val('');
        this.editView.find('select[name="status"]').val('');
        this.editView.find('input[name="edit_time"]').val('');
        this.editView.find('input[name="create_time"]').val('');


        //CKEDITOR.instances.project_content.setData('');
    };





   // alert('sdfadsf jasif jsdiof ');



    projectHelper = new ProjectHelper();
    projectHelper.getProjectList(20, nowProjectPage);


  //  projectHelper.getProjectCate(projectHelper.editView.find('input[name="category_id"]').val());

    // projectHelper.editView.find('.category_panel .back-cate-parent').click(function(){
    // 	projectHelper.getProjectCate($(this).attr('role-data'));
    // });
   	projectHelper.getProjectCate();

  //  alert('fsfdsdsfd');

})(jQuery, this, 0);







function get_project_list(num, start)
{
    nowProjectPage = start;
    startCount = (start - 1) * 20;
    $.ajax({
        type: "POST",
        url: "admin_project/project_list",
        data: {
            'num': num, 
            'start': startCount
        }
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        $('.project-list tbody').empty();
        $('#project-page .pagination').empty();
        $('#project-page .pagination li').unbind('click');

        if(json_data.data.count > 20)
        {
            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
            {
                if(i == start)
                {
                    $('#project-page .pagination').append(
                        '<li class="active"><a>' + i + '</a></li>');
                } else {
                    $('#project-page .pagination').append(
                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
                }
            }
            $('#project-page .pagination li').click(function (){
                if($(this).hasClass("active"))
                    return false;
                get_project_list(20, $(this).attr('role-data'));
                return false;
            });
        }

        for(var i = 0; i < json_data.data.project.length; i++)
        {   
            $('.project-list tbody').append('<tr><td class="text-center">'
                        + '<input type="checkbox" name="selected[]" value="2911"></td>'
                        + '<td class="text-left">' + (i + 1) + '</td>'
                        + '<td class="text-left"><img class="thumb" src="' 
                        + json_data.data.project[i].cover_photo_small + '"></td>'
                        + '<td class="text-left">' + json_data.data.project[i].id + '</td>'
                        + '<td class="text-left">' + json_data.data.project[i].title + '</td>'
                        + '<td class="text-left desc">' + json_data.data.project[i].excerpt + '</td>'
                        + '<td class="text-right">'
                        + '<button type="button" data-project-id="' 
                        + json_data.data.project[i].id + '" class="btn btn-group delet">'
                        + '<i class="fa fa-trash"></i></button>'
                        + '<a title="修改問題" class="btn btn-gold update" data-project-id="' 
                        + json_data.data.project[i].id + '">'
                        + '<i class="fa fa-pencil"></i></a>'
                        + '</td>'
                        + '</tr>');
        }

        $('#project-page table tbody .delet').unbind('click');
        $('#project-page table tbody .delet').click(function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                delete_project_by_id($(this).attr('data-project-id'));
            }
        });

        $('#project-page table tbody .update').unbind('click');
        $('#project-page table tbody .update').click(function (){
            _self.getProject($(this).attr('data-project-id'));
        });



    }).fail(function() {
        alert( "發生錯誤，請檢查網路或重新載入網頁" );
    }).always(function() {
        
    });
}










function delete_project_by_id (id) {
    $.ajax({
        type: "POST",
        url: "admin_project/project_delete",
        data: {'project_id': id}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            projectHelper.getProjectList(20, 1);
            alert("刪除專案·成功 !");
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



