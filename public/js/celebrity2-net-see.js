var rank = getParameter('rank');
    rank = ( (rank !== undefined) && (rank !== null) ? rank : 'all' );
    rank = 'view_cnt';

// 沒有收到起訖日期參數，自動以當前時間作為起訖時間參數
var start_day = getParameter('start_day'); // console.log('start_date：' + start_day);
var end_day = getParameter('end_day'); // console.log('end_date：' + end_day);
if ( (start_day == null) || (end_day == null) ) {
    var _date = new Date();
    var year = _date.getFullYear();
    var month = (_date.getMonth() + 1);
        month = ( (month < 10) ? ('0' + month) : month );
    var day = _date.getDate();
        day = ( (day < 10) ? ('0' + day) : day );

    start_day = year + '-' + month + '-' + day; // console.log(start_day);
    end_day = start_day;
}


var kol_perform_items = kolPerformItems(project_id, rank, start_day, end_day); // console.log( kol_perform_items );

var table_html = '';
if ( kol_perform_items.result === 'success' ) {
    for (key in kol_perform_items.data) {
        var platform_img = '';
        switch (key) { // 平台icon
            case 'youtube':
                platform_img = '<img src="./public/img/youtube.png" alt=""></img>';
                break;

            case 'facebook':
                platform_img = '<img src="./public/img/logo_FB_channel.png" alt=""></img>';
                break;

            case 'instagram':
                platform_img = '<img src="./public/img/logo_IG_channel.png" alt=""></img>';
                break;

            default:
                // do nothing
        }

        var platform_html = '';
        if ( kol_perform_items.data[key].length > 0 ) {
            for (var i=0; i<kol_perform_items.data[key].length; i++) {
                var round = kol_perform_items.data[key][i];
                platform_html +=    '<tr>' +
                                        '<td class="t-net">' +
                                            platform_img +
                                        '</td>' +
                                        '<td class="rank">' + (i+1) + '</td>' +
                                        '<td class="t-red">' +
                                            '<div class="personal pers2">' +
                                                '<div class="pic">' +
                                                    '<img src="' + round.photo + '" alt="">' +
                                                '</div>' +
                                                '<h4 class="name">' + round.name + '</h4>' +
                                            '</div>' +
                                        '</td>' +
                                        '<td class="t-cont">' +
                                            round.content_title +
                                        '</td>' +
                                        '<td class="t-num">' + round.view_count.numberFormat(0, '.', ',') + '</td>' +
                                        '<td class="t-num">' + round.interactive_rate + '%</td>' +
                                        '<td class="t-num">' + round.emv + '%</td>' +
                                        '<td class="t-num">' + round.cpe + '</td>' +
                                    '</tr>';
            }
        }

        table_html +=   '<table class="content">' +
                            platform_html +
                        '</table>' +
                        '<div class="divide-line"></div>';
    }
}

$(function(){
    $('table.content, div.divide-line').remove();
    $('table.subject').after(table_html);
});