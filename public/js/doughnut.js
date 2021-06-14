// 甜甜圈圖
var sexData = {
	datasets: [{
		data: [0.72, 0.28],
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