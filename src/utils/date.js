export default {
	friendlyDate: (timestamp) => {
		var formats = {
			'year': '%n% 年前',
			'month': '%n% 月前',
			'day': '%n% 天前',
			'hour': '%n% 小时前',
			'minute': '%n% 分钟前',
			'second': '%n% 秒前',
		};
		var now = Date.now();
		var seconds = Math.floor((now - parseInt(timestamp)) / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		var months = Math.floor(days / 30);
		var years = Math.floor(months / 12);

		var diffType = '';
		var diffValue = 0;
		if (years > 0) {
			diffType = 'year';
			diffValue = years;
		} else {
			if (months > 0) {
				diffType = 'month';
				diffValue = months;
			} else {
				if (days > 0) {
					diffType = 'day';
					diffValue = days;
				} else {
					if (hours > 0) {
						diffType = 'hour';
						diffValue = hours;
					} else {
						if (minutes > 0) {
							diffType = 'minute';
							diffValue = minutes;
						} else {
							diffType = 'second';
							diffValue = seconds === 0 ? (seconds = 1) : seconds;
						}
					}
				}
			}
		}
		return formats[diffType].replace('%n%', diffValue);
	},
	timeTodate: (format, timestamp) => {
		
		var myDate = new Date();  
		myDate.getYear(); //获取当前年份(2位)  
		myDate.getFullYear(); //获取完整的年份(4位,1970-????)  
		myDate.getMonth(); //获取当前月份(0-11,0代表1月)         // 所以获取当前月份是myDate.getMonth()+1;   
		myDate.getDate(); //获取当前日(1-31)  
		myDate.getDay(); //获取当前星期X(0-6,0代表星期天)  
		myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)  
		myDate.getHours(); //获取当前小时数(0-23)  
		myDate.getMinutes(); //获取当前分钟数(0-59)  
		myDate.getSeconds(); //获取当前秒数(0-59)  
		myDate.getMilliseconds(); //获取当前毫秒数(0-999)  
		myDate.toLocaleDateString(); //获取当前日期  
		var mytime=myDate.toLocaleTimeString(); //获取当前时间  
		myDate.toLocaleString( ); //获取日期与时间  

		// 2019-10-01 23:08:35
		var tmpDate = new Date(timestamp);
		var seconds = tmpDate.getSeconds();
		var minutes = ('0' + tmpDate.getMinutes()).substr(-2);
		var hours = tmpDate.getHours();
		var days = ('0' + tmpDate.getDate()).substr(-2);
		var months = ('0' + (tmpDate.getMonth() + 1)).substr(-2);
		var years = tmpDate.getFullYear();
		
		var value = '自定义替换值';
		// 输出格式为 .replace(被替换字符, 计算后值)

		return format.replace('Y', years).replace('m', months).replace('d', days).replace('H', hours).replace('i', minutes).replace('s', seconds).replace('index', value);
	}
}
