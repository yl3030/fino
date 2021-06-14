var nowSeoPage = 1;


(function ($, window, i) {

    var SeoHelper = function(){
        this.rootView = $('#seo-page');
        this.pageList = this.rootView.find('.seo-page-list');

        this.pageList.find(".panel .save").on('click', this, function(event){
            var _self = (event.data) ? event.data : this;

            var $panelView = _self.pageList.find('.panel[role-data-contain="' + $(this).attr('role-data') + '"]');

            _self.saveSeoData($(this).attr('role-data'), $panelView.find('input[name="title"]').val(), 
            	$panelView.find('textarea[name="description"]').val(), $panelView.find('input[name="keywords"]').val(),
            	$panelView.find('input[name="image"]').val());
        });
    };

    SeoHelper.prototype.saveSeoData = function(page_name, title, desc, keywords, image) {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_seo/seo_save",
            data: {
            	'page_name': page_name,
                'title': title,
                'description': desc,
                'keywords': keywords,
                'image': image
            }
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("儲存成功 !");
            } else {
                alert("儲存失敗，請檢查資料都有輸入齊全 !");
            }

        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {
            
        });
    };



    SeoHelper.prototype.updateSeo = function() {
        var _self = (event.data) ? event.data : this;
        var tags = '';
        for (var i = 0; i < seo_tag_arr.length; i++) {
            if(i > 0)
                tags += ',';
            tags += seo_tag_arr[i];
        }

        $.ajax({
            type: "POST",
            url: "admin_seo/seo_update",
            data: { 
                id: $('.seo-edit .seo_id').val(),
                title: $('.seo-edit .seo_title').val(),
                excerpt: $('.seo-edit .seo_excerpt').val(),
                category_id: _self.editView.find('select[name="sub-cate"]').val(),
                seo_content: CKEDITOR.instances.seo_content.getData(),
                address: _self.editView.find('input[name="address"]').val(),
                start_time: _self.editView.find('input[name="start_time"]').val(),
                end_time: _self.editView.find('input[name="end_time"]').val(),
                tags: tags
            }

        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                alert("修改活動成功 !");
                
                _self.getSeoList(20, nowSeoPage);
                _self.listView.show();
                _self.editView.hide();
            } else {
                alert("修改活動失敗，請檢查資料都有輸入齊全 !");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    };


    

    SeoHelper.prototype.get_seo_by_id = function(id) {
        var _self = (event.data) ? event.data : this;
        $.ajax({
            type: "POST",
            url: "admin_seo/get_seo_by_id",
            data: {'id': id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                $('.seo-edit .state').val('update');
                $('.seo-edit .seo_id').val(json_data.data.seo_id);

                $("#seo-page .inner-panel .seo_title").val(json_data.data.title);
                $("#seo-page .inner-panel .seo_excerpt").val(json_data.data.excerpt);

				_self.editView.find('input[name="address"]').val(json_data.data.address);
                _self.editView.find('input[name="start_time"]').val(json_data.data.start_time);
                _self.editView.find('input[name="end_time"]').val(json_data.data.end_time);


                _self.editView.find('select[name="main-cate"]').val(json_data.data.parent_id);
               // _self.getSubCate();
                _self.editView.find('select[name="sub-cate"]').val(json_data.data.category_id);


                seo_tag_arr = [];
                for (var i = 0; i < json_data.data.tags.length; i++) {
                    seo_tag_arr[i] = json_data.data.tags[i].name;
                }

                show_seo_tag();

                $("#seo-page .img-cover").attr('src', json_data.data.cover_photo);

                CKEDITOR.instances.seo_content.setData(json_data.data.content);

                $("#seo-page .inner-panel .edit_time").val(json_data.data.last_edit_time);
                $("#seo-page .inner-panel .create_time").val(json_data.data.create_time);

                $("#seo-page .seo-edit").show();
                $("#seo-page .seo-list").hide();

            } else {
                alert("發生錯誤，請檢查網路或重新載入網頁");
            }
        }).fail(function() {
            alert( "發生錯誤，請檢查網路或重新載入網頁" );
        }).always(function() {

        });
    }


    /*SeoHelper.prototype.editorInit = function() {

        this.editView.find('.seo_title').val('');
        this.editView.find('.seo_excerpt').val('');
        this.editView.find('input[name="address"]').val('');
        this.editView.find('input[name="start_time"]').val('');
        this.editView.find('input[name="end_time"]').val('');
        this.editView.find('.seo_id').val('');

        seo_tag_arr = [];
        this.editView.find(".tag-list").html('');

        this.editView.find('.edit_time').val('');
        this.editView.find('.create_time').val('');
        this.editView.find('select[name="main-cate"]').val('');
        this.editView.find('select[name="sub-cate"]').val('');
        this.editView.find('.img-cover').attr('src', 'http://pettalk.tw/public/img/store_holder.jpg');

        CKEDITOR.instances.seo_content.setData('');

        
        this.editView.show();
        this.listView.hide();
    };
*/



    seoHelper = new SeoHelper();

})(jQuery, this, 0);

