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


var kol_perform_items = kolPerformItems(project_id, rank, start_day, end_day); // console.log(kol_perform_items);
var content_tag = contentTag(project_id, start_day, end_day); // console.log(content_tag);
var content_words = contentWords(project_id, start_day, end_day); // console.log(content_words);

switch (rank) {
    case 'all':
        $('div.arrange-section > h4').text('綜合排名');
        break;

    case 'view_cnt':
        $('div.arrange-section > h4').text('平台(觀看數)');
        break;

    case 'interactive_rate':
        $('div.arrange-section > h4').text('平台(互動率)');
        break;

    case 'emv':
        $('div.arrange-section > h4').text('EMV');
        break;

    case 'cpe':
        $('div.arrange-section > h4').text('平台(CPE)');
        break;

    default:
        $('div.arrange-section > h4').text('綜合排名');
}

// 清除掉所有內容
var platform_area = ['#youtube_area', '#ig_area', '#fb_area'];
for (var i=0; i<platform_area.length; i++) {
    var round = platform_area[i];
    $(round + ' > table.content').remove();
}

if ( kol_perform_items.result === 'success' ) {
    if ( rank === 'all' ) {
        if ( kol_perform_items.data.length > 0 ) {
            for (var i=0; i<kol_perform_items.data.length; i++) {
                var round = kol_perform_items.data[i]; // 網紅
                var round_name = round.name; // 網紅名稱
                var round_photo = round.photo; // 網紅照片

                for (key in round.platform) { // 平台
                    var platform_round = round.platform[key];
                    switch (key) {
                        case 'youtube':
                            if ( platform_round.length > 0 ) {
                                for (var j=0; j<platform_round.length; j++) {
                                    var platform_data_round = platform_round[j];
                                    var num = $('#youtube_area > table.content').length + 1;
                                    $('#youtube_area').append( generateHtml(num, platform_data_round.content_title, round_photo, round_name, platform_data_round.view_count, platform_data_round.interactive_rate, platform_data_round.emv, platform_data_round.cpe) );
                                }
                            }

                            break;

                        case 'instagram':
                            if ( platform_round.length > 0 ) {
                                for (var j=0; j<platform_round.length; j++) {
                                    var platform_data_round = platform_round[j];
                                    var num = $('#ig_area > table.content').length + 1;
                                    $('#ig_area').append( generateHtml(num, platform_data_round.content_title, round_photo, round_name, platform_data_round.view_count, platform_data_round.interactive_rate, platform_data_round.emv, platform_data_round.cpe) );
                                }
                            }

                            break;

                        case 'facebook':
                            if ( platform_round.length > 0 ) {
                                for (var j=0; j<platform_round.length; j++) {
                                    var platform_data_round = platform_round[j];
                                    var num = $('#fb_area > table.content').length + 1;
                                    $('#fb_area').append( generateHtml(num, platform_data_round.content_title, round_photo, round_name, platform_data_round.view_count, platform_data_round.interactive_rate, platform_data_round.emv, platform_data_round.cpe) );
                                }
                            }

                            break;

                        default:
                            // do nothing
                    }
                }
            }
        }
    } else {
        if ( (kol_perform_items.data !== null) && (kol_perform_items.data !== undefined) ) {
            for (key in kol_perform_items.data) {
                var platform_data = kol_perform_items.data[key];

                switch (key) {
                    case 'youtube':
                        if ( platform_data.length > 0 ) {
                            for (var i=0; i<platform_data.length; i++) {
                                var platform_data_round = platform_data[i];
                                var num = $('#youtube_area > table.content').length + 1;
                                    $('#youtube_area').append( generateHtml(num, platform_data_round.content_title, platform_data_round.photo, platform_data_round.name, platform_data_round.view_count, platform_data_round.interactive_rate, platform_data_round.emv, platform_data_round.cpe) );
                            }
                        }

                        break;

                    case 'instagram':
                        if ( platform_data.length > 0 ) {
                            for (var i=0; i<platform_data.length; i++) {
                                var platform_data_round = platform_data[i];
                                var num = $('#ig_area > table.content').length + 1;
                                    $('#ig_area').append( generateHtml(num, platform_data_round.content_title, platform_data_round.photo, platform_data_round.name, platform_data_round.view_count, platform_data_round.interactive_rate, platform_data_round.emv, platform_data_round.cpe) );
                            }
                        }

                        break;

                    case 'facebook':
                        if ( platform_data.length > 0 ) {
                            for (var i=0; i<platform_data.length; i++) {
                                var platform_data_round = platform_data[i];
                                var num = $('#fb_area > table.content').length + 1;
                                    $('#fb_area').append( generateHtml(num, platform_data_round.content_title, platform_data_round.photo, platform_data_round.name, platform_data_round.view_count, platform_data_round.interactive_rate, platform_data_round.emv, platform_data_round.cpe) );
                            }
                        }
                        break;

                    default:
                        // do nothing
                }
            }
        }
    }
}

