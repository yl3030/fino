var fans_analytics = fansAnalytics(project_id); // console.log(fans_analytics);
var kol_prefer = kolPrefer(project_id); // console.log(kol_prefer);
var brand_prefer = brandPrefer(project_id); // console.log(brand_prefer);

var table_html = '';
if ( fans_analytics.result === 'success' ) {

    // consum_power
    var consum_power_heigh = 0;
    var consum_mid_heigh = 0;
    var consum_mid = 0;
    var consum_low = 0;

    if ( fans_analytics.data.consum_power !== undefined ) {
        for (key in fans_analytics.data.consum_power) {
            consum_power_heigh = fans_analytics.data.consum_power.heigh;
            consum_mid_heigh = fans_analytics.data.consum_power.mid_heigh;
            consum_mid = fans_analytics.data.consum_power.mid;
            consum_low = fans_analytics.data.consum_power.low;
        }
    }

    $('#consum_power_heigh').css('width', consum_power_heigh);
    $('#consum_mid_heigh').css('width', consum_mid_heigh);
    $('#consum_mid').css('width', consum_mid);
    $('#consum_low').css('width', consum_low);

    $('#consum_power_heigh').children('p').text(consum_power_heigh + '%');
    $('#consum_mid_heigh').children('p').text(consum_mid_heigh + '%');
    $('#consum_mid').children('p').text(consum_mid + '%');
    $('#consum_low').children('p').text(consum_low + '%');


    // age_distr
    if ( fans_analytics.data.age_distr !== undefined ) {
        var age_area = $('div.age');
        var female_area = age_area.children('div.female-bar.age-box');
        var male_area = age_area.children('div.male-bar.age-box');

        for (key in fans_analytics.data.age_distr) {
            var round = fans_analytics.data.age_distr[key];
            switch ( key ) {
                case 'level1':
                    female_area.children('div:nth-child(1)').css('height', round.female + '%');
                    female_area.children('div:nth-child(1)').children('p').text(round.female + '%');

                    male_area.children('div:nth-child(1)').css('height', round.male + '%');
                    male_area.children('div:nth-child(1)').children('p').text(round.male + '%');
                    break;

                case 'level2':
                    female_area.children('div:nth-child(2)').css('height', round.female + '%');
                    female_area.children('div:nth-child(2)').children('p').text(round.female + '%');

                    male_area.children('div:nth-child(2)').css('height', round.male + '%');
                    male_area.children('div:nth-child(2)').children('p').text(round.male + '%');
                    break;

                case 'level3':
                    female_area.children('div:nth-child(3)').css('height', round.female + '%');
                    female_area.children('div:nth-child(3)').children('p').text(round.female + '%');

                    male_area.children('div:nth-child(3)').css('height', round.male + '%');
                    male_area.children('div:nth-child(3)').children('p').text(round.male + '%');
                    break;

                case 'level4':
                    female_area.children('div:nth-child(4)').css('height', round.female + '%');
                    female_area.children('div:nth-child(4)').children('p').text(round.female + '%');

                    male_area.children('div:nth-child(4)').css('height', round.male + '%');
                    male_area.children('div:nth-child(4)').children('p').text(round.male + '%');
                    break;

                case 'level5':
                    female_area.children('div:nth-child(5)').css('height', round.female + '%');
                    female_area.children('div:nth-child(5)').children('p').text(round.female + '%');

                    male_area.children('div:nth-child(5)').css('height', round.male + '%');
                    male_area.children('div:nth-child(5)').children('p').text(round.male + '%');
                    break;

                case 'level6':
                    female_area.children('div:nth-child(6)').css('height', round.female + '%');
                    female_area.children('div:nth-child(6)').children('p').text(round.female + '%');

                    male_area.children('div:nth-child(6)').css('height', round.male + '%');
                    male_area.children('div:nth-child(6)').children('p').text(round.male + '%');
                    break;

                case 'level7':
                    female_area.children('div:nth-child(7)').css('height', round.female + '%');
                    female_area.children('div:nth-child(7)').children('p').text(round.female + '%');

                    male_area.children('div:nth-child(7)').css('height', round.male + '%');
                    male_area.children('div:nth-child(7)').children('p').text(round.male + '%');
                    break;

                default:
                    // do nothing
            }
        }
    }


    // gender_social
    if ( fans_analytics.data.gender_social !== undefined ) {
        var source_area = $('table.source > tbody');
        var female_area = source_area.children('.female-data');
        var male_area = source_area.children('.male-data');

        for (key in fans_analytics.data.gender_social) {
            switch ( key ) {
                case 'female':
                    var round = fans_analytics.data.gender_social[key];
                    female_area.children('td:nth-child(2)').text(round.yut.numberFormat(0, '.', ','));
                    female_area.children('td:nth-child(3)').text(round.ig.numberFormat(0, '.', ','));
                    female_area.children('td:nth-child(4)').text(round.fb.numberFormat(0, '.', ','));
                    break;

                case 'male':
                    var round = fans_analytics.data.gender_social[key];
                    male_area.children('td:nth-child(2)').text(round.yut.numberFormat(0, '.', ','));
                    male_area.children('td:nth-child(3)').text(round.ig.numberFormat(0, '.', ','));
                    male_area.children('td:nth-child(4)').text(round.fb.numberFormat(0, '.', ','));
                    break;

                default:
                    // do nothing
            }
        }
    }


    // gender(環狀圖)
    if ( fans_analytics.data.gender !== undefined ) {
        var male = fans_analytics.data.gender.male;
        var female = fans_analytics.data.gender.female;

        // 甜甜圈圖
        var sexData = {
            datasets: [{
                data: [(female / 100), (male / 100)],
                backgroundColor:["#FE8AC6","#7DD3F3"]
            }],
            labels:['女','男']
        };
        var sex = document.getElementById("sex-data").getContext("2d");
        var mtChart_sex = new Chart(sex, {
            type: 'doughnut',
            data: sexData ,
            options: {
                legend:{
                    display:false,
                }
            }
        });

        if ( female > male ) {
            $('div.display-data > p.data-name').text('女');
            $('div.display-data > p.data-num').text(female + '%');
        } else {
            $('div.display-data > p.data-name').text('男');
            $('div.display-data > p.data-num').text(male + '%');
        }
    }
}

