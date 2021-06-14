$(".btn").click(function () {
	$(".btn").removeClass("active");
	$(this).addClass("active");
});

$(".toggle-btn").click(function () {
	if ($(this).children(".fas").hasClass("arrow-turn")) {
		$(this)
			.parents(".analysis-box")
			.children(".box")
			.children(".content-box")
			.slideToggle(500);
		$(this).children(".fas").removeClass("arrow-turn");
	} else {
		$(this)
			.parents(".analysis-box")
			.children(".box")
			.children(".content-box")
			.slideToggle(500);
		$(this).children(".fas").addClass("arrow-turn");
	}
});

var chartData_yt = {
	labels: [
		"1","2","3","4","5","6","7","8","9","10",
		"11","12","13","14","15","16","17","18","19","20",
		"21","22","23","24","25","26","27","28","29","30",
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
				0.5, 1.55, 2.34, 3.4, 3.5, 4.2, 5.2, 5.78, 5.89, 6.33,
				7.23, 7.24, 7.39, 8.35, 8.45, 8.93, 9.29, 10.44, 11.4, 12.4,
				12.46, 13.67, 15.08, 15.83, 16.2, 17.3, 18.93, 19.42, 19.43, 19.58,
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
				5000, 5673, 6920, 9315, 10934, 13952, 12945, 8419, 15930, 18439,
				4273, 3907, 4729, 8923, 2944, 2453, 8574, 4673, 9764, 5657,
				5636, 5457, 4366, 9673, 2434, 4325, 4256, 5473, 3254, 7893,
			],
		},
	],
};

document.getElementById("yt-day").addEventListener("click", function dayData() {
	myChart_yt.data.labels = [
		"1","2","3","4","5","6","7","8","9","10",
		"11","12","13","14","15","16","17","18","19","20",
		"21","22","23","24","25","26","27","28","29","30",
	];
	myChart_yt.data.datasets[0].data = [
		0.5, 1.55, 2.34, 3.4, 3.5, 4.2, 5.2, 5.78, 5.89, 6.33,
		7.23, 7.24, 7.39, 8.35, 8.45, 8.93, 9.29, 10.44, 11.4, 12.4,
		12.46, 13.67, 15.08, 15.83, 16.2, 17.3, 18.93, 19.42, 19.43, 19.58,
	];
	myChart_yt.data.datasets[1].data = [
		5000, 5673, 6920, 9315, 10934, 13952, 12945, 8419, 15930, 18439,
		4273, 3907, 4729, 8923, 2944, 2453, 8574, 4673, 9764, 5657,
		5636, 5457, 4366, 9673, 2434, 4325, 4256, 5473, 3254, 7893,
	];
	myChart_yt.update();
});

document
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
	});

