var kolFormHelper;
var kolFormPage = 1;

(function ($, window, i) {

    var KolFormHelper = function(){
        this.rootView = $('#kolform-page');
        this.form = $('#kolform_form');

        this.listView = this.rootView.find('.list-panel');
        this.editView = this.rootView.find('.edit-panel');

        // this.crtBtn = this.rootView.find('.create');
        this.returnBtn = this.rootView.find('.return');


        this.state = this.editView.find('[name="state"]');

        this.searchCon = this.rootView.find('.search-console');
        this.searchInput = this.searchCon.find('[name="keyword"]');
        this.searchBtn = this.searchCon.find('.search');
        this.clearBtn = this.searchCon.find('.clear');
        

        this.tableView = this.listView.find('tbody');
        this.pagination = this.listView.find('.pagination');

        this.URL = "admin_kolform/";

       // this.searchBtn = this.rootView.find('.search-console .search');
       //	this.rootView.find(".datepicker").datepicker({ dateFormat: 'yy-mm-dd' });


        var _self = this;

        this.searchBtn.click(function (){
        	_self.getList(20, 1);
		});

        this.clearBtn.click(function (){
        	_self.searchInput.val('');
        	_self.getList(20, 1);
		});


  //       this.crtBtn.click(function (){

		//     _self.state.val('insert');
		//     //_self.editView.find('h1').html('建立');

		//     _self.editorInit();
		//     _self.editView.show();
		//     _self.listView.hide();
		// });

        this.returnBtn.on('click', this, function(event){
            _self.editView.hide();
            _self.listView.show();
        });




        this.tableBuilder = new TableBuilder(this.tableView, this.pagination, 'form_id',
        	['form_id', 'nickname', 'email', 'line_id', 'phone'],
        	['td', 'td', 'td', 'td', 'td'], function(data) {

        	_self.getList(20, data);
        });

        //this.tableBuilder.isImgIpv = true;



        this.form.on('submit', this, function(event){
            event.preventDefault();

            if(_self.state.val() == 'insert')
                _self.createImgIpv();
            else
                _self.editImgIpv();
        });



        
        this.tableView.on('click', '.delete', function (){
            var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
                _self.delete($(this).attr('data-id'));
            }
        });

        this.tableView.on('click', '.update', function (){
            _self.get($(this).attr('data-id'));
        });
    };

    KolFormHelper.prototype.getList = function(num, start) {

    	var _self = this;
    	kolFormPage = start;
        startCount = (start - 1) * 20;

        var formData = new FormData();

        formData.append("num", num);
        formData.append("start", startCount);
        formData.append("keywords", _self.searchInput.val());
      
        postReq(_self.URL + "lists", formData, function(json){
        	
            var items = json.data.list;

            for(var i = 0; i < items.length; i++)
            {   
                // if(items[i].cover == '')
                //     items[i].cover = 'https://pettalk.s3-ap-northeast-1.amazonaws.com/p/img_pool/eQygB=MTZdySbpz_square_img.jpg';

                // if(shops[i].status == 1)
                // 	shops[i].status = '上架中';
                // else
                // 	shops[i].status = '已下架';
            }

            _self.tableBuilder.refresh(items, json.data.count);

        }, function(json){
        	alert( "發生錯誤，請檢查網路或重新載入網頁" );
        });
    };

    KolFormHelper.prototype.create = function() {
        
        var _self = this;
        var formData = _self.getFormData();

       // showCVLoading();

        postReq(_self.URL + "insert", formData, function(json){

        	alert("建立商店成功 !");
            _self.getList(20, 1);
            _self.listView.show();
            _self.editView.hide();

        }, function(json){
        	if(json.msg == "cus_msg")
        		alert(json.msg_content);
        	else
				alert("建立商店失敗，請檢查資料都有輸入齊全 !");
        });
    };

    KolFormHelper.prototype.edit = function() {

        var _self = this;
		var formData = _self.getFormData();

		//showCVLoading();

		postReq(_self.URL + "edit", formData, function(json){

			alert('修改商店成功 !');
            _self.getList(20, kolFormPage);
            _self.listView.show();
           	_self.editView.hide();

        }, function(json){
        	if(json.msg == "cus_msg")
        		alert(json.msg_content);
        	else
				alert("修改商店失敗，請檢查資料都有輸入齊全 !");
        });
    };

    KolFormHelper.prototype.getFormData = function() {

		var formData = new FormData(this.form[0]);

		//var fileData = imgHelper.uploadInput.prop("files")[0];

		if(fileData)
    		formData.append("shopfile", fileData);


		if(!formData.get('name')){
			alert('請輸入名稱');
			return;
		}

		if(!formData.get('website')){
			alert('請輸入網站');
			return;
		}

		if(!formData.get('area') || !formData.get('location')){ //
			alert('請選擇地址');
			return;
		}

		// if(!formData.get('level1_city')){
		// 	alert('請選擇地址');
		// 	return;
		// }

        return formData;
    }

    KolFormHelper.prototype.get = function(id) {

        var _self = this;
        _self.editorInit();

        var formData = new FormData();
		formData.append("id", id);
        
		postReq(_self.URL + "get", formData, function(json){

			var form = json.data;

            _self.state.val('update');
            _self.editView.find('[name="form_id"]').val(form.form_id);
            _self.editView.find('[name="username"]').val(form.username);
            _self.editView.find('[name="company"]').val(form.company);
            _self.editView.find('[name="email"]').val(form.email);
            _self.editView.find('[name="phone"]').val(form.phone);

            _self.editView.show();
            _self.listView.hide();

        }, function(json){
        	alert("發生錯誤，請檢查網路或重新載入網頁");
        });
    }

    KolFormHelper.prototype.delete = function(id) {

	    var _self = this;

	    var formData = new FormData();
		formData.append("id", id);
		
        postReq(_self.URL + "delete", formData, function(json_data){

        	_self.getList(20, 1);
			alert("刪除商店成功 !");

        }, function(){
        	alert("發生錯誤，請檢查網路或重新載入網頁");
        });
	}

    KolFormHelper.prototype.editorInit = function() {
        this.form[0].reset();
    };

    kolFormHelper = new KolFormHelper();
    kolFormHelper.getList(20, kolFormPage);

})(jQuery, this, 0);



// var imgHelper = new UploaderHelper($('#kolform-page .photo-con'));
// //imgHelper.fileName = 'shopfile';
// //imgHelper.idName = 'shop_id';
// //imgHelper.action = $('#shop_form [name="state"]');
// //imgHelper.updateId = $('#shop-page input[name="shop_id"]');
// //imgHelper.uploadUrl = 'admin/admin_image_improve/photo';
// imgHelper.succCallback = function(json) {
// 	imgHelper.imgCover.attr('src', json.data.cover);
// 	imgHelper.getList(20, nowPageImgIpv);
// };









