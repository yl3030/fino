var postHelper;
var postCateJson;
var ProductHelper;
var activityHelper;
var netstarHelper;
var storeHelper;
var shippingHelper;
var bannerHelper;
var navbarHelper;
var couponHelper;
var edmHelper;
var hpBlkHelper;
var jpLocationData;




var imgBrowserCallback;






$('#button-menu').on('click', function() {
    if ($('#side-menu').hasClass('active')) {
        //localStorage.setItem('column-left', '');

        $('#button-menu i').replaceWith('<i class="fa fa-indent fa-lg"></i>');

        $('#side-menu').removeClass('active');

        $('#menu > li > ul').removeClass('in collapse');
        $('#menu > li > ul').removeAttr('style');
    } else {
        //localStorage.setItem('column-left', 'active');

        $('#button-menu i').replaceWith('<i class="fa fa-dedent fa-lg"></i>');
        
        $('#side-menu').addClass('active');

        // Add the slide down to open menu items
        $('#menu li.open').has('ul').children('ul').addClass('collapse in');
        $('#menu li').not('.open').has('ul').children('ul').addClass('collapse');
    }
});

$(document).ready(function() {
    if (localStorage.getItem('side-menu') == 'active') {
        $('#button-menu i').replaceWith('<i class="fa fa-dedent fa-lg"></i>');
        
        $('#side-menu').addClass('active');
        
        // Slide Down Menu
        $('#menu li.active').has('ul').children('ul').addClass('collapse in');
        $('#menu li').not('.active').has('ul').children('ul').addClass('collapse');
    } else {
        $('#button-menu i').replaceWith('<i class="fa fa-indent fa-lg"></i>');
        
        $('#menu li li.active').has('ul').children('ul').addClass('collapse in');
        $('#menu li li').not('.active').has('ul').children('ul').addClass('collapse');
    }
});



$(".menu-list-parent").on('click', function() {

});




