function errorMsg($msg){
	if($msg == 'percent_err')
		return '付款比例錯誤，總和需等於 100%';
	else if($msg == 'end_recruit')
		return '招募已截止囉!';
	else if($msg == 'stage_err')
		return '請填寫正確付款階段';
	else
		return '網路環境不穩，請稍候再嘗試';
}