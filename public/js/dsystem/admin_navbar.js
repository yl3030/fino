var nowNavbarPage = 1;

(function ($, window, i) {

    var NavbarHelper = function(){
        this.rootView = $('.nav-console');
        this.addRowBtn = this.rootView.find('.nav-row .add-row');
        this.navEditor = this.rootView.parent().find('.nav-editor');

        
        this.navDeleteAction = this.navEditor.find('.delete');
        this.navEditorAction = this.navEditor.find('.action');

        this.saveBtn = $('#navbar-page').find('.save');
        
        

        this.nowRow = 1;
        this.nowNavList;
        this.nowNav;


        this.rootView.find('.add-row').on('click', this, function(event){

        	var _self = (event.data) ? event.data : this;
        	$con = _self.rootView.find('.inner');

        	_self.navEditor.find('input[name="type"]').val('title');
        	_self.navEditor.find('input[name="action"]').val('insert');
        	_self.navDeleteAction.hide();

        	_self.navEditor.find('input[name="title"]').val('');
			_self.navEditor.find('input[name="url"]').val('');
			_self.navEditor.show();

        	
					//var num = $con.children().length + 1;

			// $con.append('<div class="nav-row" role-data="">'
   //          		+ '<div class="title" role-data="">'
   //          			+ '<span>ABCDE</span>'
   //          			+ '<i class="fa fa-pencil"></i>'
   //          		+ '</div>'
 		// 			+ '<div class="nav-item-con">'

			// 	  	+ '</div>'
			// 	  	+ '<div class="center">'
			// 		  	+ '<a class="add-item">+</a>'
			// 	  	+ '</div>'
			// 	+ '</div>');



			// _self.initSortable();
        });



        this.navEditorAction.on('click', this, function(event){

        	var _self = (event.data) ? event.data : this;
        	$con = _self.rootView.find('.inner');

        	if(_self.navEditor.find('input[name="type"]').val() == 'title') {

        		if(_self.navEditor.find('input[name="action"]').val() == 'insert') {

					$con.append('<div class="nav-row" role-data="' + nav_row + '">'
		            		+ '<div class="title" role-data="' + _self.navEditor.find('input[name="url"]').val() + '">'
		            			+ '<span>' + _self.navEditor.find('input[name="title"]').val() + '</span>'
		            			+ '<i class="fa fa-pencil"></i>'
		            		+ '</div>'
		 					+ '<div class="nav-item-con">'

						  	+ '</div>'
						  	+ '<div class="center">'
							  	+ '<a class="add-item">+</a>'
						  	+ '</div>'
						+ '</div>');

					_self.initSortable();
					_self.navEditor.hide();

					nav_row++;

        		} else {
        			_self.rootView.find('.nav-row[role-data="' + _self.nowRow + '"] .title').attr('role-data', _self.navEditor.find('input[name="url"]').val());
        			_self.rootView.find('.nav-row[role-data="' + _self.nowRow + '"] span').html(_self.navEditor.find('input[name="title"]').val());
        			_self.navEditor.hide();
        		}
        	} else {

        		if(_self.navEditor.find('input[name="action"]').val() == 'insert') {

					_self.rootView.find('.nav-row[role-data="' + _self.nowRow + '"] .nav-item-con').append('<div class="portlet">'
					    + '<div class="portlet-header">' + _self.navEditor.find('input[name="title"]').val() + '</div>'
					    + '<input type="hidden" value="' + _self.navEditor.find('input[name="url"]').val() + '">'
					  	+ '</div>');

					_self.initSortable();
					_self.navEditor.hide();

        		} else {

        			_self.nowNav.find('.portlet-header').html(_self.navEditor.find('input[name="title"]').val());
        			_self.nowNav.find('input[type="hidden"]').val(_self.navEditor.find('input[name="url"]').val());
        			_self.navEditor.hide();
   //      			_self.navEditor.find('input[name="type"]').val('item');
   //      	_self.navEditor.find('input[name="action"]').val('update');

   //      	_self.navEditor.find('input[name="title"]').val($(this).find('.portlet-header').html());
			// _self.navEditor.find('input[name="url"]').val($(this).find('input').val());
			// _self.navEditor.show();



        		}



        	}
        });


        this.navDeleteAction.on('click', this, function(event){

        	var _self = (event.data) ? event.data : this;

        	if(_self.navEditor.find('input[name="type"]').val() == 'title') {

	        	if(_self.nowNavList)
	        		_self.nowNavList.remove();

	        	_self.navEditor.hide();

	        } else {
	        	
	        	if(_self.nowNav)
	        		_self.nowNav.remove();

	        	_self.navEditor.hide();
	        }

        });


        


        this.saveBtn.on('click', this, function(event){

        	var _self = (event.data) ? event.data : this;

        	var json  = {};
			json.navlist = [];

			var i = 0;
        	_self.rootView.find('.inner .nav-row').each(function() {

        		json.navlist[i] = {};
				json.navlist[i].title = $(this).find(".title span").html();
				json.navlist[i].url = $(this).find(".title").attr('role-data');
				json.navlist[i].navRows = [];

				var k = 0;

				$(this).find('.nav-item-con .portlet').each(function() {

					json.navlist[i].navRows[k] = {};
					json.navlist[i].navRows[k].title = $(this).find('.portlet-header').html();
					json.navlist[i].navRows[k].url = $(this).find('input').val();

					k++;
				});
	       
	       		i++;
	        });

        	console.log(json);
	        
        	//alert(json);


	        $.ajax({
	            type: "POST",
	            url: "admin_navbar/navbar_save",
	            data: {
	                'json': json
	            }
	        }).done(function( json_data ) {
	            if(!auth_response_pre_processer(json_data))
	                return;

	            alert( "儲存成功!" );

	        }).fail(function() {
	            alert( "發生錯誤，請檢查網路或重新載入網頁" );
	        }).always(function() {
	            
	        });
        });
    }


    NavbarHelper.prototype.initSortable = function() {
		this.rootView.find( ".nav-item-con" ).sortable({
			connectWith: ".nav-item-con",
			handle: ".portlet-header",
			cancel: ".portlet-toggle",
			start: function (event, ui) {
				ui.item.addClass('tilt');
			},
			stop: function (event, ui) {
				ui.item.removeClass('tilt');
			}
		});

		this.rootView.find('.nav-row .title .fa').unbind('click');
		this.rootView.find('.nav-row .title .fa').on('click', this, function(event){

			var _self = (event.data) ? event.data : this;

			_self.nowRow = $(this).parent().parent().attr('role-data');

			_self.navEditor.find('input[name="type"]').val('title');
        	_self.navEditor.find('input[name="action"]').val('update');
        	_self.navDeleteAction.show();

        	_self.nowNavList = $(this).parent().parent();

			_self.navEditor.find('input[name="title"]').val($(this).parent().find('span').html());
			_self.navEditor.find('input[name="url"]').val($(this).parent().attr('role-data'));

			$('.nav-editor').show();
		});



		this.rootView.find('.nav-row .add-item').unbind('click');
		this.rootView.find('.nav-row .add-item').on('click', this, function(event){

			var _self = (event.data) ? event.data : this;

			_self.navEditor.find('input[name="type"]').val('item');
        	_self.navEditor.find('input[name="action"]').val('insert');
        	_self.navDeleteAction.hide();

			_self.nowRow = $(this).parent().parent().attr('role-data');

			_self.navEditor.find('input[name="title"]').val('');
			_self.navEditor.find('input[name="url"]').val('');
			_self.navEditor.show();


			// $(this).parent().parent().find('.nav-item-con').append('<div class="portlet">'
			//     + '<div class="portlet-header"></div>'
			//     + '<input type="hidden" value="">'
			//   	+ '</div>');
		});

		this.rootView.find('.nav-row .portlet').on('click', this, function(event){

			var _self = (event.data) ? event.data : this;

			_self.navEditor.find('input[name="type"]').val('item');
        	_self.navEditor.find('input[name="action"]').val('update');
        	_self.navDeleteAction.show();

        	_self.nowNav = $(this);

        	_self.navEditor.find('input[name="title"]').val($(this).find('.portlet-header').html());
			_self.navEditor.find('input[name="url"]').val($(this).find('input').val());
			_self.navEditor.show();
		});

		
	}



    navbarHelper = new NavbarHelper();
    navbarHelper.initSortable();
  //  navbarHelper.getNavbarList(20, nowNavbarPage);

})(jQuery, this, 0);
// var nowNavbarPage = 1;