$('#menu').find('li').has('ul').children('a').on('click', function() {
    if ($('#side-menu').hasClass('active')) {
        $(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
        $(this).parent('li').siblings().removeClass('open').children('ul.in').collapse('hide');
    } else if (!$(this).parent().parent().is('#menu')) {
        $(this).parent('li').toggleClass('open').children('ul').collapse('toggle');
        $(this).parent('li').siblings().removeClass('open').children('ul.in').collapse('hide');
    }
});











	var webPagePrefix = [
		"user", "netstar", "account", "school",
		"info-data-setting", "news", "webpage-job", "seo", "project",
		"homepage-slider", "webpage-q-and-q", "webpage-about-us",
		"post", "activity", "store", "shipping", "banner", "navbar", "coupon", "edm", "promotionall", "promotionevt", "hp-blk", "post-cate", "product", "product-cate", "order",
		"upfile", "parttime", "support", "busform", "kolform",
		"webform"
	];


	function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

$( document ).ready(function() {

    $('#index-control-panel').click(function (){
        changePage('index', 'admin_view_loader',
            base_url + 'public/js/home.js', true);
    });


    for (var i = 0; i < webPagePrefix.length; i++) {
    	$('#' + webPagePrefix[i] + '-control-panel').click(function (){

    		var page = $(this).attr('id').replace("-control-panel", "");
    		var panel = replaceAll(page, "-", "_");

            changePage(page, 'admin_view_loader/' + panel + '_panel',
                base_url + 'public/js/dsystem/admin_' + panel + '.js', true);
        });
    }
 

    $('#media-control-panel').click(function(){
        openImageBrowser();
    });
});

window.onpopstate = function(event) {

    if(event.state == null || event.state == 'index')
    {
        changePage('index', 'admin_view_loader', base_url + 'public/js/home.js', false);
    } else {

    	for (var i = 0; i < webPagePrefix.length; i++) {
    		if(event.state == webPagePrefix[i]) {
    			var panel = replaceAll(webPagePrefix[i], "-", "_");
        		changePage(webPagePrefix[i], 'admin_view_loader/' + panel 
        			+ '_panel', base_url + 'public/js/dsystem/admin_' + panel + '.js', false);
        		break;
        	}
    	}
    }
};

function changePage(option, url, jsUrl, pushHistory)
{
    $('#menu li').removeClass('active');
    $("#menu li[id='" + option + "-control-panel']").addClass('active');

    if($('#' + option + '-page').length) {
        if(index != option)
        {
            processPageTansfer(index, option);
        } else {
            processPageTansfer(index, option);
            return;
        }
    } else {
        $.ajax({
            method: "POST",
            url: url
        }).done(function( msg ) {
           // alert( "Data Saved: " + msg );
            if(!($('#' + option + '-page').length)) {
                $('#content').append(msg);
                fadePanel(index, option);
                $.getScript( jsUrl, function( data, textStatus, jqxhr ) {
    
                });
            }
        });
    }
    if(pushHistory)
        history.pushState(option, option, '?page=' + option);
}



var index = 'index';

function fadePanel(preIndex, nowIndex)
{
    $('#' + preIndex + "-page").hide();
    $('#' + nowIndex + "-page").show();
    index = nowIndex;
}

function processPageTansfer(index, option)
{
    fadePanel(index, option);
    if(option == 'user')
    {
        nowPageUser = 1;
        get_user_list(20, nowPageUser);
    } else if(option == 'netstar') {
        nowPageNetstar = 1;
        get_Netstar_list(20, nowPageNetstar);
    } else if(option == 'school') {
        nowSchoolPage = 1;
        get_school_list(20, nowSchoolPage);
    } else if(option == 'info-data-setting') {
        //get_data_info_setting();
    } else if(option == 'webpage-job') {
        nowWebpageJobPage = 1;
        //get_school_list(20, nowSchoolPage);
    } else if(option == 'webpage-q-and-a') {
        nowWebpageQandAPage = 1;
        //get_school_list(20, nowSchoolPage);
    } else if(option == 'webpage-about-us') {
        //nowWebpageQandAPage = 1;
        //get_school_list(20, nowSchoolPage);
    } else if(option == 'news') {
        nowNewsPage = 1;
        get_news_list(20, nowNewsPage);
    } else if(option == 'post') {
        nowPostPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'activity') {
        nowActivityPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'store') {
        nowStorePage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'shipping') {
        nowShippingPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'banner') {
        nowBannerPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'navbar') {
        //nowNavbarPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'coupon') {
        nowCouponPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'edm') {
        nowEdmPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'hp-blk') {
        nowHpBlkPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'post-cate') {
        nowPostTagPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'product') {
        //nowPostPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'order') {
        //nowPostPage = 1;
        //get_post_list(20, nowPostPage);
    } else if(option == 'upfile') {
        nowUpfilePage = 1;
        get_upfile_list(20, nowUpfilePage);
    } else if(option == 'parttime') {
        nowParttimePage = 1;
        get_parttime_list(20, nowParttimePage);
    } else if(option == 'webform') {
        nowSchformPage = 1;
        get_webform_list(20, nowSchformPage);
    }
}
//school-dt-pop
$('.close-btn').click(function (){
     $("#" + $(this).attr('role-btn')).fadeOut(); 
});







function auth_response_pre_processer(json_data)
{
    if(json_data.result != undefined) {
        var obj = json_data;
    } else {
        try{
            var obj = JSON.parse(json_data);
        }catch(e){
            alert( "???????????????????????????????????????????????????" );
            return false;
        }
    }

    if(obj.result == "success")
        return true;

    if(obj.result == "failed")
    {
        if(obj.code == 401)
        {
            alert("??????????????????????????????!");
            window.top.location = "<?php echo base_url(); ?>admin/dsystem";
            return false;
        }else  if(obj.code == 402)
        {
            alert("??????????????????????????????!");
            window.top.location = "<?php echo base_url(); ?>admin/dsystem";
            return false;
        }
    }

    return true;
}









$(document).on('click', '.input-group .input-group-addon', function(){
    num = parseInt($(this).siblings( ".bfh-number" ).val());

    if(isNaN(num))
        num = $(this).siblings( ".bfh-number" ).attr("old-value");
    else
        num++;

    $(this).siblings( ".bfh-number" ).val(num);
});

$(document).on('click', '.input-group .input-group-down', function(){
    num = parseInt($(this).siblings( ".bfh-number" ).val());

    if(isNaN(num))
        num = $(this).siblings( ".bfh-number" ).attr("old-value");
    else
        num--;

    $(this).siblings( ".bfh-number" ).val(num);
});


























function spinnerInit($spi_con){
    $spi_con.find('.spi-muti-ck input[type="checkbox"]').change(function(){

        $list = $(this).parent().parent().parent().parent();

        str_data = '';
        $list.find('li input[type="checkbox"]').each(function() {
            if ($(this).is(':checked')) {
                if(str_data == '')
                    str_data += $(this).val();
                else
                    str_data += ', ' + $(this).val();
            }
        });

        if($list.parent().attr('data-type') == 's-o')
            if(str_data == '')
                str_data = '??????';
        $list.parent().find('.spi-muti-ck-input').html(str_data);
    });

    $spi_con.find('.spi-muti-ck').click(function(e){
        event.stopPropagation();
    });

    $spi_con.find('.spi-muti-ck-input').click(function(e){

        $ul = $(this).siblings('.spi-muti-ck');

        if(!$ul.hasClass('active')){
            $('.spi-muti-ck').removeClass('active')
            $ul.addClass('active');
        }else
            $('.spi-muti-ck').removeClass('active')

        event.stopPropagation();
    });
}

function get_spinner_value($spinner_con)
{
    value = '';
    $spinner_con.find('.spi-muti-ck li input').each(function(){
        if($(this).is(':checked')){
            if(value == '')
                value += $(this).attr('data-id');
            else
            value += ',' + $(this).attr('data-id');
        }
    });
    return value;
}

function set_spinner_value($spinner_con, arr)
{
    $spinner_con.find('.spi-muti-ck li input').each(function(){
        if(arr.indexOf($(this).attr('data-id')) != -1)
            $(this).prop("checked", true);
        else
            $(this).prop("checked", false);
    });
}

function showSelectedOption($spi_con){
    str_data = '';
    $spi_con.find('li input[type="checkbox"]').each(function() {
        if ($(this).is(':checked')) {
            if(str_data == '')
                str_data += $(this).val();
            else
                str_data += ', ' + $(this).val();
        }
    });

    if($spi_con.attr('data-type') == 's-o')
        if(str_data == '')
            str_data = '??????';
    $spi_con.find('.spi-muti-ck-input').html(str_data);
}







var droppedFiles = false;
var $uploader_block = $('#media-dt-pop .uploader-inline');
/*var showFiles = function(files) {
            $label.text(files.length > 1 ? ($input.attr('data-multiple-caption') || '')
                .replace( '{count}', files.length ) : files[ 0 ].name);
        };*/


$uploader_block.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {

    e.preventDefault();
    e.stopPropagation();

}).on('dragover dragenter', function() {
    $uploader_block .addClass('is-dragover');
}).on('dragleave dragend drop', function() {
    $uploader_block .removeClass('is-dragover');
}).on('drop', function(e) {

    droppedFiles = e.originalEvent.dataTransfer.files;
    upload_imgs_to_pool(droppedFiles);

});


function readPoolURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        droppedFiles = input.files;
        upload_imgs_to_pool(droppedFiles);
    }
}


function upload_imgs_to_pool(files)
{
    if (!files) {
        alert("????????????????????????!!");
        return;
    }

   // var file_data = $("#post-page .img-select").prop("files")[0];
    var form_data = new FormData();

    $.each( files, function(i, file) {
        form_data.append('postfile[]', file );
       // alert('ddd');
    });
    
    $.ajax({
        url: "admin_photo_pool/photo_pool",
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         // Setting the data attribute of ajax with file_data
        type: 'post'
    }).done(function( json ) {

       // alert(json);

        if(json.result == 'success')
        {
            for(var i = 0; i < json.data.length; i++)
            {
                photo_pool_hash[json.data[i].id] = json.data[i];

                $('#media-dt-pop .media-box').prepend('<li data-id="'
                        + json.data[i].id + '"><div class="img-hold">'
                        + '<div class="img-pre" style="background-image: url('
                        + json.data[i].img_url + ')">'
                        + '<div class="act"><div>'
                        + '<button type="button" class="btn btn-gold detail" data-id="'
                        + json.data[i].id +'">????????????</button>'
                        + '<button type="button" class="btn btn-gold copy" data-url="'
                        + json.data[i].img_url + '">????????????</button>'
                        + '</div></div></div></div></li>');
            }

            photo_pool_action();

        } else {
            alert( "???????????????????????????????????????????????????" );
        }
    }).fail(function( jqXHR, textStatus  ) {
        alert( "???????????????????????????????????????????????????ccccc" );
    });
}

var photo_pool_count = 1;
var is_photo_pool_loading = false;
var photo_pool_hash = new Object();
var now_photo_pool_id = 0;

function get_photo_pool_list(num, start)
{
    //media-box
    is_photo_pool_loading = true;

    photo_pool_count = start;
    startCount = (start - 1) * 20;

    $.ajax({
        type: "POST",
        url: "admin_photo_pool/photo_pool_list",
        data: {'num': num, 'start': startCount}
    }).done(function( json_data ) {
        if(!auth_response_pre_processer(json_data))
            return;

        if(json_data.result == "success")
        {
            for(var i = 0; i < json_data.data.length; i++)
            {
                photo_pool_hash[json_data.data[i].id] = json_data.data[i];

                $('#media-dt-pop .media-box').append('<li data-id="'
                        + json_data.data[i].id + '"><div class="img-hold">'
                        + '<div class="img-pre" style="background-image: url('
                        + json_data.data[i].thumbnail + ')">'
                        + '<div class="act"><div>'
                        + '<button type="button" class="btn btn-gold detail" data-id="'
                        + json_data.data[i].id +'">????????????</button>'
                        + '<button type="button" class="btn btn-gold copy" data-url="'
                        + json_data.data[i].img_url + '">????????????</button>'
                        + '</div></div></div></div></li>');
            }

            photo_pool_action();

            photo_pool_count++;
            if(json_data.data.length > 0)
                is_photo_pool_loading = false;
            else
                is_photo_pool_loading = true;

        } else {
            alert("???????????????????????????????????????????????????");
        }
    }).fail(function() {
        alert( "???????????????????????????????????????????????????" );
        is_photo_pool_loading = false;
    }).always(function() {
    });
}

function openImageBrowser()
{
	imgBrowserCallback = null;

	$('#media-dt-pop').fadeIn();

    $('#media-dt-pop .media-box').html('');
    is_photo_pool_loading = false;
    photo_pool_count = 1;
    photo_pool_hash = new Object();
    get_photo_pool_list(20, photo_pool_count);
}

function photo_pool_action()
{
    $('#media-dt-pop .media-box .copy').unbind('click');
    $('#media-dt-pop .media-box .copy').click(function (){

    	if(imgBrowserCallback) {
    		imgBrowserCallback($(this).attr('data-url'));
    		$('#media-dt-pop').fadeOut();
    	}else{
        	getSelectedCheckboxes($(this).attr('data-url'));
    	}
    });

    $('#media-dt-pop .media-box .detail').unbind('click');
    $('#media-dt-pop .media-box .detail').click(function (){

        now_photo_pool_id = $(this).attr('data-id');

        $('#media-dt-pop #img-detail-dt-pop .img-pre')
            .attr("src", photo_pool_hash[$(this).attr('data-id')].img_url);
        
        $('#media-dt-pop #img-detail-dt-pop .p-url').html(photo_pool_hash[$(this).attr('data-id')].img_url);

        $('#media-dt-pop #img-detail-dt-pop .p-upload-time').html(photo_pool_hash[$(this).attr('data-id')].add_time);
            
       // alert(photo_pool_hash[$(this).attr('data-id')].id);
        $('#media-dt-pop #img-detail-dt-pop').fadeIn();
    });
}

$('#media-dt-pop .media-data-panel .login-panel').scroll(function(){
    if(!is_photo_pool_loading)
    {
        if(($(this).scrollTop() + $(this).height() + 200) >= $('#media-dt-pop .media-data-panel .media-con').height())
        {
            console.log(photo_pool_count + '');
            get_photo_pool_list(20, photo_pool_count);
            //alert("bottom!");
        }
    }
});

$('#media-dt-pop #img-detail-dt-pop .action .copy').click(function(){
    getSelectedCheckboxes(photo_pool_hash[now_photo_pool_id].img_url);
});

