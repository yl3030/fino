$(".btn").click(function () {
    $(".btn").removeClass("active");
    $(this).addClass("active");
});

$(document).on('click', '.toggle-btn', function(){
    $(this).parents(".overview").children(".top-box").children(".content-box").slideToggle(500);
    $(this).parents(".data-box").children(".sd").children(".content-box").slideToggle(500);
    if ($(this).children(".fas").hasClass("arrow-turn")) {
        $(this).children(".fas").removeClass("arrow-turn");
    } else {
        $(this).children(".fas").addClass("arrow-turn");
    }
});

// 匯出檔案
$(".export").click(function () {
    $(this).parents(".export-box").children(".eb-cont").slideToggle(100);
});
$(document).click(function (event) {
    var _con = $(".export-box");
    if (!_con.is(event.target) && _con.has(event.target).length === 0) {
        $(".eb-cont").slideUp(100);
    }
});
$(".option").click(function () {
    if ($(this).hasClass("op-active")) {
        $(this).removeClass("op-active");
    } else {
        $(this).addClass("op-active");
    }
});
$(".file").click(function () {
    $(".file").removeClass("fi-active");
    $(this).addClass("fi-active");
});
$(".clear").click(function () {
    $(this).parents(".eb-cont").children(".option").removeClass("op-active");
});



// 網紅選項
$(".title-section").click(function () {
    if ($(this).children(".arrow").hasClass("op-arrow")) {
        $(this).children(".arrow").removeClass("op-arrow");
        $(this).parents(".s-title-box").children(".title-option").slideUp(100);
    } else {
        $(this).children(".arrow").addClass("op-arrow");
        $(this).parents(".s-title-box").children(".title-option").slideDown(100);
    }
});

// 排序方式
$(".arrange-section").click(function(){
    if($(this).hasClass("active-section")){
        $(this).removeClass("active-section");
        $(this).parents(".arrange").children(".title-option").slideUp(100);
    }else{
        $(this).addClass("active-section");
        $(this).parents(".arrange").children(".title-option").slideDown(100);
    }
});

// 點到空白處收回選單
$(document).click(function (event) {
    var _acon = $(".arrange");
    var _scon = $(".s-title-box");
    if (!_acon.is(event.target) && _acon.has(event.target).length === 0) {
        if (!_scon.is(event.target) && _scon.has(event.target).length === 0) {
            if ($(".title-section").children(".arrow").hasClass("op-arrow")) {
                $(".title-section").children(".arrow").removeClass("op-arrow");
                $(".s-title-box").children(".title-option").slideUp(100);
            }
            $(".title-option").slideUp(100);
            $(".arrange").children(".arrange-section").removeClass("active-section");
        }
    }
});



/* // 長條圖
    var chartData_yt = {
        labels: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
        ],
        datasets: [
            {
                type: "line",
                label: "互動率",
                borderColor: "#77D8DE",
                borderWidth: 8,
                fill: false,
                yAxisID: "YTinteraction",
                data: [
                    0.5,
                    1.55,
                    2.34,
                    3.4,
                    3.5,
                    4.2,
                    5.2,
                    5.78,
                    5.89,
                    6.33,
                    7.23,
                    7.24,
                    7.39,
                    8.35,
                    8.45,
                    8.93,
                    9.29,
                    10.44,
                    11.4,
                    12.4,
                    12.46,
                    13.67,
                    15.08,
                    15.83,
                    16.2,
                    17.3,
                    18.93,
                    19.42,
                    19.43,
                    19.58,
                ],
            },
            {
                type: "bar",
                label: "觀看數",
                borderColor: "#E3E4E4",
                borderWidth: 8,
                backgroundColor: "#E3E4E4",
                yAxisID: "YTsee",
                data: [
                    5000,
                    5673,
                    6920,
                    9315,
                    10934,
                    13952,
                    12945,
                    8419,
                    15930,
                    18439,
                    4273,
                    3907,
                    4729,
                    8923,
                    2944,
                    2453,
                    8574,
                    4673,
                    9764,
                    5657,
                    5636,
                    5457,
                    4366,
                    9673,
                    2434,
                    4325,
                    4256,
                    5473,
                    3254,
                    7893,
                ],
            },
        ],
    };

    document.getElementById("yt-day").addEventListener("click", function dayData() {
        // 日期
        myChart_yt.data.labels = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
        ];

        myChart_yt.data.datasets[0].data = [
            0.5,
            1.55,
            2.34,
            3.4,
            3.5,
            4.2,
            5.2,
            5.78,
            5.89,
            6.33,
            7.23,
            7.24,
            7.39,
            8.35,
            8.45,
            8.93,
            9.29,
            10.44,
            11.4,
            12.4,
            12.46,
            13.67,
            15.08,
            15.83,
            16.2,
            17.3,
            18.93,
            19.42,
            19.43,
            19.58,
        ];

        myChart_yt.data.datasets[1].data = [
            5000,
            5673,
            6920,
            9315,
            10934,
            13952,
            12945,
            8419,
            15930,
            18439,
            4273,
            3907,
            4729,
            8923,
            2944,
            2453,
            8574,
            4673,
            9764,
            5657,
            5636,
            5457,
            4366,
            9673,
            2434,
            4325,
            4256,
            5473,
            3254,
            7893,
        ];

        myChart_yt.update();
    });
*/

