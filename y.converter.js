(function (window, undefined) {
	var arg = function (a) {
		a = !isNaN(a) ? a : false;
		return a;
	};
	var get_correction = function (a) {
		var splitval = a.toString().indexOf('.');
		var precision = 0;
		if (splitval > 0) { precision = a.toString().split(".")[1].length; }
		var result = Math.pow(10, precision);
		return result;
	};
	var mul = function (a, b) {
		var x = get_correction(a);
		var y = get_correction(b);
		return ((a * x) * (b * y)) / (x * y);
	};
	var div = function (a, b) {
		var x = get_correction(a);
		var y = get_correction(b);
		var res = ((a * x) / (b * y));
		var z = get_correction(res);
		return (res * z) / (x * y * z);
	};
	var y_math = {
		mul: function (a, b) { return arg(a) && arg(b) ? mul(a, b) : false; },
		div: function (a, b) { return arg(a) && arg(b) ? div(a, b) : false; }
	};
	var y_now_string = function (param) {
		var now = new Date();
		return y_datetime_convert(now, param);
	};
	var y_this_month = function (param) {
		this_month = new Date();
		//this_month = new Date(this_month);
		//last_month.setDate(this_month.getDate() - 1);
		return y_datetime_convert(this_month, param);
	};
	var y_last_month = function (param) {
		this_month = new Date();
		last_month = new Date(this_month);
		last_month.setMonth(last_month.getMonth() - 1);
		return y_datetime_convert(last_month, param);
	};
	var y_next_month = function (param) {
		this_month = new Date();
		next_month = new Date(this_month);
		next_month.setMonth(next_month.getMonth() + 1);
		return y_datetime_convert(next_month, param);
	};
	var y_yesterday = function (param) {
		today = new Date();
		yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		return y_datetime_convert(yesterday, param);
	};
	var y_last_hour = function (param) {
		today = new Date();
		time = new Date(today);
		time.setHours(today.getHours() - 1);
		return y_datetime_convert(time, param);
	};
	var y_next_hour = function (param) {
		today = new Date();
		time = new Date(today);
		time.setHours(today.getHours() + 1);
		return y_datetime_convert(time, param);
	};
	var y_day = function (dateString) {
		var weekday = [];
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		var d = new Date(dateString);
		var n = d.getDay();
		return weekday[n];
	};
	var y_month_name = function (dateString) {
		var monthName = [];
		monthName[0] = "January";
		monthName[1] = "February";
		monthName[2] = "March";
		monthName[3] = "April";
		monthName[4] = "May";
		monthName[5] = "June";
		monthName[6] = "July";
		monthName[7] = "August";
		monthName[8] = "September";
		monthName[9] = "October";
		monthName[10] = "November";
		monthName[11] = "December";
		var d = new Date(dateString);
		var n = d.getMonth();
		return monthName[n];
	};
	var y_tomorrow = function (param) {
		today = new Date();
		tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		return y_datetime_convert(tomorrow, param);
	};

	var y_datetime_convert = function (date, param) {
		var result;
		switch (param) {
			case 'short_time':
				var _h = date.getHours();
				var _m = date.getMinutes();
				result = _h + ':' + _m;
				break;
			case 'time':
				result = date_to_time(date); // hh:ii:ss
				break;
			case 'simple_time':
				result = date_to_simple_time(date); // hh:ii:ss
				break;
			case 'simple_month':
				result = date_to_simple_month(date); // mm/yyyy
				break;
			case 'long_datetime':
				result = date_to_long_datetime(date); // mm/dd/yyyy hh:ii
				break;
			case 'medium_date':
				result = date_to_medium_date(date); // mm/dd/yyyy
				break;
			case 'dd/mm/yyyy':
				result = date_dd_mm_yyyy(date); // mm/dd/yyyy
				break;
			case 'medium_datetime':
				result = date_to_medium_datetime(date); // mm/dd/yyyy hh:ii
				break;
			case 'file_tag':
				result = date_to_file_tag(date); // yyyy_mm_dd_hh_ii;
				break;
			case 'serial_datetime':
				result = date_to_serial_datetime(date); // yyyymmddhhiiss;
				break;
			case 'coded_datetime':
				result = date_to_coded_datetime(date); // yyyymmddhhiiss;
				break;
			case 'date_sql_to_medium_date':
				result = date_sql_to_medium_date(date); // yyyy-mm-dd to mm/dd/yyyy
				break;
			case 'datetime_sql_to_medium_datetime':
				result = datetime_sql_to_medium_datetime(date);
				break;
			case 'medium_datetime_to_date_sql':
				result = medium_datetime_to_date_sql(date);
				break;
			case 'datetime_sql_to_medium_date':
				result = datetime_sql_to_medium_date(date);
				break;
			case 'medium_date_to_date_sql':
				result = medium_date_to_date_sql(date);
				break;
			case 'medium_date_to_datetime_sql':
				result = medium_date_to_datetime_sql(date);
				break;
			case 'sap_std':
				result = sap_std(date); //dd.mm.yyyy
				break;
		}
		return result;
	};

	var sap_std = function (sql_date) {
		// convert yyyy-mm-dd to dd.mm.yyyy
		if (sql_date && sql_date !== '') {
			array_date = sql_date.split("-");
			var _yyyy = (array_date[0]);
			var _mm = (array_date[1]);
			var _dd = (array_date[2]);
			return _dd + '.' + _mm + '.' + _yyyy;
		}
		else {
			return sql_date;
		}
	};
	function date_to_long_datetime(date) {
		var _yyyy = date.getFullYear();
		var _mm = date.getMonth() + 1;
		var _dd = date.getDate();
		var _hh = date.getHours();
		var _ii = date.getMinutes();
		var _ss = date.getSeconds();
		if (_dd < 10) { _dd = '0' + _dd; }
		if (_mm < 10) { _mm = '0' + _mm; }
		if (_hh < 10) { _hh = '0' + _hh; }
		if (_ii < 10) { _ii = '0' + _ii; }
		if (_ss < 10) { _ss = '0' + _ss; }
		return _mm + '/' + _dd + '/' + _yyyy + ' ' + _hh + ':' + _ii + ':' + _ss;
	}

	function date_to_time(date) {
		var _hh = date.getHours();
		var _ii = date.getMinutes();
		var _ss = date.getSeconds();
		if (_hh < 10) { _hh = '0' + _hh; }
		if (_ii < 10) { _ii = '0' + _ii; }
		if (_ss < 10) { _ss = '0' + _ss; }
		return _hh + ':' + _ii + ':' + _ss;
	}
	function date_to_simple_time(date) {
		var _hh = date.getHours();
		var _ii = date.getMinutes();
		if (_hh < 10) { _hh = '0' + _hh; }
		if (_ii < 10) { _ii = '0' + _ii; }
		return _hh + ':' + _ii;
	}
	function date_to_simple_month(date) {
		var _yyyy = date.getFullYear();
		var _mm = date.getMonth() + 1;
		if (_mm < 10) { _mm = '0' + _mm; }
		return _mm + '/' + _yyyy;
	}
	function date_to_medium_date(date) {
		var _yyyy = date.getFullYear();
		var _mm = date.getMonth() + 1;
		var _dd = date.getDate();
		if (_dd < 10) { _dd = '0' + _dd; }
		if (_mm < 10) { _mm = '0' + _mm; }
		return _mm + '/' + _dd + '/' + _yyyy;
	}
	function date_dd_mm_yyyy(date) {
		var _yyyy = date.getFullYear();
		var _mm = date.getMonth() + 1;
		var _dd = date.getDate();
		if (_dd < 10) { _dd = '0' + _dd; }
		if (_mm < 10) { _mm = '0' + _mm; }
		return _dd + '/' + _mm + '/' + _yyyy;
	}
	function date_to_medium_datetime(date) {
		var _yyyy = date.getFullYear();
		var _mm = date.getMonth() + 1;
		var _dd = date.getDate();
		var _hh = date.getHours();
		var _ii = date.getMinutes();
		if (_dd < 10) { _dd = '0' + _dd; }
		if (_mm < 10) { _mm = '0' + _mm; }
		if (_hh < 10) { _hh = '0' + _hh; }
		if (_ii < 10) { _ii = '0' + _ii; }
		return _mm + '/' + _dd + '/' + _yyyy + ' ' + _hh + ':' + _ii;
	}
	function date_to_file_tag(date) {
		var _yyyy = date.getFullYear();
		var _mm = date.getMonth() + 1;
		var _dd = date.getDate();
		var _hh = date.getHours();
		var _ii = date.getMinutes();
		if (_dd < 10) { _dd = '0' + _dd; }
		if (_mm < 10) { _mm = '0' + _mm; }
		if (_hh < 10) { _hh = '0' + _hh; }
		if (_ii < 10) { _ii = '0' + _ii; }
		return _yyyy + '_' + _mm + '_' + _dd + '_' + _hh + '_' + _ii;
	}
	function date_sql_to_medium_date(yyyymmdd_date) {
		// convert yyyy-mm-dd to mm/dd/yyyy
		if (yyyymmdd_date && yyyymmdd_date !== '') {
			array_date = yyyymmdd_date.split("-");
			var yyyy = (array_date[0]);
			var mm = (array_date[1]);
			var dd = (array_date[2]);
			mmddyyyy = mm + '/' + dd + '/' + yyyy;
			return mmddyyyy;
		}
		else {
			return "";
		}
	}
	function datetime_sql_to_medium_datetime(date) {
		// convert yyyy-mm-dd to mm/dd/yyyy
		var result = date;
		if (date && date !== '') {
			array_datetime = date.split(" ");
			if (typeof array_datetime[0] !== 'undefined' && typeof array_datetime[1] !== 'undefined') {
				array_date = array_datetime[0].split("-");
				array_time = array_datetime[1].split(":");
				if (typeof array_date[0] !== 'undefined' &&
					typeof array_date[1] !== 'undefined' &&
					typeof array_date[2] !== 'undefined' &&
					typeof array_time[0] !== 'undefined' &&
					typeof array_time[1] !== 'undefined' &&
					typeof array_time[2] !== 'undefined'
				); {
					var yyyy = (array_date[0]);
					var mm = (array_date[1]);
					var dd = (array_date[2]);
					var hh = (array_time[0]);
					var ii = (array_time[1]);
					result = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + ii;
				}
			}
		}
		return result;
	}
	function medium_date_to_date_sql(date) {
		// convert mm/dd/yyyy to yyyy-mm-dd
		if (date) {
			array_date = date.split("/");
			var yyyy = (array_date[2]);
			var mm = (array_date[0]);
			var dd = (array_date[1]);
			var std_date = yyyy + '-' + mm + '-' + dd;
			return std_date;
		}
		else {
			return "";
		}
	}
	function medium_date_to_datetime_sql(date) {
		// convert mm/dd/yyyy to yyyy-mm-dd 00:00:00
		if (date) {
			array_date = date.split("/");
			var yyyy = (array_date[2]);
			var mm = (array_date[0]);
			var dd = (array_date[1]);
			var std_date = yyyy + '-' + mm + '-' + dd + ' 00:00:00';
			return std_date;
		}
		else {
			return "";
		}
	}
	function medium_datetime_to_date_sql(date) {
		// convert mm/dd/yyyy hh:ii:ss to yyyy-mm-dd
		if (date) {
			array_datetime = date.split(" ");
			array_date = array_datetime[0].split("/");
			var yyyy = (array_date[2]);
			var mm = (array_date[0]);
			var dd = (array_date[1]);
			var std_date = yyyy + '-' + mm + '-' + dd;
			return std_date;
		}
		else {
			return "";
		}
	}
	function date_to_serial_datetime(date) {
		// convert date to yyyymmddhhiiss
		var yyyy = date.getFullYear();
		var mm = date.getMonth() + 1;
		var dd = date.getDate();
		var hh = date.getHours();
		var ii = date.getMinutes();
		var ss = date.getSeconds();
		if (dd < 10) { dd = '0' + dd; }
		if (mm < 10) { mm = '0' + mm; }
		if (hh < 10) { hh = '0' + hh; }
		if (ii < 10) { ii = '0' + ii; }
		if (ss < 10) { ss = '0' + ss; }
		return yyyy + mm + dd + hh + ii + ss;
	}
	function date_to_coded_datetime(date) {
		// convert date to XyyMddHiiss
		if (typeof date === 'object') {
			var yyyy = date.getFullYear();
			var mm = date.getMonth() + 1;
			var dd = date.getDate();
			var hh = date.getHours();
			var ii = date.getMinutes();
			var ss = date.getSeconds();
			yyyy = yyyy.toString();
			var yy1 = yyyy.substring(0, 2);
			var yy2 = yyyy.substring(2, 4);
			var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split('');
			if (yy1 >= 20 && yy1 < 56) { // after 2000
				yy1 = yy1 - 20;
				yy1 = alpha[yy1];
			}
			else if (yy1 < 20) { // before 2000
				yy1 = 'A' + alpha[yy1];
			}
			yyyy = yy1.concat(yy2);
			mm = alpha[mm];
			dd = alpha[dd];
			hh = alpha[hh];
			ms = (ii * 60 + ss);
			ms = y_add_pre_zero(ms, 4);
			ms = ms.toString();
			var ms1 = parseInt(ms.substring(0, 2));
			var ms2 = parseInt(ms.substring(2, 4));
			ms1 = alpha[ms1];
			ms = ms1.concat(ms2);
			return yyyy.concat(mm, dd, hh, ms);
		}
		else {
			return '';
		}
	}
	function datetime_sql_to_medium_date(datetime_sql) {
		// convert yyyy-mm-dd hh:ii:ss to mm/dd/yyyy
		if (datetime_sql && datetime_sql !== '') {
			array_datetime = datetime_sql.split(' ');
			return date_sql_to_medium_date(array_datetime[0]);
		}
		else {
			return "";
		}
	}
	function date_convert_simple(yyyymmdd_date) {
		string = '';
		if (yyyymmdd_date) {
			array_date = yyyymmdd_date.split("-");
			var yyyy = (array_date[0]);
			var mm = (array_date[1]);
			var dd = (array_date[2]);
			var now = new Date();
			var today_yyyy = now.getFullYear();
			if (yyyy != today_yyyy) { string = mm + '/' + dd + '/' + yyyy; }
			else { string = mm + '/' + dd; }
		}
		return string;
	}
	function y_input_date_to_indonesia_long_date(date) {
		if (date) {
			array_date = date.split("/");
			var yyyy = (array_date[2]);
			var mm = (array_date[0]);
			var dd = (array_date[1]);
			var std_date = yyyy + '-' + y_add_pre_zero(mm, 2) + '-' + y_add_pre_zero(dd, 2);
			var formated_date = y_format_long_date_id(std_date);
			return formated_date;
		}
		else {
			return "";
		}
	}
	function date_convert_to_yyyymmdd(date) {
		if (date) {
			array_date = date.split("/");
			var yyyy = (array_date[2]);
			var mm = (array_date[0]);
			var dd = (array_date[1]);
			yyyymmdd = yyyy + mm + dd;
			return yyyymmdd;
		}
		else {
			return "";
		}
	}
	function y_format_long_date_id(date) {
		if (typeof date != 'undefined' && date !== null) {
			if (date !== '') {
				array_global = date.split(" ");
				array_date = array_global[0].split("-");
				var yyyy = (array_date[0]);
				var mm = (array_date[1]);
				var dd = (array_date[2]);
				switch (mm) {
					case '01': m_indonesia = 'Januari'; break;
					case '02': m_indonesia = 'Februari'; break;
					case '03': m_indonesia = 'Maret'; break;
					case '04': m_indonesia = 'April'; break;
					case '05': m_indonesia = 'Mei'; break;
					case '06': m_indonesia = 'Juni'; break;
					case '07': m_indonesia = 'Juli'; break;
					case '08': m_indonesia = 'Agustus'; break;
					case '09': m_indonesia = 'September'; break;
					case '10': m_indonesia = 'Oktober'; break;
					case '11': m_indonesia = 'November'; break;
					case '12': m_indonesia = 'Desember'; break;
					default: m_indonesia = '';
				}
				if (dd == '00') { dd = ''; }
				if (yyyy == '0000') { yyyy = ''; }
				return dd + ' ' + m_indonesia + ' ' + yyyy;
			}
			else { return ""; }
		}
	}
	function y_format_number(number, regional) {
		if (!isNaN(number)) {
			regional = typeof regional !== 'undefined' ? regional : 'english';
			var divider, decimal;
			switch (regional) {
				case 'english':
					decimal = '.';
					divider = ',';
					break;
				case 'indonesia':
					decimal = ',';
					divider = '.';
					break;
				default:
					decimal = '.';
					divider = ',';
			}
			number += '';
			x = number.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? decimal + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + divider + '$2');
			}
			return x1 + x2;
		}
		else {
			return number;
		}
	}

	function y_format_currency(number, symbol, regional) {
		if (!isNaN(number)) {
			symbol = typeof symbol !== 'undefined' ? symbol : '';
			return symbol + ' ' + y_format_number(number, regional);
		}
		else {
			return number;
		}
	}
	function y_to_currency(number, symbol) {
		return y_format_currency(number, symbol);
	}
	function y_terbilang_bahasa(nilai) {
		nilai = nilai.toString().replace('-', '');
		if (y_is_number(nilai)) {
			var daftarAngka = new Array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan");
			var temp = '';
			var hasilBagi, sisaBagi;
			//batas untuk ribuan
			var batas = 3;
			//untuk menentukan ukuran array, jumlahnya sesuaikan dengan jumlah anggota dari array gradeNilai[]
			var maxBagian = 5;
			var gradeNilai = new Array("", "ribu", "juta", "milyar", "triliun");
			//cek apakah ada angka 0 didepan ==> 00098, harus diubah menjadi 98
			nilai = y_delete_pre_zero(nilai);
			var nilaiTemp = y_string_to_array(batas, maxBagian, nilai);
			//ubah menjadi bentuk terbilang
			var j = nilai.length;
			//menentukan batas array
			var banyakBagian = (j % batas) === 0 ? (j / batas) : Math.round(j / batas + 0.5);
			var h = 0;
			for (var i = banyakBagian - 1; i >= 0; i--) {
				var nilaiSementara = parseInt(nilaiTemp[h]);
				if (nilaiSementara == 1 && i == 1) {
					temp += "seribu ";
				}
				else {
					temp += y_convert_hundred_to_string(nilaiTemp[h]) + " ";
					// cek apakah string bernilai 000, maka jangan tambahkan gradeNilai[i]
					if (nilaiTemp[h] != "000") { temp += gradeNilai[i] + " "; }
				}
				h++;
			}
			temp = temp.replace(/^\s+|\s+$/g, "");
			return temp + ' rupiah';
		}
		else {
			return 'not a number';
		}

		function y_string_to_array(batas, maxBagian, kata) {
			// maksimal 999 milyar
			var temp = new Array(maxBagian);
			var j = kata.length;
			//menentukan batas array
			var banyakBagian = (j % batas) === 0 ? (j / batas) : Math.round(j / batas + 0.5);
			for (var i = banyakBagian - 1; i >= 0; i--) {
				var k = j - batas;
				if (k < 0) k = 0;
				temp[i] = kata.substring(k, j);
				j = k;
				if (j === 0) break;
			}
			return temp;
		}

		function y_convert_hundred_to_string(nilai) {
			//maksimal 3 karakter
			var batas = 2;
			//membagi string menjadi 2 bagian, misal 123 ==> 1 dan 23
			var maxBagian = 2;
			var temp = y_string_to_array(batas, maxBagian, nilai);
			var j = nilai.length;
			var hasil = "";
			//menentukan batas array
			var banyakBagian = (j % batas) === 0 ? (j / batas) : Math.round(j / batas + 0.5);
			for (var i = 0; i < banyakBagian; i++) {
				//cek string yang memiliki panjang lebih dari satu ==> belasan atau puluhan
				if (temp[i].length > 1) {
					//cek untuk yang bernilai belasan ==> angka pertama 1 dan angka kedua 0 - 9, seperti 11,16 dst
					if (temp[i].charAt(0) == '1') {
						if (temp[i].charAt(1) == '1') {
							hasil += "sebelas";
						}
						else if (temp[i].charAt(1) == '0') {
							hasil += "sepuluh";
						}
						else hasil += daftarAngka[temp[i].charAt(1) - '0'] + " belas ";
					}
					//cek untuk string dengan format angka  pertama 0 ==> 09,05 dst
					else if (temp[i].charAt(0) === '0') {
						hasil += daftarAngka[temp[i].charAt(1) - '0'];
					}
					//cek string dengan format selain angka pertama 0 atau 1
					else
						hasil += daftarAngka[temp[i].charAt(0) - '0'] + " puluh " + daftarAngka[temp[i].charAt(1) - '0'];
				}
				else {
					//cek string yang memiliki panjang = 1 dan berada pada posisi ratusan
					if (i === 0 && banyakBagian != 1) {
						if (temp[i].charAt(0) == '1')
							hasil += " seratus ";
						else if (temp[i].charAt(0) === '0') hasil += " ";
						else hasil += daftarAngka[parseInt(temp[i])] + " ratus ";
					}
					//string dengan panjang satu dan tidak berada pada posisi ratusan ==> satuan
					else hasil += daftarAngka[parseInt(temp[i])];
				}
			}
			return hasil;
		}
	}
	function y_add_pre_zero(number, digit) {
		var result = '0000';
		if (number !== '') {
			if (!isNaN(number)) {
				var y_log10 = function (val) { return Math.log(val) / Math.LN10; };
				result = y_str_repeat("0", (digit + -1 - Math.floor(y_log10(number)))) + number;
			}
			else {
				length = number.length;
				result = number;
				if (length < 4) {
					for (var i = length; i < 4; i++) {
						result += '0';
					}
				}
			}
		}
		return result;
	}
	function y_str_repeat(input, multiplier) {
		var y = '';
		while (true) {
			if (multiplier & 1) { y += input; }
			multiplier >>= 1;
			if (multiplier) { input += input; }
			else { break; }
		}
		return y;
	}
	function y_delete_pre_zero(number) {
		while (number.indexOf("0") === 0) { number = number.substring(1, number.length); }
		return number;
	}
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}
	const monthDiff = function (start, end) {
		let month = (end.getFullYear() - start.getFullYear()) * 12;
		month -= start.getMonth();
		month += end.getMonth() + 1;
		return month <= 0 ? 0 : month;
	}
	const getDateObject = function (dateString, format) {
		let res = false
		dateString = typeof dateString !== 'undefined' ? dateString : ''
		if (dateString !== '') {
			let dd = false
			let mm = false
			let yyyy = false
			format = typeof format !== 'undefined' ? format : 'dd/mm/yyyy'
			switch (format) {
				case 'dd.mm.yyyy':
					const a = dateString.split(".")
					dd = typeof a[0] !== 'undefined' ? parseInt(a[0], 10) : false
					mm = typeof a[1] !== 'undefined' ? parseInt(a[1], 10) - 1 : false
					yyyy = typeof a[2] !== 'undefined' ? parseInt(a[2], 10) : false
					break;
				case 'dd/mm/yyyy':
					const b = dateString.split("/")
					dd = typeof b[0] !== 'undefined' ? parseInt(b[0], 10) : false
					mm = typeof b[1] !== 'undefined' ? parseInt(b[1], 10) - 1 : false
					yyyy = typeof b[2] !== 'undefined' ? parseInt(b[2], 10) : false
					break;
				case 'dd-mm-yyyy':
					const c = dateString.split("-")
					dd = typeof c[0] !== 'undefined' ? parseInt(c[0], 10) : false
					mm = typeof c[1] !== 'undefined' ? parseInt(c[1], 10) - 1 : false
					yyyy = typeof c[2] !== 'undefined' ? parseInt(c[2], 10) : false
					break;
				case 'mm/dd/yyyy':
					const d = dateString.split("/")
					mm = typeof d[0] !== 'undefined' ? parseInt(d[0], 10) - 1 : false
					dd = typeof d[1] !== 'undefined' ? parseInt(d[1], 10) : false
					yyyy = typeof d[2] !== 'undefined' ? parseInt(d[2], 10) : false
					break
				case 'yyyy-mm-dd':
					const e = dateString.split("-")
					yyyy = typeof e[0] !== 'undefined' ? parseInt(e[0], 10) : false
					mm = typeof e[1] !== 'undefined' ? parseInt(e[1], 10) - 1 : false
					dd = typeof e[2] !== 'undefined' ? parseInt(e[2], 10) : false
					break
			}
			res = yyyy ? new Date(yyyy, mm, dd) : false;
		}
		return res
	}
	function getJsDateFromExcel(excelDate) {

		// JavaScript dates can be constructed by passing milliseconds
		// since the Unix epoch (January 1, 1970) example: new Date(12312512312);

		// 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
		// 2. Convert to milliseconds.

		//return new Date((excelDate - (25567+2))*86400*1000);
		var date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
		var localTime = new Date(date.getTime() + (new Date()).getTimezoneOffset() * 60000);
		return localTime;

	}

	function dateFromFormat(str, format) {
		let arr, d, m, y
		switch (format) {
			case 'mm/dd/yyyy':
				arr = str.split('/')
				d = elvis(arr[1], 0)
				m = elvis(arr[0], 0)
				y = elvis(arr[2], 0)
				break;

			case 'mm-dd-yyyy':
				arr = str.split('-')
				d = elvis(arr[1], 0)
				m = elvis(arr[0], 0)
				y = elvis(arr[2], 0)
				break;

			case 'mm.dd.yyyy':
				arr = str.split('.')
				d = elvis(arr[1], 0)
				m = elvis(arr[0], 0)
				y = elvis(arr[2], 0)
				break;

			case 'mm dd yyyy':
				arr = str.split(' ')
				d = elvis(arr[1], 0)
				m = elvis(arr[0], 0)
				y = elvis(arr[2], 0)
				break;

			case 'dd/mm/yyyy':
				arr = str.split('/')
				d = elvis(arr[0], 0)
				m = elvis(arr[1], 0)
				y = elvis(arr[2], 0)
				break;

			case 'dd-mm-yyyy':
				arr = str.split('-')
				d = elvis(arr[0], 0)
				m = elvis(arr[1], 0)
				y = elvis(arr[2], 0)
				break;

			case 'dd.mm.yyyy':
				arr = str.split('.')
				d = elvis(arr[0], 0)
				m = elvis(arr[1], 0)
				y = elvis(arr[2], 0)
				break;

			case 'dd mm yyyy':
				arr = str.split(' ')
				d = elvis(arr[0], 0)
				m = elvis(arr[1], 0)
				y = elvis(arr[2], 0)
				break;
		}
		return new Date(y, (parseInt(m) - 1), d)

	}



	if (typeof window === 'object' && typeof window.document === 'object') {
		window.y_now_string = y_now_string;
		window.y_now = y_now_string;
		window.y_day = y_day;
		window.y_month_name = y_month_name;
		window.y_yesterday = y_yesterday;
		window.y_tomorrow = y_tomorrow;
		window.y_last_hour = y_last_hour;
		window.y_next_hour = y_next_hour;
		window.y_input_date_to_indonesia_long_date = y_input_date_to_indonesia_long_date;
		window.y_datetime_convert = y_datetime_convert;
		window.y_format_long_date_id = y_format_long_date_id;
		window.y_format_number = y_format_number;
		window.y_format_currency = y_format_currency;
		window.y_to_currency = y_to_currency;
		window.y_terbilang_bahasa = y_terbilang_bahasa;
		window.y_add_pre_zero = y_add_pre_zero;
		window.y_math = y_math;
		window.y_toTitleCase = toTitleCase;
		window.y_this_month = y_this_month;
		window.y_last_month = y_last_month;
		window.y_next_month = y_next_month;
		window.getJsDateFromExcel = getJsDateFromExcel;
		window.monthDiff = monthDiff;
		window.getDateObject = getDateObject;
		window.dateFromFormat = dateFromFormat;
	}
})(window)