$('#media-dt-pop #img-detail-dt-pop .action .delete').click(function(){




    //alert('delete: ' + photo_pool_hash[now_photo_pool_id].id);



    var r = confirm("?????????????????????????????? ?");
    if (r == true) {
        $.ajax({
            type: "POST",
            url: "admin_photo_pool/delete_photo",
            data: {'photo_id': photo_pool_hash[now_photo_pool_id].id}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
               // alert('??????????????????!!');
                $('#img-detail-dt-pop').fadeOut();
                $("#media-dt-pop .media-box li[data-id='" 
                    + photo_pool_hash[now_photo_pool_id].id + "']").remove();

            } else {
                alert("???????????????????????????????????????????????????");
            }
        }).fail(function() {
            alert( "???????????????????????????????????????????????????" );
            is_photo_pool_loading = false;
        }).always(function() {

        });
    }

});



function getSelectedCheckboxes(str) {
    var inp = document.createElement("input");
    document.body.appendChild(inp);
    inp.setAttribute("id", "photo_url_copy");
    document.getElementById("photo_url_copy").value = str;
    inp.select();
    document.execCommand("copy");
    document.body.removeChild(inp);
}









$('#media-dt-pop').click(function() {
    $(this).fadeOut();
});

$('#media-dt-pop .media-data-panel').click(function(event) {
    event.stopPropagation();
});

$('#media-dt-pop #img-detail-dt-pop').click(function(event) {
    event.stopPropagation();
});










if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
    CKEDITOR.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
CKEDITOR.config.height = 450;
CKEDITOR.config.width = 'auto';
CKEDITOR.config.extraAllowedContent = 'iframe[*]';
// CKEDITOR.instances.post_content.filter.check( 'iframe' );



function initCkeditor($id)
{
    var editorElement = CKEDITOR.document.getById($id);
        CKEDITOR.replace($id, {
		height: 300,
		// Configure your file manager integration. This example uses CKFinder 3 for PHP.
		filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
		filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
		// filebrowserUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
		// filebrowserImageUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images'
	});
}


$(window).click(function() {
    if($('.spi-muti-ck').hasClass('active'))
        $('.spi-muti-ck').removeClass('active');
});






window.HeaderAlert = function() {
    var obj = this,
        header_alert_view = $('.navbar-header + .nav .dropdown > a > .pull-right'),
        scf_alert = $('.navbar-header + .nav .dropdown > .dropdown-menu li:nth-child(1) .label'),
        bcf_alert = $('.navbar-header + .nav .dropdown > .dropdown-menu li:nth-child(2) .label'),
        g = {},
        e = {
            appId: null,
            loginOfStatus: function(a) {},
            loginOfSignIn: function() {}
        },
        g = {},
        p = [];
    obj.updateHeaderCnt = function(scf_c, bcf_c) {
        header_alert_view.html((scf_c + bcf_c));
        scf_alert.html(scf_c);
        bcf_alert.html(bcf_c);
    };
    (function() {
        
    })()
};



$(function() {
    //var aaaaaa = {};
    window.headerAlert = new window.HeaderAlert();
   // window.aaaaaa = aaaaaa;

    //window.headerAlert.updateHeaderCnt(7, 9);
});












$(function () {
   // $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });

    $('#add-folder').popover({
        html: true,
        title: '???????????????',
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',

        content: '<div class="input-group"><input type="text" name="folder" value="" placeholder="???????????????" class="form-control">  <span class="input-group-btn"><button type="button" title="????????????" id="create-folder" class="btn btn-primary"><i class="fa fa-plus-circle"></i></button></span></div>',
       // template: popoverTemplate,
        placement: "bottom",
        html: true
    }); 

    $(document).on('click', '#create-folder', function(event){
            //event.preventDefault();
            //folder

            if($('#product-img-dt-pop input[name="folder"]').val() == '')
                alert('????????????????????????');
            else {
                productImageHelper.addFolder();
            }
    });

    $(document).on('click', function (e) {
        $('[data-toggle="popover"],[data-original-title]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            $(this).tooltip('hide');

            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {                
                (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
            }

        });
    });
});




var productImageHelper;