/* document
    .getElementById("yt-week")
    .addEventListener("click", function weekData() {
        myChart_yt.data.labels = [
            "7/1-7/4",
            "7/5-7/11",
            "7/12-7/18",
            "7/19-7/25",
            "7/26-7/31",
        ];
        myChart_yt.data.datasets[0].data = [3.56, 9.29, 15.33, 8.51, 14.29];
        myChart_yt.data.datasets[1].data = [3562, 5721, 10493, 6024, 18420];
        myChart_yt.update();
    }); */

/* document
    .getElementById("yt-month")
    .addEventListener("click", function monthData() {
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
        myChart_yt.data.datasets[0].data = [
            4.33,
            4.39,
            5.88,
            8.88,
            9.12,
            12.94,
            14.01,
            15.23,
            15.93,
            16.12,
            16.49,
            19.32,
        ];
        myChart_yt.data.datasets[1].data = [
            3531,
            3564,
            9139,
            3149,
            10483,
            2324,
            9405,
            13142,
            3920,
            4829,
            3524,
            19304,
        ];
        myChart_yt.update();
    }); */

/* var ytCtx = document.getElementById("yt-canvas").getContext("2d");
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
}); */

/* var chartData_ig = {
    labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
    ],
    datasets: [
        {
            type: "line",
            label: "互動率",
            borderColor: "#77D8DE",
            borderWidth: 8,
            fill: false,
            yAxisID: "IGinteraction",
            data: [
                0.5,
                1.55,
                2.34,
                3.4,
                3.5,
                4.2,
                5.2,
                5.78,
                5.89,
                6.33,
                7.23,
                7.24,
                7.39,
                8.35,
                8.45,
                8.93,
                9.29,
                10.44,
                11.4,
                12.4,
                12.46,
                13.67,
                15.08,
                15.83,
                16.2,
                17.3,
                18.93,
                19.42,
                19.43,
                19.58,
            ],
        },
        {
            type: "bar",
            label: "觀看數",
            borderColor: "#E3E4E4",
            borderWidth: 8,
            backgroundColor: "#E3E4E4",
            yAxisID: "IGsee",
            data: [
                5000,
                5673,
                6920,
                9315,
                10934,
                13952,
                12945,
                8419,
                15930,
                18439,
                4273,
                3907,
                4729,
                8923,
                2944,
                2453,
                8574,
                4673,
                9764,
                5657,
                5636,
                5457,
                4366,
                9673,
                2434,
                4325,
                4256,
                5473,
                3254,
                7893,
            ],
        },
    ],
};
document.getElementById("ig-day").addEventListener("click", function dayData() {
    myChart_ig.data.labels = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
    ];
    myChart_ig.data.datasets[0].data = [
        0.5,
        1.55,
        2.34,
        3.4,
        3.5,
        4.2,
        5.2,
        5.78,
        5.89,
        6.33,
        7.23,
        7.24,
        7.39,
        8.35,
        8.45,
        8.93,
        9.29,
        10.44,
        11.4,
        12.4,
        12.46,
        13.67,
        15.08,
        15.83,
        16.2,
        17.3,
        18.93,
        19.42,
        19.43,
        19.58,
    ];
    myChart_ig.data.datasets[1].data = [
        5000,
        5673,
        6920,
        9315,
        10934,
        13952,
        12945,
        8419,
        15930,
        18439,
        4273,
        3907,
        4729,
        8923,
        2944,
        2453,
        8574,
        4673,
        9764,
        5657,
        5636,
        5457,
        4366,
        9673,
        2434,
        4325,
        4256,
        5473,
        3254,
        7893,
    ];
    myChart_ig.update();
});

document
    .getElementById("ig-week")
    .addEventListener("click", function weekData() {
        myChart_ig.data.labels = [
            "7/1-7/4",
            "7/5-7/11",
            "7/12-7/18",
            "7/19-7/25",
            "7/26-7/31",
        ];
        myChart_ig.data.datasets[0].data = [3.56, 9.29, 15.33, 8.51, 14.29];
        myChart_ig.data.datasets[1].data = [3562, 5721, 10493, 6024, 18420];
        myChart_ig.update();
    });

document
    .getElementById("ig-month")
    .addEventListener("click", function monthData() {
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
        myChart_ig.data.datasets[0].data = [
            4.33,
            4.39,
            5.88,
            8.88,
            9.12,
            12.94,
            14.01,
            15.23,
            15.93,
            16.12,
            16.49,
            19.32,
        ];
        myChart_ig.data.datasets[1].data = [
            3531,
            3564,
            9139,
            3149,
            10483,
            2324,
            9405,
            13142,
            3920,
            4829,
            3524,
            19304,
        ];
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
        },
        scales: {
            yAxes: [
                {
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
}); */

