var product_compare_product = productCompare(project_id, 'product');  console.log(product_compare_product);
var product_compare_competitor = productCompare(project_id, 'competitor');  console.log(product_compare_competitor);

// 清除所有內容
$('div.comp-box div.comp-data').remove();

// 產品比較
if ( (product_compare_product.result === 'success') && (product_compare_product.data.length > 0) ) {
    for (var i=0; i<product_compare_product.data.length; i++) {
        var round = product_compare_product.data[i];
        $('div.comp-box:nth-child(1) div.interactive').append( generateDataRow(round.brand_name, round.funs_level1_rate, round.funs_level2_rate, round.funs_level3_rate, round.funs_level4_rate) );

        $('div.comp-box:nth-child(1) div.grade').append( generateDataRow(round.brand_name, round.funs_level1_rate, round.funs_level2_rate, round.funs_level3_rate, round.funs_level4_rate) );
    }
}

//競品比較
if ( (product_compare_competitor.result === 'success') && (product_compare_competitor.data.length > 0) ) {
    for (var i=0; i<product_compare_competitor.data.length; i++) {
        var round = product_compare_competitor.data[i];
        $('div.comp-box:nth-child(2) div.interactive').append( generateDataRow(round.brand_name, round.funs_level1_rate, round.funs_level2_rate, round.funs_level3_rate, round.funs_level4_rate) );

        $('div.comp-box:nth-child(2) div.grade').append( generateDataRow(round.brand_name, round.funs_level1_rate, round.funs_level2_rate, round.funs_level3_rate, round.funs_level4_rate) );
    }
}

// 產生資料
function generateDataRow(brand_name, rate1, rate2, rate3, rate4){
    return  '<div class="comp-data">' +
                '<div class="name">' + brand_name + '</div>' +
                '<div class="bar-box">' +
                    '<div class="big-bar bar" style="width: ' + rate1 + '%;">' +
                        '<p class="bar-num">' + rate1 + '%</p>' +
                    '</div>' +
                    '<div class="medium-bar bar" style="width: ' + rate2 + '%;">' +
                        '<p class="bar-num">' + rate2 + '%</p>' +
                    '</div>' +
                    '<div class="small-bar bar" style="width: ' + rate3 + '%;">' +
                        '<p class="bar-num">' + rate3 + '%</p>' +
                    '</div>' +
                    '<div class="micro-bar bar" style="width: ' + rate4 + '%;">' +
                    '<p class="bar-num">' + rate4 + '%</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
}