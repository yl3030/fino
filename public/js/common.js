var kol_detail = {
	'detail': function(id) {
		$.ajax({
			url: '/providers/detail',
			type: 'post',
			data: 'id=' + id,
			dataType: 'json',
			success: function(json) {
				
				if(json.result == "success") {
					var gender, age = '25-34歲', child = '小孩 : 無', pet, country, marriage;
					if(json.data.gender == 'male')
						gender = '男';
					else if(json.data.gender == 'female')
						gender = '女';
					else
						gender = '無性別';
					
					var currentTime = new Date();
					var nowyear = currentTime.getFullYear();
					var born = json.data.birthday.split("-");
					var bornyear = parseInt(born[0]);
	
					if(nowyear - bornyear < 100)//LEO_HSIEH 當出生年月日不是 0000-00-00的時候
					{
						age = nowyear-bornyear + '歲';
					}
					
					if(json.data.child_born_year.length != 0){
						if(nowyear - json.data.child_born_year < 100)
							child = '小孩 : ' + (nowyear-json.data.child_born_year).toString() + '歲';
						else
							child = '小孩 : 6-8歲';
					}
						
	
					if(json.data.pet.length != 0)
						pet='寵物 : 有';
					else
						pet='寵物 : 無';
					
					if(json.data.marriage == 'married')
						marriage='已婚';
					else
						marriage='未婚';
					var script = json.data.name_tw + ' | ' + gender + ' | ' + age +'<br>';
					script += '婚姻 : ' + marriage + ' | ' + child + ' | ' + pet;
	
					/*台灣 | 女 | 25-34歲<br>
								婚姻 : 已婚 | 小孩 : 6-8歲 | 寵物 : 有*/
	
					$('#kol-detail .user-photo').css('background-image', "url('" + json.data.picture + "')");
	
					$('#kol-detail .user-detail').html(script);
					$('#kol-detail h2').html(json.data.title);
					$('#kol-detail .desc').html(json.data.description);
					$('#kol-detail .tag-list').html('');
					$('#kol-detail .tg15.prices').html('圖文 NT' + (json.data.img_txt_price/1).toLocaleString() + ' | 影片 ' + (json.data.video_price/1).toLocaleString());//圖文 NT20,000-50,000 | 影片 NT20,000-50,000
					
					//Canon 佳能:50.0,Apple 蘋果:7.0,SAMSUNG 三星:3.0,Razer 雷蛇:2.0,Beats:1.0
					var type = json.data.content_brand.split(",");
					var content='';
					for(let i=0; i<type.length; i++)
					{
						var t = type[i].split(":");
						var t_space = t[0].split(" ");
						for(let j=0; j<t_space.length; j++)
						{
							content += t_space[j] + '。';
						}
					}
					$('#kol-detail .tg15.brand').html(content)
	
					var ytDetailScript = '訂閱數 ' + json.data.subscribe_count/1000 + 'K | 影片數 ' + json.data.yt_video_count + ' | 平均觀看數 ' + ((json.data.view_count/json.data.yt_video_count)/1000).toFixed(3) + 'K';
					$('#kol-detail .info-detail').html(ytDetailScript)//訂閱數 165K   |   影片數 105   |   平均觀看數 1220K
	
					$('#kol-detail .val.int_rate').html((json.data.interactive_rate*100).toFixed(3) + '%<img src="https://fino-david-backup.s3-ap-northeast-1.amazonaws.com/p/img_pool/5ceLqn_fill_8.png">');
					$('#kol-detail .val.emv').html(json.data.emv + '%<img src="https://fino-david-backup.s3-ap-northeast-1.amazonaws.com/p/img_pool/5ceLqn_fill_8.png">');
					$('#kol-detail .val.sc_int_rete').html((json.data.sales_corp_interactive_rate*100).toFixed(3) + '%<img src="https://fino-david-backup.s3-ap-northeast-1.amazonaws.com/p/img_pool/5ceLqn_fill_8.png">');
					$('#kol-detail .val.grow_fans').html((json.data.grow_fans_rate*100).toFixed(3) + '%<img src="https://fino-david-backup.s3-ap-northeast-1.amazonaws.com/p/img_pool/5ceLqn_fill_8.png">');
					
					//LEO_HSIEH: ＤＢ資料尚未完整所以算式裡面的分母先加一 避免除以零 
					//$('#kol-detail .val.fino_level').html(((json.data.emv + json.data.lowest_budget)/(json.data.interactive_val + json.data.cooperation_level +1)).toFixed(3) + '%<img src="https://fino-david-backup.s3-ap-northeast-1.amazonaws.com/p/img_pool/5ceLqn_fill_8.png">');
	
					$('#kol-detail .cover').css('background-image', "url('" + json.data.picture + "')");
	
					for (var i = 0; i < json.data.tags.length; i++) {
						$('#kol-detail .tag-list').append('<li><a>' + json.data.tags[i].txt + '</a></li>');
					}	
	
					//showAskDialog(json.content)
					//window.top.location = json.data.loc;
				} else {
	
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
			
			if($('#work-content').attr('class') == 'active'){
				getWorkConetent(e, id);
			}
			else if($('#fans-content').attr('class') == 'active') {
				getFansConetent(e, id);
			}
	
			showFilterDialog('kol-detail');
		
		});
	}
}

		
		