document
	.getElementById("yt-month")
	.addEventListener("click", function monthData() {
		myChart_yt.data.labels = [
			"一月", "二月", "三月", "四月", "五月",
			"六月", "七月", "八月", "九月", "十月",
			"十一月", "十二月",
		];
		myChart_yt.data.datasets[0].data = [
			4.33, 4.39, 5.88, 8.88, 9.12,
			12.94, 14.01, 15.23, 15.93, 16.12,
			16.49, 19.32,
		];
		myChart_yt.data.datasets[1].data = [
			3531, 3564, 9139, 3149, 10483,
			2324, 9405, 13142, 3920, 4829,
			3524, 19304,
		];
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
			}	
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
			xAxes: [{
				gridLines: {
					display: false,
				},
			}],
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



var chartData_ig = {
	labels: [
		"1","2","3","4","5","6","7","8","9","10",
		"11","12","13","14","15","16","17","18","19","20",
		"21","22","23","24","25","26","27","28","29","30",
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
				0.5, 1.55, 2.34, 3.4, 3.5, 4.2, 5.2, 5.78, 5.89, 6.33,
				7.23, 7.24, 7.39, 8.35, 8.45, 8.93, 9.29, 10.44, 11.4, 12.4,
				12.46, 13.67, 15.08, 15.83, 16.2, 17.3, 18.93, 19.42, 19.43, 19.58,
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
				5000, 5673, 6920, 9315, 10934, 13952, 12945, 8419, 15930, 18439,
				4273, 3907, 4729, 8923, 2944, 2453, 8574, 4673, 9764, 5657,
				5636, 5457, 4366, 9673, 2434, 4325, 4256, 5473, 3254, 7893,
			],
		},
	],
};
document.getElementById("ig-day").addEventListener("click", function dayData() {
	myChart_ig.data.labels = [
		"1","2","3","4","5","6","7","8","9","10",
		"11","12","13","14","15","16","17","18","19","20",
		"21","22","23","24","25","26","27","28","29","30",
	];
	myChart_ig.data.datasets[0].data = [
		0.5, 1.55, 2.34, 3.4, 3.5, 4.2, 5.2, 5.78, 5.89, 6.33,
		7.23, 7.24, 7.39, 8.35, 8.45, 8.93, 9.29, 10.44, 11.4, 12.4,
		12.46, 13.67, 15.08, 15.83, 16.2, 17.3, 18.93, 19.42, 19.43, 19.58,
	];
	myChart_ig.data.datasets[1].data = [
		5000, 5673, 6920, 9315, 10934, 13952, 12945, 8419, 15930, 18439,
		4273, 3907, 4729, 8923, 2944, 2453, 8574, 4673, 9764, 5657,
		5636, 5457, 4366, 9673, 2434, 4325, 4256, 5473, 3254, 7893,
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
			"一月", "二月", "三月", "四月", "五月",
			"六月", "七月", "八月", "九月", "十月",
			"十一月", "十二月",
		];
		myChart_ig.data.datasets[0].data = [
			4.33, 4.39, 5.88, 8.88, 9.12,
			12.94, 14.01, 15.23, 15.93, 16.12,
			16.49, 19.32,
		];
		myChart_ig.data.datasets[1].data = [
			3531, 3564, 9139, 3149, 10483,
			2324, 9405, 13142, 3920, 4829,
			3524, 19304,
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
				}
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
				xAxes: [{
					gridLines: {
						display: false,
					},
				}],
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



var chartData_fb = {
	labels: [
		"1","2","3","4","5","6","7","8","9","10",
		"11","12","13","14","15","16","17","18","19","20",
		"21","22","23","24","25","26","27","28","29","30",
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
				0.5, 1.55, 2.34, 3.4, 3.5, 4.2, 5.2, 5.78, 5.89, 6.33,
				7.23, 7.24, 7.39, 8.35, 8.45, 8.93, 9.29, 10.44, 11.4, 12.4,
				12.46, 13.67, 15.08, 15.83, 16.2, 17.3, 18.93, 19.42, 19.43, 19.58,
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
				5000, 5673, 6920, 9315, 10934, 13952, 12945, 8419, 15930, 18439,
				4273, 3907, 4729, 8923, 2944, 2453, 8574, 4673, 9764, 5657,
				5636, 5457, 4366, 9673, 2434, 4325, 4256, 5473, 3254, 7893,
			],
		},
	],
};

document.getElementById("fb-day").addEventListener("click", function dayData() {
	myChart_fb.data.labels = [
		"1","2","3","4","5","6","7","8","9","10",
		"11","12","13","14","15","16","17","18","19","20",
		"21","22","23","24","25","26","27","28","29","30",
	];
	myChart_fb.data.datasets[0].data = [
		0.5, 1.55, 2.34, 3.4, 3.5, 4.2, 5.2, 5.78, 5.89, 6.33,
		7.23, 7.24, 7.39, 8.35, 8.45, 8.93, 9.29, 10.44, 11.4, 12.4,
		12.46, 13.67, 15.08, 15.83, 16.2, 17.3, 18.93, 19.42, 19.43, 19.58,
	];
	myChart_fb.data.datasets[1].data = [
		5000, 5673, 6920, 9315, 10934, 13952, 12945, 8419, 15930, 18439,
		4273, 3907, 4729, 8923, 2944, 2453, 8574, 4673, 9764, 5657,
		5636, 5457, 4366, 9673, 2434, 4325, 4256, 5473, 3254, 7893,
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
			"一月", "二月", "三月", "四月", "五月",
			"六月", "七月", "八月", "九月", "十月",
			"十一月", "十二月",
		];
		myChart_fb.data.datasets[0].data = [
			4.33, 4.39, 5.88, 8.88, 9.12,
			12.94, 14.01, 15.23, 15.93, 16.12,
			16.49, 19.32,
		];
		myChart_fb.data.datasets[1].data = [
			3531, 3564, 9139, 3149, 10483,
			2324, 9405, 13142, 3920, 4829,
			3524, 19304,
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
			}
			
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
			xAxes: [{
				gridLines: {
					display: false,
				},
			}],
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