// (function ($, window, i) {

//     var NavbarHelper = function(){
//         this.rootView = $('#navbar-page');
//         this.form = $('#navbar_form');
//         this.listView = this.rootView.find('.navbar-list');
//         this.editView = this.rootView.find('.navbar-edit');
//         this.editBtn = this.rootView.find('.return');
//         this.state = this.editView.find('.state');

//         this.tableView = this.listView.find('tbody');
//         this.pagination = this.rootView.find('.pagination');

//        /* this.editView.find( ".datepicker" ).datepicker({ 
//         	dateFormat: 'yy-mm-dd'
//         });*/
//         this.editView.find( ".datepicker" ).datetimepicker({ 
//             dateFormat: 'yy-mm-dd',
//             timeFormat: "HH:mm:ss"
//         });


//         this.editBtn.on('click', this, function(event){
//             var _self = (event.data) ? event.data : this;
//             _self.editView.hide();
//             _self.listView.show();
//         });

//         this.form.on('submit', this, function(event){
//             event.preventDefault();

//             var _self = (event.data) ? event.data : this;

//             if(_self.state.val() == 'insert')
//                 _self.createNavbar();
//             else
//                 _self.updateNavbar();
//         });


//         this.editView.find('select[name="main-cate"]').on('change', this, function(event){
            