/* var chartData_fb = {
    labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
    ],
    datasets: [
        {
            type: "line",
            label: "互動率",
            borderColor: "#77D8DE",
            borderWidth: 8,
            fill: false,
            yAxisID: "FBinteraction",
            data: [
                0.5,
                1.55,
                2.34,
                3.4,
                3.5,
                4.2,
                5.2,
                5.78,
                5.89,
                6.33,
                7.23,
                7.24,
                7.39,
                8.35,
                8.45,
                8.93,
                9.29,
                10.44,
                11.4,
                12.4,
                12.46,
                13.67,
                15.08,
                15.83,
                16.2,
                17.3,
                18.93,
                19.42,
                19.43,
                19.58,
            ],
        },
        {
            type: "bar",
            label: "觀看數",
            borderColor: "#E3E4E4",
            borderWidth: 8,
            backgroundColor: "#E3E4E4",
            yAxisID: "FBsee",
            data: [
                5000,
                5673,
                6920,
                9315,
                10934,
                13952,
                12945,
                8419,
                15930,
                18439,
                4273,
                3907,
                4729,
                8923,
                2944,
                2453,
                8574,
                4673,
                9764,
                5657,
                5636,
                5457,
                4366,
                9673,
                2434,
                4325,
                4256,
                5473,
                3254,
                7893,
            ],
        },
    ],
};

document.getElementById("fb-day").addEventListener("click", function dayData() {
    myChart_fb.data.labels = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
    ];
    myChart_fb.data.datasets[0].data = [
        0.5,
        1.55,
        2.34,
        3.4,
        3.5,
        4.2,
        5.2,
        5.78,
        5.89,
        6.33,
        7.23,
        7.24,
        7.39,
        8.35,
        8.45,
        8.93,
        9.29,
        10.44,
        11.4,
        12.4,
        12.46,
        13.67,
        15.08,
        15.83,
        16.2,
        17.3,
        18.93,
        19.42,
        19.43,
        19.58,
    ];
    myChart_fb.data.datasets[1].data = [
        5000,
        5673,
        6920,
        9315,
        10934,
        13952,
        12945,
        8419,
        15930,
        18439,
        4273,
        3907,
        4729,
        8923,
        2944,
        2453,
        8574,
        4673,
        9764,
        5657,
        5636,
        5457,
        4366,
        9673,
        2434,
        4325,
        4256,
        5473,
        3254,
        7893,
    ];
    myChart_fb.update();
});

document
    .getElementById("fb-week")
    .addEventListener("click", function weekData() {
        myChart_fb.data.labels = [
            "7/1-7/4",
            "7/5-7/11",
            "7/12-7/18",
            "7/19-7/25",
            "7/26-7/31",
        ];
        myChart_fb.data.datasets[0].data = [3.56, 9.29, 15.33, 8.51, 14.29];
        myChart_fb.data.datasets[1].data = [3562, 5721, 10493, 6024, 18420];
        myChart_fb.update();
    });

document
    .getElementById("fb-month")
    .addEventListener("click", function monthData() {
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
        myChart_fb.data.datasets[0].data = [
            4.33,
            4.39,
            5.88,
            8.88,
            9.12,
            12.94,
            14.01,
            15.23,
            15.93,
            16.12,
            16.49,
            19.32,
        ];
        myChart_fb.data.datasets[1].data = [
            3531,
            3564,
            9139,
            3149,
            10483,
            2324,
            9405,
            13142,
            3920,
            4829,
            3524,
            19304,
        ];
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
}); */