(function ($, window, i) {

    var ProductImageBox = function(){
        this.rootView = $('#product-img-dt-pop');
        this.imageBox = this.rootView.find('.media-box');
        this.imgInput = this.rootView.find('.img-select');
        this.pagination = this.rootView.find('.pagination');

        this.nowFolderId = 0;
        this.parentFolderId = 0;
        this.page = 1;
        this.imageNum = 0;
        this.targetImageId = '';
        this.contentList;


        this.imgInput.on('change', this, function(event){

            var _self = (event.data) ? event.data : this;

            if (this.files && this.files[0]) {
                var reader = new FileReader();

                droppedFiles = this.files;
               
                _self.uploadImage(droppedFiles);
            }
        });

        $('#button-parent').on('click', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;

            if(_self.nowFolderId == 0)
                return;

            _self.nowFolderId = _self.parentFolderId;
            _self.getImageList();
        });

        $('#button-refresh').on('click', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;
            _self.getImageList();
        });


        $('#pro-igp-delete').on('click', this, function(event){
            event.preventDefault();

            var _self = (event.data) ? event.data : this;



            /*alert(getFilename('https://ecdemo.s3.amazonaws.com/p/productimg/0sz5ee_thumbnail_banner.jpg'));

            return;*/

            var images = [];

            _self.imageBox.find('li input[name="chk_image_id"]:checked').each(function(i, file) {
               	images.push($(this).val());
            });
           
            if(images.length == 0){
            	alert('???????????????????????????!');
            	return;
            }

            var r = confirm("??????????????????????????????????????????");
			if (r == true)
			    _self.deleteImage(images);
        });
        
    };

    ProductImageBox.prototype.getImageList = function() {
        var _self = (event.data) ? event.data : this;

        $.ajax({
            type: "POST",
            url: "admin_product/get_porduct_media_content",
            data: {'folder_id': _self.nowFolderId, 'page': _self.page}
        }).done(function( json_data ) {
            if(!auth_response_pre_processer(json_data))
                return;

            if(json_data.result == "success")
            {
                _self.imageBox.html('');








                _self.pagination.empty();
		        _self.pagination.find('li').unbind('click');

		        if(json_data.data.count > 20)
		        {
		            for(var i = 1; i <= Math.ceil(json_data.data.count / 20); i++)
		            {
		                if(i == _self.page)
		                {
		                    _self.pagination.append(
		                        '<li class="active"><a>' + i + '</a></li>');
		                } else {
		                    _self.pagination.append(
		                        '<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
		                }
		            }
		            _self.pagination.find('li').click(function (){
		                if($(this).hasClass("active"))
		                    return false;

		                _self.page = $(this).attr('role-data');
		                _self.getImageList();
		                
		                return false;
		            });
		        }











                _self.parentFolderId = json_data.data.parent_id;
                _self.contentList = json_data.data.content;

                for(var i = 0; i < json_data.data.content.length; i++)
                {
                    if(json_data.data.content[i].type == 'folder') {
                        _self.imageBox.append('<li data-id="'
                            + json_data.data.content[i].id + '"><div class="">'
                            + '<a href="folder:' + json_data.data.content[i].id + '" style="background-image: url('
                            + json_data.data.content[i].thumbnail + ')">'
                            + '<i class="fa fa-folder fa-5x"></i>'
                            + '</a></div>'
                            + '<label><input type="checkbox" name="path[]" value="catalog/Banner ">'
                            + json_data.data.content[i].data + '</label>'
                            + '</li>');
                    } else {
                    	var file_name = getFilename(json_data.data.content[i].data);
                    	file_name = file_name.substring(17, file_name.length + 1);

                        _self.imageBox.append('<li data-id="'
                            + json_data.data.content[i].id + '"><div class="img-hold">'
                            + '<a href="img:' + json_data.data.content[i].id + '" class="img-pre">'
                            + '<img src="' + json_data.data.content[i].data + '">' //+ '<div class="act"><div>'
                            + '</a></div>'

                            + '<label><input type="checkbox" name="chk_image_id" value="'
                            + json_data.data.content[i].id + '">'
                            + file_name + '</label></li>');
                    }
                }


                _self.imageBox.find('li > div > a').unbind('click');
                _self.imageBox.find('li > div > a').on('click', this, function(event){
                    event.preventDefault();
                    
                    var action = $(this).attr('href');
                    if(action.startsWith("folder")) {
                        _self.nowFolderId = action.replace("folder:", "");
                        _self.getImageList();
                    } else if(action.startsWith("img")) {


                        var imageId = action.replace("img:", "");

                        for(var i = 0; i < _self.contentList.length; i++)
                        {
                            if((_self.contentList[i].type == 'img') && 
                                (imageId == _self.contentList[i].id)) {

                                if(productImageHelper.targetImageId != '') {
                                    $('#' + productImageHelper.targetImageId + " img")
                                        .attr('src', _self.contentList[i].data);
                                    $('#' + productImageHelper.targetImageId + " + input")
                                        .val(_self.contentList[i].id);

                                    _self.close();
                                }

                                break;
                            }
                        }
                    }
                });




              //  photo_pool_action();

              //  photo_pool_count++;
                /*if(json_data.data.length > 0)
                    is_photo_pool_loading = false;
                else
                    is_photo_pool_loading = true;*/

            } else {
                alert("???????????????????????????????????????????????????");
            }
        }).fail(function() {
            alert( "???????????????????????????????????????????????????" );
            is_photo_pool_loading = false;
        }).always(function() {
        });
    };

    ProductImageBox.prototype.open = function() {
        this.rootView.fadeIn();

        
        /*is_photo_pool_loading = false;
        photo_pool_count = 1;
        photo_pool_hash = new Object();
        */
        this.getImageList();
    };

    ProductImageBox.prototype.close = function() {
        this.rootView.fadeOut();
    };




    ProductImageBox.prototype.addFolder = function() {
        
        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();
        form_data.append("folder_name", $('#product-img-dt-pop input[name="folder"]').val());
        form_data.append("parent_id", _self.nowFolderId);

        $.ajax({
            url: "admin_product/add_folder",
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
                alert("????????????????????? !");

                _self.getImageList();
            } else {
                alert("?????????????????????????????????????????????????????? !");
            }
        }).fail(function() {
            alert( "???????????????????????????????????????????????????" );
        }).always(function() {

        });
    };

    ProductImageBox.prototype.uploadImage = function(files) {

        if (!files) {
            alert("????????????????????????!!");
            return;
        }

        var _self = (event.data) ? event.data : this;

       // var file_data = $("#post-page .img-select").prop("files")[0];
        var form_data = new FormData();

        $.each( files, function(i, file) {
            form_data.append('postfile[]', file );
           // alert('ddd');
        });

        form_data.append('folder_id', this.nowFolderId );
        
        $.ajax({
            url: "admin_product_image_pool/photo_pool",
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,                         // Setting the data attribute of ajax with file_data
            type: 'post'
        }).done(function( json ) {

           // alert(json);

            if(json.result == 'success')
            {
                alert( "????????????????????????" );

                for(var i = 0; i < json.data.length; i++)
                {

                }

               // photo_pool_action();

                _self.getImageList();

            } else {
                alert( "???????????????????????????????????????????????????" );
            }
        }).fail(function( jqXHR, textStatus  ) {
            alert( "???????????????????????????????????????????????????" );
        });
    }

    ProductImageBox.prototype.deleteImage = function(images) {

        /*if (!files) {
            alert("????????????????????????!!");
            return;
        }*/

        var _self = (event.data) ? event.data : this;

        var form_data = new FormData();

        /*$.each( files, function(i, file) {
            form_data.append('postfile[]', file );
           // alert('ddd');
        });
*/
		for(var i = 0; i < images.length; i++){
			form_data.append('images[' + i + ']', images[i]);
		}

        //form_data.append('images[]', images);
        
        $.ajax({
            url: "admin_product_image_pool/photo_delete",
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,                         // Setting the data attribute of ajax with file_data
            type: 'post'
        }).done(function( json ) {

           // alert(json);

            if(json.result == 'success')
            {
               // alert( "????????????????????????" );

                

               // photo_pool_action();

                _self.getImageList();

            } else {
                alert( "???????????????????????????????????????????????????" );
            }
        }).fail(function( jqXHR, textStatus  ) {
            alert( "???????????????????????????????????????????????????" );
        });
    }

    productImageHelper = new ProductImageBox();

})(jQuery, this, 0);