//             var _self = (event.data) ? event.data : this;
//             _self.getSubCate();

//         });

//     };

//     NavbarHelper.prototype.getSubCate = function() {
//         sub_options = '';
//         for(var i = 0; i < navbarCateJson.length; i++) {
//             if(navbarCateJson[i].category_id == this.editView.find('select[name="main-cate"]').val()) {
//                 for(var k = 0; k < navbarCateJson[i].sub_cate.length; k++) {
//                     sub_options += '<option value="' + navbarCateJson[i].sub_cate[k].category_id + '">' 
//                     + navbarCateJson[i].sub_cate[k].name + '</option>';
//                 }
//             }
//         }

//         this.editView.find('select[name="sub-cate"]').html(sub_options);
//     };

//     NavbarHelper.prototype.yyyyyy = function(event) {
//         var _self = (event.data) ? event.data : this;
//         _self.editView.hide();
//         _self.listView.show();
//     };

//     NavbarHelper.prototype.getNavbarList = function(num, start) {
//         var _self = (event.data) ? event.data : this;

//         nowNavbarPage = start;
//         startCount = (start - 1) * 20;
//         $.ajax({
//             type: "POST",
//             url: "admin_navbar/navbar_list",
//             data: {
//                 'num': num, 
//                 'start': startCount
//             }
//         }).done(function( json_data ) {
//             if(!auth_response_pre_processer(json_data))
//                 return;

//             _self.tableView.empty();
//             _self.pagination.empty();
//             _self.pagination.find('li').unbind('click');

//             if(json_data.data.count > 20)
//             {
//                 for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
//                 {
//                     if(i == start)
//                         _self.pagination.append('<li class="active"><a>' + i + '</a></li>');
//                     else
//                         _self.pagination.append('<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
//                 }

//                 _self.pagination.find('li').click(function (){
//                     if($(this).hasClass("active"))
//                         return false;
//                     _self.getNavbarList(20, $(this).attr('role-data'));
//                     return false;
//                 });
//             }


//             for(var i = 0; i < json_data.data.navbar.length; i++)
//             {   
//                 _self.tableView.append('<tr><td class="text-center">'
//                             + '<input type="checkbox" name="selected[]" value="2911"></td>'
//                             + '<td class="text-left">' + (i + 1) + '</td>'
//                             + '<td class="text-left"><img class="thumb" src="' 
//                             + json_data.data.navbar[i].navbar_img_small + '"></td>'
//                             + '<td class="text-left">' + json_data.data.navbar[i].navbar_name + '</td>'
//                             + '<td class="text-left">' + json_data.data.navbar[i].locate + '</td>'
//                             + '<td class="text-left desc">' + json_data.data.navbar[i].link + '</td>'
//                             + '<td class="text-right">'
//                             + '<button type="button" data-navbar-id="' 
//                             + json_data.data.navbar[i].navbar_id + '" class="btn btn-group delet">'
//                             + '<i class="fa fa-trash"></i></button>'
//                             + '<a title="修改問題" class="btn btn-gold update" data-navbar-id="' 
//                             + json_data.data.navbar[i].navbar_id + '">'
//                             + '<i class="fa fa-pencil"></i></a>'
//                             + '</td>'
//                             + '</tr>');
//             }

//             _self.tableView.find('.delet').unbind('click');
//             _self.tableView.find('.delet').click(function (){
//                 var r = confirm("確定要刪除這筆資料嗎 ?");
//                 if (r == true) {
//                     delete_navbar_by_id($(this).attr('data-navbar-id'));
//                 }
//             });

//             _self.tableView.find('.update').unbind('click');
//             _self.tableView.find('.update').click(function (){
//                 _self.get_navbar_by_id($(this).attr('data-navbar-id'));
//             });

//         }).fail(function() {
//             alert( "發生錯誤，請檢查網路或重新載入網頁" );
//         }).always(function() {
            
