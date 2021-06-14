// new
$(".select-all").click(function(){
	if($(this).hasClass("active")){
		$(this).removeClass("active");
	}else{
		$(this).addClass("active");
	}
})


$(".select-active").children("li").children("img").click(function(){
	$(this).parents("li").hide();
})
$(".active-box").click(function (event) {
	var y_con = $(this).children(".select-active").children("li");
	if (!y_con.is(event.target) && y_con.has(event.target).length === 0) {
		$(this).parents(".select-box").children(".select-option").slideToggle(100);
	}
});
$(document).click(function (event) {
	var y_con = $(".select-box");
	if (!y_con.is(event.target) && y_con.has(event.target).length === 0) {
		$(".select-box").children(".select-option").slideUp(100);
	}
});
$(".select-option").children("li").click(function(){
	$(this).parents(".select-option").hide();
})

$(".add-list").click(function(){
	if($(this).children(".plus-circle").hasClass("active")){
		$(this).children(".plus-circle").removeClass("active");
	}else {
		$(this).children(".plus-circle").addClass("active");
	}
})

$(".soc-content-tag").children(".arrow").click(function(){
	if(!$(this).hasClass("rotate")){
		$(this).addClass("rotate");
		$(".tgb-hide").css("display","table-row");
	}else{
		$(this).removeClass("rotate");
		$(".tgb-hide").hide();
	}
})

$(".video-box").click(function(){
	$(this).hide();
	$(this).parents("div").children(".vedio-detail").show();
	// $(this).parents("div").addClass("video-box-expand");
	$(this).parents("div").children(".shrink").show();
})
$(".shrink").click(function(){
	$(this).parents("div").children(".vedio-detail").hide();
	$(this).parents("div").children(".video-box").show();
	// $(this).parents("div").removeClass("video-box-expand");
	$(this).hide();
})

$("#social-menu")
	.children(".selected")
	.click(function () {
		$(this).parents("#social-menu").children(".option-box").slideToggle(100).css("display","flex");
	});
var selectWidth = $(".selected").width() + 2 + 30;
$(".option-box").css("width", selectWidth);
$(".option-box").children("li").click(function(){
	$(this).parents("#social-menu").children(".selected").children(".s-item").hide();
	if($(this).hasClass("option-all")){
		$(this).parents("#social-menu").children(".selected").children(".selected-all").show().css("display","inline-block");
	}else if($(this).hasClass("option-ig")){
		$(this).parents("#social-menu").children(".selected").children(".selected-ig").show().css("display","inline-block");
	}else if($(this).hasClass("option-fb")){
		$(this).parents("#social-menu").children(".selected").children(".selected-fb").show().css("display","inline-block");
	}else if($(this).hasClass("option-yt")){
		$(this).parents("#social-menu").children(".selected").children(".selected-yt").show().css("display","inline-block");
	}
})
$(document).click(function (event) {
	var y_con = $(".selected");
	if (!y_con.is(event.target) && y_con.has(event.target).length === 0) {
		$(".option-box").hide();
	}
});


var fansData = {
	datasets: [{
		data: [0.72, 0.28],
		backgroundColor:["rgb(119, 216, 222)", "rgb(230, 230, 230)"]
	}],
	labels:['真實帳號','鐵粉率']
};
var fans = document.getElementById("quality-circle").getContext("2d");
var mtChart_fans = new Chart(fans, {
	type: 'doughnut',
	data: fansData ,
	options: {
		legend:{
			display:false,
		}
	},
	cutoutPercentage: 80,
    elements: {
        arc: {
            borderWidth: 0
        },
    	center: {
        	text: "76",
        	color: '#4d4d4d',
        }
    },
});


var fansDataline = {
	labels: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
	],
	datasets: [
		{
			type: "line",
			label: "漲粉率",
			borderColor: "#77D8DE",
			borderWidth: 8,
			fill: false,
			yAxisID: "quality-data",
			data: [
				4,
				9,
				10,
				5,
				16,
				19,
			],
		},
	],
};
var QL = document.getElementById("quality-line").getContext("2d");
var fansPercent = new Chart(QL, {
	type: "line",
	data: fansDataline,
	barPercentage: 1,
	categoryPercentage: 1,
	options: {
		responsive: true,
		legend: {
			display: false,
		},
		scales: {
			yAxes: [
				{
					type: "linear",
					display: true,
					position: "left",
					id: "quality-data",
					ticks: {
						min: 0,
						max: 20,
						stepSize: 5,
						fontColor: "#455560",
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


var gpData = {
	datasets: [{
		data: [0.72, 0.28],
		backgroundColor:["#F871B7", "#6EB5D0"]
	}],
	labels:['女','男']
};
var gp = document.getElementById("gp-circle").getContext("2d");
var mtChart_gp = new Chart(gp, {
	type: 'doughnut',
	data: gpData ,
	options: {
		legend:{
			display:false,
		}
	},
	cutoutPercentage: 80,
    elements: {
        arc: {
            borderWidth: 0
        },
    	center: {
        	text: "76",
        	color: '#4d4d4d',
        }
    },
});


var gpBar = {
	labels: [
		"低",
		"中",
		"中高",
		"高",
	],
	datasets: [
		{
			type: "bar",
			label: "性別/消費力",
			borderColor: "#BED4EF",
			borderWidth: 8,
			backgroundColor: "#BED4EF",
			yAxisID: "gpBar",
			data: [
				24000,
				17800,
				2300,
				5000,
			],
		},
	],
};
var Chart_gpBar = document.getElementById("gp-bar").getContext("2d");
var gpBar_Data = new Chart(Chart_gpBar, {
	type: "bar",
	data: gpBar,
	options: {
		responsive: true,
		legend: {
			display: false,
		},
		scales: {
			yAxes: [
				{
					type: "linear",
					display: true,
					position: "left",
					id: "gpBar",
					ticks: {
						min: 0,
						max: 30000,
						stepSize: 10000,
						fontColor: "#455560",
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
					ticks: {
						fontColor: "#455560",
						fontSize: 12,
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


var ageBar = {
	labels: [
		"13-17",
		"18-25",
		"26-34",
		"35-44",
		"45-54",
		"55-64",
		"65+"
	],
	datasets: [
		{
			type: "bar",
			label: "年紀",
			borderColor: "#BED4EF",
			borderWidth: 8,
			backgroundColor: "#BED4EF",
			yAxisID: "ageBar",
			data: [
				24000,
				17800,
				2300,
				5000,
				24500,
				13487,
				2398,
			],
		},
	],
};
var Chart_ageBar = document.getElementById("age-bar").getContext("2d");
var ageBar_Data = new Chart(Chart_ageBar, {
	type: "bar",
	data: ageBar,
	options: {
		responsive: true,
		legend: {
			display: false,
		},
		scales: {
			yAxes: [
				{
					type: "linear",
					display: true,
					position: "left",
					id: "ageBar",
					ticks: {
						min: 0,
						max: 30000,
						stepSize: 10000,
						fontColor: "#455560",
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
					ticks: {
						fontColor: "#455560",
						fontSize: 12,
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