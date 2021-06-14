var api = {
    'location': 'https://www.fino.one/',
    // 'location': 'http://official.fino.com/',
    'prefix': 'actmanager'
};

// 判斷是否有設定專案ID
var mode = 'development';
switch(mode){
    case 'development':
        var project_id = 21; // 測試資料
        break;
    case 'official':
        var project_id = getParameter('project_id');
        break;
}

$(function() {
    if ( $('div.second-nav').length == 1 ) {
        // 動態變更ul li的active
        $('#nav_tab > li > a.active').removeClass('active');

        // 例外情況
        // console.log(window.location.pathname);
        switch (window.location.pathname) {
            case '/providers/celebity':
                $('#nav_tab > li > a[href*="providers/celebity"]').addClass('active');
                break;

            case '/providers/celebrity2':
                $('#nav_tab > li > a[href*="providers/celebity"]').addClass('active');
                break;

            case '/providers/celebrity2_net_see':
                $('#nav_tab > li > a[href*="providers/celebity"]').addClass('active');
                break;

            default:
                $('#nav_tab > li > a').each(function(){
                    if ( $(this).attr('href') == window.location.pathname ) {
                        $(this).addClass('active');
                    }
                });
        }

        // 粉絲輪廓、產業比較隱藏時間搜尋區塊
        var current_pathname = location.pathname; // console.log(current_pathname);
        if ( (current_pathname == '/providers/fans') || (current_pathname == '/providers/comparison') ) {
            console.log($('#daterange_area').length);
            $('#daterange_area').remove();
        } else {
            $('#daterange_area').show();
            $('#daterange_search').daterangepicker({
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '前 7 天': [moment().subtract(6, 'days'), moment()],
                    '前 30 天': [moment().subtract(29, 'days'), moment()],
                    '這個月': [moment().startOf('month'), moment().endOf('month')],
                    '上個月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    format: "YYYY-MM-DD",
                    separator: " ~ ",
                    applyLabel: "確認",
                    cancelLabel: "取消",
                    customRangeLabel: "自訂義範圍",
                    daysOfWeek: [
                        "日",
                        "一",
                        "二",
                        "三",
                        "四",
                        "五",
                        "六"
                    ],
                    monthNames: [
                        "1 月",
                        "2 月",
                        "3 月",
                        "4 月",
                        "5 月",
                        "6 月",
                        "7 月",
                        "8 月",
                        "9 月",
                        "10 月",
                        "11 月",
                        "12 月"
                    ],
                    firstDay: 1
                },
                startDate: ( (getParameter('start_day') != null) ? getParameter('start_day') : moment() ),
                endDate: ( (getParameter('end_day') != null) ? getParameter('end_day') : moment() ),
                // minDate: "2000年01月02日",
                // maxDate: "2020年12月31日"
            });
            $(document).on('change', '#daterange_search', function() {
                var rank = getParameter('rank');
                var daterange = splitDaterangepicker($(this).val());
                if ( rank != null ) {
                    var url = current_pathname + '?rank=' + rank + '&start_day=' + daterange[0] + '&end_day=' + daterange[1];
                } else {
                    var url = current_pathname + '?start_day=' + daterange[0] + '&end_day=' + daterange[1];
                }

                window.location.href = url;
            });
        }
    }
});