//         });
//     };


//     NavbarHelper.prototype.createNavbar = function() {
        
//         var _self = (event.data) ? event.data : this;
//         var file_data = $("#navbar-page .img-select").prop("files")[0];

//         var form_data = new FormData();
//         form_data.append("navbarfile", file_data);


//         /*navbar_id
//         navbar_name
//         locate
//         link
//         remarks
//         edit_time
//         create_time*/

//         form_data.append("navbar_name", _self.editView.find('input[name="navbar_name"]').val());
//         form_data.append("locate", _self.editView.find('select[name="locate"]').val());
//         form_data.append("link", _self.editView.find('input[name="link"]').val());
//         form_data.append("remarks", _self.editView.find('textarea[name="remarks"]').val());

//         form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
//         form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
//         form_data.append("active", _self.editView.find('select[name="active"]').val());


//         $.ajax({
//             url: "admin_navbar/navbar_insert",
//             dataType: 'json',
//             cache: false,
//             contentType: false,
//             processData: false,
//             data: form_data,
//             type: 'post'
//         }).done(function( json_data ) {
//             if(!auth_response_pre_processer(json_data))
//                 return;

//             if(json_data.result == "success")
//             {
//                 alert("建立 Navbar 成功 !");

//                 _self.getNavbarList(20, 1);
//                 _self.listView.show();
//                 _self.editView.hide();
//             } else {
//                 alert("建立 Navbar 失敗，請檢查資料都有輸入齊全 !");
//             }
//         }).fail(function() {
//             alert( "發生錯誤，請檢查網路或重新載入網頁" );
//         }).always(function() {

//         });
//     };


//     NavbarHelper.prototype.updateNavbar = function() {
       
//         var _self = (event.data) ? event.data : this;
//         var file_data = $("#navbar-page .img-select").prop("files")[0];

//         var form_data = new FormData();
//         form_data.append("navbarfile", file_data);

//         /*navbar_id
//         navbar_name
//         locate
//         link
//         remarks
//         edit_time
//         create_time*/

//         form_data.append("navbar_id", _self.editView.find('input[name="navbar_id"]').val());
//         form_data.append("navbar_name", _self.editView.find('input[name="navbar_name"]').val());
//         form_data.append("locate", _self.editView.find('select[name="locate"]').val());
//         form_data.append("link", _self.editView.find('input[name="link"]').val());
//         form_data.append("remarks", _self.editView.find('textarea[name="remarks"]').val());

//         form_data.append("start_time", _self.editView.find('input[name="start_time"]').val());
//         form_data.append("end_time", _self.editView.find('input[name="end_time"]').val());
//         form_data.append("active", _self.editView.find('select[name="active"]').val());


//         $.ajax({
//             url: "admin_navbar/navbar_update",
//             dataType: 'json',
//             cache: false,
//             contentType: false,
//             processData: false,
//             data: form_data,
//             type: 'post'
//         }).done(function( json_data ) {
//             if(!auth_response_pre_processer(json_data))
//                 return;

//             if(json_data.result == "success")
//             {
//                 alert("修改 Navbar 成功 !");
                
//                 _self.getNavbarList(20, nowNavbarPage);
//                 _self.listView.show();
//                 _self.editView.hide();
//             } else {
//                 alert("修改 Navbar 失敗，請檢查資料都有輸入齊全 !");
//             }
//         }).fail(function() {
//             alert( "發生錯誤，請檢查網路或重新載入網頁" );
//         }).always(function() {

//         });
//     };

//     NavbarHelper.prototype.get_navbar_by_id = function(id) {
//         var _self = (event.data) ? event.data : this;
//         $.ajax({
//             type: "POST",
//             url: "admin_navbar/get_navbar_by_id",
//             data: {'id': id}
//         }).done(function( json_data ) {
//             if(!auth_response_pre_processer(json_data))
//                 return;

//             if(json_data.result == "success")
//             {
//                 $('.navbar-edit .state').val('update');

//                 _self.editView.find('input[name="navbar_id"]').val(json_data.data.navbar_id);
// 		        _self.editView.find('input[name="navbar_name"]').val(json_data.data.navbar_name);
// 		        _self.editView.find('select[name="locate"]').val(json_data.data.locate);
// 		        _self.editView.find('input[name="link"]').val(json_data.data.link);
// 		        _self.editView.find('textarea[name="remarks"]').val(json_data.data.remarks);
// 		        _self.editView.find('input[name="edit_time"]').val(json_data.data.edit_time);
// 		        _self.editView.find('input[name="create_time"]').val(json_data.data.create_time);

