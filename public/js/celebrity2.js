var rank = getParameter('rank');
    rank = ( (rank !== undefined) && (rank !== null) ? rank : 'all' );

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
    if ( rank === 'all' ) {
        for (var i=0; i<kol_perform_items.data.length; i++) { // 網紅
            var round = kol_perform_items.data[i];
            var personal_info = generatePersonInfo(round.photo, round.name); // 網紅的資訊欄
            var platform_html = '';
            var setted_personal_info = false; // 是否有填入網紅的資訊欄

            for (key in round.platform) { // 平台
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

                for (var j=0; j<round.platform[key].length; j++) {
                    var round_platform_data = round.platform[key][j];
                    if ( setted_personal_info === false ) {
                        setted_personal_info = true;
                        platform_html +=    '<tr>' +
                                                '<td class="rank">' + (i+1) + '</td>' +
                                                '<td class="t-red" rowspan="6">' + personal_info + '</td>' +
                                                '<td class="t-net">' + platform_img + '</td>' +
                                                '<td class="t-cont">' + round_platform_data.content_title + '</td>' +
                                                '<td class="t-num">' + round_platform_data.view_count.numberFormat(0, '.', ',') + '</td>' +
                                                '<td class="t-num">' + round_platform_data.interactive_rate + '%</td>' +
                                                '<td class="t-num">' + round_platform_data.emv + '%</td>' +
                                                '<td class="t-num">' + round_platform_data.cpe + '</td>' +
                                            '</tr>';
                    } else {
                        platform_html += '<tr>' +
                                            '<td></td>' +
                                            '<td class="t-net">' + platform_img + '</td>' +
                                            '<td class="t-cont">' + round_platform_data.content_title + '</td>' +
                                            '<td class="t-num">' + round_platform_data.view_count.numberFormat(0, '.', ',') + '</td>' +
                                            '<td class="t-num">' + round_platform_data.interactive_rate + '%</td>' +
                                            '<td class="t-num">' + round_platform_data.emv + '%</td>' +
                                            '<td class="t-num">' + round_platform_data.cpe + '</td>' +
                                        '</tr>';
                    }
                }
            }

            table_html +=   '<table class="content">' +
                                platform_html +
                            '</table>' +
                            '<div class="divide-line"></div>';
        }
    } else {
        for (key in kol_perform_items.data) { // 平台
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
            var platform_data = kol_perform_items.data[key]; // array
            for (var i=0; i<platform_data.length; i++) {
                var round_platform_data = platform_data[i];
                table_html +=   '<table class="content">' +
                                    '<tr>' +
                                        '<td class="rank">' + (i+1) + '</td>' +
                                        '<td rowspan="6" class="t-red">' +
                                            '<div class="personal">' +
                                                '<div class="pic">' +
                                                    '<img src="' + round_platform_data.photo + '" alt="">' +
                                                '</div>' +
                                                '<h4 class="name">' + round_platform_data.name + '</h4>' +
                                                '<div class="price">' +
                                                    '<p>本次合作報價</p>' +
                                                    '<p>NT 150,000</p>' +
                                                '</div>' +
                                                '<p class="freq">已合作次數 5</p>' +
                                            '</div>' +
                                        '</td>' +
                                        '<td class="t-net">' +
                                            platform_img +
                                        '</td>' +
                                        '<td class="t-cont">' +
                                            round_platform_data.content_title +
                                        '</td>' +
                                        '<td class="t-num">' + round_platform_data.view_count.numberFormat(0, '.', ',') + '</td>' +
                                        '<td class="t-num">' + round_platform_data.interactive_rate + '%</td>' +
                                        '<td class="t-num">' + round_platform_data.emv + '%</td>' +
                                        '<td class="t-num">' + round_platform_data.cpe + '</td>' +
                                    '</tr>' +
                                '</table>' +
                                '<div class="divide-line"></div>';
            }
        }
    }
}

$(function(){
    $('table.content, div.divide-line').remove();
    $('table.subject').after(table_html);
});

// person info
function generatePersonInfo(photo, name){
    var _html = '<div class="personal">' +
                    '<div class="pic">' +
                        '<img src="' + photo + '" alt="">' +
                    '</div>' +
                    '<h4 class="name">' + name + '</h4>' +
                    '<div class="price">' +
                        '<p>本次合作報價</p>' +
                        '<p>NT 150,000</p>' +
                    '</div>' +
                    '<p class="freq">已合作次數 5</p>' +
                '</div>';
    return _html;
}