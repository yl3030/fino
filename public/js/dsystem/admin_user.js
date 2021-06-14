var nowPageUser = 1;
var kolHelper;
var nowKolPage = 1;
var user_reg_state = 'complete';
var conuntry_city_json;


(function ($, window, i) {

    var KolHelper = function(){

        this.rootView = $('#user-page');
        this.form = $('#user_form');
        this.searchCon = this.rootView.find('.search-console');
        this.listView = this.rootView.find('.user-list');
        this.editView = this.rootView.find('.user-edit');
        this.editBtn = this.rootView.find('.return');
        this.state = this.editView.find('.state');

        this.tableView = this.listView.find('tbody');
        this.pagination = this.rootView.find('.pagination');

        var _self = this;



        this.searchCon.find('.in-sub').click(function () {
		    nowPageUser = 1;
		    _self.getKolList(20, nowPageUser);
		});

		this.searchCon.find('.search').click(function () {
		    nowPageUser = 1;
		    _self.getKolList(20, nowPageUser);
		});

        // this.editView.find( ".datepicker" ).datepicker({ 
        // 	dateFormat: 'yy-mm-dd'
        // });

        this.editBtn.on('click', this, function(event){
           // var _self = (event.data) ? event.data : this;
            _self.editView.hide();
            _self.listView.show();
        });

        this.tableBuilder = new TableBuilder(this.tableView, this.pagination, 'id',
        	['id', 'photo', 'name', 'email', 'gender'],
        	['td', 'img', 'td', 'td', 'td'], function(roleData) {

        	_self.getKolList(20, roleData);
        });

        this.tableView.on('click', '.delete', function() {
        	var r = confirm("確定要刪除這筆資料嗎 ?");
            if (r == true) {
               // _self.deleteKolById($(this).attr('data-id'));
            }
        });

        this.tableView.on('click', '.update', function() {
        	_self.getKolById($(this).attr('data-id'));
        });
    };

    KolHelper.prototype.getKolList = function(num, start) {
        var _self = this;

        nowKolPage = start;
        startCount = (start - 1) * 20;

        $.ajax({
            type: "POST",
            url: "admin_user/user_list",
            data: {
                'num': num, 
                'start': startCount,
                'keyword': _self.searchCon.find('[name="keyword"]').val(),
            }
        }).done(function( jsonData ) {
            if(!auth_response_pre_processer(jsonData))
                return;

            var kols = jsonData.data.user;

            for(var i = 0; i < kols.length; i++)
            {   
            	if(kols[i].gender != '')
                	kols[i].gender = (kols[i].gender == 'male') ? '男' : '女';
            	else
                	kols[i].gender = '未填';
            }

            _self.tableBuilder.refresh(kols, jsonData.data.count, start);

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };

    KolHelper.prototype.getKolById = function(kolId) {

        var _self = this;

        $.ajax({
	        type: "POST",
	        url: "admin_user/get_user_by_id",
	        data: {'id': kolId}
	    }).done(function( json_data ) {
	        if(!auth_response_pre_processer(json_data))
	            return;
	        
	        if(json_data.result == "success")
	        {
	            _self.init();

	            if(json_data.data.gender != '')
	                gender = (json_data.data.gender == 'male') ? '男' : '女';
	            else
	                gender = '未填';



	            // for (var i = Things.length - 1; i >= 0; i--) {
	            // 	Things[i]
	            // }

	            _self.editView.find(".user-photo").attr('src', json_data.data.photo);
	            
	            _self.editView.find("input[name='user_id']").val(json_data.data.id);
	            _self.editView.find("input[name='name']").val(json_data.data.name);
	            _self.editView.find("input[name='gender']").val(gender);
	            _self.editView.find("input[name='birthday']").val(json_data.data.birthday);


	            if(json_data.data.bodyInfo) {
		            _self.editView.find("input[name='bank_account_name']").val(json_data.data.bodyInfo.bank_account_name);
		            _self.editView.find("input[name='bank_account']").val(json_data.data.bodyInfo.bank_account);
		            _self.editView.find("input[name='bank_code']").val(json_data.data.bodyInfo.bank_code);
		            _self.editView.find("input[name='bank_branch']").val(json_data.data.bodyInfo.bank_branch);
				}








	            _self.editView.find("select[name='country_id']").val(json_data.data.country_id);
	           // set_user_city();
	            _self.editView.find("select[name='location_id']").val(json_data.data.location_id);

	            _self.editView.find("select[name='ident']").val(json_data.data.character_id);

	            if(json_data.data.character_id == '1'){
	                change_user_ident($('#user-page .user-edit select[name="ident"]').val());
	                _self.editView.find("select[name='state']").val(json_data.data.now_state);
	            }else if(json_data.data.character_id == '2'){
	                change_user_ident($('#user-page .user-edit select[name="ident"]').val());
	                _self.editView.find("select[name='state']").val(json_data.data.purpose);
	            }


	            _self.editView.find(".id_front_url").attr('src', json_data.data.bodyInfo.id_front_url);
	            _self.editView.find(".id_back_url").attr('src', json_data.data.bodyInfo.id_back_url);

	            _self.editView.find(".user-sti-vd-con input[name='user_id']").val(json_data.data.id);
	            _self.editView.find(".user-sti-vd-con input[name='name']").val(json_data.data.name);



	            _self.listView.hide();
        		_self.editView.show();


	        } else {
	            alert("發生錯誤，請檢查網路或重新載入網頁");
	        }
	    }).fail(function() {
	        alert( "發生錯誤，請檢查網路或重新載入網頁" );
	    }).always(function() {

	    });
    };

    KolHelper.prototype.init = function() {

    	this.form[0].reset();
    	this.editView.find('.user-photo').attr('src', '');

    	$("#user-page .user-edit .id_front_url").attr('src', '');
	    $("#user-page .user-edit .id_back_url").attr('src', '');
    	$("#user-page .user-edit input[name='bank_account_name']").val('');
		$("#user-page .user-edit input[name='bank_account']").val('');
		$("#user-page .user-edit input[name='bank_code']").val('');
		$("#user-page .user-edit input[name='bank_branch']").val('');
	   // $("#user-page .user-edit .user-photo").attr('src', '');
	};

    kolHelper = new KolHelper();
    kolHelper.getKolList(20, nowKolPage);

})(jQuery, this, 0);