// 網紅偏好
var kol_prefer_html = '';
if ( kol_prefer.result === 'success' ) {
    if ( kol_prefer.data.length > 0 ) {
        for (var i=0; i<kol_prefer.data.length; i++) {
            var round = kol_prefer.data[i];
            kol_prefer_html += generateKolPreferHtml(round);
        }
    }
}
$('#kol_prefer .name-box').remove();
$('#kol_prefer .small-title').after(kol_prefer_html);

// 品牌偏好
var brand_prefer_data = [];
if ( brand_prefer.result === 'success' ) {
    if ( brand_prefer.data.length > 0 ) {
        for (var i=0; i<brand_prefer.data.length; i++) {
            var round = brand_prefer.data[i];
            brand_prefer_data.push({
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
        .words(brand_prefer_data)
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

// 產生網紅偏好html
function generateKolPreferHtml(data) {
    // <div class="net ig">IG</div>
    // <div class="net fb">FB</div>
    return  '<div class="name-box red">' +
                '<div class="f-pic">' +
                    '<img src="' + data.photo + '" alt="">' +
                    '<div class="net yt">YT</div>' +
                '</div>' +
                '<div class="f-text">' +
                    '<h5 class="f-name">' + data.name + '</h5>' +
                    '<h5 class="f-num">' + data.percent + '%</h5>' +
                    '<div class="prog fp">' +
                        '<div class="prog-value" style="width: ' + data.percent + '%;"></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
}