function getFilename (path) {
  	return path.split('/').pop().replace('.html', '');
}



function randomString(len) {
    var text = "";
    
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    for(var i = 0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}



function is_numeric(str){
    return /^\d+$/.test(str);
}



function postReq(url, formData, success, failed, always) {
	$.ajax({
        url: url,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post'
    }).done(function( jsonData ) {

        if(!auth_response_pre_processer(jsonData))
            return;

        if(jsonData.result == "success")
        {
        	if(success)
        		success(jsonData);
        } else {
            if(failed)
        		failed(jsonData);
        }
    }).fail(function() {
        alert( "???????????????????????????????????????????????????" );
    }).always(function() {
    	if(always)
        	always();
    });
}

var FormValHelper = function($form){

	this.form = $form;

	FormValHelper.prototype.val = function(name) {
		var ele = this.form.find('[name=' + name + ']');
		//alert(ele.prop("tagName").toLowerCase());
		return ele.val().trim();
	};

	FormValHelper.prototype.emptyChk = function(name, txt, action) {
		var ele = this.form.find('[name=' + name + ']').val().trim();

		if(ele == '') {
			alert(txt);
			if(this.action)
				action();

			return false;
		}

		return true;
	};

	FormValHelper.prototype.clearForm = function() {

		var $inputs = this.form.find('input[name], textarea[name], select[name]');
	        
	    $inputs.each(function() {
	        $(this).val('');
	    });
	};
};


var TableBuilder = function($table, $pagination, _id, pattern, field, pageAction){

	this.table = $table;
	this.pagination = $pagination;
	this.pageCount = 20;
	this._id = _id;
	this.pageAction = pageAction;
	this.pattern = pattern;
	this.field = field;
	this.actBtns = [];
	var _self = this;

	TableBuilder.prototype.refresh = function(data, count, start) {

		_self.table.empty();


		if(_self.pagination) {
	        _self.pagination.empty();
	        _self.pagination.find('li').unbind('click');

	        if(count > _self.pageCount)
	        {
	            for(var i = 1; i <= Math.ceil(count / _self.pageCount); i++)
	            {
	                if(i == start)
	                    _self.pagination.append('<li class="active"><a>' + i + '</a></li>');
	                else
	                    _self.pagination.append('<li class="uactive" role-data="' + i + '"><a>' + i + '</a></li>');
	            }

	            _self.pagination.find('li').click(function (){
	                if($(this).hasClass("active"))
	                    return false;
	                if(pageAction)
	                	pageAction($(this).attr('role-data'));
	            });
	        }
	    }

        for(var i = 0; i < data.length; i++)
        {
        	var item = '';

        	for(var key in _self.pattern) {
	        	if(_self.field[key] == 'img')
	        		item += '<td class="text-left"><img class="thumb" src="' 
	                    + data[i][_self.pattern[key]] + '"></td>';
	            else if(_self.field[key] == 'td')
	            	item += '<td class="text-left">' + data[i][_self.pattern[key]] + '</td>';
		    }

		    var btns = '';

		    for(var key in _self.actBtns) {
	        	btns = '<button type="button" title="' + _self.actBtns[key]['title'] + '" class="btn btn-gold ' 
	        	 	+ _self.actBtns[key]['class'] + '" data-id="' 
                    + data[i][_self._id] + '">'
                    + '<i class="fa fa-copy"></i></button>';
		    }

            _self.table.append('<tr><td class="text-center">'
                    + '<input type="checkbox" name="selected[]" value="' 
                    + data[i][_self._id] + '"></td>'
                    + '<td class="text-left">' + (i + 1) + '</td>'
                    + item
                    + '<td class="text-right">'
                    + '<button type="button" data-id="' 
                    + data[i][_self._id] + '" class="btn btn-group delete">'
                    + '<i class="fa fa-trash"></i></button>'
                    + '<button type="button" title="??????" class="btn btn-gold update" data-id="' 
                    + data[i][_self._id] + '">'
                    + '<i class="fa fa-pencil"></i></button>'
                    + btns
                    + '</td></tr>');
        }
	};

	TableBuilder.prototype.addActBtn = function(_class, title) {
		_self.actBtns.push({'class': _class, 'title': title});
	};
};


var SubTableBuilder = function(root, name, pattern, field, placeholder, pageAction){

	this.root = $(root);
	this.table = this.root.find('tbody');
	this.addBtn = this.root.find('tfoot button');
	this.optionName = name;
	this.count = 0;

	this.placeholder = placeholder;
	this.pageAction = pageAction;
	this.pattern = pattern;
	this.field = field;
	this.actBtns = [];
	this.defultValue = null;

	var _self = this;


	this.addBtn.on('click', this, function(event){

		_self.addRowItem(_self.defultValue);
    });
	
	this.refresh = function(data) {

		_self.clear();

        for(var i = 0; i < data.length; i++)
        {
        	_self.addRowItem(data[i]);
        }
	};

	this.addRowItem = function(value) {

		var item = '';
    	for(var key in _self.pattern) {

    		var v = '';
    		if(value) {
    			if(value[_self.pattern[key]])
    				v = value[_self.pattern[key]];
    		}

    		var placeholder = '';
    		if(_self.placeholder) {
    			placeholder = _self.placeholder[key];
    		}


    		if(_self.field[key] == '_id') {
        		item += '<input type="hidden" name="' + _self.optionName + '[' 
		        	+ _self.count + '][' + _self.pattern[key] + ']" value="' + v + '">';
        	} else if(_self.field[key] == 'img') {
        		// item += '<td class="text-left"><img class="thumb" src="' 
          //           + value[_self.pattern[key]] + '"></td>';
        	} else if(_self.field[key] == 'td') {
            	item += '<td class="text-right">'
		        	+ '<input type="text" name="' + _self.optionName + '[' 
		        	+ _self.count + '][' + _self.pattern[key] + ']" value="' + v
		        	+ '" placeholder="' + placeholder + '" class="form-control"></td>';
            } else if(_self.field[key] == 'select') {
            	item += '<td class="text-right">'
		        	+ '<select name="' + _self.optionName + '[' + _self.count 
		        	+ '][is_accumulate]">' + v + '</select></td>';
		    }
	    }

		_self.table.append('<tr id="' + _self.optionName + _self.count + '">'//????????? ??????ID ??? ????????????
		        + item
		        + '<td class="text-right bn"><button type="button" onclick="$(\'#' + _self.optionName 
		        + _self.count + '\').remove();" data-toggle="tooltip" title="??????" class="btn btn-danger"><i class="fa fa-minus-circle"></i>'
		        + '</button></td></tr>');
        _self.count++;
	};

	// SubTableBuilder.prototype.addActBtn = function(_class, title) {
	// 	_self.actBtns.push({'class': _class, 'title': title});
	// };

	this.clear = function() {
		_self.count = 0;
		_self.table.html('');
	}
};


function submitFORM(path, params, method) {
    method = method || "post"; 

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    //Move the submit function to another variable
    //so that it doesn't get overwritten.
    form._submit_function_ = form.submit;

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form._submit_function_();
}


$(window).click(function() {
    $('.suggest-content').hide();
});






var tw_data = {
    '?????????': {'?????????': '200', '?????????': '201', '?????????': '202', '?????????': '203', '?????????': '204', '?????????': '205', '?????????': '206'},
    '?????????': {'?????????': '100', '?????????': '103', '?????????': '104', '?????????': '105', '?????????': '106', '?????????': '108', '?????????': '110', '?????????': '111', '?????????': '112', '?????????': '114', '?????????': '115', '?????????': '116'},
    '?????????': {
      '?????????': '207', '?????????': '208', '?????????': '220', '?????????': '221', '?????????': '222', '?????????': '223',
      '?????????': '224', '?????????': '226', '?????????': '227', '?????????': '228', '?????????': '231', '?????????': '232',
      '?????????': '233', '?????????': '234', '?????????': '235', '?????????': '236', '?????????': '237', '?????????': '238',
      '?????????': '239', '?????????': '241', '?????????': '242', '?????????': '243', '?????????': '244', '?????????': '247',
      '?????????': '248', '?????????': '249', '?????????': '251', '?????????': '252', '?????????': '253'
    },
    '?????????': {
      '?????????': '260', '?????????': '261', '?????????': '262', '?????????': '263', '?????????': '264', '?????????': '265',
      '?????????': '266', '?????????': '267', '?????????': '268', '?????????': '269', '?????????': '270', '?????????': '272',
      '???????????????': '290'
    },
    '?????????': {'??????': '300', '??????': '300', '?????????': '300'},
    '?????????': {
      '?????????': '302', '?????????': '303', '?????????': '304', '?????????': '305', '?????????': '306', '?????????': '307',
      '?????????': '308', '?????????': '310', '?????????': '311', '?????????': '312', '?????????': '313', '?????????': '314',
      '?????????': '315'
    },
    '?????????': {
      '?????????': '320', '?????????': '324', '?????????': '325', '?????????': '326', '?????????': '327', '?????????': '328',
      '?????????': '330', '?????????': '333', '?????????': '334', '?????????': '335', '?????????': '336', '?????????': '337',
      '?????????': '338'
    },
    '?????????': {
      '?????????': '350', '?????????': '351', '?????????': '352', '?????????': '353', '?????????': '354', '?????????': '356',
      '?????????': '357', '?????????': '358', '?????????': '360', '?????????': '361', '?????????': '362', '?????????': '363',
      '?????????': '364', '?????????': '365', '?????????': '366', '?????????': '367', '?????????': '368', '?????????': '369'
    },
    '?????????': {
      '??????': '400', '??????': '401', '??????': '402', '??????': '403', '??????': '404', '?????????': '406', '?????????': '407', '?????????': '408',
      '?????????': '411', '?????????': '412', '?????????': '413', '?????????': '414', '?????????': '420', '?????????': '421',
      '?????????': '422', '?????????': '423', '?????????': '424', '?????????': '426', '?????????': '427', '?????????': '428',
      '?????????': '429', '?????????': '432', '?????????': '433', '?????????': '434', '?????????': '435', '?????????': '436',
      '?????????': '437', '?????????': '438', '?????????': '439'
    },
    '?????????': {
      '?????????': '500', '?????????': '502', '?????????': '503', '?????????': '504', '?????????': '505', '?????????': '506',
      '?????????': '507', '?????????': '508', '?????????': '509', '?????????': '510', '?????????': '511', '?????????': '512',
      '?????????': '513', '?????????': '514', '?????????': '515', '?????????': '516', '?????????': '520', '?????????': '521',
      '?????????': '522', '?????????': '523', '?????????': '524', '?????????': '525', '?????????': '526', '?????????': '527',
      '?????????': '528', '?????????': '530'
    },
    '?????????': {
      '?????????': '540', '?????????': '541', '?????????': '542', '?????????': '544', '?????????': '545', '?????????': '546',
      '?????????': '551', '?????????': '552', '?????????': '553', '?????????': '555', '?????????': '556', '?????????': '557',
      '?????????': '558'
    },
    '?????????': {'??????': '600', '??????': '600'},
    '?????????': {
      '?????????': '602', '?????????': '603', '?????????': '604', '?????????': '605', '?????????': '606', '?????????': '607',
      '?????????': '608', '?????????': '611', '?????????': '612', '?????????': '613', '?????????': '614', '?????????': '615',
      '?????????': '616', '?????????': '621', '?????????': '622', '?????????': '623', '?????????': '624', '?????????': '625'
    },
    '?????????': {
      '?????????': '630', '?????????': '631', '?????????': '632', '?????????': '633', '?????????': '634', '?????????': '635',
      '?????????': '636', '?????????': '637', '?????????': '638', '?????????': '640', '?????????': '643', '?????????': '646',
      '?????????': '647', '?????????': '648', '?????????': '649', '?????????': '651', '?????????': '652', '?????????': '653',
      '?????????': '654', '?????????': '655'
    },
    '?????????': {
      '?????????': '700', '??????': '701', '??????': '702', '??????': '704', '?????????': '708', '?????????': '709',
      '?????????': '710', '?????????': '711', '?????????': '712', '?????????': '713', '?????????': '714', '?????????': '715',
      '?????????': '716', '?????????': '717', '?????????': '718', '?????????': '719', '?????????': '720', '?????????': '721',
      '?????????': '722', '?????????': '723', '?????????': '724', '?????????': '725', '?????????': '726', '?????????': '727',
      '?????????': '730', '?????????': '731', '?????????': '732', '?????????': '733', '?????????': '734', '?????????': '735',
      '?????????': '736', '?????????': '737', '?????????': '741', '?????????': '742', '?????????': '743', '?????????': '744',
      '?????????': '745'
    },
    '?????????': {
      '?????????': '800', '?????????': '801', '?????????': '802', '?????????': '803', '?????????': '804', '?????????': '805',
      '?????????': '806', '?????????': '807', '?????????': '811', '?????????': '812', '?????????': '813',
      '?????????': '814', '?????????': '815', '????????????': '817', '????????????': '819', '?????????': '820', '?????????': '821',
      '?????????': '822', '?????????': '823',
      '?????????': '824', '?????????': '825', '?????????': '826', '?????????': '827', '?????????': '828', '?????????': '829',
      '?????????': '830', '?????????': '831', '?????????': '832', '?????????': '833', '?????????': '840', '?????????': '842',
      '?????????': '843', '?????????': '844', '?????????': '845', '?????????': '846', '?????????': '847', '?????????': '848',
      '????????????': '849', '?????????': '851', '?????????': '852'
    },
    '?????????': {
      '?????????': '900', '????????????': '901', '?????????': '902', '?????????': '903', '?????????': '904', '?????????': '905',
      '?????????': '906', '?????????': '907', '?????????': '908', '?????????': '909', '?????????': '911', '?????????': '912',
      '?????????': '913', '?????????': '920', '?????????': '921', '?????????': '922', '?????????': '923', '?????????': '924',
      '?????????': '925', '?????????': '926', '?????????': '927', '?????????': '928', '?????????': '929', '?????????': '931',
      '?????????': '932', '?????????': '940', '?????????': '941', '?????????': '942', '?????????': '943', '?????????': '944',
      '?????????': '945', '?????????': '946', '?????????': '947'
    },
    '?????????': {
      '?????????': '950', '?????????': '951', '?????????': '952', '?????????': '953', '?????????': '954', '?????????': '955',
      '?????????': '956', '?????????': '957', '?????????': '958', '?????????': '959', '?????????': '961', '?????????': '962',
      '????????????': '963', '?????????': '964', '?????????': '965', '?????????': '966'
    },
    '?????????': {
      '?????????': '970', '?????????': '971', '?????????': '972', '?????????': '973', '?????????': '974', '?????????': '975',
      '?????????': '976', '?????????': '977', '?????????': '978', '?????????': '979', '?????????': '981', '?????????': '982',
      '?????????': '983'
    },
    '?????????': {'?????????': '890', '?????????': '891', '?????????': '892', '?????????': '893', '?????????': '894', '?????????': '896'},
    '?????????': {'?????????': '209', '?????????': '210', '?????????': '211', '?????????': '212'},
    '?????????': {'?????????': '880', '?????????': '881', '?????????': '882', '?????????': '883', '?????????': '884', '?????????': '885'}
};







function getAddrLatLng(addr, callback) {
    var _self = (event.data) ? event.data : this;

    $.ajax({
        type: "GET",
        url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + addr + '&sensor=true_or_false'
    }).done(function( json_data ) {

        if(json_data.status == "OK")
        {
        	callback(true, json_data.results[0].geometry.location.lat, json_data.results[0].geometry.location.lng)

        } else {
            callback(false);
        }
    }).fail(function() {
        //alert( "???????????????????????????????????????????????????" );
        callback(false);
    }).always(function() {
    	//callback(false);
    });
};