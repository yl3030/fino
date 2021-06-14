// overview.js

$(function(){
    var undefined_sign = '----';
    var msg = {
        'undefined_project_id': '未選擇專案',
        'data_not_found': '查無資料'
    };

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

    if ( project_id !== null ) {
        var channels = ['youtube', 'instagram', 'facebook'];
        var channel_data = channelData(project_id, start_day, end_day); // console.log(channel_data);

        // 先隱藏所有頻道資訊
        for (var i=0; i<channels.length; i++) {
            $('#overview_' + channels[i]).hide();
        }

        if (typeof channel_data === 'object') {
            for (var i=0; i<channels.length; i++) {
                var channel = channels[i]; // 本輪頻道
                if (typeof channel_data[channel] !== 'undefined') {
                    var data = channel_data[channel];
                    if ( (data.total !== 'undefined') && (data.kol_cnt !== 'undefined') ) {
                        $('#' + channel + '_total').html(data.kol_cnt + '/' + data.total);
                    } else {
                        $('#' + channel + '_total').html(undefined_sign);
                    }

                    if (data.video_cnt !== 'undefined') {
                        $('#' + channel + '_video_cnt').html(data.video_cnt);
                    } else {
                        $('#' + channel + '_video_cnt').html(undefined_sign);
                    }

                    if (data.view_cnt !== 'undefined') {
                        $('#' + channel + '_view_cnt').html( data.view_cnt.numberFormat(0, '.', ',') );
                    } else {
                        $('#' + channel + '_view_cnt').html(undefined_sign);
                    }

                    if (data.interactive_rate !== 'undefined') {
                        var interactive_percentage = ((data.interactive_rate >= 1) ? '100%' : (data.interactive_rate * 100) + '%');
                        $('#' + channel + '_interactive_rate').html( (data.interactive_rate * 100) + '%' );
                        $('#' + channel + '_interactive_rate_range').css('width', interactive_percentage);
                    } else {
                        $('#' + channel + '_interactive_rate').html(undefined_sign);
                        $('#' + channel + '_interactive_rate_range').css('width', 0);
                    }

                    if (data.emv !== 'undefined') {
                        var emv_percentage = ((data.emv >= 100) ? '100%' : (data.emv + '%'));
                        $('#' + channel + '_emv').html( (data.emv + '%') );
                        $('#' + channel + '_emv_range').css('width', emv_percentage);
                    } else {
                        $('#' + channel + '_emv').html(undefined_sign);
                        $('#' + channel + '_emv_range').css('width', 0);
                    }

                    if (data.cpe !== 'undefined') {
                        var cpe_percentage = ((data.cpe >= 100) ? '100%' : (data.cpe + '%'));
                        $('#' + channel + '_cpe').html('NT' + data.cpe);
                        $('#' + channel + '_cpe_range').css('width', cpe_percentage);
                    } else {
                        $('#' + channel + '_cpe').html(undefined_sign);
                        $('#' + channel + '_cpe_range').css('width', 0);
                    }

                    // 顯示該頻道資料
                    $('#overview_' + channels[i]).show();
                }
            }
        } else { // 查無資料
            alert(msg.data_not_found);
        }
    } else { // 未選擇專案
        alert(msg.undefined_project_id);
        history.go(-1);
    }

    function rankItemHtml(photo, name, val, type){
        var _html = '<div class="name-box">' +
                        '<div class="f-pic">' +
                            '<img src="' + photo + '" alt="">' +
                        '</div>' +
                        '<div class="f-text">' +
                            '<h5 class="f-name">' + name + '</h5>' +
                            '<h5 class="f-num">' + ( (type === 'view') ? val.numberFormat(0, '.', ',') : ( (type === 'interactive') ? val + '%' : val ) ) + '</h5>' +
                            '<div class="prog fp">' +
                                '<div class="prog-value" style="width: 100%;"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        return _html;
    }

    // 統計資料
    $(document).on("click", "ul[id*='rank_list'] > li", function(){
        var dom = $(this).children('a');
        var rank_val = dom.data('rank');
        var rank_name = dom.text();
        var channel = dom.data('channel');
        $('#' + channel + '_toggle').click();
        $('#' + channel + '_toggle_title').text(rank_name);

        // 取得排行資料
        var rank_data = socailKolPerform(project_id, channel, rank_val, start_day, end_day);

        // 觀看數
        var rank_view_html = '';
        if (rank_data.view.length > 0) {
            for (var i=0; i<rank_data.view.length; i++) {
                var round = rank_data.view[i];
                rank_view_html += rankItemHtml(round.photo, round.name, round.view_cnt, 'view');
            }
        }
        $('#' + channel + '_view').html(rank_view_html);

        // 互動率
        var rank_interactive_html = '';
        if (rank_data.interactive.length > 0) {
            for (var i=0; i<rank_data.interactive.length; i++) {
                var round = rank_data.interactive[i];
                rank_interactive_html += rankItemHtml(round.photo, round.name, round.val, 'interactive');
            }
        }
        $('#' + channel + '_interactive').html(rank_interactive_html);

        // CPE
        var rank_cpe_html = '';
        if (rank_data.cpe.length > 0) {
            for (var i=0; i<rank_data.cpe.length; i++) {
                var round = rank_data.cpe[i];
                rank_cpe_html += rankItemHtml(round.photo, round.name, round.val, 'cpe');
            }
        }
        $('#' + channel + '_rank_cpe').html(rank_cpe_html);

        return false;
    });

    // 觸發產生統計資料事件
    for (var i=0; i<channels.length; i++) {
        var channel = channels[i]; // 本輪頻道
        $("ul[id*='" + channel + "_rank_list'] > li").eq(1).trigger('click');
        $('#youtube_toggle').trigger('click');
    }

    var current_date = new Date();
    var year = current_date.getFullYear(); // console.log(year);
    var month = ( (current_date.getMonth() <= 8) ? '0' + (current_date.getMonth() + 1) : (current_date.getMonth() + 1) ) ; // console.log(month);
    var month = '09'; // 假資料

    var day = current_date.getDate(); // console.log(day);
    var days_in_month = new Date(year, month, 0).getDate(); // console.log(days_in_month);

    // console.log( new Date('2020-09-30').getDate() );

    // var start_date = year + '-' + month + '-01'; // console.log(start_date);
    // var end_date = year + '-' + month + '-' + days_in_month; // console.log(end_date);
    var start_date = start_day;
    var end_date = end_day;

    var weekdays = [];
    var reduce_days = 0; // 已扣除的天數
    var start_week_date = month + '/01';
    var first_weekday_in_month = new Date(start_date).getDay(); // 這個月第一天是星期幾  console.log(first_weekday_in_month);
    switch (first_weekday_in_month) {
        case 0:
            reduce_days = 7;
            // weekdays.push(start_week_date + '-' + month + '/07');
            weekdays.push({
                'title': start_week_date + '-' + month + '/07',
                'start': 1,
                'end': 7
            });
            break;
        case 1:
            reduce_days = 6;
            // weekdays.push(start_week_date + '-' + month + '/06');
            weekdays.push({
                'title': start_week_date + '-' + month + '/06',
                'start': 1,
                'end': 6
            });
            break;
        case 2:
            reduce_days = 5;
            // weekdays.push(start_week_date + '-' + month + '/05');
            weekdays.push({
                'title': start_week_date + '-' + month + '/05',
                'start': 1,
                'end': 5
            });
            break;
        case 3:
            reduce_days = 4;
            // weekdays.push(start_week_date + '-' + month + '/04');
            weekdays.push({
                'title': start_week_date + '-' + month + '/04',
                'start': 1,
                'end': 4
            });
            break;
        case 4:
            reduce_days = 3;
            // weekdays.push(start_week_date + '-' + month + '/03');
            weekdays.push({
                'title': start_week_date + '-' + month + '/03',
                'start': 1,
                'end': 3
            });
            break;
        case 5:
            reduce_days = 2;
            // weekdays.push(start_week_date + '-' + month + '/02');
            weekdays.push({
                'title': start_week_date + '-' + month + '/02',
                'start': 1,
                'end': 2
            });
            break;
        case 6:
            reduce_days = 1;
            // weekdays.push(start_week_date + '-' + month + '/01');
            weekdays.push({
                'title': start_week_date + '-' + month + '/01',
                'start': 1,
                'end': 1
            });
            break;
        default:
            // do nothing
    } // console.log(weekdays);

    do {
        if ( (days_in_month - reduce_days) > 7 ) {
            // weekdays.push(month + '/' + ( (reduce_days + 1) < 10 ? '0' + (reduce_days + 1) : (reduce_days + 1) ) + '-' + month + '/' + ( (reduce_days + 7) < 10 ? '0' + (reduce_days + 7) : (reduce_days + 7) ));
            weekdays.push({
                'title': month + '/' + ( (reduce_days + 1) < 10 ? '0' + (reduce_days + 1) : (reduce_days + 1) ) + '-' + month + '/' + ( (reduce_days + 7) < 10 ? '0' + (reduce_days + 7) : (reduce_days + 7) ),
                'start': reduce_days + 1,
                'end': reduce_days + 7
            });
            reduce_days += 7;
        } else {
            // weekdays.push(month + '/' + (reduce_days + 1) + '-' + month + '/' + days_in_month);
            weekdays.push({
                'title': month + '/' + (reduce_days + 1) + '-' + month + '/' + days_in_month,
                'start': reduce_days + 1,
                'end': days_in_month
            });
            reduce_days = days_in_month;
        }
    } while (reduce_days < days_in_month); // console.log(weekdays);  // true時會繼續執行


    var labels = {
        'day': [],
        'week': [] //,
        // 'month': [] // 省略
    };
    for (var round=1; round<=days_in_month; round++) {
        labels.day.push(round);
    } // console.log(labels.day);

    for (var round=0; round<weekdays.length; round++) {
        labels.week.push(weekdays[round].title);
    } // console.log(labels.week);

    for (var i=0; i<channels.length; i++) {
        var channel = channels[i]; // 本輪頻道
        var socail_daily_data = socailDailyData(project_id, channel, start_date, end_date); // console.log(socail_daily_data);
        var data = {
            'day': {
                'interaction': [],
                'view': []
            },
            'week': {
                'interaction': [],
                'view': []
            },
            'month': {
                'interaction': [],
                'view': []
            }
        };

        // 查詢今年每個月的資料
        for (var j=1; j<=12; j++) {
            var round_month = ( (j < 10) ? '0' + j : j );
            var days_in_round_month = new Date(year, round_month, 0).getDate(); // 計算這個月有幾天
            var socail_month_data = socailDailyData(project_id, channel, year + '-' + round_month + '-01', year + '-' + round_month + '-' + days_in_round_month); // console.log(socail_month_data);

            var count_interaction = 0;
            var count_view = 0;
            if (socail_month_data.length === undefined) {
                for (key in socail_month_data) {
                    count_interaction += socail_month_data[key].interactive_rate;
                    count_view += socail_month_data[key].view_count;
                }
            }
            data.month.interaction.push(count_interaction); // console.log(count_interaction);
            data.month.view.push(count_view); // console.log(count_view);
        } // console.log(data.month.interaction); // console.log(data.month.view);

        // 整理每天的資料
        if (socail_daily_data.length !== 0) {
            for (var j=1; j<=days_in_month; j++) {
                var date = year + '-' + month + '-' + ( (j < 10) ? '0' + j : j ); // console.log(date);
                if (socail_daily_data[date] !== undefined) {
                    data.day.interaction.push( socail_daily_data[date].interactive_rate );
                    data.day.view.push( socail_daily_data[date].view_count );
                } else {
                    data.day.interaction.push(0);
                    data.day.view.push(0);
                }
            }
        } else {
            for (var j=1; j<=days_in_month; j++) {
                data.day.interaction.push(0);
                data.day.view.push(0);
            }
        } // console.log(data.day);

        // 整理每週的統計資料
        for (var j=0; j<weekdays.length; j++) {
            var week_start_date = weekdays[j].start;
            var week_end_date = weekdays[j].end;

            var count_interaction = 0;
            var count_view = 0;
            for (var k=(week_start_date - 1); k<week_end_date; k++) {
                count_interaction += data.day.interaction[k];
                count_view += data.day.view[k];
            }
            data.week.interaction.push(count_interaction);
            data.week.view.push(count_view);
        } // console.log(data.week.interaction);  console.log(data.week.view);


        switch (channel){
            case 'youtube':
                // 長條圖
                var chartData_yt = {
                    labels: labels.day,
                    datasets: [{
                        type: "line",
                        label: "互動率",
                        borderColor: "#77D8DE",
                        borderWidth: 8,
                        fill: false,
                        yAxisID: "YTinteraction",
                        data: data.day.interaction
                    }, {
                        type: "bar",
                        label: "觀看數",
                        borderColor: "#E3E4E4",
                        borderWidth: 8,
                        backgroundColor: "#E3E4E4",
                        yAxisID: "YTsee",
                        data: data.day.view,
                    }]
                };

                // 點擊日/週/月按鈕，切換active class
                $(document).on('click', 'div.data button.btn', function() {
                    $(this).parent().children('button.btn').removeClass('active');
                    $(this).addClass('active');
                });

                // 日期
                document.getElementById("yt-day").addEventListener("click", function dayData() {
                    myChart_yt.data.labels = labels.day;
                    myChart_yt.data.datasets[0].data = data.day.interaction;
                    myChart_yt.data.datasets[1].data = data.day.view;
                    myChart_yt.update();
                });

                // 週
                document.getElementById("yt-week").addEventListener("click", function weekData() {
                    myChart_yt.data.labels = labels.week;
                    myChart_yt.data.datasets[0].data = data.week.interaction;
                    myChart_yt.data.datasets[1].data = data.week.view;
                    myChart_yt.update();
                });

                // 月
                document.getElementById("yt-month").addEventListener("click", function monthData() {
                    myChart_yt.data.labels = [
                        "一月",
                        "二月",
                        "三月",
                        "四月",
                        "五月",
                        "六月",
                        "七月",
                        "八月",
                        "九月",
                        "十月",
                        "十一月",
                        "十二月",
                    ];
                    myChart_yt.data.datasets[0].data = data.month.interaction;
                    myChart_yt.data.datasets[1].data = data.month.view;
                    myChart_yt.update();
                });

                var ytCtx = document.getElementById("yt-canvas").getContext("2d");
                var myChart_yt = new Chart(ytCtx, {
                    type: "bar",
                    data: chartData_yt,
                    barPercentage: 1,
                    categoryPercentage: 1,
                    options: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: "bottom",
                            align: "start",
                            labels: {
                                fontSize: 14,
                                padding: 25,
                            },
                        },
                        scales: {
                            yAxes: [
                                {
                                    type: "linear",
                                    display: true,
                                    position: "right",
                                    id: "YTinteraction",
                                    ticks: {
                                        min: 0,
                                        max: 20,
                                        stepSize: 5,
                                        fontColor: "#77D8DE",
                                        fontSize: 14,
                                        callback: function (value) {
                                            return value + "%";
                                        },
                                    },
                                    gridLines: {
                                        borderDash: [5, 3],
                                        drawBorder: 0,
                                        lineWidth: 1,
                                        zeroLineWidth: 3,
                                        zeroLineColor: "#E3E4E4",
                                    },
                                },
                                {
                                    type: "linear",
                                    display: true,
                                    position: "left",
                                    id: "YTsee",
                                    ticks: {
                                        min: 0,
                                        max: 20000,
                                        stepSize: 5000,
                                        fontColor: "#BFC0C3",
                                        fontSize: 14,
                                        callback: function (value) {
                                            return value / 1000 + "K";
                                        },
                                    },
                                    gridLines: {
                                        borderDash: [5, 3],
                                        drawBorder: 0,
                                        lineWidth: 1,
                                        zeroLineWidth: 3,
                                        zeroLineColor: "#E3E4E4",
                                    },
                                },
                            ],
                            xAxes: [
                                {
                                    gridLines: {
                                        display: false,
                                    },
                                },
                            ],
                        },
                        elements: {
                            point: {
                                radius: 0,
                                hoverRadius: 10,
                                backgroundColor: "rgba(255,255,255,1)",
                                hoverBorderWidth: 2,
                                borderColor: "#77D8DE",
                            },
                        },
                    },
                });

                break;
            case 'instagram':
                // 長條圖
                var chartData_ig = {
                    labels: labels.day,
                    datasets: [{
                        type: "line",
                        label: "互動率",
                        borderColor: "#77D8DE",
                        borderWidth: 8,
                        fill: false,
                        yAxisID: "IGinteraction",
                        data: data.day.interaction,
                    }, {
                        type: "bar",
                        label: "觀看數",
                        borderColor: "#E3E4E4",
                        borderWidth: 8,
                        backgroundColor: "#E3E4E4",
                        yAxisID: "IGsee",
                        data: data.day.view,
                    }]
                };

                // 日期
                document.getElementById("ig-day").addEventListener("click", function dayData() {
                    myChart_ig.data.labels = labels.day;
                    myChart_ig.data.datasets[0].data = data.day.interaction;
                    myChart_ig.data.datasets[1].data = data.day.view;
                    myChart_ig.update();
                });

                // 週
                document.getElementById("ig-week").addEventListener("click", function weekData() {
                    myChart_ig.data.labels = labels.week;
                    myChart_ig.data.datasets[0].data = data.week.interaction;
                    myChart_ig.data.datasets[1].data = data.week.view;
                    myChart_ig.update();
                });

                // 月
                document.getElementById("ig-month").addEventListener("click", function monthData() {
                    myChart_ig.data.labels = [
                        "一月",
                        "二月",
                        "三月",
                        "四月",
                        "五月",
                        "六月",
                        "七月",
                        "八月",
                        "九月",
                        "十月",
                        "十一月",
                        "十二月",
                    ];
                    myChart_ig.data.datasets[0].data = data.month.interaction;
                    myChart_ig.data.datasets[1].data = data.month.view;
                    myChart_ig.update();
                });

                var igCtx = document.getElementById("ig-canvas").getContext("2d");
                var myChart_ig = new Chart(igCtx, {
                    type: "bar",
                    data: chartData_ig,
                    options: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: "bottom",
                            align: "start",
                            labels: {
                                fontSize: 14,
                                padding: 25,
                            },
                        }, scales: {
                            yAxes: [{
                                type: "linear",
                                display: true,
                                position: "right",
                                id: "IGinteraction",
                                ticks: {
                                    min: 0,
                                    max: 20,
                                    stepSize: 5,
                                    fontColor: "#77D8DE",
                                    fontSize: 14,
                                    callback: function (value) {
                                        return value + "%";
                                    }
                                }, gridLines: {
                                    borderDash: [5, 3],
                                    drawBorder: 0,
                                    lineWidth: 1,
                                    zeroLineWidth: 3,
                                    zeroLineColor: "#E3E4E4",
                                }
                            }, {
                                type: "linear",
                                display: true,
                                position: "left",
                                id: "IGsee",
                                ticks: {
                                    min: 0,
                                    max: 20000,
                                    stepSize: 5000,
                                    fontColor: "#BFC0C3",
                                    fontSize: 14,
                                    callback: function (value) {
                                        return value / 1000 + "K";
                                    },
                                },
                                gridLines: {
                                    borderDash: [5, 3],
                                    drawBorder: 0,
                                    lineWidth: 1,
                                    zeroLineWidth: 3,
                                    zeroLineColor: "#E3E4E4",
                                },
                            }], xAxes: [{
                                gridLines: {
                                    display: false,
                                }
                            }]
                        }, elements: {
                            point: {
                                radius: 0,
                                hoverRadius: 10,
                                backgroundColor: "rgba(255,255,255,1)",
                                hoverBorderWidth: 2,
                                borderColor: "#77D8DE",
                            }
                        }
                    }
                });

                break;
            case 'facebook':
                // 長條圖
                var chartData_fb = {
                    labels: labels.day,
                    datasets: [
                        {
                            type: "line",
                            label: "互動率",
                            borderColor: "#77D8DE",
                            borderWidth: 8,
                            fill: false,
                            yAxisID: "FBinteraction",
                            data: data.day.interaction,
                        },
                        {
                            type: "bar",
                            label: "觀看數",
                            borderColor: "#E3E4E4",
                            borderWidth: 8,
                            backgroundColor: "#E3E4E4",
                            yAxisID: "FBsee",
                            data: data.day.view,
                        },
                    ],
                };

                // 日期
                document.getElementById("fb-day").addEventListener("click", function dayData() {
                    myChart_fb.data.labels = labels.day;
                    myChart_fb.data.datasets[0].data = data.day.interaction;
                    myChart_fb.data.datasets[1].data = data.day.view;
                    myChart_fb.update();
                });

                // 週
                document.getElementById("fb-week").addEventListener("click", function weekData() {
                    myChart_fb.data.labels = labels.week;
                    myChart_fb.data.datasets[0].data = data.week.interaction;
                    myChart_fb.data.datasets[1].data = data.week.view;
                    myChart_fb.update();
                });

                // 月
                document.getElementById("fb-month").addEventListener("click", function monthData() {
                    myChart_fb.data.labels = [
                        "一月",
                        "二月",
                        "三月",
                        "四月",
                        "五月",
                        "六月",
                        "七月",
                        "八月",
                        "九月",
                        "十月",
                        "十一月",
                        "十二月",
                    ];
                    myChart_fb.data.datasets[0].data = data.month.interaction;
                    myChart_fb.data.datasets[1].data = data.month.view;
                    myChart_fb.update();
                });

                var fbCtx = document.getElementById("fb-canvas").getContext("2d");
                var myChart_fb = new Chart(fbCtx, {
                    type: "bar",
                    data: chartData_fb,
                    options: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: "bottom",
                            align: "start",
                            labels: {
                                fontSize: 14,
                                padding: 25,
                            },
                        },
                        scales: {
                            yAxes: [
                                {
                                    type: "linear",
                                    display: true,
                                    position: "right",
                                    id: "FBinteraction",
                                    ticks: {
                                        min: 0,
                                        max: 20,
                                        stepSize: 5,
                                        fontColor: "#77D8DE",
                                        fontSize: 14,
                                        callback: function (value) {
                                            return value + "%";
                                        },
                                    },
                                    gridLines: {
                                        borderDash: [5, 3],
                                        drawBorder: 0,
                                        lineWidth: 1,
                                        zeroLineWidth: 3,
                                        zeroLineColor: "#E3E4E4",
                                    },
                                },
                                {
                                    type: "linear",
                                    display: true,
                                    position: "left",
                                    id: "FBsee",
                                    ticks: {
                                        min: 0,
                                        max: 20000,
                                        stepSize: 5000,
                                        fontColor: "#BFC0C3",
                                        fontSize: 14,
                                        callback: function (value) {
                                            return value / 1000 + "K";
                                        },
                                    },
                                    gridLines: {
                                        borderDash: [5, 3],
                                        drawBorder: 0,
                                        lineWidth: 1,
                                        zeroLineWidth: 3,
                                        zeroLineColor: "#E3E4E4",
                                    },
                                },
                            ],
                            xAxes: [
                                {
                                    gridLines: {
                                        display: false,
                                    },
                                },
                            ],
                        },
                        elements: {
                            point: {
                                radius: 0,
                                hoverRadius: 10,
                                backgroundColor: "rgba(255,255,255,1)",
                                hoverBorderWidth: 2,
                                borderColor: "#79C9CE",
                            },
                        },
                    },
                });

                break;
            default:
                // do nothing
        }

        // console.log(data);
    }
});