//                 _self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
//                 _self.editView.find('input[name="end_time"]').val(json_data.data.end_time);
//                 _self.editView.find('select[name="active"]').val(json_data.data.active);

// 		        _self.editView.find('.img-cover').attr('src', json_data.data.navbar_img);


//                 $("#navbar-page .navbar-edit").show();
//                 $("#navbar-page .navbar-list").hide();

//             } else {
//                 alert("發生錯誤，請檢查網路或重新載入網頁");
//             }
//         }).fail(function() {
//             alert( "發生錯誤，請檢查網路或重新載入網頁" );
//         }).always(function() {

//         });
//     }


//     NavbarHelper.prototype.editorInit = function() {

//         this.editView.find('input[name="navbar_id"]').val('');
//         this.editView.find('input[name="navbar_name"]').val('');
//         this.editView.find('select[name="locate"]').val('homepage');
//         this.editView.find('input[name="link"]').val('');
//         this.editView.find('textarea[name="remarks"]').val('');
//         this.editView.find('input[name="edit_time"]').val('');
//         this.editView.find('input[name="create_time"]').val('');



//         this.editView.find('input[name="start_time"]').val('');
//         this.editView.find('input[name="end_time"]').val('');
//         this.editView.find('select[name="active"]').val(1);






//         this.editView.find('.img-cover').attr('src', 'https://s3-ap-northeast-1.amazonaws.com/dymainbucket/static/p/navbar_holder.jpg');

        
//         this.editView.show();
//         this.listView.hide();
//     };




//     navbarHelper = new NavbarHelper();
//   //  navbarHelper.getNavbarList(20, nowNavbarPage);

// })(jQuery, this, 0);




// function delete_navbar_by_id (id) {
//     $.ajax({
//         type: "POST",
//         url: "admin_navbar/navbar_delete",
//         data: {'id': id}
//     }).done(function( json_data ) {
//         if(!auth_response_pre_processer(json_data))
//             return;

//         if(json_data.result == "success")
//         {
//             navbarHelper.getNavbarList(20, 1);
//             alert("刪除 Navbar ·成功 !");
//         } else {
//             alert("發生錯誤，請檢查網路或重新載入網頁");
//         }
//     }).fail(function() {
//         alert( "發生錯誤，請檢查網路或重新載入網頁" );
//     }).always(function() {

//     });
// }


// $('#navbar-page .create').click(function (){

//     $('.navbar-edit .state').val('insert');
//     navbarHelper.editorInit();
    
// });







// $( "#navbar-page .img-select" ).change(function() {

//     if ($(this)[0].files && $(this)[0].files[0]) {
//         var reader = new FileReader();

//         reader.onload = function (e) {

//             if($('.navbar-edit .state').val() == 'insert')
//             {
//                 $('.navbar-edit .img-cover').attr('src', e.target.result);
//             } else {
//                 $('#navbar-page .img-preview').attr('src', e.target.result);

//                 $('#navbar-page .preview-console').show();
//             }
//         };

//         reader.readAsDataURL($(this)[0].files[0]);
//     }
// });








// $('#navbar-page .cancel-img').click(function (){
//     $('#navbar-page .img-select').val('');
//     $('#navbar-page .preview-console').hide();
// });


// $("#navbar-page .upload-img").click(function(){
//     var imgVal = $('#navbar-page .img-select').val();
//     if(imgVal=='')
//     { 
//         alert("請先選擇圖片");
//         return;
//     }

//     var file_data = $("#navbar-page .img-select").prop("files")[0];
//     var form_data = new FormData();
//     form_data.append("navbarfile", file_data)
//     form_data.append("navbar_id", $('.navbar-edit input[name="navbar_id"]').val())
//     $.ajax({
//         url: "admin_navbar/photo",
//         dataType: 'json',
//         cache: false,
//         contentType: false,
//         processData: false,
//         data: form_data,
//         type: 'post'
//     }).done(function( json ) {

//         if(json.result == 'success')
//         {
//             $("#navbar-page .navbar-edit .img-cover").attr("src", json.data.navbar_img);
//             alert('圖片上傳成功 !');
//             $('#navbar-page .img-select').val('');
//             $('#navbar-page .preview-console').hide();
//             navbarHelper.getNavbarList(20, nowNavbarPage);
//         } else {
//             alert( "發生錯誤，請檢查網路或重新載入網頁" );
//         }
//     }).fail(function( jqXHR, textStatus  ) {
//         alert( "發生錯誤，請檢查網路或重新載入網頁" );
//     });
// });