var content_tag_html = '';
if ( content_tag.result === 'success' ) {
    if ( content_tag.data.length > 0 ) {
        for (var i=0; i<content_tag.data.length; i++) {
            var round = content_tag.data[i];
            content_tag_html += generateContentTagHtml(i+1, round);
        }
    }
}
$('#content_tag .content').remove();
$('#content_tag .small-title').after(content_tag_html);

var content_tag_data = [];
if ( content_words.result === 'success' ) {
    if ( content_words.data.length > 0 ) {
        for (var i=0; i<content_words.data.length; i++) {
            var round = content_words.data[i];
            content_tag_data.push({
                'text': round.name,
                'size': round.count
            });
        }
    }
}
//取得d3顏色
var fill = d3.scaleOrdinal(d3.schemeCategory10);
//文字雲/關鍵字，及字型大小（這邊只放三個）
/* var data = [
    {text: "加里山", size: 21},
    {text: "文字雲", size: 18},
    {text: "翠湖 螢火蟲", size: 17}
]; */
//取得呈現處的寬、高
var w = parseInt(d3.select("#tag").style("width"), 10);
var h = parseInt(d3.select("#tag").style("height"), 10);

d3.layout.cloud().size([w, h])
        .words(content_tag_data)
        .padding(2)
        .rotate(function () {
            return ~~(Math.random() * 2) * 90;
        })
        .rotate(function () {
            return 0;
        })
        .fontSize(function (d) {
            return d.size;
        })
        .on("end", draw)
        .start();

function draw(words) {
    d3.select("#tag").append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size + "px";
            })
            .style("font-family", "Microsoft JhengHei")
            .style("cursor", 'pointer')
            .style("fill", function (d, i) {
                return fill(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            })
            .on("click", function (d) {
                window.open("https://www.google.com/search?q=" + d.text, '_blank');
            });
}

// 產生資料列的html
function generateHtml(num, content_title, photo, name, view_count, interactive_rate, emv, cpe){
    return  '<table class="content">' +
                '<tr>' +
                    '<td class="rank">' + num + '</td>' +
                    '<td class="t-cont">' +
                        '<div class="tc">' +
                            '<img src="./public/img/content.png" alt="">' +
                            '<p>' + content_title + '</p>' +
                        '</div>' +
                    '</td>' +
                    '<td class="t-red">' +
                        '<div class="personal pers2">' +
                            '<div class="pic">' +
                                '<img src="' + photo + '" alt="">' +
                            '</div>' +
                            '<h4 class="name">' + name + '</h4>' +
                        '</div>' +
                    '</td>' +
                    '<td class="t-num">' + view_count.numberFormat(0, '.', ',') + '</td>' +
                    '<td class="t-num">' + interactive_rate + '%</td>' +
                    '<td class="t-num">' + emv + '%</td>' +
                    '<td class="t-num">' + cpe + '</td>' +
                '</tr>' +
            '</table>';
}

// content_tag_html
function generateContentTagHtml(num, data) {
    return  '<div class="content">' +
                '<div class="tb">' +
                    '<p class="tag-rank">' + num + '</p>' +
                    '<a href="#" class="tag">#' + data.name + '</a>' +
                    '<p class="num">' + data.count + '</p>' +
                    '<p class="percent">' + data.count + '%</p>' +
                '</div>' +
                '<div class="tbp">' +
                    '<div class="tb-bar">' +
                        '<div class="bar" style="width: ' + data.count + '%;"></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
}






