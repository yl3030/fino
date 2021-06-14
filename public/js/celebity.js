var rank = getParameter('rank');
    rank = ( (rank !== undefined) && (rank !== null) ? rank : null );

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


var kol_perform = kolPerform(project_id, rank, start_day, end_day); // console.log( kol_perform );
var container_html = '';
if ( kol_perform.result === 'success' ) {
    for (var i=0; i<kol_perform.data.length; i++) {
        var round = kol_perform.data[i];

        // 平台的html
        var platform_html = '';
        for (var j=0; j<round.platform_list.length; j++) {
            var sub_round = round.platform_list[j];
            platform_html += generateTotalDataHtml(sub_round.cpe, sub_round.daily_data, sub_round.emv, sub_round.interactive_rate, sub_round.media_type, sub_round.video_cnt, sub_round.view_cnt);
        }
        container_html +=   '<div class="container">' +
                                '<div class="celebrity box slidedown-box">' +
                                    generatePersonalInfoHtml(round.photo, round.name, round.offer, round.coop_cnt) +
                                    '<div class="data-box">' +
                                        platform_html +
                                        '' +
                                        '<button class="toggle-btn">' +
                                            '<i class="fas fa-angle-up"></i>' +
                                        '</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
    }
}

$(function(){
    // 移除掉非第1個container，並插入container_html
    $('body > div.container:not(:first)').remove();
    $('body > div.container:first').after(container_html);
});


// 產生網紅info的html
function generatePersonalInfoHtml(photo, name, offer, coop_cnt){
    var _html = '<div class="personal">' +
                    '<div class="pic">' +
                        '<img src="' + photo + '" alt="">' +
                    '</div>' +
                    '<h4 class="name">' + name + '</h4>' +
                    '<div class="price">' +
                        '<p>本次合作報價</p>' +
                        '<p>NT ' + offer.numberFormat(0, '.', ',') + '</p>' +
                    '</div>' +
                    '<p class="freq">已合作次數 ' + coop_cnt + '</p>' +
                '</div>';

    return _html;
}

// 產生total data的html
function generateTotalDataHtml(cpe, daily_data=[], emv, interactive_rate, media_type, video_cnt, view_cnt){
    // 平台icon
    var platform_img = '';
    var div_class = '';
    switch(media_type){
        case 'youtube':
            platform_img = './public/img/youtube.png';
            div_class = 'yt-data';
            break;

        case 'facebook':
            platform_img = './public/img/logo_FB_channel.png';
            div_class = 'fb-data';
            break;

        case 'instagram':
            platform_img = './public/img/logo_IG_channel.png.png';
            div_class = 'ig-data';
            break;

        default:
            // do nothing
    }

    var _html = '<div class="' + div_class + ' sd">' +
                    '<div class="total-data">' +
                        '<div class="pic">' +
                            '<img src="' + platform_img + '" alt="' + media_type + '">' +
                        '</div>' +
                        '<div class="number">' +
                            '<div class="video n-box">' +
                                '<h4 class="n-num td-num">' + video_cnt.numberFormat(0, '.', ',') + '</h4>' +
                                '<h5 class="td-text">影片數</h5>' +
                            '</div>' +
                            '<div class="see n-box">' +
                                '<h4 class="n-num td-num">' + view_cnt.numberFormat(0, '.', ',') + '</h4>' +
                                '<h5 class="td-text">觀看數</h5>' +
                            '</div>' +
                        '</div>' +
                        '<div class="percent">' +
                            '<div class="interactive p-box">' +
                                '<div class="up-box">' +
                                    '<h4 class="p-num td-num">' + (interactive_rate * 100) + '%</h4>' +
                                    '<div class="p-icon">' +
                                        '<img src="./public/img/ic_bad.png" alt="bad-icon">' +
                                    '</div>' +
                                '</div>' +
                                '<div class="bottom-box">' +
                                    '<div class="prog">' +
                                        '<div class="prog-value" style="width: ' + ( (interactive_rate<=1) ? (interactive_rate * 100) : '100' ) + '%;"></div>' +
                                    '</div>' +
                                    '<h5 class="p-text td-text">互動率</h5>' +
                                '</div>' +
                            '</div>' +
                            '<div class="EMV p-box">' +
                                '<div class="up-box">' +
                                    '<h4 class="p-num td-num">' + emv + '%</h4>' +
                                    '<div class="p-icon">' +
                                        '<img src="./public/img/ic_great.png" alt="great-icon">' +
                                    '</div>' +
                                '</div>' +
                                '<div class="bottom-box">' +
                                    '<div class="prog">' +
                                        '<div class="prog-value" style="width: ' + ( (emv<=100) ? emv : '100' ) + '%;"></div>' +
                                    '</div>' +
                                    '<h5 class="p-text td-text">EMV</h5>' +
                                '</div>' +
                            '</div>' +
                            '<div class="CPE p-box">' +
                                '<div class="up-box">' +
                                    '<h4 class="p-num td-num">NT' + cpe + '</h4>' +
                                    '<div class="p-icon">' +
                                        '<img src="./public/img/ic_fair.png" alt="fair-icon">' +
                                    '</div>' +
                                '</div>' +
                                '<div class="bottom-box">' +
                                    '<div class="prog">' +
                                        '<div class="prog-value" style="width: ' + cpe + '%;"></div>' +
                                    '</div>' +
                                    '<h5 class="p-text td-text">CPE</h5>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    generateCanvas() +
                '</div>';

    return _html;
}

// 產生canvas
function generateCanvas(){
    var canvas_html =   '<div class="content-box">' +
                            '<div class="data">' +
                                '<div class="btn-box">' +
                                    '<button class="btn active" id="ig-day">日</button>' +
                                    '<button class="btn" id="ig-week">週</button>' +
                                    '<button class="btn" id="ig-month">月</button>' +
                                '</div>' +
                                '<div>' +
                                    '<canvas id="ig-canvas"></canvas>' +
                                '</div>' +
                            '</div>' +
                            '<div class="ig-cont cbox">' +
                                '<div class="c-card">' +
                                    '<img src="./public/img/ig-card.png" alt="">' +
                                '</div>' +
                                '<div class="c-card">' +
                                    '<img src="./public/img/ig-card.png" alt="">' +
                                '</div>' +
                                '<div class="c-card">' +
                                    '<img src="./public/img/ig-card.png" alt="">' +
                                '</div>' +
                                '<div class="c-card">' +
                                    '<img src="./public/img/ig-card.png" alt="">' +
                                '</div>' +
                            '</div>' +
                        '</div>';
    return canvas_html;
}