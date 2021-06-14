// 是否有設置api參數
function issetApi(){
    var result = true;
    var required_parameter = ['location', 'prefix'];
    for (var i=0; i<required_parameter.length; i++) {
        var round = required_parameter[i];
        if (typeof api[round] === 'undefined') {
            result = false;
        }
    }
    return result;
}

// 總覽 分別列出 youtube, facebook, instagram 的總成效
function channelData(project_id, start_date, end_date){
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/channel_data/' + project_id,
            headers: {'Content-Type':'application/json'},
            type: 'GET',
            async: false, // 同步請求
            cache: false,
            data: {
                'start_date': start_date,
                'end_date': end_date
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                switch (response.result) {
                    case 'success':
                        data = response.data;
                        break;
                    default:
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// youtube, facebook, instagram 個別內部成效(By 天，週，月由前端計算得出)
function socailDailyData(project_id, platform, start_day, end_day){
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/socail_daily_data/' + project_id + '/' + platform,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {
                'start_day': start_day,
                'end_day': end_day
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) { // console.log(response);
                switch (response.result) {
                    case 'success':
                        data = response.data;
                        break;
                    default:
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// youtube, facebook, instagram 個別內部
function socailKolPerform(project_id, platform, rank='top5', start_day, end_day){
    var ranks = ['top5', 'worst5', 'all'];
    if ( issetApi() && ($.inArray(rank, ranks) !== -1) ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/socail_kol_perform/' + project_id + '/' + platform,
            headers: {'Content-Type':'application/json'},
            type: 'GET',
            async: false, // 同步請求
            cache: false,
            data: {
                'rank': rank,
                'start_day': start_day,
                'end_day': end_day
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                switch (response.result) {
                    case 'success':
                        data = response.data;
                        break;
                    default:
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 取得get參數
function getParameter(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    /*
     * window.location.search 獲取URL ?之後的參數(包含問號)
     * substr(1) 獲取第一個字以後的字串(就是去除掉?號)
     * match(reg) 用正規表達式檢查是否符合要查詢的參數
    */
    var r = window.location.search.substr(1).match(reg);
    //如果取出的參數存在則取出參數的值否則回穿null
    return ( (r != null) ? unescape(r[2]) : null );
}

// JS版的number_formate // data.view_cnt.numberFormat(0, '.', ',')
Number.prototype.numberFormat = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// 專案概觀 - 網紅
function kolPerform(project_id, rank='all', start_day, end_day){
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/kol_perform/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {
                'rank': rank,
                'start_day': start_day,
                'end_day': end_day
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 專案概觀 - 網紅清單形式
function kolPerformItems(project_id, rank='all', start_day, end_day){
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/kol_perform_items/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {
                'rank': rank,
                'start_day': start_day,
                'end_day': end_day
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 粉絲輪廓
function fansAnalytics(project_id){
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/fans_analytics/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {},
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 網紅偏好(New)(Done)(Connected)
function kolPrefer(project_id) {
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/kol_prefer/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {},
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 品牌偏好(New)(Done)
function brandPrefer(project_id) {
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/brand_prefer/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {},
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 主題標籤 Top10(New)(Done)
function contentTag(project_id, start_day, end_day) {
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/content_tag/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {
                'start_day': start_day,
                'end_day': end_day
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 內容文字雲(New)(Done)
function contentWords(project_id, start_day, end_day) {
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/content_words/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {
                'start_day': start_day,
                'end_day': end_day
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 內容列表
function kolPerformItems(project_id, rank='all', start_day, end_day){
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/kol_perform_items/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {
                'rank': rank,
                'start_day': start_day,
                'end_day': end_day
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 產業比較
function productCompare(project_id, type='product'){ // competitor
    if ( issetApi() ) {
        var data = null;
        $.ajax({
            url: api.location + api.prefix + '/product_compare/' + project_id,
            type: 'POST',
            async: false, // 同步請求
            cache: false,
            data: {
                'type': type
            },
            dataType: 'JSON',
            beforeSend: function() {},
            complete: function() {},
            success: function(response) {
                data = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                // console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });

        return data;
    } else {
        return false;
    }
}

// 處理daterangepicker，回傳array
function splitDaterangepicker(daterange) {
    return daterange.split(" ~ ");
}