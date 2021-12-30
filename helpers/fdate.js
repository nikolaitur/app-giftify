const Fdate = (d1 = null, diff = null) => {
	let d = d1 ? new Date(d1) : new Date();

	if (d1 && diff) {
		d = new Date(d.getTime() + parseInt(diff));
	}

  const base = {
  	date: d,
  	year: d.getFullYear(),
  	month: ("0"+(d.getMonth()+1)).slice(-2),
  	day: ("0" + d.getDate()).slice(-2),
  	hours: ("0" + d.getHours()).slice(-2),
  	hours12: d.getHours() == 0 ? 12 : (d.getHours() < 13 ? d.getHours() : d.getHours() - 12),
  	minutes: ("0" + d.getMinutes()).slice(-2),
		period: d.getHours() < 12 ? 'am' : 'pm',
		offset: d.getTimezoneOffset() * 60 * 1000
	};

	base.format = (view = 'server', time = true) => {
		switch(view) {
			case 'server':
				return base.year + "-" + base.month + "-" + base.day + (time ? " " + base.hours + ":" + base.minutes : '')
				break;
			case 'client':
				return base.year + "-" + base.month + "-" + base.day + (time ? " @ " + base.hours12 + ":" + base.minutes + ' ' + base.period : '')
				break;
			case 'date':
				return base.year + "-" + base.month + "-" + base.day
				break;
		}
	};

  return base;
}

export default Fdate;