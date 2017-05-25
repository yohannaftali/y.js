// y.form.js
// 2017.09.22
// Bug Fix for resizeable coloumn
// 2017.09.21
// Resizebale Coloumn for info_form
// 2017.09.20
// - fix sort and filter with freezed coloumn
// 2017.09.13
// - minor fix
// - freeze coloumn on info_form
// 2016.09.05
// - adding buttonUploadCsvWriteDetail
// 2016.07.01
// - ac_source
// 2015.09.21
// - Major Change

(function(window,undefined){
var document=window.document;
var location=window.location;

//----------------------------------------------------------------------------------------------------------------------
// basic_form
//----------------------------------------------------------------------------------------------------------------------
var basic_form=function(param){
	useParam(this,param);
};

//----------------------------------------------------------------------------------------------------------------------
// y_form
//----------------------------------------------------------------------------------------------------------------------
var y_form=function(param){
	useParam(this,param);
	var that=this;
	if(typeof param.module!=='undefined'){
		this.name=typeof param.name!=='undefined'?param.name:'form_'+param.module;
		this.query_url=typeof param.query_url!=='undefined'?param.query_url:'c_'+param.module+'/';
		this.trigger=typeof param.trigger!=='undefined'?param.trigger:$('#button_form_'+param.module);
	}
	this.wrapper=$('#module_panel');
	this.active_form='#'+this.name;
	this.panel_type=this.type;
	this.panel_master_label=typeof this.label.master !== 'undefined'?this.label.master:'';
	this.panel_detail_label=typeof this.label.detail!== 'undefined'?this.label.detail:'';
	this.panel_history_label=typeof this.label.history !== 'undefined'?this.label.history :'';
	this.panel=new Y_Framework(this);
	this.master=this.panel.master;
	this.detail_header=this.panel.detail_header;
	this.detail=this.panel.detail;
	this.history_header=this.panel.history_header;
	this.history=this.panel.history;
	this.field=[];
	this.data={};
	this.data.detail={};
	this.data.history={};
	this.database=false;
	this.use_csv_title=false;
	this.database=false;
	this.use_csv_title=false;
	this.vars={
		detailShown: 0,
		historyShown: 0,
		lastKeyValue:'',
		lastMainValue:'',
		keyValue:'',
		mainValue:'',
		masterData:{},
		detailData:{},
		historyData:{},
		responseData:{},
		menuPanelOpen:false
	};
	this.last_sort=[];
	this.last_sort.detail=[];
	this.last_sort.history=[];
	this.create_sidebar_panel();
	this.main_field=false;
	this.next_main_field=false;
	this.key_field=false;
	this.key_field_type=false;
	this.last_select=false;
	this.last_css=false;
	this.last_font=false;
	this.auto_row_trigger=false;
	this.auto_row_trigger_history=false;
	this.min_rows=0;
	// prevent enter as submit
	prevent_key_enter(this.active_form);
	this.sortable();
	this.default_parent_location_id=false;
	this.default_type_location_id=false;
	this.default_trip_id=false;
	this.use_date_picker();
	this.use_time_picker();
	this.use_simple_time_picker();
	this.use_datetime_picker();
	this.use_location_picker();
	this.use_trip_picker();
	this.use_simple_month_picker();

	$('body').off('paste','.input_detail_text');
	$('body').on('paste','.input_detail_text',function(e){
		var obj = this;
		var element,evt=e?e:event;
		if(evt.srcElement) element=evt.srcElement;
		else if(evt.target) element=evt.target;
		if(! (evt.which == 86 && (evt.ctrlKey || evt.metaKey))) { //Ctrl + V
			y_handle_paste(obj);
		 }
	});
	$(this.detail).off('focus','.input_detail_text');
	$(this.detail).on('focus','.input_detail_text',function(){
		$(this).select();
	});
	$('body').off("keydown");
	$('body').on("keydown",function(e){
		var element,evt=e?e:event;
		if(evt.srcElement) element=evt.srcElement;
		else if(evt.target) element=evt.target;
		if(evt.shiftKey){
			var key=evt.keyCode;
			switch(key){
				// Enter
				case 13:
					evt.preventDefault();
					that.submit();
					break;

				// SHIFT+F1 = new form
				case 112:
					evt.preventDefault();
					var buttonNew = document.getElementById('button_new_new_record');
					if (buttonNew !== null) {
						buttonNew.click();
					}
					break;
				// SHIFT+F2 = open form
				case 113:
					evt.preventDefault();
					var buttonOpen = document.getElementById('button_open_open_record');
					if (buttonOpen !== null) {
						buttonOpen.click();
					}
					break;
				// SHIFT+F3 = clone form
				case 114:
					evt.preventDefault();
					var buttonClone = document.getElementById('button_submit_clone_record');
					if (buttonClone !== null) {
						buttonClone.click();
					}
					break;
				default:
					break;
			}
		}
		if(evt.altKey || evt.metaKey){
			switch(evt.keyCode){
				// Enter
				case 13:
					evt.preventDefault();
					that.submit();
					break;

				default:
					break;
			}
		}
	});
	$('body').off('keydown','.input_detail_text');
	$('body').on('keydown','.input_detail_text',function(e){
		var obj = this;
		var element,evt=e?e:event;
		if(evt.srcElement) element=evt.srcElement;
		else if(evt.target) element=evt.target;
		var shift=evt.shiftKey;
 		var key=evt.keyCode;

 		if(shift){
 			var that=this;
 			var elName = $(that).attr('name');
 			elName.replace(']', '');
 			var arrName = elName.split('[');
 			var row=typeof arrName[1]!=='undefined'?parseInt(arrName[1]):0;

 			switch(key){
 				case 13:
 					evt.preventDefault();
					$(this).blur();
 					break;
 				// Left
 				case 37:
 					$(that).prev(".input_detail_text").focus();
 					break;
 				// Up
 				case 38:
 					if(row > 0){
 						row --;
 						$("[name='"+arrName[0]+"["+row+"]']").focus();
 					}
 					break;
 				// Right
 				case 39:
 					$(that).next('.input_detail_text').focus();
 					break;
 				// Down
 				case 40:
 					row ++;
 					$("[name='"+arrName[0]+"["+row+"]']").focus();
 					break;
 				default:
 					break;
 			}
 		}
		else if(evt.which == 86 && (evt.ctrlKey || evt.metaKey)) { //Ctrl + V
			ta = document.getElementById('y_paste');
			ta.focus();
			setTimeout(function(){
				var clipText = ta.value;
				ta.value ='';
			 	y_grid_paste(obj, clipText);
			 }, 10);
		}
 		else {
 			switch(key){
 				// enter
 				case 13:
 					evt.preventDefault();
 					break;
 				default:
 					break;
 			}
 		}

	});
	$(this.active_form).off('keyup','.input_date_ddmmyyyy');
	$(this.active_form).on('keyup','.input_date_ddmmyyyy',function(){
		var v = this.value;
		if (v.match(/^\d{2}$/) !== null) {
			this.value = v + '/';
		} else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
			this.value = v + '/';
		}
	});
	$(this.active_form).off('keyup','.input_type_date');
	$(this.active_form).on('keyup','.input_type_date',function(){
		var v = this.value;
        if (v.match(/^\d{2}$/) !== null) {
            this.value = v + '/';
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
            this.value = v + '/';
        }
	});
	$(this.active_form).off('keyup','.input_type_datetime');
	$(this.active_form).on('keyup','.input_type_datetime',function(){
		var v = this.value;
		if (v.match(/^\d{2}$/) !== null) {
			this.value = v + '/';
		} else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
			this.value = v + '/';
		}
		else if (v.match(/^\d{2}\/\d{2}\/\d{4}$/) !== null) {
            this.value = v + ' ';
        }
		else if (v.match(/^\d{2}\/\d{2}\/\d{4} \d{2}$/) !== null) {
            this.value = v + ':';
        }
	});
	$(this.active_form).off('change','.input_with_thousand_separator');
	$(this.active_form).on('change','.input_with_thousand_separator',function(){
		$(this).val(that.addThousandSeparator($(this).val(),',',2));
	});

};
y_form.prototype.addThousandSeparator=function(nStr,separator,fixed){
	separator = typeof(separator)!=='undefined'?separator:',';
	fixed = typeof(fixed)!=='undefined'?fixed:false;
	var decimal='.';
	if(separator!==','){
		decimal=',';
	}
    nStr += '';
	nStr=nStr.replace(/,/g,'');
	if(fixed){
		nStr=Number(nStr).toFixed(fixed);
	}
    x = nStr.split(decimal);
    x1 = x[0];
	if(fixed){
		x2=decimal + x[1];
	}
	else{
		x2 = x.length > 1 ? decimal + x[1] : '';
	}

    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + separator + '$2');
    }
    return x1 + x2;
};
y_form.prototype.superinit=function(){
	this.get_field_param();
	this.write_master();
	if(this.type!='m'){
		this.write_header('detail');
		if(this.type!='md'){
			this.write_header('history');
		}
	}
	// Shortcut on Input Detail Text
	$(this.detail).off('keydown','.input_detail_text');
	$(this.detail).on('keydown','.input_detail_text',function(event){
		event=event||window.event;

	});
};
y_form.prototype.mobileMode=function(){
	this.get_field_param();
	this.panel.writeMobileLayout(this.field.master);
	$('#input_'+this.key_field).focus();
	$('#footer').hide();

	$('#module_panel').off('focus','.yMInputNoVirtKey');
	$('#module_panel').on('focus','.yMInputNoVirtKey',function(){
		var obj=this;
		setTimeout(function() {
		    $(obj).blur();
		}, 50);


	});
	redimension(css);
};
y_form.prototype.renderHtmlMode=function(param){
	var that=this;
	param = typeof(param)!=='undefined'? param: 'static';
	var h=y_html([{element:'div',class:'_yFL _yPanelRender',id:'yRender'}]);
	$(this.master).append(h);

	if(param ==='static'){
		var callback=function(res){
			$('#yRender').append(res);
		};
		getAjaxText(this.query_url+'get','',callback);
	}
	redimension(css);
};
y_form.prototype.sortable=function(){
	if(this.type!='m'){
		this.activate_sortable('detail');
		if(this.type!='md'){
			this.activate_sortable('history');
		}
	}
};
y_form.prototype.activate_sortable=function(func){
	/*
	func=typeof func!=='undefined'?func:'detail';
	var that = this;
	$(this[func]).parent().off('click','.label_header_sortable');
	$(this[func]).parent().on('click','.label_header_sortable',function(){
		var col = $(this).attr('col');
		that.last_sort[func][col] = typeof that.last_sort[func][col]!=='undefined'?that.last_sort[func][col]:false;
		var type = that.last_sort[func][col] ? 'desc' : 'asc';
		var data = that.data[func];
		var sorted = that.sort_data(data, col, type);
		that.data[func] = sorted;
		$(that[func]).html('');
		that.panel.write_table_data(func,that.data[func]);
		that.last_sort[func][col]=!that.last_sort[func][col];
	});*/
};
y_form.prototype.deactivate_sortable=function(func){
	func=typeof func!=='undefined'?func:'detail';
	var that=this;
	$(this[func]).parent().off('click','.label_header_sortable');
};
y_form.prototype.sort_data=function(data, field, type){
	tempdata=data;
	tempdata.sort(function(a,b){
		var c='';
		var d='';
		if(type=='asc'){
			c=a[field];
			d=b[field];
		}
		else if(type=='desc'){
			c=b[field];
			d=a[field];
		}
		if(y_is_number(c)&&y_is_number(d)){
			return(c-d);
		}
		else{
			return (c||"|||").toUpperCase().localeCompare((d||"|||").toUpperCase());
		}
	});
	return tempdata;
};
y_form.prototype.get_field_param=function(){
	if(typeof this.field.master!=='undefined'){
		var master=this.field.master;
		this.next_main_field=false;
		for(var i in master){
			if(typeof master[i].is_key!=='undefined' && master[i].is_key !== false){
				this.key_field=master[i].name;
				if(typeof master[i].label_info!=='undefined' && master[i].label_info !== false){
					this.key_field_type='label_info';
				}
				else{
					this.key_field_type='input';
				}
			}
			if(typeof master[i].is_main!=='undefined' && master[i].is_main !== false){
				this.main_field=master[i].name;
				for(var j=parseInt(i)+1;j<master.length; j++){
					if(typeof master[j]!=='undefined'){
						if(!(typeof master[j].label_info!=='undefined' && master[j].label_info !== false)){
							this.next_main_field=master[j].name;
							break;
						}
					}
				}
			}
		}
	}
	if(typeof this.field.detail!=='undefined'){
		var detail=this.field.detail;
		var last_field;
		this.auto_row_trigger = false;
		for(var k in detail){
			last_field = detail[k].name;
			if(typeof detail[k].auto_row_trigger!=='undefined' && detail[k].auto_row_trigger !== false){
				this.auto_row_trigger=detail[k].name;
			}
		}
	}
	if(typeof this.field.history!=='undefined'){
		var history=this.field.history;
		var lastFieldHistory;
		this.auto_row_trigger_history = false;
		for(var kH in history){
			lastFieldHistory = history[kH].name;
			if(typeof history[kH].auto_row_trigger!=='undefined' && history[kH].auto_row_trigger !== false){
				this.auto_row_trigger_history=history[kH].name;
			}
		}
	}
};
y_form.prototype.post_master=function(new_message,edit_message,callback,extra){
	callback=typeof callback!=='undefined'?callback:false;
	extra=typeof extra!=='undefined'?extra:false;
	new_message=typeof new_message!=='undefined'?new_message:'Are you sure to create new record?';
	edit_message=typeof edit_message!=='undefined'?edit_message:'Are you sure to edit record?';
	this.post_form(new_message,edit_message,callback,extra);
};
y_form.prototype.get_value_label=function(field){
	var element=document.getElementById('label_info_'+field);
	var result=typeof element!=='undefined'&&element!==null&&typeof element.innerHTML!=='undefined'?element.innerHTML:false;
	return result;
};
y_form.prototype.post_form=function(new_message,edit_message,callback,extra){
	callback=typeof callback!=='undefined'?callback:false;
	extra=typeof extra!=='undefined'?extra:false;
	new_message=typeof new_message!=='undefined'?new_message:'Are you sure to create new data ?';
	edit_message=typeof edit_message!=='undefined'?edit_message:'Are you sure to create new data ?';
	var value;
	if(typeof this.key_field_type!=='undefined' && this.key_field_type){
		if(this.key_field_type=='input'){
			value=$('#input_'+this.key_field).val();
		}
		else{
			value=$('#label_info_'+this.key_field).text();
		}
	}
	var message;
	if(value===''){
		message=new_message;
	}
	else{
		message=edit_message;
	}
	var r=confirm(message);
	if(r===true){
		var extra_param=this.key_field+'='+value;
		if(extra){
			extra_param+='&'+extra;
		}
		this.submit_form(extra_param,callback);
	}
};
y_form.prototype.submit_form=function(arg_a,arg_b){
	// submit_form() ... type 1
	// submit_form(extra_param) ... type 2
	// submit_form(callback) ... type 3
	// submit_form(extra_param, callback) ... type 4
	var that=this;
	var submit_url=this.query_url+'submit';
	var data=$(this.active_form).serialize(); // serialize
	var callback=false;
	var set_callback=function(fn){
		callback=fn;
		return false;
	};
	var set_extra_param=function(extra_param){
		data+='&'+extra_param;
		return true;
	};
	var handle_a=typeof arg_a!=='undefined'?(
		typeof arg_a!=='function'?set_extra_param(arg_a):set_callback(arg_a)
	):false;
	if(handle_a){
		var handle_b=typeof arg_b!=='undefined'&&typeof arg_b==='function'?set_callback(arg_b):false;
	}
	y_wait_show();
	var onSuccess=function(status){
		var success=true;
		for(var i in status){
			array_status=status[i].split(' ');
			if(array_status[0]=='error:'){
				success=false;
			}
		}
		y_show_ajax_result(status);
		if(success){
			if(callback!==false){
				callback();
			}
			else{
				that.reset_master();
				that.write_detail();
			}
		}
		y_wait_hide();
	};
	postAjax(submit_url,data,onSuccess);
};
y_form.prototype.write_master=function(){
	var span=typeof this.master_span!=='undefined'?this.master_span:1;
	this.panel.write_master(this.field.master,span);
};
y_form.prototype.write_header=function(func){
	var all=typeof func!=='undefined'?false:true;
	if(all){
		this.panel.write_header('detail');
		this.panel.write_header('history');
	}
	else{ this.panel.write_header(func);}
};
y_form.prototype.button_submit_action=function(){
	var that=this;
	$(this.wrapper).off('click','.button_submit');
	$(this.wrapper).on('click','.button_submit',function(event){
		event=event||window.event;
		event.preventDefault();
		that.submit();
	});
};
y_form.prototype.populate_master=function(after_callback){
	var that=this;
	var mainParam=$('#input_'+this.main_field).val();
	var param=this.main_field+'='+mainParam;
	if($('#input_database').length){
		param+='&database='+$('#input_database').val();
	}
	var callback=function(data){
		that.data.master = typeof data!=='undefined' ? typeof data.master!=='undefined'? data.master:{} : {};
		that.data.detail = typeof data!=='undefined' ? typeof data.detail!=='undefined'? data.detail:{} : {};
		that.data.history = typeof data!=='undefined' ? typeof data.history!=='undefined'? data.history:{} : {};
		if(typeof data.master!=='undefined' && typeof that.field!=='undefined' && typeof that.field.master !== 'undefined'){
			var field=that.field.master;
			for(var i in field){
				var value = '';
				if(typeof field[i].name!=='undefined' && typeof data.master[field[i].name]!=='undefined'){
					value=data.master[field[i].name];
				}
				if(typeof field[i].format!=='undefined' && field[i].format=='medium_datetime'){
					value=y_datetime_convert(value,'datetime_sql_to_medium_datetime');
				}
				if(typeof field[i].label_info!=='undefined' && (field[i].label_info==='yes'||field[i].label_info===true)){
					$('#label_info_'+field[i].name).text(value);
				}
				else if(!(typeof field[i].label_only!=='undefined' && (field[i].label_only==='yes'||field[i].label_only===true))){
					$('#input_'+field[i].name).val(value);
				}
			}
		}
		after_callback();
	};
	getAjax(this.query_url+'get',param,callback);
};
// Autocomplete
y_form.prototype.ac_source=function(field){
	var database = false;
	var source=this.query_url+'call_'+field+'_autocomplete';
	if(this.database){
		database=this.database;
		if(database!==''){
			source+='?db='+database;
		}
	}
	return source;
};
y_form.prototype.autocomplete=function(field,callback,show_data,with_detail){
	var that=this;
	callback=typeof callback!=='undefined'?callback:function(){};
	if(callback!=='off'&&callback!=='on'&&typeof callback==='function'){
		callback_before=typeof callback.before!=='undefined'?callback.before:callback;
		callback_after=typeof callback.after!=='undefined'?callback.after:function(){};
		show_data=typeof show_data!=='undefined'?show_data:true;
		with_detail=typeof with_detail!=='undefined'?with_detail:false;
		$(this.wrapper).off('focusin','#input_'+field);
		$(this.wrapper).on('focusin','#input_'+field,function(e){
			var element, evt=e ? e : event;
			if(evt.srcElement) element=evt.srcElement;
			else if(evt.target) element=evt.target;

			var ac_config={
				source: that.ac_source(field),
				select: function(event,ui){
					$('#input_'+field).val(ui.item.value);
					callback_before(ui);
					if(show_data){that.show_data(with_detail);}
					callback_after(ui);
				},
				minLength:1
			};
			$('#input_'+field).autocomplete(ac_config);
		});
	}
	else if(callback==='off'){
		$('#input_'+field).autocomplete({ disabled: true });
	}
	else if(callback==='on'){
		//show_data as callback parameter
		show_data=typeof show_data!=='undefined'?show_data:function(){};
		$('#input_'+field).autocomplete({ disabled: false });
		if(typeof show_data === 'function'){
			show_data();
		}
	}
	else if(callback==='value_only'){
		show_data=typeof show_data!=='undefined'?show_data:false;
		$(this.wrapper).off('focusin','#input_'+field);
		$(this.wrapper).on('focusin','#input_'+field,function(e){
			var element, evt=e ? e : event;
			if(evt.srcElement) element=evt.srcElement;
			else if(evt.target) element=evt.target;
			var ac_config={
				source: that.ac_source(field),
				select: function(event,ui){
					$('#input_'+field).val(ui.item.value);
					if(show_data){
						show_data(ui);
					}
				},
				minLength:1
			};
			$('#input_'+field).autocomplete(ac_config);
		});
	}
};
y_form.prototype.query_detail=function(field,callback){
	callback=typeof callback!=='undefined'?callback:function(){};
	var that=this;
	$(this.master).off('focusin','#input_'+field);
	$(this.master).on('focusin','#input_'+field,function(e){
		var element, evt=e ? e : event;
		if(evt.srcElement) element=evt.srcElement;
		else if(evt.target) element=evt.target;
		var ac_config={
			source: that.ac_source(field),
			select: function(event,ui){
				$('#input_'+field).val(ui.item.value);
				callback(ui);
				that.write_detail('get_detail',field+'='+ui.item.value);
				$('.button_submit').show();
				that.toogle_button_post('show');
			},
			minLength:1
		};
		$('#input_'+field).autocomplete(ac_config);
	});
};
y_form.prototype.show_data=function(with_detail,with_history,with_submit,callback_after_populate){
	var that=this;
	callback_after_populate=typeof callback_after_populate!=='undefined'?callback_after_populate:function(){};
	with_detail=typeof with_detail!=='undefined'?with_detail:true;
	with_history=typeof with_history!=='undefined'?with_history:true;
	with_submit=typeof with_submit!=='undefined'?with_submit:true;
	var value=$('#input_'+this.main_field).val();
	if(value!==''){
		var callback_history=function(){};
		var callback_detail = function(){};
		if(with_detail){
			callback_detail=function(){
				$(that.detail).html('');
				that.write_detail();
			};
		}
		if(this.type === 'mdh' && with_history){
			callback_history=function(){
				$(that.history).html('');
				that.write_history();
			};
		}
		var callback = function(){
			that.enable_master();
			callback_detail();
			callback_history();
			that.select_detail_action();
			$('#button_submit_clone_record').show();
			if(with_submit){
				$('.button_submit').show();
			}
			that.toogle_button_post('show');
			callback_after_populate();
		};
		this.populate_master(callback);
	}
};
y_form.prototype.hide_button_submit=function(){
	$('.button_submit').hide();
	this.toogle_button_post('hide');
};
y_form.prototype.reset=function(){
	$(this.active_form)[0].reset();
	$(this.detail).html('');
	$(this.history).html('');
	$('.label_info').html('');
};
y_form.prototype.reset_master=function(){
	this.disable_master_input();
	$('.input_master_text').val('');
	$('.label_info').text('');
};
y_form.prototype.reset_detail=function(reset_data,blank){
	reset_data=typeof reset_data!=='undefined'?reset_data:false;
	blank=typeof blank!=='undefined'?blank:false;
	this.disable_detail_input();
	$(this.detail).html('');
	if(reset_data){
		this.data = {};
	}
	if(!blank){
		this.write_detail();
	}
};
y_form.prototype.reset_history=function(reset_all_data,blank){
	reset_all_data=typeof reset_all_data!=='undefined'?reset_all_data:false;
	blank=typeof blank!=='undefined'?blank:false;
	this.disable_history_input();
	$(this.history).html('');
	if(reset_all_data){
		this.data = {};
	}
	if(!blank){
		this.write_history();
	}
};
y_form.prototype.disable_master_input=function(field){
	selector=typeof field!=='undefined'?'#input_'+field:'.input_master_text';
	$(selector).prop('disabled', true);
	$(selector).css('background-color','#bfbfbf');
	$('._yIconPickerMaster').css('background-color','#bfbfbf');
};
y_form.prototype.readonly_master_input=function(field){
	selector=typeof field!=='undefined'?'#input_'+field:'.input_master_text';
	$(selector).prop('readonly', true);
	$(selector).css('background-color','#ffc201');
	$(selector).siblings('._yIconPickerMaster').css('background-color','#ffc201');
};
y_form.prototype.disable_detail_input=function(field){
	selector=typeof field!=='undefined'?'#input_'+field:'.input_detail_text';
	$(selector).prop('disabled', true);
	$(selector).css('background-color','#bfbfbf');
};
y_form.prototype.disable_history_input=function(field){
	selector=typeof field!=='undefined'?'#input_'+field:'.input_history_text';
	$(selector).prop('disabled', true);
	$(selector).css('background-color','#bfbfbf');
};
y_form.prototype.enable_master=function(){
	this.enable_master_input();
};
y_form.prototype.enable_master_input=function(field){
	selector=typeof field!=='undefined'?'#input_'+field:'.input_master_text';
	$(selector).prop('disabled', false);
	$(selector).css('background-color','#e9ffe8');
	$('._yIconPickerMaster').css('background-color','#e9ffe8');
};
y_form.prototype.enable_detail_input=function(field){
	selector=typeof field!=='undefined'?'#input_'+field:'.input_detail_text';
	$(selector).prop('disabled', false);
	$(selector).css('background-color','#e9ffe8');
};
y_form.prototype.enable_history_input=function(field){
	selector=typeof field!=='undefined'?'#input_'+field:'.input_history_text';
	$(selector).prop('disabled', false);
	$(selector).css('background-color','#e9ffe8');
};
y_form.prototype.enable_select_detail=function(){
	var that=this;
	$(this.detail).off('click','.panel_input_row_with_sidebar');
	$(this.detail).on('click','.panel_input_row_with_sidebar',function(event){
		event=event||window.event;
		event.preventDefault();
		$('#button_submit_edit_record').click();
		var value=$(this).children('.'+that.main_field).text();
		$('#input_'+that.main_field).val(value);
		that.show_data(false);
		if(typeof that.next_main_field!=='undefined'){
			$('#input_'+that.next_main_field).focus();
		}
	});
	$('.panel_y_detail_table_data').css('cursor','pointer');
};
y_form.prototype.enable_select_detail_to_history=function(){
	var that=this;
	$(this.detail).off('click','.panel_input_row_detail_clickable');
	$(this.detail).on('click','.panel_input_row_detail_clickable',function(event){
		event=event||window.event;
		event.preventDefault();
		var bg='background-color';
		var bg_selected='#D3FFC7';
		that.assign_command_history($(this).children('.cl_key_param').val());
		y_playClick(that);
		$('.label_data').css(bg,'#DFDFDF');
		$('.label_data_alternate').css(bg,'#F0F0F0');
		$(this).children('.label_data').css(bg,bg_selected);
		$(this).children('.label_data_alternate').css(bg,bg_selected);
	});
};
y_form.prototype.assign_command_history=function(param){
	var that=this;
	$(this.history).html('');
	var func=typeof func!=='undefined'?func:'call_history_data?param=';
	param=typeof param!=='undefined'?param:'';
	var callback=typeof callback!=='undefined'?callback:function(data){
		that.panel.write_table_data('history',data.history);
	};
	getAjax(this.query_url+func+param,param,callback);
};
y_form.prototype.enable_select_history=function(){
	var that=this;
	$(this.history).off('click','.panel_input_row_with_sidebar');
	$(this.history).on('click','.panel_input_row_with_sidebar',function(event){
		event=event||window.event;
		event.preventDefault();
		$('#button_submit_edit_record').click();
		var value=$(this).children('.'+that.main_field).text();
		$('#input_'+that.main_field).val(value);
		that.show_data(false);
		if(typeof that.next_main_field!=='undefined'){
			$('#input_'+that.next_main_field).focus();
		}
	});
	$('.panel_y_history_table_data').css('cursor','pointer');
};
y_form.prototype.select_detail_action=function(){
	var that=this;
	var label='.label_data';
	var label_alt=label+'_alternate';
	var bg_label_data = '#DFDFDF';
	var bg_label_data_alternate = '#F0F0F0';
	var bg_hover_in='#FFFCC7';
	var bg_selected='#D3FFC7';
	var color='#303030';
	var value=$('#input_'+this.key_field).val();
	var bg='background-color';
	value=typeof value!=='undefined'?value:$('#label_info_'+this.key_field).text();
	$('.'+this.key_field).each(function(){
		var this_value=$(this).text();
		if(this_value==value){
			if(typeof that.last_select!=='undefined'){
				var last_parent=that.last_select;
				if(typeof last_parent.children!=='undefined'){
					var last_row=last_parent.children(label);
					var last_row_alt=last_parent.children(label_alt);
					var last_obj=last_row.length>0?last_row:last_row_alt;
					last_obj.css(bg,that.last_css);
					last_obj.css('color',that.last_font);
				}
			}
			var parent=$(this).parent();
			var row=parent.children(label);
			var row_alt=parent.children(label_alt);
			var is_alt=row.length>0?false:true;
			var obj=row.length>0?row:row_alt;
			that.last_css=is_alt?bg_label_data_alternate:bg_label_data;
			obj.css(bg,bg_selected);
			that.last_font=obj.css('color');
			obj.css('color',color);
			that.last_select=parent;
		}
	});
};
// write_detail
// 1. Serialize active Form
// 2. call controller
// 3. write response data to table detail
// @todo write response data to master and history table if ajax response has response
y_form.prototype.write_detail=function(func,param,callback){
	var that=this;
	$(this.detail).html('');
	var serialize=$(this.active_form).serialize();
	func=typeof func!=='undefined'?func:'get_detail';
	param=typeof param!=='undefined'?param:serialize;
	callback=typeof callback!=='undefined'?callback:function(data){
		//that.panel.write_table_data('detail',data.detail);
		that.data.detail=data.detail;
		that.write_table('detail');
	};
	getAjax(this.query_url+func,param,callback);
};
y_form.prototype.write_detail_auto_add_row=function(){
	var that=this;
	var data=typeof this.data.detail!=='undefined'?this.data.detail:{};
	var min_rows=this.min_rows;
	var length=typeof data.length!=='undefined'?data.length:0;
	var rows=min_rows+length;
	var dataShown=0;
	var i = 0;
	var maxShownRows = rows<300?rows:300;
	for(i=0;i<maxShownRows;i++){
		data[i]=typeof data[i]!=='undefined'?data[i]:{};
		data[i].no=typeof data[i].no!=='undefined'?data[i].no:i+1;
		var last=(i==rows-1)?true:false;
		var param=typeof data[i]!=='undefined'?data[i]:{no:(i+1)};
		dataShown++;
		this.add_row_detail(i,param,last);
	}
	this.vars.detailShown=dataShown;
	this.vars.detailLength=length;
	if(i < rows){
		var loopthis=function(){
	        setTimeout(function(){
	        	var start = i;
	        	var end = i+30>rows?rows:i+30;
	        	while(i<end)
	        	{
			    	data[i].no=typeof data[i].no!=='undefined'?data[i].no:i+1;
					var last=(i==rows-1)?true:false;
					var param=typeof data[i]!=='undefined'?data[i]:{no:(i+1)};
					that.add_row_detail(i,param,last,that.auto_row_trigger,'hidden');
			        i++;
		    	}
		        if(i<rows){
		            loopthis();
		            $('.panel_record_info').text('processing... record #'+ (i+1) + ' of ' + that.vars.detailLength);
		        }
		        if(i==rows){
		        	$('.panel_record_info').text('show '+that.vars.detailShown+' of '+ that.vars.detailLength);
		        }
		    },0);
		};
		loopthis();
		this.panel.callback.detailScrollBottom=function(){
			// show hidden next 30
			var start = that.vars.detailShown;
			var end = start+30 > that.vars.detailLength?that.vars.detailLength:start+30;
			for(var j=start;j<end;j++){
				$('.panel_input_row_detail[row="'+j+'"]').removeAttr('hidden');
			}
			that.vars.detailShown=end;
			$('.panel_record_info').text('show '+that.vars.detailShown+' of '+ that.vars.detailLength);
		};
	}
	else{
		$('.panel_record_info').text('show '+that.vars.detailShown+' of '+ that.vars.detailLength);
	}
};
y_form.prototype.write_table=function(func){
	var that=this;
	func=typeof func!=='undefined'?func:'detail';
	data=typeof that.data[func]!=='undefined'?that.data[func]:{};
	var min_rows=that.min_rows;
	var length=typeof data.length!=='undefined'?data.length:0;
	var rows=min_rows+length;
	var dataShown=0;
	var i = 0;
	var maxShownRows = rows<300?rows:300;
	for(i=0;i<maxShownRows;i++){
		data[i].no=typeof data[i].no!=='undefined'?data[i].no:i+1;
		var last=(i==rows-1)?true:false;
		var param=typeof data[i]!=='undefined'?data[i]:{no:(i+1)};
		dataShown++;
		that.add_row(i,param,func,last);
	}
	that.vars[func+'Shown']=dataShown;
	that.vars[func+'Length']=length;
	if(i < rows){
		var loopthis=function(){
	        setTimeout(function(){
	        	var start = i;
	        	var end = i+30>rows?rows:i+30;
	        	while(i<end)
	        	{
	        		data[i]=typeof data[i]!=='undefined'?data[i]:i+1;
			    	data[i].no=typeof data[i].no!=='undefined'?data[i].no:i+1;
					var last=(i==rows-1)?true:false;
					var param=typeof data[i]!=='undefined'?data[i]:{no:(i+1)};
					that.add_row(i,param,func,last,that.auto_row_trigger,'hidden');
			        i++;
		    	}
		        if(i<rows){
		            loopthis();
		            $('.panel_record_info').text('processing... record #'+ (i+1) + ' of ' + that.vars[func+'Length']);
		        }
		        if(i==rows){
		        	$('.panel_record_info').text('show '+that.vars[func+'Shown']+' of '+ that.vars[func+'Length']);
		        }
		    },0);
		};
		loopthis();
		that.panel.callback.detailScrollBottom=function(){
			// show hidden next 30
			var start = that.vars[func+'Shown'];
			var end = start+30 > that.vars[func+'Length']?that.vars[func+'Length']:start+30;
			for(var j=start;j<end;j++){
				$('.panel_input_row_detail[row="'+j+'"]').removeAttr('hidden');
			}
			that.vars[func+'Shown']=end;
			$('.panel_record_info').text('show '+that.vars[func+'Shown']+' of '+ that.vars[func+'Length']);
		};
	}
	else{
		$('.panel_record_info').text('show '+that.vars[func+'Shown']+' of '+ that.vars[func+'Length']);
	}
};
y_form.prototype.add_row=function(i,data,func,last,trigger_name,option){
	data=typeof data!=='undefined'?data:{no:(i+1)};
	func=typeof func!=='undefined'?func:'detail'; //or history
	last=typeof last!=='undefined'?last:false;
	option=typeof option!=='undefined'?option:'show';
	var alt=i%2;
	this.panel.write_table(i,func,data,alt,option);
	if(last){
		trigger_name=typeof trigger_name!=='undefined'?trigger_name:this.auto_row_trigger;
		if(trigger_name){
			$(':input[name="'+trigger_name+'['+i+']"]').addClass('auto_row_trigger');}
	}
};
y_form.prototype.write_history=function(func,param,callback){
	var that=this;
	$(this.history).html('');
	var serialize=$(this.active_form).serialize();
	func=typeof func!=='undefined'?func:'get_history';
	param=typeof param!=='undefined'?param:serialize;
	callback=typeof callback!=='undefined'?callback:function(data){
		that.panel.write_table_data('history',data.history);
	};
	getAjax(this.query_url+func,param,callback);
};
y_form.prototype.unselect_detail=function(){
	var that=this;
	if(typeof that.last_select!=='undefined' && typeof that.last_select.children!=='undefined'){
		var row=that.last_select.children('.label_data');
		var row_alt=that.last_select.children('.label_data_alternate');
		var obj=row.length>0?row:row_alt;
		obj.css('background-color',that.last_css);
		obj.css('color',that.last_font);
	}
	//that.last_select;
};
y_form.prototype.create_sidebar_panel=function(){
	var field=[{id:'button_'+this.name,label:'Main Form'}];
	var param={container:$('.panel_sidebar'),title:'Form',field:field};
	var panel=new Sidebar_Panel(param);
	$(this.wrapper).off('click','#button_'+this.name);
	$(this.wrapper).on('click','#button_'+this.name,function(event){
		event=event||window.event;
		event.preventDefault();
		$('.panel_info').hide();
		$('.panel_setup').hide();
	});
};
y_form.prototype.fill_label_info=function(field,data){
	for(var i in field){
		var data_field = typeof data[field[i]] !== 'undefined'?data[field[i]]:'';
		var elTarget=document.getElementById('label_info_'+field[i]);
		if(elTarget!==null){
			elTarget.innerHTML=data_field;
		}
	}
};
y_form.prototype.set_label_info=function(field,text){
	var id='label_info_'+field;
	document.getElementById(id).innerHTML=text;
};
y_form.prototype.set_master_input=function(field,text){
	var id='input_'+field;
	document.getElementById(id).value=text;
};
// Auto Add Row
y_form.prototype.set_auto_add_row_detail=function(trigger_name){
	var that=this;
	trigger_name=typeof trigger_name!=='undefined'?trigger_name:this.auto_row_trigger;
	$(this.detail).off('focusin','.auto_row_trigger');
	$(this.detail).on('focusin','.auto_row_trigger',function(e){
		$(this).removeClass('auto_row_trigger');
		var element,evt=e?e:event;
		if(evt.srcElement) element=evt.srcElement;
		else if(evt.target) element=evt.target;
		var last_index=parseInt(element.name.substring((trigger_name+'[').length,element.name.length-1))+1;
		that.add_row_detail((last_index),{no:last_index+1},true,trigger_name);
	});
	this.write_detail=this.write_detail_auto_add_row;
};
y_form.prototype.add_row_detail=function(i,data,last,trigger_name,option){
	data=typeof data!=='undefined'?data:{no:(i+1)};
	last=typeof last!=='undefined'?last:false;
	option=typeof option!=='undefined'?option:'show';
	var alt=i%2;
	this.panel.write_table(i,'detail',data,alt,option);
	if(last){
		trigger_name=typeof trigger_name!=='undefined'?trigger_name:this.auto_row_trigger;
		$(':input[name="'+trigger_name+'['+i+']"]').addClass('auto_row_trigger');
	}
};
y_form.prototype.set_auto_add_row_history=function(trigger_name){
	var that=this;
	trigger_name=typeof trigger_name!=='undefined'?trigger_name:this.auto_row_trigger_history;
	$(this.history).off('focusin','.auto_row_trigger');
	$(this.history).on('focusin','.auto_row_trigger',function(e){
		$(this).removeClass('auto_row_trigger');
		var element,evt=e?e:event;
		if(evt.srcElement) element=evt.srcElement;
		else if(evt.target) element=evt.target;
		var last_index=parseInt(element.name.substring((trigger_name+'[').length,element.name.length-1))+1;
		that.add_row_history((last_index),{no:last_index+1},true,trigger_name);
	});
	this.write_history=this.write_history_auto_add_row;
};
y_form.prototype.add_row_history=function(i,data,last,trigger_name){
	var param=typeof data!=='undefined'?data:{no:(i+1)};
	last=typeof last!=='undefined'?last:false;
	trigger_name=typeof trigger_name!=='undefined'?trigger_name:this.auto_row_trigger_history;
	var alt=i%2;
	this.panel.write_table(i,'history',param,alt,'draggable');
	if(last){
		$(':input[name="'+trigger_name+'['+i+']"]').addClass('auto_row_trigger');
	}
};
y_form.prototype.write_history_auto_add_row=function(){
	var data=typeof this.data.history!=='undefined'?this.data.history:{};
	var min_rows=this.min_rows;
	var length=typeof data.length!=='undefined'?data.length:0;
	var rows=min_rows+length;
	for(var i=0;i<rows;i++){
		var last=(i==rows-1)?true:false;
		var param=typeof data[i]!=='undefined'?data[i]:{no:(i+1)};
		this.add_row_history(i,param,last);
	}
};

//----------------------------------------------------------------------------------------------------------------------
// Picker
//----------------------------------------------------------------------------------------------------------------------
// Type:
// - datetime
// - date
// - time
// - simple_time
// - simple_month
// - location
// - trip
// Usage:
// Inside object give properties of type.
// example:
// this.field.detail=[
//   {name:'duty_trip_start',label:'Start',textarea:true,edit:true,type:'simple_time',width:100},
// ];
// Use Function
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.use_datetime_picker=function(){
	var that = this;
	this.create_panel_datetime_picker(this);
	var bgColor='#E9FFE8';
	var bgColorFocus='#F6DEE5';
	$(this.wrapper).off('click','.buttonDatetimePicker');
	$(this.wrapper).on('click','.buttonDatetimePicker',function(event){
		event=event||window.event;
		if($(this).prev().attr('disabled')!=='disabled'){
			if($(this).css('background-color')!='rgba(0, 0, 0, 0)'){
				$(this).css('background-color',bgColorFocus);
			}
			that.last_input_type_datetime=$(this).prev()[0];
			var datetime=$(that.last_input_type_datetime).val();
			that.putPickerDatetime(datetime);

			$(this).prev().css('background-color',bgColorFocus);
			$('#y_panel_datetime_picker').show();
		}
	});
	$(this.wrapper).off('focusin','.input_type_datetime');
	$(this.wrapper).on('focusin','.input_type_datetime',function(){
		$(this).css('background-color',bgColorFocus);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColorFocus);
		}
	});
	$(this.wrapper).off('focusout','.input_type_datetime');
	$(this.wrapper).on('focusout','.input_type_datetime',function(){
		$(this).css('background-color',bgColor);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColor);
		}
	});

	$(this.wrapper).off('click','.label_header_type_datetime');
	$(this.wrapper).on('click','.label_header_type_datetime',function(event){
		event=event||window.event;
		var name=$(this).attr('col');
		var col='.input_'+name;
		var len=col.length;
		var firstCol=$(col)[0];
		if(typeof firstCol!== 'undefined')
		{
			var datetime=$(firstCol).val();
			that.last_input_type_datetime=$(col);
			that.putPickerDatetime(datetime);
			$('#y_panel_datetime_picker').show();
		}

	});
};

y_form.prototype.use_date_picker=function(){
	var that = this;
	this.create_panel_date_picker(this);
	var bgColor='#E9FFE8';
	var bgColorFocus='#F6DEE5';
	$(this.wrapper).off('click','.buttonDatePicker');
	$(this.wrapper).on('click','.buttonDatePicker',function(event){
		event=event||window.event;
		if($(this).prev().attr('disabled')!=='disabled'){
			if($(this).css('background-color')!='rgba(0, 0, 0, 0)'){
				$(this).css('background-color',bgColorFocus);
			}
			that.last_input_type_date=$(this).prev()[0];
			var date=$(that.last_input_type_date).val();
			that.putPickerDate(date);
			$(this).prev().css('background-color',bgColorFocus);
			$('#y_panel_date_picker').show();
		}
	});
	$(this.wrapper).off('focusin','.input_type_date');
	$(this.wrapper).on('focusin','.input_type_date',function(){
		$(this).css('background-color',bgColorFocus);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColorFocus);
		}
	});
	$(this.wrapper).off('focusout','.input_type_date');
	$(this.wrapper).on('focusout','.input_type_date',function(){
		$(this).css('background-color',bgColor);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColor);
		}
	});
	$(this.wrapper).off('click','.label_header_type_date');
	$(this.wrapper).on('click','.label_header_type_date',function(event){
		event=event||window.event;
		var name=$(this).attr('col');
		var col='.input_'+name;
		var len=col.length;
		var firstCol=$(col)[0];
		if(typeof firstCol!== 'undefined'){
			var date=$(firstCol).val();
			that.last_input_type_date=$(col);
			that.putPickerDate(date);
			$('#y_panel_date_picker').show();
		}
	});
};

y_form.prototype.use_time_picker=function(){
var that = this;
	this.create_panel_time_picker(this);
	var bgColor='#E9FFE8';
	var bgColorFocus='#F6DEE5';
	$(this.wrapper).off('click','.buttonTimePicker');
	$(this.wrapper).on('click','.buttonTimePicker',function(event){
		event=event||window.event;
		if($(this).prev().attr('disabled')!=='disabled'){
			if($(this).css('background-color')!='rgba(0, 0, 0, 0)'){
				$(this).css('background-color',bgColorFocus);
			}
			that.last_input_type_time=$(this).prev()[0];
			var time=$(that.last_input_type_time).val();
			that.putPickerTime(time);
			$(this).prev().css('background-color',bgColorFocus);
			$('#y_panel_time_picker').show();
		}
	});
	$(this.wrapper).off('focusin','.input_type_time');
	$(this.wrapper).on('focusin','.input_type_time',function(){
		$(this).css('background-color',bgColorFocus);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColorFocus);
		}
	});
	$(this.wrapper).off('focusout','.input_type_time');
	$(this.wrapper).on('focusout','.input_type_time',function(){
		$(this).css('background-color',bgColor);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColor);
		}
	});
	$(this.wrapper).off('click','.label_header_type_time');
	$(this.wrapper).on('click','.label_header_type_time',function(event){
		event=event||window.event;
		var name=$(this).attr('col');
		var col='.input_'+name;
		var len=col.length;
		var firstCol=$(col)[0];
		if(typeof firstCol!== 'undefined'){
			var time=$(firstCol).val();
			that.last_input_type_time=$(col);
			that.putPickerTime(time);
			$('#y_panel_time_picker').show();
		}
	});
};
y_form.prototype.use_simple_time_picker=function(){
	var that = this;
	this.create_panel_simple_time_picker(this);
	var bgColor='#E9FFE8';
	var bgColorFocus='#F6DEE5';
	$(this.wrapper).off('click','.buttonSimpleTimePicker');
	$(this.wrapper).on('click','.buttonSimpleTimePicker',function(event){
		event=event||window.event;
		if($(this).prev().attr('disabled')!=='disabled'){
			if($(this).css('background-color')!='rgba(0, 0, 0, 0)'){
				$(this).css('background-color',bgColorFocus);
			}
			that.last_input_type_simple_time=$(this).prev()[0];
			var value=$(that.last_input_type_simple_time).val();
			that.putPickerDate(value);
			$(this).prev().css('background-color',bgColorFocus);
			$('#y_panel_simple_time_picker').show();
		}
	});
	$(this.wrapper).off('focusin','.input_type_simple_time');
	$(this.wrapper).on('focusin','.input_type_simple_time',function(){
		$(this).css('background-color',bgColorFocus);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColorFocus);
		}
	});
	$(this.wrapper).off('focusout','.input_type_simple_time');
	$(this.wrapper).on('focusout','.input_type_simple_time',function(){
		$(this).css('background-color',bgColor);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColor);
		}
	});
	$(this.wrapper).off('click','.label_header_type_simple_time');
	$(this.wrapper).on('click','.label_header_type_simple_time',function(event){
		event=event||window.event;
		var name=$(this).attr('col');
		var col='.input_'+name;
		var len=col.length;
		var firstCol=$(col)[0];
		if(typeof firstCol!== 'undefined'){
			var value=$(firstCol).val();
			that.last_input_type_simple_time=$(col);
			that.putPickerSimpleTime(value);
			$('#y_panel_simple_time_picker').show();
		}
	});
};
y_form.prototype.use_simple_month_picker=function(){
	var that = this;
	this.create_panel_simple_month_picker(this);
	var bgColor='#E9FFE8';
	var bgColorFocus='#F6DEE5';
	$(this.wrapper).off('click','.buttonSimpleMonthPicker');
	$(this.wrapper).on('click','.buttonSimpleMonthPicker',function(event){
		event=event||window.event;
		if($(this).prev().attr('disabled')!=='disabled'){
			if($(this).css('background-color')!='rgba(0, 0, 0, 0)'){
				$(this).css('background-color',bgColorFocus);
			}
			that.last_input_type_simple_month=$(this).prev()[0];
			var simple_month=$(that.last_input_type_simple_month).val();
			that.putPickerSimpleMonth(simple_month);

			$(this).prev().css('background-color',bgColorFocus);
			$('#y_panel_simple_month_picker').show();
		}
	});
	$(this.wrapper).off('focusin','.input_type_simple_month');
	$(this.wrapper).on('focusin','.input_type_simple_month',function(){
		$(this).css('background-color',bgColorFocus);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColorFocus);
		}
	});
	$(this.wrapper).off('focusout','.input_type_simple_month');
	$(this.wrapper).on('focusout','.input_type_simple_month',function(){
		$(this).css('background-color',bgColor);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColor);
		}
	});

	$(this.wrapper).off('click','.label_header_type_simple_month');
	$(this.wrapper).on('click','.label_header_type_simple_month',function(event){
		event=event||window.event;
		var name=$(this).attr('col');
		var col='.input_'+name;
		var len=col.length;
		var firstCol=$(col)[0];
		if(typeof firstCol!== 'undefined')
		{
			var simple_month=$(firstCol).val();
			that.last_input_type_simple_month=$(col);
			that.putPickerSimpleMonth(simple_month);
			$('#y_panel_simple_month_picker').show();
		}

	});
};

// Create Picker Panel
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_panel_datetime_picker=function(){
	var that = this;
	this.data.datetime=[];
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:'y_panel_datetime_picker',content:y_html([
			{element:'div',class:'_yPanelPicker _yPanelPickerDatetime',id:'y_datetime_picker',content:y_html([
				{element:'div',id:'y_title_datetime_picker',class:'panel_title',content:'Pick a Date and Time'},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerDatetime _yFL',content:y_html([
					{element:'div',id:'yButtonPickerYesterday',class:'_yButtonPicker _yFL',content:'Yesterday'},
					{element:'div',id:'yButtonPickerNow',class:'_yButtonPicker _yFL',content:'Now'},
					{element:'div',id:'yButtonPickerTomorrow',class:'_yButtonPicker _yFL',content:'Tomorrow'}
				])},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerDatetime _yFL',content:y_html([
					{element:'div',id:'yButtonPickerMorning',class:'_yButtonPicker _yFL',content:'Morning'},
					{element:'div',id:'yButtonPickerNoon',class:'_yButtonPicker _yFL',content:'Noon'},
					{element:'div',id:'yButtonPickerNight',class:'_yButtonPicker _yFL',content:'Night'}
				])},
				{element:'div',id:'ySelectedDatetime0',class:'_yPanelPickerSelected _yPanelPickerDatetimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedDatetime1',class:'_yPanelPickerSelected _yPanelPickerDatetimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedDatetime2',class:'_yPanelPickerSelected _yPanelPickerDatetimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedDatetime3',class:'_yPanelPickerSelected _yPanelPickerDatetimeSelected _yFL',content:''},
				{element:'div',id:'yDatetimePickerTable',class:'_yPanelPickerTable _yPanelPickerDatetimeBox _yFL',content:y_html([
					{element:'div',class:'_yPanelPickerTableRowDatetime _yFL',content:''},
					{element:'div',class:'_yPanelPickerTableRowDatetime _yFL',content:y_html([
						{element:'div', class:'_yPanelPickerTableCellLabel _yFL', content:'Month'},
						{element:'div', class:'_yPanelPickerTableCellLabel _yFL', content:'Date'},
						{element:'div', class:'_yPanelPickerTableCellLabel _yFL', content:'Year'},
						{element:'div', class:'_yPanelPickerTableCellLabel _yFL', content:'Hour'},
						{element:'div', class:'_yPanelPickerTableCellLabel _yFL', content:'Minute'},
						{element:'div', class:'_yPanelPickerTableCellLabel _yFL', content:'Second'}
					])},
					{element:'div',class:'_yPanelPickerTableRowDatetime _yFL',content:y_html([
						{element:'div', id:'yPanelPickerDatetimeMonthUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabel _yFL',row:'Month',col:'Up',content:''},
						{element:'div', id:'yPanelPickerDatetimeDateUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabel _yFL',row:'Date',col:'Up',content:''},
						{element:'div', id:'yPanelPickerDatetimeYearUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabel _yFL',row:'Year',col:'Up',content:''},
						{element:'div', id:'yPanelPickerDatetimeHourUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabel _yFL',row:'Hour',col:'Up',content:''},
						{element:'div', id:'yPanelPickerDatetimeMinuteUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabel _yFL',row:'Minute',col:'Up',content:''},
						{element:'div', id:'yPanelPickerDatetimeSecondUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabel _yFL',row:'Second',col:'Up',content:''},
					])},
					{element:'div',class:'_yPanelPickerTableRowDatetime _yFL',content:y_html([
						{element:'input', type:'text', id:'yPanelPickerDatetimeMonth',class:'_yPanelPickerTableCellInput _yPanelPickerTableCellInputDatetime _yFL', content:'January'},
						{element:'input', type:'text', id:'yPanelPickerDatetimeDate',class:'_yPanelPickerTableCellInput _yPanelPickerTableCellInputDatetime _yFL', content:'30'},
						{element:'input', type:'text', id:'yPanelPickerDatetimeYear',class:'_yPanelPickerTableCellInput _yPanelPickerTableCellInputDatetime _yFL', content:'2015'},
						{element:'input', type:'text', id:'yPanelPickerDatetimeHour',class:'_yPanelPickerTableCellInput _yPanelPickerTableCellInputDatetime _yFL', content:'12'},
						{element:'input', type:'text', id:'yPanelPickerDatetimeMinute',class:'_yPanelPickerTableCellInput _yPanelPickerTableCellInputDatetime _yFL', content:'15'},
						{element:'input', type:'text', id:'yPanelPickerDatetimeSecond',class:'_yPanelPickerTableCellInput _yPanelPickerTableCellInputDatetime _yFL', content:'15'},
					])},
					{element:'div',class:'_yPanelPickerTableRowDatetime _yFL',content:y_html([
						{element:'div', id:'yPanelPickerDatetimeMonthDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabel _yFL',row:'Month',col:'Down', content:''},
						{element:'div', id:'yPanelPickerDatetimeDateDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabel _yFL',row:'Date',col:'Down', content:''},
						{element:'div', id:'yPanelPickerDatetimeYearDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabel _yFL',row:'Year',col:'Down', content:''},
						{element:'div', id:'yPanelPickerDatetimeHourDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabel _yFL',row:'Hour',col:'Down', content:''},
						{element:'div', id:'yPanelPickerDatetimeMinuteDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabel _yFL',row:'Minute',col:'Down', content:''},
						{element:'div', id:'yPanelPickerDatetimeSecondDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabel _yFL',row:'Second',col:'Down', content:''},
					])},
					{element:'div',id:'yPanelPickerDatetimeDay',class:'_yPanelPickerTableRowDatetime _yFL',content:''},
					{element:'div',id:'yPanelPickerDatetimePick',class:'_yPanelPickerTableCellButtonPick _yPanelPickerTableRowDatetime _yFL',content:''},
				])}
			])}
		])}
	]);
	$(this.wrapper).append(h);
	$(this.wrapper).off('click','#yButtonPickerYesterday');
	$(this.wrapper).on('click','#yButtonPickerYesterday',function(event){
		event=event||window.event;
		var date=y_yesterday('long_datetime');
		that.putPickerDatetime(date);
	});
	$(this.wrapper).off('click','#yButtonPickerNow');
	$(this.wrapper).on('click','#yButtonPickerNow',function(event){
		event=event||window.event;
		var date=y_now_string('long_datetime');
		that.putPickerDatetime(date);
	});
	$(this.wrapper).off('click','#yButtonPickerTomorrow');
	$(this.wrapper).on('click','#yButtonPickerTomorrow',function(event){
		event=event||window.event;
		var date=y_tomorrow('long_datetime');
		that.putPickerDatetime(date);
	});
	$(this.wrapper).off('click','#yButtonPickerMorning');
	$(this.wrapper).on('click','#yButtonPickerMorning',function(event){
		event=event||window.event;
		that.setDatetimePicker('Hour','08');
		that.setDatetimePicker('Minute','00');
		that.setDatetimePicker('Second','00');
	});
	$(this.wrapper).off('click','#yButtonPickerNoon');
	$(this.wrapper).on('click','#yButtonPickerNoon',function(event){
		event=event||window.event;
		that.setDatetimePicker('Hour','12');
		that.setDatetimePicker('Minute','00');
		that.setDatetimePicker('Second','00');
	});
	$(this.wrapper).off('click','#yButtonPickerNight');
	$(this.wrapper).on('click','#yButtonPickerNight',function(event){
		event=event||window.event;
		that.setDatetimePicker('Hour','21');
		that.setDatetimePicker('Minute','00');
		that.setDatetimePicker('Second','00');
	});
	var kindDatetime=['Month','Date','Year','Hour','Minute','Second'];
	var kindCommand=['Up','Down'];
	var eventDateTimeValue=function(){
		var event=event||window.event;
		var row=$(this).attr('row');
		var col=$(this).attr('col');
		that.handleDatetimeValue(row,col);
	};
	for(var i in kindDatetime){
		for(var j in kindCommand){
			var object='#yPanelPickerDatetime'+kindDatetime[i]+kindCommand[j];
			$(this.wrapper).off('click',object);
			$(this.wrapper).on('click',object,eventDateTimeValue);
		}
	}
	$(this.wrapper).off('click','#yPanelPickerDatetimePick');
	$(this.wrapper).on('click','#yPanelPickerDatetimePick',function(event){
		event=event||window.event;
		// get current input
		var result=that.getPickerDatetime();
		that.manageSelectedHistory('Datetime',result);
		$('#y_panel_datetime_picker').hide();
		$(that.last_input_type_datetime).focus();
		$(that.last_input_type_datetime).val(result);
		$(that.last_input_type_datetime).focus();

	});
	$('._yPanelPickerDatetimeSelected').click(function(event){
		event=event||window.event;
		$('#y_panel_datetime_picker').hide();
		var selectedText=$(this).text();
		that.manageSelectedHistory('Datetime',selectedText);
		$(that.last_input_type_datetime).focus();
		$(that.last_input_type_datetime).val(selectedText);
	});
	$('#y_title_datetime_picker').click(function(event){
		event=event||window.event;
		$('#y_panel_datetime_picker').hide();
		$(that.last_input_type_datetime).focus();
	});
	$(this.wrapper).on('change','._yPanelPickerTableCellInputDatetime',function(){
		$('#yPanelPickerDatetimeDay').text(y_day(that.getPickerDatetime()));
	});
	$('#y_panel_datetime_picker').hide();
};
y_form.prototype.create_panel_date_picker=function(){
	var that = this;
	this.data.date=[];
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:'y_panel_date_picker',content:y_html([
			{element:'div',class:'_yPanelPicker _yPanelPickerDate',id:'y_date_picker',content:y_html([
				{element:'div',id:'y_title_date_picker',class:'panel_title',content:'Pick a Date'},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerDate _yFL',content:y_html([
					{element:'div',id:'yButtonPickerDateYesterday',class:'_yButtonPicker _yFL',content:'Yesterday'},
					{element:'div',id:'yButtonPickerDateNow',class:'_yButtonPicker _yFL',content:'Now'},
					{element:'div',id:'yButtonPickerDateTomorrow',class:'_yButtonPicker _yFL',content:'Tomorrow'}
				])},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerDate _yFL',content:''},
				{element:'div',id:'ySelectedDate0',class:'_yPanelPickerSelected _yPanelPickerDateSelected _yFL',content:''},
				{element:'div',id:'ySelectedDate1',class:'_yPanelPickerSelected _yPanelPickerDateSelected _yFL',content:''},
				{element:'div',id:'ySelectedDate2',class:'_yPanelPickerSelected _yPanelPickerDateSelected _yFL',content:''},
				{element:'div',id:'ySelectedDate3',class:'_yPanelPickerSelected _yPanelPickerDateSelected _yFL',content:''},
				{element:'div',id:'yDatePickerTable',class:'_yPanelPickerTable _yPanelPickerDateBox _yFL',content:y_html([
					{element:'div',class:'_yPanelPickerTableRowDate _yFL',content:y_html([
						{element:'div', class:'_yPanelPickerTableCellLabelLong _yFL', content:'Month'},
						{element:'div', class:'_yPanelPickerTableCellLabelLong _yFL', content:'Date'},
						{element:'div', class:'_yPanelPickerTableCellLabelLong _yFL', content:'Year'},
					])},
					{element:'div',class:'_yPanelPickerTableRowDate _yFL',content:y_html([
						{element:'div', id:'yPanelPickerDateMonthUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong _yFL',row:'Month',col:'Up',content:''},
						{element:'div', id:'yPanelPickerDateDateUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong _yFL',row:'Date',col:'Up',content:''},
						{element:'div', id:'yPanelPickerDateYearUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong _yFL',row:'Year',col:'Up',content:''}
					])},
					{element:'div',class:'_yPanelPickerTableRowTall _yFL',content:y_html([
						{element:'input', type:'text', id:'yPanelPickerDateMonth',class:'_yPanelPickerTableCellInputLong _yPanelPickerTableCellInputDate _yFL', content:''},
						{element:'input', type:'text', id:'yPanelPickerDateDate',class:'_yPanelPickerTableCellInputLong _yPanelPickerTableCellInputDate _yFL', content:''},
						{element:'input', type:'text', id:'yPanelPickerDateYear',class:'_yPanelPickerTableCellInputLong _yPanelPickerTableCellInputDate _yFL', content:''}
					])},
					{element:'div',class:'_yPanelPickerTableRowDate _yFL',content:y_html([
						{element:'div', id:'yPanelPickerDateMonthDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong _yFL',row:'Month',col:'Down', content:''},
						{element:'div', id:'yPanelPickerDateDateDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong _yFL',row:'Date',col:'Down', content:''},
						{element:'div', id:'yPanelPickerDateYearDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong _yFL',row:'Year',col:'Down', content:''}
					])},
					{element:'div',id:'yPanelPickerDateDay',class:'_yPanelPickerTableRowDate _yFL',content:''},
					{element:'div',id:'yPanelPickerDatePick',class:'_yPanelPickerTableCellButtonPick _yPanelPickerTableRowDate _yFL',content:''},
				])}
			])}
		])}
	]);
	$(this.wrapper).append(h);
	$(this.wrapper).off('click','#yButtonPickerDateYesterday');
	$(this.wrapper).on('click','#yButtonPickerDateYesterday',function(event){
		event=event||window.event;
		var date=y_yesterday('medium_date');
		that.putPickerDate(date);
	});
	$(this.wrapper).off('click','#yButtonPickerDateNow');
	$(this.wrapper).on('click','#yButtonPickerDateNow',function(event){
		event=event||window.event;
		var date=y_now_string('medium_date');
		that.putPickerDate(date);
	});
	$(this.wrapper).off('click','#yButtonPickerDateTomorrow');
	$(this.wrapper).on('click','#yButtonPickerDateTomorrow',function(event){
		event=event||window.event;
		var date=y_tomorrow('medium_date');
		that.putPickerDate(date);
	});
	var kindDate=['Month','Date','Year'];
	var kindCommand=['Up','Down'];
	var eventDateValue=function(){
		var event=event||window.event;
		var row=$(this).attr('row');
		var col=$(this).attr('col');
		that.handleDateValue(row,col);
	};
	for(var i in kindDate){
		for(var j in kindCommand){
			var object='#yPanelPickerDate'+kindDate[i]+kindCommand[j];
			$(this.wrapper).off('click',object);
			$(this.wrapper).on('click',object,eventDateValue);
		}
	}
	$(this.wrapper).off('click','#yPanelPickerDatePick');
	$(this.wrapper).on('click','#yPanelPickerDatePick',function(event){
		event=event||window.event;
		// get current input
		var result=that.getPickerDate();
		that.manageSelectedHistory('Date',result);
		$('#y_panel_date_picker').hide();
		$(that.last_input_type_date).focus();
		$(that.last_input_type_date).val(result);
		$(that.last_input_type_date).focus();
	});
	$('._yPanelPickerDateSelected').click(function(event){
		event=event||window.event;
		$('#y_panel_date_picker').hide();
		var selectedText=$(this).text();
		that.manageSelectedHistory('Date',selectedText);
		$(that.last_input_type_date).focus();
		$(that.last_input_type_date).val(selectedText);
	});
	$('#y_title_date_picker').click(function(event){
		event=event||window.event;
		$('#y_panel_date_picker').hide();
		$(that.last_input_type_date).focus();
	});
	$(this.wrapper).on('change','._yPanelPickerTableCellInputDate',function(){
		$('#yPanelPickerDateDay').text(y_day(that.getPickerDate()));
	});
	$('#y_panel_date_picker').hide();
};

y_form.prototype.create_panel_time_picker=function(){
	var that = this;
	this.data.time=[];
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:'y_panel_time_picker',content:y_html([
			{element:'div',class:'_yPanelPicker _yPanelPickerTime',id:'y_time_picker',content:y_html([
				{element:'div',id:'y_title_time_picker',class:'panel_title',content:'Pick a Time (hours minutes seconds'},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerTime _yFL',content:y_html([
					{element:'div',id:'yButtonPickerTimeLastHour',class:'_yButtonPicker _yFL',content:'-1 Hour'},
					{element:'div',id:'yButtonPickerTimeNow',class:'_yButtonPicker _yFL',content:'Now'},
					{element:'div',id:'yButtonPickerTimeNextHour',class:'_yButtonPicker _yFL',content:'+ 1 Hour'}
				])},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerTime _yFL',content:y_html([
					{element:'div',id:'yButtonPickerTimeMorning',class:'_yButtonPicker _yFL',content:'Morning'},
					{element:'div',id:'yButtonPickerTimeNoon',class:'_yButtonPicker _yFL',content:'Noon'},
					{element:'div',id:'yButtonPickerTimeNight',class:'_yButtonPicker _yFL',content:'Night'}
				])},
				{element:'div',id:'ySelectedTime0',class:'_yPanelPickerSelected _yPanelPickerTimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedTime1',class:'_yPanelPickerSelected _yPanelPickerTimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedTime2',class:'_yPanelPickerSelected _yPanelPickerTimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedTime3',class:'_yPanelPickerSelected _yPanelPickerTimeSelected _yFL',content:''},
				{element:'div',id:'yTimePickerTable',class:'_yPanelPickerTable _yPanelPickerTimeBox _yFL',content:y_html([
					{element:'div',class:'_yPanelPickerTableRowTime _yFL',content:''},
					{element:'div',class:'_yPanelPickerTableRowTime _yFL',content:y_html([
						{element:'div', class:'_yPanelPickerTableCellLabelLong _yFL', content:'Hour'},
						{element:'div', class:'_yPanelPickerTableCellLabelLong _yFL', content:'Minute'},
						{element:'div', class:'_yPanelPickerTableCellLabelLong _yFL', content:'Second'}
					])},
					{element:'div',class:'_yPanelPickerTableRowTime _yFL',content:y_html([
						{element:'div', id:'yPanelPickerTimeHourUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong _yFL',row:'Hour',col:'Up',content:''},
						{element:'div', id:'yPanelPickerTimeMinuteUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong _yFL',row:'Minute',col:'Up',content:''},
						{element:'div', id:'yPanelPickerTimeSecondUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong _yFL',row:'Second',col:'Up',content:''},
					])},
					{element:'div',class:'_yPanelPickerTableRowTall _yFL',content:y_html([
						{element:'input', type:'text', id:'yPanelPickerTimeHour',class:'_yPanelPickerTableCellInputLong _yPanelPickerTableCellInputTime _yFL', content:'12'},
						{element:'input', type:'text', id:'yPanelPickerTimeMinute',class:'_yPanelPickerTableCellInputLong _yPanelPickerTableCellInputTime _yFL', content:'15'},
						{element:'input', type:'text', id:'yPanelPickerTimeSecond',class:'_yPanelPickerTableCellInputLong _yPanelPickerTableCellInputTime _yFL', content:'15'},
					])},
					{element:'div',class:'_yPanelPickerTableRowTime _yFL',content:y_html([
						{element:'div', id:'yPanelPickerTimeHourDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong _yFL',row:'Hour',col:'Down', content:''},
						{element:'div', id:'yPanelPickerTimeMinuteDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong _yFL',row:'Minute',col:'Down', content:''},
						{element:'div', id:'yPanelPickerTimeSecondDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong _yFL',row:'Second',col:'Down', content:''},
					])},
					{element:'div',id:'yPanelPickerTimePick',class:'_yPanelPickerTableCellButtonPick _yPanelPickerTableRowTime _yFL',content:''},
				])}
			])}
		])}
	]);
	$(this.wrapper).append(h);
	$(this.wrapper).off('click','#yButtonPickerTimeLastHour');
	$(this.wrapper).on('click','#yButtonPickerTimeLastHour',function(event){
		event=event||window.event;
		var time=y_last_hour('time');
		that.putPickerTime(time);
	});
	$(this.wrapper).off('click','#yButtonPickerTimeNow');
	$(this.wrapper).on('click','#yButtonPickerTimeNow',function(event){
		event=event||window.event;
		var time=y_now_string('time');
		that.putPickerTime(time);
	});
	$(this.wrapper).off('click','#yButtonPickerTimeNextHour');
	$(this.wrapper).on('click','#yButtonPickerTimeNextHour',function(event){
		event=event||window.event;
		var time=y_next_hour('time');
		that.putPickerTime(time);
	});
	$(this.wrapper).off('click','#yButtonPickerTimeMorning');
	$(this.wrapper).on('click','#yButtonPickerTimeMorning',function(event){
		event=event||window.event;
		that.setTimePicker('Hour','08');
		that.setTimePicker('Minute','00');
		that.setTimePicker('Second','00');
	});
	$(this.wrapper).off('click','#yButtonPickerTimeNoon');
	$(this.wrapper).on('click','#yButtonPickerTimeNoon',function(event){
		event=event||window.event;
		that.setTimePicker('Hour','12');
		that.setTimePicker('Minute','00');
		that.setTimePicker('Second','00');
	});
	$(this.wrapper).off('click','#yButtonPickerTimeNight');
	$(this.wrapper).on('click','#yButtonPickerTimeNight',function(event){
		event=event||window.event;
		that.setTimePicker('Hour','21');
		that.setTimePicker('Minute','00');
		that.setTimePicker('Second','00');
	});
	var kindTime=['Hour','Minute','Second'];
	var kindCommand=['Up','Down'];
	var eventTimeValue=function(){
		var event=event||window.event;
		var row=$(this).attr('row');
		var col=$(this).attr('col');
		that.handleTimeValue(row,col);
	};
	for(var i in kindTime){
		for(var j in kindCommand){
			var object='#yPanelPickerTime'+kindTime[i]+kindCommand[j];
			$(this.wrapper).off('click',object);
			$(this.wrapper).on('click',object,eventTimeValue);
		}
	}
	$(this.wrapper).off('click','#yPanelPickerTimePick');
	$(this.wrapper).on('click','#yPanelPickerTimePick',function(event){
		event=event||window.event;
		// get current input
		var result=that.getPickerTime();
		that.manageSelectedHistory('Time',result);
		$('#y_panel_time_picker').hide();
		$(that.last_input_type_time).focus();
		$(that.last_input_type_time).val(result);
		$(that.last_input_type_time).focus();

	});
	$('._yPanelPickerTimeSelected').click(function(event){
		event=event||window.event;
		$('#y_panel_time_picker').hide();
		var selectedText=$(this).text();
		that.manageSelectedHistory('Time',selectedText);
		$(that.last_input_type_time).focus();
		$(that.last_input_type_time).val(selectedText);
	});
	$('#y_title_time_picker').click(function(event){
		event=event||window.event;
		$('#y_panel_time_picker').hide();
		$(that.last_input_type_time).focus();
	});
	$('#y_panel_time_picker').hide();
};

y_form.prototype.create_panel_simple_time_picker=function(){
	var that = this;
	this.data.simpleTime=[];
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:'y_panel_simple_time_picker',content:y_html([
			{element:'div',class:'_yPanelPicker _yPanelPickerSimpleTime',id:'y_simple_time_picker',content:y_html([
				{element:'div',id:'y_title_simple_time_picker',class:'panel_title',content:'Pick a Simple Time (hours minutes'},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerTime _yFL',content:y_html([
					{element:'div',id:'yButtonPickerSimpleTimeLastHour',class:'_yButtonPicker _yFL',content:'-1 Hour'},
					{element:'div',id:'yButtonPickerSimpleTimeNow',class:'_yButtonPicker _yFL',content:'Now'},
					{element:'div',id:'yButtonPickerSimpleTimeNextHour',class:'_yButtonPicker _yFL',content:'+ 1 Hour'}
				])},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerSimpleTime _yFL',content:y_html([
					{element:'div',id:'yButtonPickerSimpleTimeMorning',class:'_yButtonPicker _yFL',content:'Morning'},
					{element:'div',id:'yButtonPickerSimpleTimeNoon',class:'_yButtonPicker _yFL',content:'Noon'},
					{element:'div',id:'yButtonPickerSimpleTimeNight',class:'_yButtonPicker _yFL',content:'Night'}
				])},
				{element:'div',id:'ySelectedSimpleTime0',class:'_yPanelPickerSelected _yPanelPickerSimpleTimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedSimpleTime1',class:'_yPanelPickerSelected _yPanelPickerSimpleTimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedSimpleTime2',class:'_yPanelPickerSelected _yPanelPickerSimpleTimeSelected _yFL',content:''},
				{element:'div',id:'ySelectedSimpleTime3',class:'_yPanelPickerSelected _yPanelPickerSimpleTimeSelected _yFL',content:''},
				{element:'div',id:'ySimpleTimePickerTable',class:'_yPanelPickerTable _yPanelPickerSimpleTimeBox _yFL',content:y_html([
					{element:'div',class:'_yPanelPickerTableRowSimpleTime _yFL',content:''},
					{element:'div',class:'_yPanelPickerTableRowSimpleTime _yFL',content:y_html([
						{element:'div', class:'_yPanelPickerTableCellLabelLong2 _yFL', content:'Hour'},
						{element:'div', class:'_yPanelPickerTableCellLabelLong2 _yFL', content:'Minute'}
					])},
					{element:'div',class:'_yPanelPickerTableRowSimpleTime _yFL',content:y_html([
						{element:'div', id:'yPanelPickerSimpleTimeHourUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong2 _yFL',row:'Hour',col:'Up',content:''},
						{element:'div', id:'yPanelPickerSimpleTimeMinuteUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong2 _yFL',row:'Minute',col:'Up',content:''},
					])},
					{element:'div',class:'_yPanelPickerTableRowTall _yFL',content:y_html([
						{element:'input', type:'text', id:'yPanelPickerSimpleTimeHour',class:'_yPanelPickerTableCellInputLong2 _yPanelPickerTableCellInputSimpleTime _yFL', content:'12'},
						{element:'input', type:'text', id:'yPanelPickerSimpleTimeMinute',class:'_yPanelPickerTableCellInputLong2 _yPanelPickerTableCellInputSimpleTime _yFL', content:'15'},
					])},
					{element:'div',class:'_yPanelPickerTableRowSimpleTime _yFL',content:y_html([
						{element:'div', id:'yPanelPickerSimpleTimeHourDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong2 _yFL',row:'Hour',col:'Down', content:''},
						{element:'div', id:'yPanelPickerSimpleTimeMinuteDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong2 _yFL',row:'Minute',col:'Down', content:''},
					])},
					{element:'div',id:'yPanelPickerSimpleTimePick',class:'_yPanelPickerTableCellButtonPick _yPanelPickerTableRowSimpleTime _yFL',content:''},
				])}
			])}
		])}
	]);
	$(this.wrapper).append(h);
	$(this.wrapper).off('click','#yButtonPickerSimpleTimeLastHour');
	$(this.wrapper).on('click','#yButtonPickerSimpleTimeLastHour',function(event){
		event=event||window.event;
		var time=y_last_hour('simple_time');
		that.putPickerSimpleTime(time);
	});
	$(this.wrapper).off('click','#yButtonPickerSimpleTimeNow');
	$(this.wrapper).on('click','#yButtonPickerSimpleTimeNow',function(event){
		event=event||window.event;
		var time=y_now_string('simple_time');
		that.putPickerSimpleTime(time);
	});
	$(this.wrapper).off('click','#yButtonPickerSimpleTimeNextHour');
	$(this.wrapper).on('click','#yButtonPickerSimpleTimeNextHour',function(event){
		event=event||window.event;
		var time=y_next_hour('simple_time');
		that.putPickerSimpleTime(time);
	});
	$(this.wrapper).off('click','#yButtonPickerSimpleTimeMorning');
	$(this.wrapper).on('click','#yButtonPickerSimpleTimeMorning',function(event){
		event=event||window.event;
		that.setSimpleTimePicker('Hour','08');
		that.setSimpleTimePicker('Minute','00');
	});
	$(this.wrapper).off('click','#yButtonPickerSimpleTimeNoon');
	$(this.wrapper).on('click','#yButtonPickerSimpleTimeNoon',function(event){
		event=event||window.event;
		that.setSimpleTimePicker('Hour','12');
		that.setSimpleTimePicker('Minute','00');
	});
	$(this.wrapper).off('click','#yButtonPickerSimpleTimeNight');
	$(this.wrapper).on('click','#yButtonPickerSimpleTimeNight',function(event){
		event=event||window.event;
		that.setSimpleTimePicker('Hour','21');
		that.setSimpleTimePicker('Minute','00');
	});
	var kindSimpleTime=['Hour','Minute'];
	var kindCommand=['Up','Down'];
	var eventValue=function(){
		var event=event||window.event;
		var row=$(this).attr('row');
		var col=$(this).attr('col');
		that.handleSimpleTimeValue(row,col);
	};
	for(var i in kindSimpleTime){
		for(var j in kindCommand){
			var object='#yPanelPickerSimpleTime'+kindSimpleTime[i]+kindCommand[j];
			$(this.wrapper).off('click',object);
			$(this.wrapper).on('click',object,eventValue);
		}
	}
	$(this.wrapper).off('click','#yPanelPickerSimpleTimePick');
	$(this.wrapper).on('click','#yPanelPickerSimpleTimePick',function(event){
		event=event||window.event;
		// get current input
		var result=that.getPickerSimpleTime();
		that.manageSelectedHistory('SimpleTime',result);
		$('#y_panel_simple_time_picker').hide();
		$(that.last_input_type_simple_time).focus();
		$(that.last_input_type_simple_time).val(result);
		$(that.last_input_type_simple_time).focus();

	});
	$('._yPanelPickerSimpleTimeSelected').click(function(event){
		event=event||window.event;
		$('#y_panel_simple_time_picker').hide();
		var selectedText=$(this).text();
		that.manageSelectedHistory('SimpleTime',selectedText);
		$(that.last_input_type_simple_time).focus();
		$(that.last_input_type_simple_time).val(selectedText);
	});
	$('#y_title_simple_time_picker').click(function(event){
		event=event||window.event;
		$('#y_panel_simple_time_picker').hide();
		$(that.last_input_type_simple_time).focus();
	});
	$('#y_panel_simple_time_picker').hide();
};

y_form.prototype.create_panel_simple_month_picker=function(){
	var that = this;
	this.data.simple_month=[];
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:'y_panel_simple_month_picker',content:y_html([
			{element:'div',class:'_yPanelPicker _yPanelPickerSimpleMonth',id:'y_simple_month_picker',content:y_html([
				{element:'div',id:'y_title_simple_month_picker',class:'panel_title',content:'Pick Month'},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerSimpleMonth _yFL',content:y_html([
					{element:'div',id:'yButtonPickerLastMonth',class:'_yButtonPicker _yFL',content:'Last Month'},
					{element:'div',id:'yButtonPickerThisMonth',class:'_yButtonPicker _yFL',content:'This Month'},
					{element:'div',id:'yButtonPickerNextMonth',class:'_yButtonPicker _yFL',content:'Next Month'}
				])},
				{element:'div',class:'_yToolbarPicker _yPanelPickerSimpleMonth _yFL',content:''},
				{element:'div',id:'ySelectedSimpleMonth0',class:'_yPanelPickerSelected _yPanelPickerSimpleMonthSelected _yFL',content:''},
				{element:'div',id:'ySelectedSimpleMonth1',class:'_yPanelPickerSelected _yPanelPickerSimpleMonthSelected _yFL',content:''},
				{element:'div',id:'ySelectedSimpleMonth2',class:'_yPanelPickerSelected _yPanelPickerSimpleMonthSelected _yFL',content:''},
				{element:'div',id:'ySelectedSimpleMonth3',class:'_yPanelPickerSelected _yPanelPickerSimpleMonthSelected _yFL',content:''},
				{element:'div',id:'ySimpleMonthPickerTable',class:'_yPanelPickerTable _yPanelPickerSimpleMonthBox _yFL',content:y_html([
					{element:'div',class:'_yPanelPickerTableRowSimpleMonth _yFL',content:y_html([
						{element:'div', class:'_yPanelPickerTableCellLabelLong2 _yFL', content:'Month'},
						{element:'div', class:'_yPanelPickerTableCellLabelLong2 _yFL', content:'Year'}
					])},
					{element:'div',class:'_yPanelPickerTableRowSimpleMonth _yFL',content:y_html([
						{element:'div', id:'yPanelPickerSimpleMonthMonthUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong2 _yFL',row:'Month',col:'Up',content:''},
						{element:'div', id:'yPanelPickerSimpleMonthYearUp',class:'_yPanelPickerTableCellButtonUp _yPanelPickerTableCellLabelLong2 _yFL',row:'Year',col:'Up',content:''}
					])},
					{element:'div',class:'_yPanelPickerTableRowTall _yFL',content:y_html([
						{element:'input', type:'text', id:'yPanelPickerSimpleMonthMonth',class:'_yPanelPickerTableCellInputLong2 _yPanelPickerTableCellInputSimpleMonth _yFL', content:'January'},
						{element:'input', type:'text', id:'yPanelPickerSimpleMonthYear',class:'_yPanelPickerTableCellInputLong2 _yPanelPickerTableCellInputSimpleMonth _yFL', content:'2015'}
					])},
					{element:'div',class:'_yPanelPickerTableRowSimpleMonth _yFL',content:y_html([
						{element:'div', id:'yPanelPickerSimpleMonthMonthDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong2 _yFL',row:'Month',col:'Down', content:''},
						{element:'div', id:'yPanelPickerSimpleMonthYearDown',class:'_yPanelPickerTableCellButtonDown _yPanelPickerTableCellLabelLong2 _yFL',row:'Year',col:'Down', content:''}
					])},
					{element:'div',id:'yPanelPickerSimpleMonthName',class:'_yPanelPickerTableRowSimpleMonth _yFL',content:''},
					{element:'div',id:'yPanelPickerSimpleMonthPick',class:'_yPanelPickerTableCellButtonPick _yPanelPickerTableRowSimpleMonth _yFL',content:''},
				])}
			])}
		])}
	]);
	$(this.wrapper).append(h);
	$(this.wrapper).off('click','#yButtonPickerLastMonth');
	$(this.wrapper).on('click','#yButtonPickerLastMonth',function(event){
		event=event||window.event;
		var date=y_last_month('simple_month');
		that.putPickerSimpleMonth(date);
	});
	$(this.wrapper).off('click','#yButtonPickerThisMonth');
	$(this.wrapper).on('click','#yButtonPickerThisMonth',function(event){
		event=event||window.event;
		var date=y_this_month('simple_month');
		that.putPickerSimpleMonth(date);
	});
	$(this.wrapper).off('click','#yButtonPickerNextMonth');
	$(this.wrapper).on('click','#yButtonPickerNextMonth',function(event){
		event=event||window.event;
		var date=y_next_month('simple_month');
		that.putPickerSimpleMonth(date);
	});
	var kindSimpleMonth=['Month','Year'];
	var kindCommand=['Up','Down'];
	var eventSimpleMonthValue=function(){
		var event=event||window.event;
		var row=$(this).attr('row');
		var col=$(this).attr('col');
		that.handleSimpleMonthValue(row,col);
	};
	for(var i in kindSimpleMonth){
		for(var j in kindCommand){
			var object='#yPanelPickerSimpleMonth'+kindSimpleMonth[i]+kindCommand[j];
			$(this.wrapper).off('click',object);
			$(this.wrapper).on('click',object,eventSimpleMonthValue);
		}
	}
	$(this.wrapper).off('click','#yPanelPickerSimpleMonthPick');
	$(this.wrapper).on('click','#yPanelPickerSimpleMonthPick',function(event){
		event=event||window.event;
		// get current input
		var result=that.getPickerSimpleMonth();
		that.manageSelectedHistory('SimpleMonth',result);
		$('#y_panel_simple_month_picker').hide();
		$(that.last_input_type_simple_month).focus();
		$(that.last_input_type_simple_month).val(result);
		$(that.last_input_type_simple_month).focus();

	});
	$('._yPanelPickerSimpleMonthSelected').click(function(event){
		event=event||window.event;
		$('#y_panel_simple_month_picker').hide();
		var selectedText=$(this).text();
		that.manageSelectedHistory('SimpleMonth',selectedText);
		$(that.last_input_type_simple_month).focus();
		$(that.last_input_type_simple_month).val(selectedText);
	});
	$('#y_title_simple_month_picker').click(function(event){
		event=event||window.event;
		$('#y_panel_simple_month_picker').hide();
		$(that.last_input_type_simple_month).focus();
	});
	$(this.wrapper).on('change','._yPanelPickerTableCellInputSimpleMonth',function(){
		$('#yPanelPickerSimpleMonthName').text(y_month_name(that.getPickerSimpleMonth()));
	});
	$('#y_panel_simple_month_picker').hide();
};

// Get Picker Value
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.getPickerDate=function(request){
	return this.getPickerValue('Date',request);
};
y_form.prototype.getPickerDatetime=function(request){
	return this.getPickerValue('Datetime',request);
};
y_form.prototype.getPickerTime=function(request){
	return this.getPickerValue('Time',request);
};
y_form.prototype.getPickerSimpleTime=function(request){
	return this.getPickerValue('SimpleTime',request);
};
y_form.prototype.getPickerSimpleMonth=function(request){
	return this.getPickerValue('SimpleMonth',request);
};
y_form.prototype.getPickerValue=function(type,request){
	var result;
	var month,date,year,hour,minute,second;
	result=typeof request!=='undefined'?$('#yPanelPicker'+type+request).val():false;
	if(!result && typeof type!=='undefined')
	{
		month=$('#yPanelPicker'+type+'Month').val();
		date=$('#yPanelPicker'+type+'Date').val();
		year=$('#yPanelPicker'+type+'Year').val();
		hour=$('#yPanelPicker'+type+'Hour').val();
		minute=$('#yPanelPicker'+type+'Minute').val();
		second=$('#yPanelPicker'+type+'Second').val();
		switch(type){
			case'Datetime':
				result = month+'/'+date+'/'+year+' '+hour+':'+minute;
				break;
			case 'Date':
				result = month+'/'+date+'/'+year;
				break;
			case 'Time':
				result = hour+':'+minute+':'+second;
				break;
			case 'SimpleTime':
				result = hour+':'+minute;
				break;
			case 'SimpleMonth':
				result = month+'/'+year;
				break;
		}
	}
	return result;
};

// Put Picker Value
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.putPickerDatetime=function(value){
	var month;
	var date;
	var year;
	var hour;
	var minute;
	var second;
	if(value!==''){
		var arrayDateTime=value.split(' ');
		var arrayDate = arrayDateTime[0];
		var arrayTime = arrayDateTime[1];
		if(typeof arrayDate !== 'undefined'){
			var sDate=arrayDate.split('/');
			month = typeof sDate[0]!=='undefined'? sDate[0]:'00';
			date = typeof sDate[1]!=='undefined'? sDate[1]:'00';
			year = typeof sDate[2]!=='undefined'? sDate[2]:'0000';
		}
		if(typeof arrayTime !== 'undefined'){
			var sTime=arrayTime.split(':');
			hour = typeof sTime[0]!=='undefined'? sTime[0]:'00';
			minute = typeof sTime[1]!=='undefined'? sTime[1]:'00';
			second = typeof sTime[2]!=='undefined'? sTime[2]:'00';
		}
	}
	this.setDatetimePicker('Month',month);
	this.setDatetimePicker('Date',date);
	this.setDatetimePicker('Year',year);
	this.setDatetimePicker('Hour',hour);
	this.setDatetimePicker('Minute',minute);
	this.setDatetimePicker('Second',second);
};
y_form.prototype.putPickerDate=function(arrayDate){
	var month;
	var date;
	var year;
	if(arrayDate!==''){
		if(typeof arrayDate !== 'undefined'){
			var sDate=arrayDate.split('/');
			month = typeof sDate[0]!=='undefined'? sDate[0]:'00';
			date = typeof sDate[1]!=='undefined'? sDate[1]:'00';
			year = typeof sDate[2]!=='undefined'? sDate[2]:'0000';
		}
	}
	this.setDatePicker('Month',month);
	this.setDatePicker('Date',date);
	this.setDatePicker('Year',year);
};
y_form.prototype.putPickerTime=function(value){
	var hour;
	var minute;
	var second;
	if(value!==''){
		if(typeof value !== 'undefined'){
			var sTime=value.split(':');
			hour = typeof sTime[0]!=='undefined'? sTime[0]:'00';
			minute = typeof sTime[1]!=='undefined'? sTime[1]:'00';
			second = typeof sTime[2]!=='undefined'? sTime[2]:'00';
		}
	}
	this.setTimePicker('Hour',hour);
	this.setTimePicker('Minute',minute);
	this.setTimePicker('Second',second);
};
y_form.prototype.putPickerSimpleTime=function(value){
	var hour;
	var minute;
	if(value!==''){
		if(typeof value !== 'undefined'){
			var sTime=value.split(':');
			hour = typeof sTime[0]!=='undefined'? sTime[0]:'00';
			minute = typeof sTime[1]!=='undefined'? sTime[1]:'00';
		}
	}
	this.setSimpleTimePicker('Hour',hour);
	this.setSimpleTimePicker('Minute',minute);
};

y_form.prototype.putPickerSimpleMonth=function(value){
	var month;
	var year;
	if(value!==''){
		var arraySimpleMonth=value.split(' ');
		var arrayDate = arraySimpleMonth[0];
		if(typeof arrayDate !== 'undefined'){
			var sDate=arrayDate.split('/');
			month = typeof sDate[0]!=='undefined'? sDate[0]:'00';
			year = typeof sDate[1]!=='undefined'? sDate[1]:'0000';
		}
	}
	this.setSimpleMonthPicker('Month',month);
	this.setSimpleMonthPicker('Year',year);
};

// Set Picker Value
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.setDatetimePicker=function(kind, value){
	if(parseInt(value)<10 && kind!=='Year'){
		value='0'+parseInt(value);
	}
	$('#yPanelPickerDatetime'+kind).val(value);
	$('#yPanelPickerDatetimeDay').text(y_day(this.getPickerDatetime()));
};
y_form.prototype.setDatePicker=function(kind, value){
	if(parseInt(value)<10 && kind!=='Year'){
		value='0'+parseInt(value);
	}
	$('#yPanelPickerDate'+kind).val(value);
	$('#yPanelPickerDateDay').text(y_day(this.getPickerDate()));
};
y_form.prototype.setTimePicker=function(kind, value){
	if(parseInt(value)<10){
		value='0'+parseInt(value);
	}
	$('#yPanelPickerTime'+kind).val(value);
};
y_form.prototype.setSimpleTimePicker=function(kind, value){
	if(parseInt(value)<10){
		value='0'+parseInt(value);
	}
	$('#yPanelPickerSimpleTime'+kind).val(value);
};
y_form.prototype.setSimpleMonthPicker=function(kind, value){
	if(parseInt(value)<10 && kind!=='Year'){
		value='0'+parseInt(value);
	}
	$('#yPanelPickerSimpleMonth'+kind).val(value);
	$('#yPanelPickerSimpleMonthName').text(y_month_name(this.getPickerSimpleMonth()));
};


// Handle Picker Value
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.handleDatetimeValue=function(kind,command){
	var value=this.getPickerDatetime(kind);
	var year=this.getPickerDatetime('Year');
	var month=this.getPickerDatetime('Month');
	var date=this.getPickerDatetime('Date');
	switch(kind){
		case 'Month':
			value=this.changeValue(value,command,1,12);
			month=value;
			var newDate = new Date(parseInt(year), parseInt(month), 0);
			var dayOfMonth=newDate.getDate();
			var valueDate=date > dayOfMonth?dayOfMonth:date;
			this.setDatetimePicker('Date',valueDate);
			break;
		case 'Date':
			var d = new Date(parseInt(year), parseInt(month), 0);
			value=this.changeValue(value,command,1,d.getDate());
			break;
		case 'Year':
			value=this.changeValue(value,command,0,9999);
			break;
		case 'Hour':
			value=this.changeValue(value,command,0,23);
			break;
		case 'Minute':
		case 'Second':
			value=this.changeValue(value,command,0,59);
			break;
	}
	this.setDatetimePicker(kind,value);
};
y_form.prototype.handleDateValue=function(kind,command){
	var value=this.getPickerDate(kind);
	var year=this.getPickerDate('Year');
	var month=this.getPickerDate('Month');
	var date=this.getPickerDate('Date');
	switch(kind){
		case 'Month':
			value=this.changeValue(value,command,1,12);
			month=value;
			var newDate = new Date(parseInt(year), parseInt(month), 0);
			var dayOfMonth=newDate.getDate();
			var valueDate=date > dayOfMonth?dayOfMonth:date;
			this.setDatePicker('Date',valueDate);
			break;
		case 'Date':
			var d = new Date(parseInt(year), parseInt(month), 0);
			value=this.changeValue(value,command,1,d.getDate());
			break;
		case 'Year':
			value=this.changeValue(value,command,0,9999);
			break;
	}
	this.setDatePicker(kind,value);
};
y_form.prototype.handleTimeValue=function(kind,command){
	var value=this.getPickerTime(kind);
	switch(kind){
		case 'Hour':
			value=this.changeValue(value,command,0,23);
			break;
		case 'Minute':
		case 'Second':
			value=this.changeValue(value,command,0,59);
			break;
	}
	this.setTimePicker(kind,value);
};
y_form.prototype.handleSimpleTimeValue=function(kind,command){
	var value=this.getPickerSimpleTime(kind);
	switch(kind){
		case 'Hour':
			value=this.changeValue(value,command,0,23);
			break;
		case 'Minute':
			value=this.changeValue(value,command,0,59);
			break;
	}
	this.setSimpleTimePicker(kind,value);
};
y_form.prototype.handleSimpleMonthValue=function(kind,command){
	var value=this.getPickerSimpleMonth(kind);
	var year=this.getPickerSimpleMonth('Year');
	var month=this.getPickerSimpleMonth('Month');
	switch(kind){
		case 'Month':
			value=this.changeValue(value,command,1,12);
			month=value;
			var newDate = new Date(parseInt(year), parseInt(month), 0);
			var dayOfMonth=newDate.getDate();
			var valueDate=date > dayOfMonth?dayOfMonth:date;
			this.setSimpleMonthPicker('Date',valueDate);
			break;
		case 'Year':
			value=this.changeValue(value,command,0,9999);
			break;
	}
	this.setSimpleMonthPicker(kind,value);
};

// Change Picker Value Command
//----------------------------------------------------------------------------------------------------------------------
// Return new value when up down button pressed
// value = current value
// command = Up or Down or Up Up or DownDown
// start = lowest value
// end = higest value
y_form.prototype.changeValue=function(value,command,start,end){
	if( isNaN(value) || value===''){value = start;}
	else{
		switch(command){
			case 'Up':
				value=parseInt(value)+1;
				if(value > end){value = start;}
				break;
			case 'Down':
				value=parseInt(value)-1;
				if(value < start){value = end;}
				break;
			case 'UpUp':
				value=end;
				break;
			case 'DownDown':
				value=start;
				break;
		}
	}
	return value;
};

// Manage Selected History
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.manageSelectedHistory=function(type,new_data){
	var no_of_history = 4;
	var data=[];
	var array=[];
	var i;
	for(i=0; i<no_of_history; i++){
		data[i]=$('#ySelected'+type+i).text();
		array[i]='';
	}
	var j=0;
	array[0]=new_data;
	for(i=0; i<no_of_history; i++){
		if(data[i]!==new_data){
			array[j+1]=data[i];
			j++;
		}
	}
	for(i=0; i<no_of_history; i++){
		$('#ySelected'+type+i).text(array[i]);
	}
};

// Location Picker
y_form.prototype.use_location_picker=function(){
	var that = this;
	var bgColor='#E9FFE8';
	var bgColorFocus='#F6DEE5';
	this.create_panel_location_picker(this);
	$(this.wrapper).off('click','.buttonLocationPicker');
	$(this.wrapper).on('click','.buttonLocationPicker',function(event){
		event=event||window.event;
		if($(this).prev().attr('disabled')!=='disabled'){
			that.default_parent_location_id=$(this).attr('data');
			that.default_type_location_id=$(this).attr('cols');
			if($(this).css('background-color')!='rgba(0, 0, 0, 0)'){
				$(this).css('background-color',bgColorFocus);
			}
			that.last_input_type_location=$(this).prev()[0];
			var location_name=$(that.last_input_type_location).val();
			if(location_name!==''){
				that.getLocationData(false,location_name);
			}
			else{
				if(that.default_type_location_id && that.default_type_location_id!==0){
					that.getLocationData(false, false, that.default_type_location_id);
				}
				else{
					that.getLocationData(that.default_parent_location_id);
				}
			}
			$(this).prev().css('background-color',bgColorFocus);
			$('#y_panel_location_picker').show();
			document.getElementById('yLocationInputFilter').focus();
		}
	});
	$(this.wrapper).off('focusin','.input_type_location');
	$(this.wrapper).on('focusin','.input_type_location',function(){
		$(this).css('background-color',bgColorFocus);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColorFocus);
		}
	});
	$(this.wrapper).off('focusout','.input_type_location');
	$(this.wrapper).on('focusout','.input_type_location',function(){
		$(this).css('background-color',bgColor);
		if($(this).next().css('background-color')!='rgba(0, 0, 0, 0)'){
			$(this).next().css('background-color',bgColor);
		}
	});
	$(this.wrapper).off('click','.label_header_type_location');
	$(this.wrapper).on('click','.label_header_type_location',function(event){
		event=event||window.event;
		var name=$(this).attr('col');
		var col='.input_'+name;
		var len=col.length;
		var default_parent_location_id=0;
		var firstCol=$(col)[0];
		if(typeof firstCol!== 'undefined'){
			var location_name=$(firstCol).val();
			var nextButton=$(firstCol).next()[0];
			var dataButton=$(nextButton).attr('data');
			that.default_parent_location_id=0;
			if(default_parent_location_id!==''){
				that.default_parent_location_id=dataButton;
			}
			that.last_input_type_location=$(col);
			if(location_name!==''){
				that.getLocationData(false,location_name);
			}
			else{
				that.getLocationData(that.default_parent_location_id);
			}
			$('#y_panel_location_picker').show();
			document.getElementById('yLocationInputFilter').focus();
		}

	});
};
y_form.prototype.create_panel_location_picker=function(){
	var that = this;
	this.data.location=[];
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:'y_panel_location_picker',content:y_html([
			{element:'div',class:'_yPanelPicker _yPanelPickerLocation',id:'y_location_picker',content:y_html([
				{element:'div',id:'y_title_location_picker',class:'panel_title',content:'Pick a Location'},
				{element:'div',class:'_yToolbarPicker _yToolbarPickerLocation _yFL',content:y_html([
					{element:'div',id:'yButtonPickerAll',class:'_yButtonPicker _yFL',content:'All'},
					{element:'div',id:'yButtonPickerDefault',class:'_yButtonPicker _yFL',content:'Default'},
					{element:'div',id:'yButtonPickerType',class:'_yButtonPicker _yFL',content:'Type'}
				])},
				{element:'div',id:'ySelectedLocation0',class:'_yPanelPickerSelected _yPanelPickerLocationSelected _yFL',content:''},
				{element:'div',id:'ySelectedLocation1',class:'_yPanelPickerSelected _yPanelPickerLocationSelected _yFL',content:''},
				{element:'div',id:'ySelectedLocation2',class:'_yPanelPickerSelected _yPanelPickerLocationSelected _yFL',content:''},
				{element:'div',id:'ySelectedLocation3',class:'_yPanelPickerSelected _yPanelPickerLocationSelected _yFL',content:''},
				{element:'div',id:'yLocationParent',class:'_yPanelPickerParent _yPanelPickerLocationParent _yFL',content:' '},
				{element:'div',id:'yLocationPickerTable',class:'_yPanelPickerTable _yPanelPickerLocationBox _yFL',content:''},
				{element:'input',type:'text',id:'yLocationInputFilter',class:'input_text _yPanelPickerInputFilter _yPanelPickerLocationInputFilter _yFL',content:' '},
			])}
		])}
	]);
	$(this.wrapper).append(h);
	$(this.wrapper).off('click','#yButtonPickerAll');
	$(this.wrapper).on('click','#yButtonPickerAll',function(event){
		event=event||window.event;
		that.getLocationData('all');
	});
	$(this.wrapper).off('click','#yButtonPickerDefault');
	$(this.wrapper).on('click','#yButtonPickerDefault',function(event){
		event=event||window.event;
		that.getLocationData(that.default_parent_location_id);
	});
	$(this.wrapper).off('click','#yButtonPickerType');
	$(this.wrapper).on('click','#yButtonPickerType',function(event){
		event=event||window.event;
		that.getLocationData('type_list');
	});
	$(this.wrapper).off('click','#yLocationParent');
	$(this.wrapper).on('click','#yLocationParent',function(event){
		event=event||window.event;
		var grandparent_location_id=$('#yLocationParent').attr('parent');
		if(grandparent_location_id=='type'){
			var location_type_id=$('#yLocationParent').attr('data');
			parent_type = parseInt(location_type_id)-1;
 			that.getLocationData('type_list');
		}
		else{
			that.getLocationData(grandparent_location_id);
		}
	});
	$(this.wrapper).off('click','._yPanelPickerLocationBoxType');
	$(this.wrapper).on('click','._yPanelPickerLocationBoxType',function(event){
		event=event||window.event;
		var location_type_id=$(this).attr('data');
		that.getLocationData(false,false,location_type_id);
	});

	$(this.wrapper).off('click','._yPanelPickerLocationBoxButtonEnter');
	$(this.wrapper).on('click','._yPanelPickerLocationBoxButtonEnter',function(event){
		event=event||window.event;
		var type=$('#yLocationParent').attr('parent');
		if(type==='type_list')
		{
			var type_id=$(this).siblings('._yPanelPickerLocationBoxCell').attr('data');
			that.getLocationData(false,false,type_id);
		}
		else{
			var new_parent_id=$(this).siblings('._yPanelPickerLocationBoxCell').attr('data');
			that.getLocationData(new_parent_id);
		}
		document.getElementById('yLocationInputFilter').value='';
		document.getElementById('yLocationInputFilter').focus();

	});
	$(this.wrapper).off('click','._yPanelPickerLocationBoxCell');
	$(this.wrapper).on('click','._yPanelPickerLocationBoxCell',function(event){
		event=event||window.event;
		var type=$('#yLocationParent').attr('parent');
		if(type==='type_list'){
			var type_id=$(this).attr('data');
			that.getLocationData(false,false,type_id);
		}
		else{
			var location_name=$(this).attr('row');
			that.manageSelectedHistory('Location',location_name);
			$('#y_panel_location_picker').hide();
			$(that.last_input_type_location).focus();
			$(that.last_input_type_location).val(location_name);
			$(that.last_input_type_location).focus();
		}
	});
	$(this.wrapper).off('dblclick','._yPanelPickerLocationBoxCell');
	$(this.wrapper).on('dblclick','._yPanelPickerLocationBoxCell',function(event){
		event=event||window.event;
		var new_parent_id=$(this).attr('data');
		that.getLocationData(new_parent_id);
	});
	$(this.wrapper).off('hover','._yPanelPickerLocationBoxButtonEnter');
	$(this.wrapper).on('hover','._yPanelPickerLocationBoxButtonEnter',function(e) {
	    if (e.type == "mouseenter") {
	         $(this).prev().css('background-color','#565656');
	    }
	    else {
	         $(this).prev().css('background-color','#E8E8E8');
	    }
	});
	$(this.wrapper).off('hover','._yPanelPickerLocationBoxCell');
	$(this.wrapper).on('hover','._yPanelPickerLocationBoxCell',function(e) {
	    if (e.type == "mouseenter") {
	         $(this).css('background-color','#565656');
	    }
	    else {
	         $(this).css('background-color','#E8E8E8');
	    }
	});
	$('._yPanelPickerLocationSelected').click(function(event){
		event=event||window.event;
		$('#y_panel_location_picker').hide();
		var selectedText=$(this).text();
		that.manageSelectedHistory('Location',selectedText);
		$(that.last_input_type_location).focus();
		$(that.last_input_type_location).val(selectedText);
	});
	$('#y_title_location_picker').click(function(event){
		event=event||window.event;
		$('#y_panel_location_picker').hide();
		$(that.last_input_type_location).focus();
	});
	$('#y_panel_location_picker').hide();
	document.addEventListener('keyup',function(event){
		var key=event.keyCode;
		var picker=document.getElementById('y_location_picker');
		if(typeof picker === 'object' && picker!==null){
			if(typeof picker.offsetLeft==='number' && picker.offsetLeft!==null){
				var offsetLeft=picker.offsetLeft;
				if(offsetLeft>0){
					var el=document.getElementById('yLocationInputFilter');
					if((key>=65 && key<=90) || key===13 || key=== 8 || key === 46){
						that.filterLocationPicker(el.value);
					}
					else if(key==27){
						that.filterLocationPicker();
					}
				}
			}
		}
	});
	document.addEventListener('keydown', function(event) {
		var key=event.keyCode;
		var picker=document.getElementById('y_location_picker');
		if(typeof picker === 'object' && picker!==null){
			if(typeof picker.offsetLeft==='number' && picker.offsetLeft!==null){
				var offsetLeft=picker.offsetLeft;
				if(offsetLeft>0){
					el=document.getElementById('yLocationInputFilter');
					if(key >=65 && key <=90){
						if(el.value===''){
							el.focus();
						}
					}
					else if (key==27){
						el.value='';
					}
				}
			}
		}
	});
};
y_form.prototype.getLocationData=function(parent_location_id, location_name, location_type_id){
	parent_location_id = typeof parent_location_id!=='undefined'? parent_location_id : 1;
	location_name = typeof location_name!=='undefined' ? location_name : false;
	location_type_id = typeof location_type_id!=='undefined' ? location_type_id : false;
	var key='param='+parent_location_id;
	if(!parent_location_id){
		key='location_name='+location_name;
	}
	if(location_type_id){
		key='location_type_id='+location_type_id;
	}
	var that=this;
	var func='get_locations';
	var callback=typeof callback!=='undefined'?callback:function(data){
		that.data.location=data;
		that.vars.locData=data;
		if(typeof data.parent!=='undefined' && typeof data.parent.location_name !=='undefined'){
			$('#yLocationParent').text('Parent: '+ data.parent.location_name + ' [' + data.parent.location_description+']');
			$('#yLocationParent').attr('data',  data.parent.location_id );
			$('#yLocationParent').attr('col',  data.parent.location_type_name );
			$('#yLocationParent').attr('row',  data.parent.location_name );
			$('#yLocationParent').attr('parent',  data.parent.parent_location_id );
		}
		if(typeof data.type!=='undefined' && typeof data.type.location_type_id !=='undefined'){
			$('#yLocationParent').text('Type: '+ data.type.location_type_name + ' [' + data.type.location_type_description+']');
			$('#yLocationParent').attr('data',  data.type.location_type_id );
			$('#yLocationParent').attr('col',  data.type.location_type_name );
			$('#yLocationParent').attr('row',  0 );
			$('#yLocationParent').attr('parent',  'type' );
		}
		if(typeof data.all!=='undefined' && data.all ===true){
			$('#yLocationParent').text('All Location Data');
			$('#yLocationParent').attr('data',  0 );
			$('#yLocationParent').attr('col', 0 );
			$('#yLocationParent').attr('row',  0 );
			$('#yLocationParent').attr('parent',  'all' );
		}
		if(typeof data.type_list!=='undefined' && data.type_list ===true){
			$('#yLocationParent').text("List of All Locations' Type");
			$('#yLocationParent').attr('data',  0 );
			$('#yLocationParent').attr('col', 0 );
			$('#yLocationParent').attr('row',  0 );
			$('#yLocationParent').attr('parent',  'type_list' );
		}
		if( typeof data.child!=='undefined'){
			that.reloadLocationChild(data.child);
		}
	};
	getAjax(that.query_url+func,key,callback);
};
y_form.prototype.createLocationItemRow=function(item){
	var itemRow=[];
	var cellType={
		element:'div',
		class:'_yPanelPickerTableCellType _yPanelPickerLocationBoxType _yFL',
		content:'',
		style:"background-image: url('../images/button/type_"+item.location_type_name+".png')",
		data:item.location_type_id,
		col:item.location_type_name
	};
	itemRow.push(cellType);
	var cellElement={
		element:'div',
		class:'_yPanelPickerTableCell _yPanelPickerLocationBoxCell _yFL',
		content:item.location_name + ' [' + item.location_description + ']',
		data:item.location_id,
		col:item.location_type_name,
		row:item.location_name,
		parent:item.location_id_parent
	};
	itemRow.push(cellElement);
	var buttonDownElement={
		element:'div',
		class:'_yPanelPickerTableCellZoomIn _yPanelPickerLocationBoxButtonEnter _yFL',
		content:'Zoom In',
		data:item.location_id,
		col:item.location_type_name,
		row:item.location_name,
		parent:item.location_id_parent
	};
	itemRow.push(buttonDownElement);
	return itemRow;
};
y_form.prototype.createLocationRowElement=function(item){
	var itemRow=this.createLocationItemRow(item);
	var rowElement={
		element:'div',
		class:'_yPanelPickerTableRow _yPanelPickerLocationBoxRow _yFL',
		content:y_html(itemRow)
	};
	return rowElement;
};
y_form.prototype.createLocationRowElementMore=function(dataShown,rows){
	var rowElement={
		element:'div',
		class:'_yPanelPickerTableRow _yPanelPickerLocationBoxRow _yFL',
		content:'Shown ' + dataShown + ' of ' + rows + ' records, ' + 'use filter for more'
	};
	return rowElement;
};
y_form.prototype.reloadLocationChild=function(data){
	var locationTable=document.getElementById('yLocationPickerTable');
	locationTable.innerHTML='';
	var locationArray=[];
	var rows=data.length;
	var maxShownRows = rows<60?rows:60;
	var dataShown=0;
	var i = 0;
	this.vars._yLocData=data;
	this.vars._yLocShown=maxShownRows;
	this.vars._yLocLength=rows;
	for(i=0;i<maxShownRows;i++){
		var item = data[i];
		var rowElement=this.createLocationRowElement(item);
		locationArray.push(rowElement);
		dataShown++;
	}
	if(maxShownRows<rows){
		var moreElement=this.createLocationRowElementMore(dataShown,rows);
		locationArray.push(moreElement);
	}
	locationTable.innerHTML=y_html(locationArray);
};
y_form.prototype.filterLocationPicker=function(filter){
	var originalData = this.vars.locData;
	var data = jQuery.extend(true, {}, originalData);
	if(typeof filter!=='undefined' && filter !==''){
		data.child=this.filterLocationData(filter,data.child);
	}
	this.reloadLocationChild(data.child);
};
y_form.prototype.filterLocationData=function(param,data){
	var result=[];
	var index=0;
	if(param!==''){
		for(var i in data){
			var label=data[i].location_name + ' ' +data[i].location_description;
			var similar=false;
			var a=param.toLowerCase();
			var b=label.toLowerCase();
			if(a.length < b.length){
				b=b.substring(0,a.length);
			}
			if(a==b){similar=true;}
			c=label.toLowerCase().split(' ');
			for(var j in c){
				b=c[j];
				if(a.length<b.length) b=b.substring(0,a.length);
				if(a==b) similar=true;
			}
			if(similar){
				result[index]=data[i];
				index++;
			}
		}
	}
	else{
		result=data;
	}
	return result;
};
// Trip Picker
y_form.prototype.use_trip_picker=function(){
	var that = this;
	var bgColor='#E9FFE8';
	var bgColorFocus='#F6DEE5';
	this.create_panel_trip_picker(this);
	$(this.wrapper).off('click','.buttonTripPicker');
	$(this.wrapper).on('click','.buttonTripPicker',function(event){
		event=event||window.event;
		var trip_name = typeof $('#input_trip_name').val() !== 'undefined' ? $('#input_trip_name').val() : 0;
		if($(this).prev().attr('disabled')!=='disabled'){
			that.default_trip_id=$(this).attr('data');
			that.last_input_type_trip=$(this).prev()[0];
			//var trip_name=$(that.last_input_type_trip).val();
			//that.getTripData(that.default_trip_id);
			that.getTripData(trip_name);
			if($(this).css('background-color')!='rgba(0, 0, 0, 0)'){
				$(this).css('background-color',bgColorFocus);
			}
			$(this).prev().css('background-color',bgColorFocus);
			$('#y_panel_trip_picker').show();
			document.getElementById('yTripInputFilter').focus();
		}
	});
};
y_form.prototype.create_panel_trip_picker=function(){
	var that = this;
	this.data.trip=[];
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:'y_panel_trip_picker',content:y_html([
			{element:'div',class:'_yPanelPicker _yPanelPickerTrip',id:'y_trip_picker',content:y_html([
				{element:'div',id:'y_title_trip_picker',class:'panel_title',content:'Pick a Location from the Trip'},
				{element:'div',id:'yTripPickerTable',class:'_yPanelPickerTableTall _yPanelPickerTripBox _yFL',content:''},
				{element:'input',type:'text',id:'yTripInputFilter',class:'input_text _yPanelPickerInputFilter _yPanelPickerTripInputFilter _yFL',content:' '},
			])}
		])}
	]);
	$(this.wrapper).append(h);
	$(this.wrapper).off('click','._yPanelPickerTripBoxCell');
	$(this.wrapper).on('click','._yPanelPickerTripBoxCell',function(event){
		event=event||window.event;
		var trip_name=$(this).attr('row');
		$('#y_panel_trip_picker').hide();
		$(that.last_input_type_trip).focus();
		$(that.last_input_type_trip).val(trip_name);
		$(that.last_input_type_trip).focus();

	});
	$(this.wrapper).off('hover','._yPanelPickerTripBoxCell');
	$(this.wrapper).on('hover','._yPanelPickerTripBoxCell',function(e) {
	    if (e.type == "mouseenter") {
	         $(this).css('background-color','#565656');
	         $(this).prev().css('background-color','#565656');
	    }
	    else {
	         $(this).css('background-color','#E8E8E8');
	         $(this).prev().css('background-color','#E8E8E8');
	    }
	});
	$('#y_title_trip_picker').click(function(event){
		event=event||window.event;
		$('#y_panel_trip_picker').hide();
		$(that.last_input_type_trip).focus();
	});
	$('#y_panel_trip_picker').hide();
	document.addEventListener('keyup',function(event){
		var key=event.keyCode;
		var picker=document.getElementById('y_trip_picker');
		if(typeof picker === 'object' && picker!==null){
			if(typeof picker.offsetLeft==='number' && picker.offsetLeft!==null){
				var offsetLeft=picker.offsetLeft;
				if(offsetLeft>0){
					var el=document.getElementById('yTripInputFilter');
					if((key>=65 && key<=90) || key===13 || key=== 8 || key === 46){
						that.filterTripPicker(el.value);
					}
					else if(key==27){
						that.filterTripPicker();
					}
				}
			}
		}
	});
	document.addEventListener('keydown', function(event) {
		var key=event.keyCode;
		var picker=document.getElementById('y_trip_picker');
		if(typeof picker === 'object' && picker!==null){
			if(typeof picker.offsetLeft==='number' && picker.offsetLeft!==null){
				var offsetLeft=picker.offsetLeft;
				if(offsetLeft>0){
					el=document.getElementById('yTripInputFilter');
					if(key >=65 && key <=90){
						if(el.value===''){
							el.focus();
						}
					}
					else if (key==27){
						el.value='';
					}
				}
			}
		}
	});
};
y_form.prototype.getTripData=function(trip_id){
	trip_id = typeof trip_id!=='undefined'? trip_id : 0;
	var key='param='+trip_id;
	var that=this;
	var func='get_trip';
	var callback=typeof callback!=='undefined'?callback:function(data){
		that.data.trip=data;
		that.vars.tripData=data;
		if( typeof data.child!=='undefined'){
			that.reloadTripChild(data.child);
		}
	};
	getAjax(that.query_url+func,key,callback);
};
y_form.prototype.createTripItemRow=function(item){
	var itemRow=[];
	var cellType={
		element:'div',
		class:'_yPanelPickerTableCellType _yPanelPickerTripBoxType _yFL',
		content:'',
		style:"background-image: url('../images/button/type_"+item.location_type_name+".png')",
		data:item.location_type_id,
		col:item.location_type_name
	};
	itemRow.push(cellType);
	var cellElement={
		element:'div',
		class:'_yPanelPickerTableCellFull _yPanelPickerTripBoxCell _yFL',
		content:item.location_name + ' [' + item.location_description + ']',
		data:item.location_id,
		col:item.location_type_name,
		row:item.location_name
	};
	itemRow.push(cellElement);
	return itemRow;
};
y_form.prototype.createTripRowElement=function(item){
	var itemRow=this.createTripItemRow(item);
	var rowElement={
		element:'div',
		class:'_yPanelPickerTableRow _yPanelPickerTripBoxRow _yFL',
		content:y_html(itemRow)
	};
	return rowElement;
};
y_form.prototype.createTripRowElementMore=function(dataShown,rows){
	var rowElement={
		element:'div',
		class:'_yPanelPickerTableRow _yPanelPickerTripBoxRow _yFL',
		content:'Shown ' + dataShown + ' of ' + rows + ' records, ' + 'use filter for more'
	};
	return rowElement;
};
y_form.prototype.reloadTripChild=function(data){
	var tripTable=document.getElementById('yTripPickerTable');
	tripTable.innerHTML='';
	var tripArray=[];
	var rows=data.length;
	var maxShownRows = rows<60?rows:60;
	var dataShown=0;
	var i = 0;
	this.vars._yTripData=data;
	this.vars._yTripShown=maxShownRows;
	this.vars._yTripLength=rows;
	for(i=0;i<maxShownRows;i++){
		var item = data[i];
		var rowElement=this.createTripRowElement(item);
		tripArray.push(rowElement);
		dataShown++;
	}
	if(maxShownRows<rows){
		var moreElement=this.createTripRowElementMore(dataShown,rows);
		tripArray.push(moreElement);
	}
	tripTable.innerHTML=y_html(tripArray);
};
y_form.prototype.filterTripPicker=function(filter){
	var originalData = this.vars.tripData;
	var data = jQuery.extend(true, {}, originalData);
	if(typeof filter!=='undefined' && filter !==''){
		data.child=this.filterLocationData(filter,data.child); // share with location filter function
	}
	this.reloadTripChild(data.child);
};

//----------------------------------------------------------------------------------------------------------------------
// Button
//----------------------------------------------------------------------------------------------------------------------

// Button Set - Edit - New - Clone
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_button_set=function(clear_detail){
	clear_detail=typeof clear_detail!=='undefined'?clear_detail:false;
	this.create_button_edit('Edit Record',clear_detail);
	this.create_button_insert('New Record',clear_detail);
	this.create_button_clone();
	$('#button_submit_clone_record').hide();
};

// Button Get
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_button_get=function(label){
	label=typeof label!=='undefined'?label:'Query';
	var that = this;
	var button=this.panel.create_button('post',label,'query_record');
	this.panel.command($(this.wrapper),button,function(){
		$('.button_submit').show();
		that.toogle_button_post('show');
	});
};

// Button Query
//----------------------------------------------------------------------------------------------------------------------
// Automatic call get_detail ajax when pressed
y_form.prototype.create_button_query=function(label){
	label=typeof label!=='undefined'?label:'Query';
	var that = this;
	var button=this.panel.create_button('submit',label,'query_record');
	this.panel.command($(this.wrapper),button,function(){
		$('.button_submit').show();
		that.toogle_button_post('show');
		that.write_detail_with_key_param();
	});
};
y_form.prototype.write_detail_with_key_param=function(url){
	url=typeof url!=='undefined'?url:'get_detail';
	var value;
	if(typeof this.key_field_type!=='undefined' && this.key_field_type){
		if(this.key_field_type=='input'){
			value=$('#input_'+this.key_field).val();
		}
		else{
			value=$('#label_info_'+this.key_field).text();
		}
	}
	this.write_detail(url,this.key_field+'='+value);
};

// Button Edit
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_button_edit=function(label,clear_detail){
	label=typeof label!=='undefined'?label:'Edit Record';
	clear_detail=typeof clear_detail!=='undefined'?clear_detail:false;
	var that = this;
	var button_edit=this.panel.create_button('submit',label,'edit_record');
	this.panel.command($(this.wrapper),button_edit,function(){
		$('.button_submit').hide();
		that.toogle_button_post('hide');
		that.reset_master();
		that.enable_master_input(that.main_field);
		$('#button_submit_clone_record').hide();
		$('#input_'+that.main_field).focus();
		if(clear_detail)
		{
			that.reset_detail();
		}
	});
};


// Button Post
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_button_post=function(label){
	label=typeof label!=='undefined'?label:'Upload';
	var that=this;
	var button_post=this.panel.create_button('post',label,'post_record');
	this.panel.command($(this.wrapper),button_post,function(){
		$('.button_submit').click();
	});
};
y_form.prototype.toogle_button_post=function(param){
	param=typeof param!=='undefined'?param:false;
	var element=document.getElementById('button_post_post_record');
	if(element){
		if(!param){
			var display=element.style.display;
			if (display=="none") {
				element.style.display = "block";
			}
			else{
				element.style.display = "none";
			}
		}
		else if(param=='show'){
			element.style.display = "block";
		}
		else if(param=='hide'){
			element.style.display = "none";
		}
	}
};


// Button New
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_button_new=function(label){
	label=typeof label!=='undefined'?label:'New';
	var that=this;
	var button_new=this.panel.create_button('new',label,'new_record');
	this.panel.command($(this.wrapper),button_new,function(){
		$('.button_submit').show();
		that.toogle_button_post('show');
		that.reset_master();
		that.enable_master_input();
		$('#button_submit_clone_record').hide();
		if(that.key_field_type!='input'){
			$('#input_'+that.main_field).focus();
		}
		else{
			$('#input_'+that.key_field).focus();
		}
		that.unselect_detail();
	});
};


// Button Open
//----------------------------------------------------------------------------------------------------------------------

y_form.prototype.create_button_open=function(label){
	label=typeof label!=='undefined'?label:'Open';
	var that=this;
	var button_open=this.panel.create_button('open',label,'open_record');
	this.panel.command($(this.wrapper),button_open,function(){
		$('.button_submit').hide();
		that.toogle_button_post('hide');
		that.reset_master();
		that.enable_master_input(that.main_field);
		$('#button_submit_clone_record').hide();
		$('#input_'+that.main_field).focus();
	});
};


// Button Insert
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_button_insert=function(label,clear_detail){
	label=typeof label!=='undefined'?label:'Insert';
	clear_detail=typeof clear_detail!=='undefined'?clear_detail:false;
	var that = this;
	var button_insert=this.panel.create_button('submit',label,'insert_record');
	this.panel.command($(this.wrapper),button_insert,function(){
		$('.button_submit').show();
		that.toogle_button_post('show');
		that.reset_master();
		that.enable_master_input();
		$('#button_submit_clone_record').hide();
		if(that.key_field_type!='input'){
			$('#input_'+that.main_field).focus();
		}
		else{
			$('#input_'+that.key_field).focus();
		}
		that.unselect_detail();
		if(clear_detail)
		{
			that.reset_detail();
		}
	});
};

// Button Clone
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.create_button_clone=function(label){
	label=typeof label!=='undefined'?label:'Clone Record';
	var that = this;
	var input='#input_';
	var button_clone=this.panel.create_button('submit',label,'clone_record');
	this.panel.command($(this.wrapper),button_clone,function(){
		$('.button_submit').show();
		that.toogle_button_post('show');
		$('.label_info').text('');
		if(typeof that.key_field!=='undefined' && that.key_field){
			if(that.key_field_type!='input'){
				$('#label_info_'+that.key_field).text('');
			}
			else{
				$(input+that.key_field).val('');
			}
		}
		if(typeof that.key_field_type!=='undefined')
		{
			if(that.key_field_type!='input'){
				$(input+that.key_field).select();
				$(input+that.key_field).focus();
			}
			else{
				$(input+that.main_field).select();
				$(input+that.main_field).focus();
			}
		}
		that.unselect_detail();
	});
};

// Button Action
//----------------------------------------------------------------------------------------------------------------------
// Create button action and add callback
y_form.prototype.create_button_action=function(param,label,type,callback){
	type=typeof type!=='undefined'?type:'submit';
	label=typeof label!=='undefined'?label:'action';
	var that = this;
	var button=this.panel.create_button(type,label,'action_'+param);
	this.panel.command($(this.wrapper),button,function(){
		callback();
	});
};
y_form.prototype.create_button_param=function(param,label,type){
	type=typeof type!=='undefined'?type:'submit';
	label=typeof label!=='undefined'?label:param;
	var that = this;
	var button=this.panel.create_button(type,label,'query_record_'+param);
	this.panel.command($(this.wrapper),button,function(){
		that.callback_button_param(param);
	});
};
// Callback For Action Button
y_form.prototype.callback_button_param=function(param){
	var that = this;
	var key=$(this.active_form).serialize();
	key += '&param='+param;
	var callback=typeof callback!=='undefined'?callback:function(data){
		if(typeof data.detail !=='undefined'){
			$(that.detail).html('');
			that.data.detail=data.detail;
			that.write_table('detail');
		}
		if(typeof data.history !=='undefined'){
			$(that.history).html('');
			that.data.history=data.history;
			that.write_table('history');
		}
	};
	postAjax(that.query_url+'get',key,callback);
};

// Button Download CSV
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonDownloadCsv=function(name){
	var that=this;
	name=typeof name!=='undefined'?name:'download';
	var buttonEng=this.panel.create_button('download','csv','csv_english');
	this.panel.command(this.wrapper,buttonEng,function(){
		var filename=name+'.csv';
		y_download_csv(that.field.detail,that.data.detail,filename);
	});
	var buttonInd=this.panel.create_button('download','csv indonesia','csv_indonesia');
	this.panel.command(this.wrapper,buttonInd,function(){
		var filename=name+'.csv';
		y_download_csv(that.field.detail,that.data.detail,filename,'indonesia');
	});
};

// Button Download TSV
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonDownloadTsv=function(name){
	var that=this;
	name=typeof name!=='undefined'?name:'download';
	var buttonEng=this.panel.create_button('download','tsv','tsv_english');
	this.panel.command(this.wrapper,buttonEng,function(){
		var filename=name+'.tsv';
		y_download_tsv(that.field.detail,that.data.detail,filename);
	});
	var buttonInd=this.panel.create_button('download','tsv indonesia','tsv_indonesia');
	this.panel.command(this.wrapper,buttonInd,function(){
		var filename=name+'.tsv';
		y_download_tsv(that.field.detail,that.data.detail,filename,'indonesia');
	});
};

// Button Download XLS
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonDownloadXls=function(obj,name){
	var that=this;
	name=typeof name!=='undefined'?name:'download';
	var buttonXls=this.panel.create_button('download','xls',name);
	this.panel.command(this.wrapper,buttonXls,function(){
		var key=$(obj.active_form).serialize();
		window.open(obj.query_url+'get_xls_'+name+'?'+key);
	});
};

// Button Read CSV
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonReadCsv=function(complete,obj,option){
	var that=this;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	obj=typeof obj!=='undefined'?obj:false;
	option=typeof option!=='undefined'?option:false;
	var button=this.panel.create_button_file('open','Read CSV','query_record_read_csv');
	$(button).change(function(){
		that.readCsv(complete,obj,option);
 	});
};
y_form.prototype.readCsv=function(complete,obj,option){
	var that=this;
	var objButtonFile=document.getElementById('button_file_open_query_record_read_csv');
	obj=typeof obj!=='undefined'?obj:false;
	option=typeof option!=='undefined'?option:false;
	var formData=new FormData();
	formData.append("csv_file", objButtonFile.files[0]);
	var success = function(res){
		$(that.detail).html('');
		that.data.detail={};
		if(!option){
			that.data.detail=res;
		}
		else if(option=='label' && typeof obj!=='undefined'){
			var resName=[];
			for(var i in res){
				resName[i]={};
				for(var j in obj.field.detail){
					var label = obj.field.detail[j].label;
					var name =  obj.field.detail[j].name;
					if(typeof res[i][label] !=='undefined'){
						resName[i][name]=res[i][label];
					}
				}
			}
			that.data.detail=resName;
		}
        that.write_detail();
        objButtonFile.files=[];
	};
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	fileAjax('C_home/get_csv_file',formData,success,complete);
};


// Button Upload CSV
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonUploadCsv=function(complete){
	var that=this;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	var button=this.panel.create_button_file('submit','Upload CSV','query_record_upload_submit');
	$(button).change(function(){
		that.uploadCsv(complete);
 	});
};
y_form.prototype.uploadCsv=function(complete){
	var that=this;
	var formData=new FormData();
	var objButtonFile=document.getElementById('button_file_submit_query_record_upload_submit');
	formData.append("csv_file", objButtonFile.files[0]);
	var serialData=$(that.active_form).serialize();
	formData.append("data", serialData);
	if(that.main_field){
		var mainElement=document.getElementsByName(that.main_field)[0];
		if(typeof mainElement!=='undefined'){
			that.vars.lastMainValue=typeof mainElement.value!=='undefined'?mainElement.value:mainElement.innerHTML;
		}
	}
	if(that.key_field){
		var keyElement=document.getElementsByName(that.key_field)[0];
		if(typeof keyElement!=='undefined'){
			that.vars.lastKeyValue=typeof keyElement.value!=='undefined'?keyElement.value:keyElement.innerHTML;
		}
	}
	var success = function(res){
		var with_print=false;
		y_show_ajax_result(res,with_print);
		if(that){that.reset(that.active_form);}
        objButtonFile.files=[];
	};
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	fileAjax(that.query_url+'submit_csv_file',formData,success,complete);
};

// Button Upload CSV Write Detail
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonUploadCsvWriteDetail=function(complete){
	var that=this;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	var button=this.panel.create_button_file('submit','Upload CSV','query_record_upload_submit');
	$(button).change(function(){
		that.uploadCsvWriteDetail(complete);
 	});
};

y_form.prototype.uploadCsvWriteDetail=function(complete){
	var that=this;
	var formData=new FormData();
	var objButtonFile=document.getElementById('button_file_submit_query_record_upload_submit');
	formData.append("csv_file", objButtonFile.files[0]);
	var serialData=$(that.active_form).serialize();
	formData.append("data", serialData);
	if(that.main_field){
		var mainElement=document.getElementsByName(that.main_field)[0];
		if(typeof mainElement!=='undefined'){
			that.vars.lastMainValue=typeof mainElement.value!=='undefined'?mainElement.value:mainElement.innerHTML;
		}
	}
	if(that.key_field){
		var keyElement=document.getElementsByName(that.key_field)[0];
		if(typeof keyElement!=='undefined'){
			that.vars.lastKeyValue=typeof keyElement.value!=='undefined'?keyElement.value:keyElement.innerHTML;
		}
	}
	var success = function(res){
		that.data.detail=res;
		that.write_table('detail');
		/*
		var with_print=false;
		y_show_ajax_result(res,with_print);
		if(that){that.reset(that.active_form);}
        objButtonFile.files=[];
		*/
	};
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	fileAjax(that.query_url+'submit_csv_file_write_detail',formData,success,complete);
};


// Button Read TAB File
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonReadTab=function(complete,obj,option){
	var that=this;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	obj=typeof obj!=='undefined'?obj:false;
	option=typeof option!=='undefined'?option:false;
	var button=this.panel.create_button_file('open','Read DAT','query_record_read_tab');
	$(button).change(function(){
		that.readTab(complete,obj,option);
 	});
};
y_form.prototype.readTab=function(complete,obj,option){
	var that=this;
	var objButtonFile=document.getElementById('button_file_open_query_record_read_tab');
	obj=typeof obj!=='undefined'?obj:false;
	option=typeof option!=='undefined'?option:false;
	var formData=new FormData();
	formData.append("tab_file", objButtonFile.files[0]);
	var success = function(res){
		$(that.detail).html('');
		that.data.detail={};
		if(!option){
			that.data.detail=res;
		}
		else if(option=='label' && typeof obj!=='undefined'){
			var resName=[];
			for(var i in res){
				resName[i]={};
				for(var j in obj.field.detail){
					var label = obj.field.detail[j].label;
					var name =  obj.field.detail[j].name;
					if(typeof res[i][label] !=='undefined'){
						resName[i][name]=res[i][label];
					}
				}
			}
			that.data.detail=resName;
		}
        that.write_detail();
        objButtonFile.files=[];
	};
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	fileAjax('C_home/get_tab_file',formData,success,complete);
};


// Button Read FingerPrint DAT File
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonReadFingerprint=function(complete,obj,option){
	var that=this;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	obj=typeof obj!=='undefined'?obj:false;
	option=typeof option!=='undefined'?option:false;
	var button=this.panel.create_button_file('open','Read DAT','query_record_read_fingerprint');
	$(button).change(function(){
		that.readFingerprint(complete,obj,option);
 	});
};
y_form.prototype.readFingerprint=function(complete,obj,option){
	var that=this;
	var objButtonFile=document.getElementById('button_file_open_query_record_read_fingerprint');
	obj=typeof obj!=='undefined'?obj:false;
	option=typeof option!=='undefined'?option:false;
	var formData=new FormData();
	formData.append("dat_file", objButtonFile.files[0]);
	var success = function(res){
		$(that.detail).html('');
		that.data.detail={};
		if(!option){
			that.data.detail=res;
		}
		else if(option=='label' && typeof obj!=='undefined'){
			var resName=[];
			for(var i in res){
				resName[i]={};
				for(var j in obj.field.detail){
					var label = obj.field.detail[j].label;
					var name =  obj.field.detail[j].name;
					if(typeof res[i][label] !=='undefined'){
						resName[i][name]=res[i][label];
					}
				}
			}
			that.data.detail=resName;
		}
        that.write_detail();
        objButtonFile.files=[];
	};
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	fileAjax('C_home/get_fingerprint_file',formData,success,complete);
};


// Button Upload FingerPrint DAT File
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.buttonUploadFingerprint=function(complete){
	var that=this;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	var button=this.panel.create_button_file('submit','Upload DAT','query_record_upload_submit');
	$(button).change(function(){
		that.uploadFingerprint(complete);
 	});
};
y_form.prototype.uploadFingerprint=function(complete){
	var that=this;
	var formData=new FormData();
	var objButtonFile=document.getElementById('button_file_submit_query_record_upload_submit');
	formData.append("dat_file", objButtonFile.files[0]);
	var serialData=$(that.active_form).serialize();
	formData.append("data", serialData);
	if(that.main_field){
		var mainElement=document.getElementsByName(that.main_field)[0];
		if(typeof mainElement!=='undefined'){
			that.vars.lastMainValue=typeof mainElement.value!=='undefined'?mainElement.value:mainElement.innerHTML;
		}
	}
	if(that.key_field){
		var keyElement=document.getElementsByName(that.key_field)[0];
		if(typeof keyElement!=='undefined'){
			that.vars.lastKeyValue=typeof keyElement.value!=='undefined'?keyElement.value:keyElement.innerHTML;
		}
	}
	var success = function(res){
		var with_print=false;
		y_show_ajax_result(res,with_print);
		if(that){that.reset(that.active_form);}
        objButtonFile.files=[];
	};
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	fileAjax(that.query_url+'submit_fingerprint_file',formData,success,complete);
};

// Button with PopUp Menu
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.createPopUpMenu=function(id,param,label){
	var that = this;
	label=typeof label!=='undefined'?label:'Menu';
	button=this.panel.create_button('menu',label,'button_'+id);
	var childArray=[];
	for(var i in param){
		var model=typeof param[i].model!=='undefined'?param[i].model:false;
		var src='../images/button/'+model+'.png';
		var img={element:'img',class:'_yFL iconMenuImage',src:src};
		var callback = typeof param[i].callback!=='undefined'&&typeof param[i].callback === 'function'?param[i].callback:function(){};
		var childId= typeof param[i].id!=='undefined'?param[i].id:'buttonPopUpMenu_'+i;
		var childLabel= typeof param[i].label!=='undefined'?param[i].label:'';
		if(!model){
			img={element:'div',class:'_yFL _yDropDownItemLabel',content:childLabel};
		}
		var childObject={
			element:'div',
			id:childId,
			class:'_yPopUpButtonMenu _yFL',
			content:y_html([img])
		};
		childArray.push(childObject);
		$(this.master).off('click','#'+childId);
		$(this.master).on('click','#'+childId,callback);
	}
	var panel=[{element:'div',class:'_yPanelPopUpMenu',content:y_html(childArray)}];
	var h=y_html([{element:'div',class:'yPanelTransparent',id:id,content:y_html(panel)}]);
	$(this.wrapper).append(h);
	$('#'+id).hide();
	$('#'+id).click(function(){
		$('#'+id).hide();
	});
	$(this.master).off('click',button);
	$(this.master).on('click',button,function(){
		$('#'+id).show();
	});
};

// Button with DropDown Menu
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.createDropDownMenu=function(id,param,label){
	var that = this;
	label=typeof label!=='undefined'?label:'Menu';
	button=this.panel.create_button('menu',label,'button_'+id);
	$(button).addClass('_yDropDownCategory');
	$(button).addClass('_yFL');
	var childArray=[];
	for(var i in param){
		var model=typeof param[i].model!=='undefined'?param[i].model:false;
		var src='../images/button/'+model+'.png';
		var img={element:'img',class:'_yFL _yDropDownItemImage',src:src};
		var callback = typeof param[i].callback!=='undefined'&&typeof param[i].callback === 'function'?param[i].callback:function(){};
		var childId= typeof param[i].id!=='undefined'?param[i].id:'buttonPopUpMenu_'+i;
		var childLabel= typeof param[i].label!=='undefined'?param[i].label:'';
		var lbl={element:'div',class:'_yFL _yDropDownItemLabel',content:childLabel};
		if(!model){
			img=lbl;
		}
		var childObject={
			element:'div',
			id:childId,
			class:'_yDropDownItem _yFL',
			content:y_html([img,lbl])
		};
		childArray.push(childObject);
		$(this.master).off('click','#'+childId);
		$(this.master).on('click','#'+childId,callback);
	}
	var panel=y_html([{element:'div',id:'_yDropDown_'+id,class:'_yDropDownPanel _yFL',content:y_html(childArray)}]);
	$('.panelMasterMenu').append(panel);
	$(this.master).off('click',button);
	$(this.master).on('click',button,function(){
		var panelHeight=$('#_yDropDown_'+id).outerHeight(true);
		if(panelHeight!==0){
			that.closePanelMenu(that.vars.menuPanelOpen);
			$(this).css('background','#6A6A6A');
			$('#_yDropDown_'+id).height(0);
			$('#_yDropDown_'+id).width(0);
		}
		else{
			that.openPanelMenu(that.vars.menuPanelOpen);
			$(this).css('background','#AAAAAA');
			$('#_yDropDown_'+id).height(72);
			$('#_yDropDown_'+id).width('auto');
		}
	});
};
y_form.prototype.openPanelMenu=function(isOpen){
	var that = this;
	// close other panel
	$('._yDropDownPanel').width(0);
	$('._yDropDownPanel').height(0);
	$('._yDropDownCategory').css('background','#6A6A6A');
	// is necessary to open menu panel?
	if(!isOpen){
		var mainHeight=$('.panel_master_main').outerHeight(true);
		var height = mainHeight-72;
		$('.panelMasterMenu').height(72);
		$('.panel_master_main').height(height);
		this.vars.menuPanelOpen=true;
	}
};
y_form.prototype.closePanelMenu=function(isOpen){
	if(isOpen){
		var mainHeight=$('.panel_master_main').outerHeight(true);
		var height = mainHeight+72;
		$('.panelMasterMenu').height(0);
		$('.panel_master_main').height(height);

		this.vars.menuPanelOpen=false;
	}
};

//----------------------------------------------------------------------------------------------------------------------
// Chart
//----------------------------------------------------------------------------------------------------------------------
y_form.prototype.getFillColor=function(c1){
	var c2=231705;
  	var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
  	while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  	return hexStr;
};

// 3D Cylinder Bar
y_form.prototype.createCylinderBar=function(param){
	var that = this;
	var parent=typeof param!=='undefined' && typeof param.parent!=='undefined'?param.parent:false;
	if(parent){
		var id=typeof param!=='undefined' && typeof param.id!=='undefined'?param.id:'cylinderBarId';
		var clearHeight=typeof param!=='undefined' && typeof param.height!=='undefined'?param.height:110;
		var percentage=typeof param!=='undefined' && typeof param.percentage!=='undefined'?param.percentage:0;
		percentage=percentage>1 ? 1:percentage;
		var width=typeof param!=='undefined' && typeof param.width!=='undefined'?param.width:100;
		var colorBody=typeof param!=='undefined' && typeof param.color!=='undefined'?param.color:'b6781e';
		var refColorFill=this.getFillColor(colorBody);
		var colorFill=typeof param!=='undefined' && typeof param.fill!=='undefined'?param.fill:refColorFill;
		var fontSize=typeof param!=='undefined' && typeof param.fontSize!=='undefined'?param.fontSize:'14px';
		var fontChangePercentage=typeof param!=='undefined' && typeof param.fontChangePercentage!=='undefined'?param.fontChangePercentage:0.3;
		var refElipseDiameter=0.4*width;
		var elipseDiameter=typeof param!=='undefined' && typeof param.elipseDiameter!=='undefined'?param.elipseDiameter:refElipseDiameter;
		var elipseRadius=elipseDiameter/2;
		var totalHeight=clearHeight+elipseDiameter;
		var refHeight=clearHeight+(elipseRadius);
		var filled=Math.round(percentage*clearHeight);
		var topCyl = refHeight-filled-elipseRadius;
		var topBody = topCyl+elipseRadius;
		var heightBody=refHeight-topBody;
		var heightBodyPadding=refHeight-topBody-elipseRadius;
		var h=y_html([
			{element:'div',class:'_yBoxTypeCylinder',id:id,content:y_html([
				{element:'div',class:'_yBoxTypeCylinderBody'},
				{element:'div',class:'_yBoxTypeCylinderTop'},
				{element:'div',class:'_yBoxTypeCylinderFillBod'},
				{element:'div',class:'_yBoxTypeCylinderFill'},
				{element:'div',class:'_yBoxTypeCylinderBottom'}
			])}
		]);
		$('#'+parent).append(h);
		var s1 = {
	      width : width+'px',
	      height: totalHeight+'px'
	    };
		$('#'+id).css(s1);
		var s2 = {
	      width : width+'px',
	      height: clearHeight+'px',
	      top:elipseRadius+'px',
	      fontSize: fontSize
	    };
		$('#'+id).children('._yBoxTypeCylinderBody').css(s2);
		var s3= {
	      width : width+'px',
	      height: elipseDiameter+'px',
	      borderRadius:width+'px/'+elipseDiameter+'px',
	      fontSize: fontSize
	    };
		$('#'+id).children('._yBoxTypeCylinderTop').css(s3);
		$('#'+id).children('._yBoxTypeCylinderBottom').css(s3);
		$('#'+id).children('._yBoxTypeCylinderFill').css(s3);

		$('#'+id).children('._yBoxTypeCylinderBottom').css('top',clearHeight+'px');
		$('#'+id).children('._yBoxTypeCylinderFill').css('top',topCyl+'px');
		var s4= {
	      width : width+'px',
	      height: heightBody+'px',
	      top:topBody+'px',
	      fontSize: fontSize
	    };
		$('#'+id).children('._yBoxTypeCylinderFillBody').css(s4);

		$('#'+id).children('._yBoxTypeCylinderBottom').css('background','#'+colorBody);
		$('#'+id).children('._yBoxTypeCylinderFillBody').css('background','#'+colorBody);
		$('#'+id).children('._yBoxTypeCylinderFill').css('background','#'+colorFill);

		var stringPercentage=percentage*100;
		stringPercentage=Math.round(stringPercentage*100)/100;
		stringPercentage+='%';
		if(percentage < fontChangePercentage){
			$('#'+id).children('._yBoxTypeCylinderFill').text(stringPercentage);
			$('#'+id).children('._yBoxTypeCylinderFillBody').css('padding-top',0);
			$('#'+id).children('._yBoxTypeCylinderFillBody').css('height',heightBody);
		}else{
			$('#'+id).children('._yBoxTypeCylinderFillBody').text(stringPercentage);
			$('#'+id).children('._yBoxTypeCylinderFillBody').css('padding-top',elipseRadius);
			$('#'+id).children('._yBoxTypeCylinderFillBody').css('height',heightBodyPadding);
		}
		return '#'+id;
	}
	else{
		return false;
	}
};
y_form.prototype.setCylinderBar=function(param,percentage){
	percentage=percentage>1 ? 1:percentage;
	var id=typeof param!=='undefined' && typeof param.id!=='undefined'?param.id:'cylinderBarId';
	var clearHeight=typeof param.height!=='undefined'?param.height:110; // height cyl=40px
	var width=typeof param!=='undefined' && typeof param.width!=='undefined'?param.width:100;
	var refElipseDiameter=0.4*width;
	var elipseDiameter=typeof param.elipseDiameter!=='undefined'?param.elipseDiameter:refElipseDiameter; // height cyl=40px
	var elipseRadius=elipseDiameter/2;
	var fontChangePercentage=typeof param!=='undefined' && typeof param.fontChangePercentage!=='undefined'?param.fontChangePercentage:0.3;
	var refHeight=clearHeight+(elipseRadius); // 110 + 20
	var filled=Math.round(percentage*clearHeight);
	var topCyl = refHeight-filled-elipseRadius;
	var topBody = topCyl+elipseRadius;
	var heightBody=refHeight-topBody;
	var heightBodyPadding=refHeight-topBody-elipseRadius;
	topCyl+='px';
	topBody+='px';
	heightBody+='px';
	$('#'+id).children('._yBoxTypeCylinderFill').css('top',topCyl);
	$('#'+id).children('._yBoxTypeCylinderFillBody').css('top',topBody);
	var stringPercentage=percentage*100;
	stringPercentage=Math.round(stringPercentage*100)/100;
	stringPercentage+='%';
	if(percentage < fontChangePercentage){
		$('#'+id).children('._yBoxTypeCylinderFill').text(stringPercentage);
		$('#'+id).children('._yBoxTypeCylinderFillBody').text('');
		$('#'+id).children('._yBoxTypeCylinderFillBody').css('padding-top',0);
		$('#'+id).children('._yBoxTypeCylinderFillBody').css('height',heightBody);
	}else{
		$('#'+id).children('._yBoxTypeCylinderFillBody').text(stringPercentage);
		$('#'+id).children('._yBoxTypeCylinderFill').text('');
		$('#'+id).children('._yBoxTypeCylinderFillBody').css('padding-top',elipseRadius);
		$('#'+id).children('._yBoxTypeCylinderFillBody').css('height',heightBodyPadding);
	}
};

//----------------------------------------------------------------------------------------------------------------------
// Upload Form
//----------------------------------------------------------------------------------------------------------------------
function y_upload_form(param){
	useParam(this,param);
	this.wrapper=$('#module_panel');
	this.active_form='#'+this.name;
	this.panel_type='md';
	this.panel_master_label=this.title;
	this.panel_detail_label='ITEM';
	var panel=new Y_Framework(this);
	panel.set_default_panel_height(1,3);
	this.panel=panel;
	this.master=panel.master;
	this.detail_header=panel.detail_header;
	this.detail=panel.detail;
	this.data=[];
	this.data.detail=[];
	this.field=[];
	this.field.detail=param.field_data;
	this.init();
}
y_upload_form.prototype.init=function(){
	this.write_master();
	this.panel.write_header('detail');
	var that=this;
	$('.button_submit').hide();
	// prevent enter as submit
	prevent_key_enter(this.active_form);
	this.wrapper.off('click',this.trigger.selector);
	this.wrapper.on('click',this.trigger.selector,function(event){
		$('.panel_info').hide();
		$('.panel_setup').hide();
	});
	this.set_form_attribute();
	this.set_command();
};
y_upload_form.prototype.set_command=function(){
	var button_file=document.getElementById('button_file');
	var button_preview=document.getElementById('button_preview');
	var button_upload=document.getElementById('button_upload');
	button_preview.style.display='none';
	button_upload.style.display='none';
	$('.tick').hide();
	button_file.addEventListener('click',function(event){
		event=event||window.event;
		button_upload.style.display='none';
		$('#tick_2').hide();
		$('#tick_3').hide();
	});
	button_file.addEventListener('change',function(){
		var value=this.value;
		if(value!==''){
			$('#tick_1').show();
			button_file.style.display='none';
			button_preview.style.display='';
		}
		else{
			$('#tick_1').hide();
			button_preview.style.display='none';
		}
	});
	var that=this;
	var result_data;
	$(this.active_form).ajaxForm({
		dataType:'json',
		beforeSend:function(){
			y_wait_show();
			$(this.detail).html('');
		},
		complete:function(){
			y_wait_hide();
		},
		success:function(data){
			result_data=data;
			$('#tick_2').show();
			button_preview.style.display='none';
			button_upload.style.display='';
			if(typeof result_data[0][0]!=='undefined' && result_data[0][0].substring(0,5)=='error')
			{
				y_show_ajax_result(result_data[0],false);
			}
			else
			{
				that.data.detail=result_data;
				var alternate=false;
				for(var i in data){
					//that.panel.write_table(i,'detail',data[i],alternate,'draggable');
					that.panel.write_table(i,'detail',data[i],alternate);
					alternate=!alternate;
				}
			}
		}
	});
	button_upload.addEventListener('click',function(event){
		event=event||window.event;
		event.preventDefault();
		var callback=function(status){
			button_upload.style.display='none';
			$('#tick_3').show();
			y_show_ajax_result(status);
		};
		postAjax(that.query_url+'upload_csv_file','{value:'+result_data+'}', callback);
		/*$.ajax({
			url:that.query_url+'upload_csv_file',
			type:'POST',
			dataType:'json',
			data:{value:result_data},
			beforeSend:function(){
				y_wait_show();
			},
			complete: function(){
				y_wait_hide();
			},
			success: function(status){
				button_upload.style.display='none';
				$('#tick_3').show();
				y_show_ajax_result(status);
			}
		});*/
	});
};
y_upload_form.prototype.set_form_attribute=function(){
	var form_element=document.getElementById(this.name);
	form_element.setAttribute('method','post');
	form_element.setAttribute('enctype','multipart/form-data');
	form_element.setAttribute('action',this.submit_url);
};
y_upload_form.prototype.write_master = function(){
	var cl_row='panel_input_row_with_sidebar_with_margin';
	var html_text=y_html([
		{element:'div',class:cl_row,content:y_html([
			{element:'div',class:'label_step',content:'Step 1'},
			{element:'input',type:'file',id:'button_file',name:'csv_file'},
			{element:'div',id:'tick_1',class:'tick'}
		])},
		{element:'div',class:cl_row,content:y_html([
			{element:'div',class:'label_step',content:'Step 2'},
			{element:'input',type:'submit',id:'button_preview',name:'button_preview',value:'Preview'},
			{element:'div',id:'tick_2',class:'tick'}
		])},
		{element:'div',class:cl_row,content:y_html([
			{element:'div',class:'label_step',content:'Step 3'},
			{element:'input',type:'submit',id:'button_upload',name:'button_upload'},
			{element:'div',id:'tick_3',class:'tick'}
		])}
	]);
	$(this.master).append(html_text);
};
var Download_Blank = function (p){
	p.wrapper.on('click',p.trigger.selector,function(){
		var d=[];
		y_download_csv(p.field,d,p.filename);
	});
};
function Help_Form(param){
	useParam(this,param);
	this.wrapper=typeof this.wrapper!=='undefined'?this.wrapper:$('#module_panel');
	this.name=typeof this.name!=='undefined'?this.name:(
		typeof this.item!=='undefined'?(
			typeof this.item.name!=='undefined'?'info_'+this.item.name:'info_helper_default'
		):'info_helper_default'
	);
	this.title=typeof this.title!=='undefined'?this.title:(
		typeof this.item!=='undefined'?(
			typeof this.item.label!=='undefined'?this.item.label:'Tutorial'
		):'Tutorial'
	);
	this.trigger=typeof this.trigger!=='undefined'?this.trigger:(
		typeof this.item!=='undefined'?(
			typeof this.item.name!=='undefined'?$('#button_'+this.item.name):$('#button_info_default')
		):$('#button_info_default')
	);
	this.data_url=typeof this.data_url!=='undefined'?
		this.data_url:
		(
			typeof this.item!=='undefined'?
			(
				typeof this.item.data_url!=='undefined'?
				(
					typeof this.controller!=='undefined'?this.controller+this.item.data_url:''
				):
				(
					typeof this.item.name!=='undefined'?
					(
						typeof this.controller!=='undefined'?
							this.controller+'call_'+this.item.name:''
					):''
				)
			):''
		);
	this.panel=false;
	this.panel_toolbar=false;
	this.form=false;
	this.panel_title=false;
	this.panel_table=false;
	this.panel_data=false;
	this.default_panel_data_height=472;
	this.panel_type='panel_info';
	this.created=false;
	this.init();
}
Help_Form.prototype.init=function(){
	var that=this;
	this.wrapper.off('click',this.trigger.selector);
	this.wrapper.on('click',this.trigger.selector,function(event){
		event=event||window.event;
		$('.panel_info').hide();
		if(!that.created){that.build();}
		that.reset();
		redimension(css);
		that.panel.show();
	});
};
Help_Form.prototype.build=function(){
	var that=this;
	this.write_panel();
	this.write_toolbar_row();
	this.created=true;
	this.panel.off('click',that.panel_title.selector);
	this.panel.on('click',that.panel_title.selector,function(event){event=event||window.event;that.panel.hide();});
};
Help_Form.prototype.write_panel=function(){
	var panel=this.panel_type;
	var main_class=panel;
	var end='_'+this.name;
	var main_id=panel+end;
	var title_class= panel+'_title';
	var title_id=title_class+end;
	var table_class=panel+'_table_wrapper';
	var table_id=table_class+this.name;
	var toolbar_class=panel+'_toolbar';
	var toolbar_id=toolbar_class+end;
	var table_data_class='panel_help_table_data';
	var table_data_id=table_data_class+end;
	var record_info_class= panel+'_record_info';
	var record_info_id=record_info_class+end;
	var id='#';
	var h=y_html([
		{element:'div', id:main_id, class:main_class, content:y_html([
			{element:'div',class:title_class,id:title_id,content:this.title},
			{element:'div',class:toolbar_class,id:toolbar_id},
			{element:'div',id:table_id,class:table_class,content:y_html([
				{element:'div',class:table_data_class,id:table_data_id}
			])},
			{element:'div',class:record_info_class,id:record_info_id}
		])}
	]);
	this.wrapper.append(h);
	this.panel=$(id+main_id);
	this.panel_table=$(id+table_id);
	this.panel_title=$(id+title_id);
	this.panel_toolbar=$(id+toolbar_id);
	this.panel_data=$(id+table_data_id);
	this.panel.hide();
};
Help_Form.prototype.reset=function(){
	var that=this;
	var url=this.data_url;
	getAjax(url,'',function(result){
		that.data=result;
		that.write_table(that.data);
	});
};
Help_Form.prototype.write_table=function(data){
	var object=this;
	object.panel_data.html('');
	var html='';
	for(var i in data)
	{
		html+='<p>'+data[i]+'</p>';
	}
	object.panel_data.append(html);
};

Help_Form.prototype.write_toolbar_row=function(){
	var that=this;
	var html_text=y_html([{element:'div',class:'panel_info_toolbar_separator'}]);
	html_text+=y_html([
		y_object_button('download','download',this.name),
		y_object_button('print','print',this.name)
	]);
	this.panel_toolbar.html(html_text);
	y_command({wrapper:this.panel,data:[
		{button:'#button_download_'+this.name, callback:function(){
			//y_download_csv(that.field,that.filtered_data,that.name+'.csv');
		}},
		{button:'#button_print_'+this.name,callback:function(){
			$('.button_edit_cancel').click();
			print_info_form(that.panel_table);
		}}
	]});
	function print_info_form(selector){
		if(selector.size()>1){
			selector.eq(0).print();
			return;
		}
		else if(!selector.size()){return;}
		var stlye=function(){
			var style=".panel_info_table_data{float:left;height:100%;overflow-x:auto;overflow-y:auto;} ";
			style+=".panel_info_filter,.button_edit_show{display:none;} ";
			var h=y_html([{element:'style',type:'text/css',content:style}]);
			return h;
		};
		var html=stlye()+' '+selector.html();
		y_print_html(html);
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Info_Form
//----------------------------------------------------------------------------------------------------------------------
function Info_Form(param){
	useParam(this,param);
	this.wrapper=typeof this.wrapper!=='undefined'?this.wrapper:$('#module_panel');
	this.field=typeof this.field!=='undefined'?this.field:(
		typeof this.item!=='undefined'?(
			typeof this.item.table!=='undefined'?this.item.table:[]
		):[]
	);
	this.name=typeof this.name!=='undefined'?this.name:(
		typeof this.item!=='undefined'?(
			typeof this.item.name!=='undefined'?'info_'+this.item.name:'info_default'
		):'info_default'
	);
	this.title=typeof this.title!=='undefined'?this.title:(
		typeof this.item!=='undefined'?(
			typeof this.item.label!=='undefined'?this.item.label:'default'
		):'default'
	);
	this.trigger=typeof this.trigger!=='undefined'?this.trigger:(
		typeof this.item!=='undefined'?(
			typeof this.item.name!=='undefined'?$('#button_'+this.item.name):$('#button_info_default')
		):$('#button_info_default')
	);

	this.data_url=typeof this.data_url!=='undefined'?
		this.data_url:
		(
			typeof this.item!=='undefined'?
			(
				typeof this.item.data_url!=='undefined'?
				(
					typeof this.controller!=='undefined'?this.controller+this.item.data_url:''
				):
				(
					typeof this.item.name!=='undefined'?
					(
						typeof this.controller!=='undefined'?
							this.controller+'call_'+this.item.name:''
					):''
				)
			):''
		);

	if(typeof this.item!=='undefined' && typeof this.item.data!=='undefined'){
		this.data_url+='?'+this.item.data;
	}
	this.master_filter=typeof this.master_filter!=='undefined'?this.master_filter:(
		typeof this.item!=='undefined'?(
			typeof this.item.master_filter!=='undefined'?this.item.master_filter:false
		):false
	);
	this.master_filter2=typeof this.master_filter2!=='undefined'?this.master_filter2:(
		typeof this.item!=='undefined'?(
			typeof this.item.master_filter2!=='undefined'?this.item.master_filter2:false
		):false
	);
	this.master_filter_label=typeof this.master_filter_label!=='undefined'?this.master_filter_label:(
		typeof this.item!=='undefined'?(
			typeof this.item.master_filter_label!=='undefined'?this.item.master_filter_label:''
		):''
	);
	this.master_filter2_label=typeof this.master_filter2_label!=='undefined'?this.master_filter2_label:(
		typeof this.item!=='undefined'?(
			typeof this.item.master_filter2_label!=='undefined'?this.item.master_filter2_label:''
		):''
	);
	this.master_filter_url=typeof this.master_filter_url!=='undefined'?this.master_filter_url:(
		typeof this.item!=='undefined'?(
			typeof this.item.master_filter_url!=='undefined'?this.item.master_filter_url:(
				typeof this.item.master_filter_field!=='undefined'?(
					typeof this.controller!=='undefined'?this.controller+'call_'+this.item.master_filter_field+'_autocomplete':''
				):''
			)
		):''
	);
	this.master_filter2_url=typeof this.master_filter2_url!=='undefined'?this.master_filter2_url:(
		typeof this.item!=='undefined'?(
			typeof this.item.master_filter2_url!=='undefined'?this.item.master_filter2_url:(
				typeof this.item.master_filter2_field!=='undefined'?(
					typeof this.controller!=='undefined'?this.controller+'call_'+this.item.master_filter2_field+'_autocomplete':''
				):''
			)
		):''
	);
	this.parent = typeof this.parent!=='undefined'?this.parent:false;
	this.panel=false;
	this.form=false;
	this.filtered_data=false;
	this.master_filter_input=false;
	this.master_filter2_input=false;
	this.panel_title=false;
	this.panel_table=false;
	this.panel_toolbar=false;
	this.panel_filter=false;
	this.panel_header=false;
	this.filter_class=false;
	this.panel_data=false;
	this.edit=false;
	this.cell_width=[];
	this.sort_position=[];
	this.default_panel_data_height=472;
	this.panel_type='panel_info';
	this.infoFormId=this.panel_type+'_'+this.name; // infoForm_name
	this.database=false;
	this.created=false;
	this.dataWidthClass='_yInfoFormDataWidth_'+this.name;
	this.dataWidthFreezeClass='_yInfoFormDataFreezeWidth_'+this.name;
	for(var i in this.field){
		if(typeof this.field[i].edit!=='undefined' && this.field[i].edit=='yes'){
			this.edit=true;break;
	}}
	this.init();
	//this.resizeableCol();
}
Info_Form.prototype.init=function(){
	var that=this;
	this.wrapper.off('click',this.trigger.selector);
	this.wrapper.on('click',this.trigger.selector,function(event){
		event=event||window.event;
		$('.panel_info').hide();
		if(!that.created){that.build();}
		that.reset();
		redimension(css);
		that.panel.show();
	});

};
Info_Form.prototype.resizeableCol=function(object){
	object=typeof object!=='undefined'?object:this;
	var start_pos;
	var parentCell;
	var next_panel;
	$('#'+object.infoFormId).off('mousedown','._yColResizerInfo');
	$('#'+object.infoFormId).on('mousedown','._yColResizerInfo',function(event){
		event=event||window.event;
		event.stopPropagation();
		parentCell=$(this).parent();
		start_pos=event.clientX;
		$('#'+object.infoFormId).bind("mousemove", start_split);
		$('#'+object.infoFormId).bind("mouseup", end_split);
		$('#'+object.infoFormId).css("-webkit-user-select", "none");
		document.onselectstart=function(){return false;};
	});
	$('#'+object.infoFormId).off('mousedown','._yColResizerInfoLeft');
	$('#'+object.infoFormId).on('mousedown','._yColResizerInfoLeft',function(event){
		event=event||window.event;
		event.stopPropagation();
		parentCell=typeof $(this).parent().prev()!=='undefined'?$(this).parent().prev()!=='undefined':false;
		start_pos=event.clientX;
		$('#'+object.infoFormId).bind("mousemove", start_split);
		$('#'+object.infoFormId).bind("mouseup", end_split);
		$('#'+object.infoFormId).css("-webkit-user-select", "none");
		document.onselectstart=function(){return false;};
	});
	function start_split(event){
		var newX=event.clientX;
		var move=start_pos-newX;
		start_pos=event.clientX;
		resize_panel(move);
	}
	function end_split(event){
		$('#'+object.infoFormId).unbind("mousemove", start_split);
		$('#'+object.infoFormId).unbind("mouseup", end_split);
		$('#'+object.infoFormId).css("-webkit-user-select", "text");
		document.body.style.cursor='default';
		document.onselectstart=function(){return true;};
	}
	function resize_panel(value){
		//var tableWidth=$(that.panel_data).width();
		if(parentCell){
			var tableWidth=$('.'+object.dataWidthClass).width();
			var tableFreezeWidth=$('.'+object.dataWidthFreezeClass).width();
			var parentCellWidth=parentCell.width();
			var newParentCellWidth=parentCellWidth-value;
			var parentCellCol=parentCell.attr('col');
			var isFreezed=parentCell.attr('data');
			var grandParent = parentCell.parent();
			$('.'+object.dataWidthClass).css('width',tableWidth-value);

			if(isFreezed=='freeze'){
				$('.'+object.dataWidthFreezeClass).css('width',tableFreezeWidth-value);
			}
			$('[col='+parentCellCol+']').css('width',newParentCellWidth);
		}
	}
};
Info_Form.prototype.build=function(){
	var that=this;
	this.write_panel();
	this.write_toolbar_row();
	this.write_filter_row();
	this.write_table_header();
	this.make_table_sortable();
	that.resizeableCol();
	this.created=true;
	this.panel.off('click',that.panel_title.selector);
	this.panel.on('click',that.panel_title.selector,function(event){event=event||window.event;that.panel.hide();});
	if(this.edit){
		this.panel.off('click','.button_edit_show');
		this.panel.off('click','.button_edit_cancel');
		this.panel.on('click','.button_edit_show',function(event){event=event||window.event;show_setup_edit_form(that,this);});
		this.panel.on('click','.button_edit_cancel',function(event){event=event||window.event;cancel_edit(this);});
	}
	function show_setup_edit_form(object,selector){
		var parent=$(selector).parent(0);
		var parent_height=parent.height();
		if(parent_height==26){
			parent.css('height','82');
			parent.children().hide();
			that.write_edit_field(parent);
		}
	}
	function cancel_edit(selector){
		var parent=$(selector).parent(0);
		var grandparent = parent.parent(0);
		$(parent).remove();
		grandparent.css('height','26');
		grandparent.children().show();
	}
};
Info_Form.prototype.write_panel=function(){
	var panel=this.panel_type;
	var main_class=panel;
	var end='_'+this.name;
	var main_id=panel+end;
	var title_class= panel+'_title';
	var title_id=title_class+end;
	var toolbar_class=panel+'_toolbar';
	var toolbar_id=toolbar_class+end;
	var table_class=panel+'_table_wrapper';
	var table_id=table_class+this.name;
	var filter_class=panel+'_filter';
	var freeze_filter_class=panel+'_freeze_filter';
	var filter_id=filter_class+end;
	var freeze_filter_id=freeze_filter_class+end;
	var table_header_class=panel + '_table_header';
	var table_freeze_header_class=panel + '_table_freeze_header';
	var table_header_id=table_header_class+end;
	var table_freeze_header_id=table_freeze_header_class+end;
	var table_data_class=panel+'_table_data';
	var table_freeze_data_class=panel+'_table_freeze_data';
	var table_freeze_class=panel+'_table_freeze '+this.dataWidthFreezeClass;
	var table_freeze_id=table_freeze_class+end;
	var table_data_id=table_data_class+end;
	var table_freeze_data_id=table_freeze_data_class+end;
	var record_info_class= panel+'_record_info';
	var record_info_id=record_info_class+end;
	var id='#';
	var h=y_html([
		{element:'div', id:main_id, class:main_class, content:y_html([
			{element:'div',class:title_class,id:title_id,content:this.title},
			{element:'div',class:toolbar_class,id:toolbar_id},
			{element:'div',id:table_id,class:table_class,content:y_html([
				//{element:'div',class:filter_class,id:filter_id},
				{element:'div',class:table_freeze_class,id:table_freeze_id,content:y_html([
					{element:'div',class:freeze_filter_class,id:freeze_filter_id},
					{element:'div',class:table_freeze_header_class,id:table_freeze_header_id},
					{element:'div',class:table_freeze_data_class,id:table_freeze_data_id},
				])},
				{element:'div',class:filter_class,id:filter_id},
				{element:'div',class:table_header_class,id:table_header_id},
				{element:'div',class:table_data_class,id:table_data_id}
			])},
			{element:'div',class:record_info_class,id:record_info_id}
		])}
	]);
	this.wrapper.append(h);
	this.panel=$(id+main_id);
	this.panel_table=$(id+table_id);
	this.panel_title=$(id+title_id);
	this.panel_toolbar=$(id+toolbar_id);
	this.panel_filter=$(id+filter_id);
	this.panel_freeze_filter=$(id+freeze_filter_id);
	this.panel_freeze=$(id+table_freeze_id);
	this.panel_freeze_header=$(id+table_freeze_header_id);
	this.panel_freeze_data=$(id+table_freeze_data_id);
	this.panel_header=$(id+table_header_id);
	this.panel_data=$(id+table_data_id);
	this.panel.hide();
	this.wrapper.off('scroll','#'+table_data_id);
	$('#'+table_data_id).scroll(function(event){
		var st=$('#'+table_data_id).scrollTop();
		$('#'+table_freeze_data_id).scrollTop(st);
	});
};
Info_Form.prototype.write_toolbar_row=function(){
	var that=this;
	var input_master_filter_id='input_master_filter_'+this.name;
	var input_master_filter2_id='input_master_filter2_'+this.name;
	var button_master_filter_id='button_go_filter_'+this.name;
	var html_text=y_html([{element:'div',class:'panel_info_toolbar_separator'}]);
	if(this.master_filter!==false || this.master_filter2!==false){
		if (this.master_filter!==false){
			html_text+=y_html([
				{element:'div',class:'label_form', content:this.master_filter_label},
				{element:'input',type:'text', class:'input_text width_175', id:input_master_filter_id},
				{element:'div',class:'label_form'},
			]);
		}
		if (this.master_filter2!==false){
			html_text+=y_html([
				{element:'div',class:'label_form', content:this.master_filter2_label},
				{element:'input',type:'text', class:'input_text width_175', id:input_master_filter2_id},
				{element:'div',class:'label_form'},
			]);
		}
		html_text+=y_html([
			y_object_button('go','query','filter_'+this.name)
		]);
	}
	html_text+=y_html([
		y_object_button('download','download',this.name),
		y_object_button('download','csv indonesia',this.name+'_indonesia'),
		y_object_button('filter','filter',this.name),
		y_object_button('print','print',this.name)
	]);
	if (this.master_filter2!==false){
		html_text+=y_html([y_object_button('print','PDF',this.name+'PDF')]);
	}
	this.panel_toolbar.html(html_text);
	this.master_filter_input=$('#'+input_master_filter_id);
	this.master_filter2_input=$('#'+input_master_filter2_id);
	if(this.master_filter!==false){
		this.panel.off('click','#'+button_master_filter_id);
		this.panel.on('click','#'+button_master_filter_id,function(event){event=event||window.event;that.reset();});
		if(typeof this.master_filter_url!=='undefined'){
			this.panel.off('focusin','#'+input_master_filter_id);
			this.panel.on('focusin','#'+input_master_filter_id,function(){
				var ac_config={
					source:that.ac_source(),
					select:function(event,ui){
						$(this).val(ui.item.data);
					},
					minLength:1
				};
				$('#'+input_master_filter_id).autocomplete(ac_config);
			});
		}
	}
	y_command({wrapper:this.panel,data:[
		{button:'#button_download_'+this.name, callback:function(){
			y_download_csv(that.field,that.filtered_data,that.name+'.csv','english',that.parent);
		}},
		{button:'#button_download_'+this.name+'_indonesia',callback:function(){
			y_download_csv(that.field,that.filtered_data,that.name+'.csv','indonesia',that.parent);
		}},
		{button:'#button_filter_'+this.name,callback:function(){
			that.filter();
		}},
		{button:'#button_print_'+this.name,callback:function(){
			$('.button_edit_cancel').click();
			print_info_form(that.panel_table);
		}},
		{button:'#button_print_'+this.name+'PDF',callback:function(){
			$('.button_edit_cancel').click();
			var value1=$('#'+input_master_filter_id).val();
			var value2=$('#'+input_master_filter2_id).val();
			print_info_pdf(value1, value2);
		}}
	]});
	function print_info_form(selector){
		console.log(that.field); // that.field[i].label
		console.log(that.filtered_data);
		var htmlString = '';
		var child = '';
		for(var i in that.field){
			child+=y_html([{element:'div',style:'float:left; width:80px;',content:that.field[i].label}]);
		}
		if(selector.size()>1){
			selector.eq(0).print();
			return;
		}
		else if(!selector.size()){return;}
		var stlye=function(){
			var cssString=".panel_info_table_data{float:left;height:100%;overflow-x:auto;overflow-y:auto;} ";
			cssString+=".panel_info_filter,.button_edit_show{display:none;} ";
			var h=y_html([{element:'style',type:'text/css',content:cssString}]);
			return h;
		};
		//var html=stlye()+' '+selector.html();
		var html=child;
		y_print_html(html);
	}
	function print_info_pdf(filter1, filter2){
		this.query_url = 'C_fi_input_journal/';
		var print_url  = this.query_url + 'call_pdf';
		var parameter  = '?database='+$('#input_database').val()+'&param1='+filter1+'&param2='+filter2;
		parameter = parameter.replace('/' ,'%2F');
		window.open(print_url + parameter);
	}
};
Info_Form.prototype.ac_source=function(){
	var database = false;
	var source=this.master_filter_url;
	if(this.database){
		database=this.database;
		if(database!==''){
			source+='?db='+database;
		}
	}
	return source;
};
Info_Form.prototype.write_filter_row=function(){
	var that=this;
	var fc='filter_row_'+this.name;
	var cc=fc+' input_text input_filter field_';
	var c=[];
	var c_freeze=[];
	var row=0;
	var row_freeze=0;
	for(var i in this.field){
		var isFreezed = typeof this.field[i].freeze!=='undefined'?this.field[i].freeze!=='undefined':false;
		c[row]={element:'input',style_width:0,col:this.name+'-'+i,type:'text',class:cc+this.field[i].name,id:this.field[i].name};row++;
		if(i==0||isFreezed){
			c_freeze[row_freeze]={element:'input',style_width:0,col:this.name+'-'+i,type:'text',class:cc+this.field[i].name,id:this.field[i].name};row_freeze++;
		}
	}
	var h=y_html([{element:'div',class:'panel_info_table_row '+this.dataWidthClass,content:y_html(c)}]);
	var h_freeze=y_html([{element:'div',class:this.dataWidthFreezeClass,content:y_html(c_freeze)}]);
	this.panel_filter.html(h);
	this.panel_freeze_filter.html(h_freeze);
	this.filter_class=$('.'+fc);
	this.freeze_filter_class=$('.'+fc);
	this.panel.off('change','.input_filter');
	this.panel.on('change','.input_filter',function(){that.filter();});
};
Info_Form.prototype.write_table_header=function(){
	var header_class='row_header_'+this.name;
	var child_class=header_class+' label_header label_header_sortable field_';
	var child_param=[];
	var child_param_freeze=[];
	var row=0;
	var row_freeze=0;
	for(var i in this.field){
		var isFreezed = typeof this.field[i].freeze!=='undefined'?this.field[i].freeze!=='undefined':false;
		var dataFreezed=isFreezed?'freeze':'';
		child_param[row]={element:'div',data:dataFreezed,col:this.name+'-'+i,class:child_class+this.field[i].name,content:y_html([
			{element:'div',class:'_yColResizerInfoLeft',content:''},
			{element:'div',class:'_yColSortInfo',data:this.name+'-'+i,content:this.field[i].label},
			{element:'div',class:'_yColResizerInfo',content:''},

		])};
		row++;

		if(i == 0||isFreezed){
			child_param_freeze[row_freeze]={element:'div',data:dataFreezed,col:this.name+'-'+i,class:child_class+'freeze_'+this.field[i].name,content:y_html([
				{element:'div',class:'_yColResizerInfoLeft',content:''},
				{element:'div',class:'_yColSortInfo',data:this.name+'-'+i,content:this.field[i].label},
				{element:'div',class:'_yColResizerInfo',content:''},

			])};
			row_freeze++;
		}

		this.sort_position[i]='asc';
	}
	var html_text=y_html([{element:'div',class:'panel_info_table_row '+this.dataWidthClass,content:y_html(child_param)}]);
	var html_text_freeze=y_html([{element:'div',class:'panel_info_table_row_freeze '+this.dataWidthFreezeClass,content:y_html(child_param_freeze)}]);
	this.panel_header.html(html_text);
	this.panel_freeze_header.html(html_text_freeze);
};
Info_Form.prototype.reset=function(){
	var that=this;
	var url=this.data_url;
	if($('#input_database').length){
		if(url.indexOf('?') > -1){
			url+='&database='+$('#input_database').val();
		}
		else{
			url+='?database='+$('#input_database').val();
		}
	}
	if(this.master_filter!==false){
		var value=$(this.master_filter_input).val();
		if(url.indexOf('?') > -1){
			url+='&param='+value;
		}
		else{
			url+='?param='+value;
		}
	}
	if(this.master_filter2!==false){
		var val=$(this.master_filter2_input).val();
		if(url.indexOf('?') > -1){
			url+='&param2='+val;
		}
		else{
			url+='?param2='+val;
		}
	}
	this.align_col();
	getAjax(url,'',function(result){
		that.data=result;
		that.write_table(that.data);
		that.filtered_data=y_object_clone(that.data);
	});
};
Info_Form.prototype.filter=function(){
	var object=this;
	s=object.filter_class;
	var param=y_get_filter_param($(s));
	var data=y_table_filter(object.data,param);
	object.filtered_data=y_object_clone(data);
	this.write_table(data);
	function y_get_filter_param(f){
		var p=[];
		var i=0;
		f.each(function(){
			p[i]={};
			var d=$(this).attr("id");
			p[i].field=d;
			var v=$(this).val();
			if(v!==''){p[i].criteria=v;}
			else{p[i].criteria='';}
			i++;
		});
		return p;
	}
	function y_table_filter(o,p){
		var c=y_object_clone(o);
		if(p){
			for(var i in p){
				var x=p[i].criteria;
				var f=p[i].field;
				if(x!==''){
					var s=0;
					for(var num in c){s++;}
					var j=0;
					for(var count=0;count<s;count++){
						var d=c[j][f];
						var r=y_filter_like(d,x);
						if(r<0){c.splice(j,1);}
						else{j++;}
					}
				}
				c=y_object_clone(c);
			}
		}
		return c;
	}
	function y_filter_like(a,b){
		if(b!==''){
			var c=typeof a!=='undefined'?a.toString().toLocaleLowerCase():'';
			var d=typeof b!=='undefined'?b.toString().toLocaleLowerCase():'';
			var l=d.length;var e=d.substring(0,1);
			var f=d.substring(1,l);
			if(e=='='){
				if(c==f){return 0;}
				else{return -1;}
			}
			else if(e=='>'){
				if(Number(c)>Number(f)){return 0;}
				else{return -1;}
			}
			else if(e=='<'){
				if(Number(c)<Number(f)){return 0;}
				else{return -1;}
			}
			else if(e=='!'){
				if(c!=f){return 0;}
				else{return -1;}
			}
			else{return c.indexOf(d);}
		}
		else{return 0;}
	}
};
Info_Form.prototype.write_table=function(data){
	var object=this;
	object.panel_data.html('');
	object.panel_freeze_data.html('');
	var parent_class='panel_info_table_row '+this.dataWidthClass;
	var html_text='';
	var html_text_freeze='';

	var parent_id=false;
	var parent_freeze_id=false;
	for(var i in data){
		parent_id=object.name+'-data-' + i;
		parent_freeze_id=object.name+'-freeze-data-' + i;
		var child_param=[];
		var child_param_freeze=[];
		var col=0;
		var col_freeze=0;
		for(var j in object.field){
			var child_class='label_data row field_';
			var content_data=data[i][object.field[j].name];
			if(typeof(object.field[j].format)!='undefined'){
				var format=object.field[j].format;
				switch(format){
					case 'currency':
						if(!isNaN(content_data)){
							content_data=y_format_currency(Math.round(content_data*100)/100,'Rp');
							child_class='label_data_right row field_';
						}
						break;
					case 'number':
						if(!isNaN(content_data)){
							content_data=Math.round(content_data*100)/100;
							content_data=y_format_number(parseInt(content_data));
							child_class='label_data_right row field_';
						}
						break;
					case 'number2':
						if(!isNaN(content_data)){
							content_data=y_format_number(parseFloat(content_data).toFixed(2));
							child_class='label_data_right row field_';
						}
						break;
					case 'long_date_indonesia':
						content_data=y_format_long_date_id(content_data);
						break;
				}
			}
			child_param[col]={element:'div',col:object.name+'-'+j,row:object.name+'-'+i,class:child_class+object.field[j].name,content:content_data};
			col++;
			//if(j == 0){
			var isFreezed = typeof this.field[j].freeze!=='undefined'?this.field[j].freeze!=='undefined':false;
			if(j == 0||isFreezed){
				child_param_freeze[col_freeze]={element:'div',col:object.name+'-'+j,row:object.name+'-'+i,class:child_class+'freeze_'+object.field[j].name,content:content_data};
				col_freeze++;
			}
		}
		if (object.edit){child_param[col]={element:'div', class:'button_edit_show', content:'Edit'};col++;}
		if (object.print_row_button=='yes'){child_param[col]={element:'div', class:'button_print_row', content:'Print'};col++;}
		html_text+=y_html([{element:'div', id:parent_id, class:parent_class, content:y_html(child_param)}]);
		html_text_freeze+=y_html([{element:'div', id:parent_freeze_id, class:this.dataWidthFreezeClass, content:y_html(child_param_freeze)}]);

	}
	if(html_text===''){
		parent_id = object.name+'-data-' + 0;
		html_text+=y_html([{element:'div', id:parent_id, class:parent_class, content:'No Data'}]);
	}
	object.panel_data.append(html_text);
	object.panel_freeze_data.append(html_text_freeze);
	this.align_col();
};
Info_Form.prototype.align_col=function(){
	var object=this;
	var row_width=0;
	var row_width_freeze=0;
	var measure=function (data,cl){
		width=$('<div id="y_temp" class="'+cl+'"></div>').css({display:'none',whiteSpace:'nowrap'}).appendTo($('body')).text(data+'-').width();$('#y_temp').remove();
		width = Math.ceil(width*1.2);
		return width;
	};
	var longest='';
	for(var i in object.field){
		this_col=object.name+'-'+i;
		var array_string=[];
		var j=0;
		$('[col='+this_col+']').each(function(){
			array_string[j]=$(this).text();
			j++;
		});
		if(array_string.length>0){
			longest=this.get_longest_string(array_string);
		}
		var last_width=measure(longest,'label_data');
		row_width+=last_width+6;
		$('[col='+this_col+']').css('width',last_width);
		var isFreezed = typeof object.field[i].freeze!=='undefined'?object.field[i].freeze!=='undefined':false;
		if(i==0 || isFreezed){
			row_width_freeze+=last_width+6;
		}
	}
	$('.'+this.dataWidthClass).css('width',row_width);
	$('.'+this.dataWidthFreezeClass).css('width',row_width_freeze);
	//$('.panel_info_table_row').css('width',row_width);
	//$('.panel_info_table_freeze').css('width',row_width_freeze);
};
Info_Form.prototype.get_longest_string=function(array_string){
	return array_string.reduce(function(a, b){return a.length > b.length ? a : b;});
};
Info_Form.prototype.write_edit_field=function(parent){
	var object=this;
	var parent_id=parent.attr('id');
	var form_class='panel_info_edit_data '+parent_id;
	var form_id='form_'+parent_id;
	var cl_submit='button_edit_submit';
	var id_submit=cl_submit+'_'+parent_id;
	var cl_cancel='button_edit_cancel';
	var value=[];
	var width=[];
	var row=0;
	parent.children().each(function(){
		var this_class=$(this).attr('class');
		if(this_class!=='button_edit_show'){
			value[row]=$(this).text();
			width[row]=$(this).width();
			row++;
		}
	});
	var index=value[0];
	var child_html='';
	var child_class= 'input_text field_';
	var child_class_readonly='label_data input_text field_';
	var child_param=[];
	var i;
	row=0;
	for(i in object.field){
		if (typeof object.field[i].edit!=='undefined' && object.field[i].edit=='yes'){child_param[row]={element:'input',type:'text',col:object.name+'-'+i,class:child_class+object.field[i].name,id:parent_id+'-'+object.field[i].name+'-'+index,name:object.field[i].name};row++;}
		else{child_param[row]={element:'input',type:'text',col:object.name+'-'+i,readonly:'readonly',class:child_class_readonly+object.field[i].name,id:parent_id+'-'+object.field[i].name+'-'+index,name:object.field[i].name};row++;}
	}
	child_param[row]={element:'div',class:cl_submit,id:id_submit,content:'Submit'};	row++;
	child_param[row]={element:'div',class:cl_cancel,content:'Cancel'};row++;
	var html_text=y_html([{element:'form',id:form_id,class:form_class,content:y_html(child_param)}]);
	$('#'+parent_id).append(html_text);
	for(i in object.field){
		var this_field=$('#'+parent_id+'-'+object.field[i].name+'-'+index);
		this_field.val(value[i]);
		this_field.width(width[i]);
	}
	var button_id='#button_edit_submit_'+parent_id;
	var form_object=$('#'+form_id);
	var submit_url=object.submit_url;
	object.panel.off('click',button_id);
	object.panel.on('click',button_id,function(event){
		event=event||window.event;
		y_post_action(form_object,submit_url,object,false);
	});
};
Info_Form.prototype.make_table_sortable=function(object){
	object=typeof object!=='undefined'?object:this;
	object.panel.on('click','._yColSortInfo',function(event){
		event=event||window.event;
		var parentCell = $(this).parent();
		var col=$(parentCell).attr('col');
		var n=col.split('-');
		var index;
		for(var i in n){index=n[i];}
		if(object.sort_position[index]=='asc'){
			y_sort_table(object.panel_data,object.panel_freeze_data,$(parentCell),'asc');
			object.sort_position[index]='desc';
		}
		else{
			y_sort_table(object.panel_data,object.panel_freeze_data,$(parentCell),'desc');
			object.sort_position[index]='asc';
		}
	});
	function y_sort_table(tbl,tbl_freeze,obj,type){
		var col=obj.attr('col');
		var counter=0;
		var temp_data=[];
		var table=[];
		var parent_id=[];
		var parent_freeze_id=[];
		var row_name=[];
		var col_name=[];
		var last_value='';
		var get_col_name=false;
		var no_of_field=0;
		var no_of_row=0;
		var parent_index=0;
		var parent_freeze_index=0;
		var i;
		tbl.children().each(function(){
			parent_id[parent_index]=this.getAttribute('id');
			parent_index++;
		});
		tbl_freeze.children().each(function(){
			parent_freeze_id[parent_freeze_index]=this.getAttribute('id');
			parent_freeze_index++;
		});
		$('[col='+col+']').each(function(){
			var row=this.getAttribute('row');
			row_name[counter]=row;
			if(row!==null){
				var data=$(this).text();
				temp_data[counter]={'index':counter,'data':data};
				var field_counter=0;
				table[counter]=[];
				$('[row='+row+']').each(function(){
					table[counter][field_counter]=$(this).text();
					if(get_col_name===false){
						var this_col=this.getAttribute('col');
						col_name[field_counter]=this_col;
					}
					field_counter++;
					no_of_field=field_counter;
				});
				counter++;
				get_col_name=true;
			}
		});
		no_of_row=counter;
		var is_empty=false;
		for(i=0;i<no_of_row;i++){
			if(temp_data[i].data!==''){
				is_empty=true;
			}
		}
		if(is_empty!==false){
			temp_data.sort(function(a,b){
				var c='';
				var d='';
				if(type=='asc'){
					c=a.data;
					d=b.data;
				}
				else if(type=='desc'){
					c=b.data;
					d=a.data;
				}
				if(y_is_number(c)&&y_is_number(d)){
					return(c-d);
				}
				else{
					return (c||"|||").toUpperCase().localeCompare((d||"|||").toUpperCase());
				}
			});
			var sorted=false;
			for(i=0;i<no_of_row;i++){
				if(i!=temp_data[i].index)
				{sorted=true;}
			}
			if(sorted){
				var rows=[];
				var rows_freeze=[];
				for(i=0;i<no_of_row;i++){
					rows[i]=$('#'+parent_id[i]).detach();
					rows_freeze[i]=$('#'+parent_freeze_id[i]).detach();
				}
				for(i=0;i<no_of_row;i++){
					var this_index=temp_data[i].index;
					rows[this_index].appendTo($(tbl));
					rows_freeze[this_index].appendTo($(tbl_freeze));
				}
			}
		}
	}
};
var y_panel_selector=function(title,text,id){
	var h=y_html([
		{element:'div',class:'y_transparent_outer',content:y_html([
			{element:'div',class:'y_panel_selector',id:id,content:y_html([
				{element:'div',class:'panel_title',content:title},
				{element:'div',class:'y_message_box_text',content:text}
			])}
		])}
	]);
	$('body').append(h);
	/*
	$('.y_transparent_outer').click(function(event){
		event=event||window.event;
		$('.y_transparent_outer').hide();
	});
	$('.y_transparent_outer #'+id).click(function(event){
		event=event||window.event;
		event.stopPropagation();
	});
	*/
	$('.panel_title').click(function(event){
		event=event||window.event;
		$('.y_transparent_outer').hide();
	});
};
//----------------------------------------------------------------------------------------------------------------------
// Download_Form
//----------------------------------------------------------------------------------------------------------------------
function Download_Form(opt){
	var that=this;
	opt=typeof opt!=='undefined'?opt:false;
	if(opt){
		var single=typeof opt.list_url!=='undefined'?false:true;
		var data_field=typeof opt.data!=='undefined'&&typeof opt.data.field!=='undefined'?opt.data.field:false;
		var data_key=typeof opt.data!=='undefined'&&typeof opt.data.key!=='undefined'?opt.data.key:false;
		var name=opt.name;
		var panel_id='y_panel_selector_'+name;
		var p_name=[];
		var p_id=[];
		var i;
		for(i in opt.params){
			p_name[i]=opt.params[i].name;
			p_id[i]=name+'_'+p_name[i];
		}
		var html='';
		for(i in opt.params){
			var class_input='input_text float_left';
			if(typeof(opt.params[i].type)!=='undefined'){
				if(opt.params[i].type=='date'){
					class_input='input_date float_left';
				}
			}
			p_label=opt.params[i].label;
			if(!single){
				html+=y_html([
					{element:'div',class:'y_message_box_text_row',content:y_html([
						{element:'div',class:'y_message_box_text_row_padding',content:p_label+' : '},
						{element:'input',class:class_input,id:p_id[i],name:p_name[i]},
						{element:'div',id:'download_list_'+name,class:'button_circle ',content:y_html([
							{element:'img',class:'button_circle_image',id:'query_option_'+name,src:'../images/menubar/generate.png'},
							{element:'div',class:'button_circle_text',content:'Generate'}
						])}
					])},
					{element:'div',id:'data_table_-'+name,content:''},
				]);
			}
			else{
				html+=y_html([
					{element:'div',class:'y_message_box_text_row',content:y_html([
						{element:'div',class:'y_message_box_text_row_padding',content:p_label+' : '},
						{element:'input',class:class_input,id:p_id[i],name:p_name[i]},
						{element:'div',id:'print_'+name,class:'button_circle',content:y_html([
							{element:'img',class:'button_circle_image',src:'../images/menubar/print.png'},
							{element:'div',class:'button_circle_text',content:'Download'}
						])}
					])}
				]);
			}
		}
		if(!single){
			$('body').off('click','#download_list_'+name);
			$('body').on('click','#download_list_'+name,function(){
				target = opt.list_url;
				var parameter='?';
				for(i in opt.params){
					var p_value=$('#'+p_id[i]).val();
					if(i!==0){
						parameter+='&';
					}
					parameter+=p_name[i]+'='+p_value;
				}
				var callback=function(list_data){
					$('#data_table_-'+name).html('');
					var alternate=false;
					for(i in list_data){
						var label=list_data[i][data_field];
						var key=list_data[i][data_key];
						var alt='label_data ';
						if(alternate){
							alt = 'label_data_alternate ';
						}
						var text_html=y_html([
							{element:'div',class:alt+'y_message_box_text_row ',content:y_html([
								{element:'div',class:'float_left width_50',content:parseInt(i)+1},
								{element:'div',class:'float_left width_150',content:label},
								{element:'div',row:key,class:'button_circle button_download_'+name,content:y_html([
									{element:'img',class:'button_circle_image',src:'../images/menubar/download.png'},
									{element:'div',class:'button_circle_text',content:'download'},

								])},
								{element:'img',class:'tick',src:'../images/icon/tick.png'}
							])}
						]);
						$('#data_table_-'+name).append(text_html);
						alternate=!alternate;
					}
					$('.tick').hide();
					for(i in list_data){
						$('#data_table_-'+name).off('click','.'+'button_download_'+name);
						$('#data_table_-'+name).on('click','.'+'button_download_'+name,function(){
							var key=$(this).attr('row');
							$(this).siblings('.tick').show();
							var parameter='?param='+key;
							window.open(opt.data_url+parameter);
						});
					}
				};
				getAjax(target+parameter,"",callback);
			});
		}
		else{
			$('body').off('click','#print_'+name);
			$('body').on('click','#print_'+name,function(event){
				event=event||window.event;
				var parameter='?';
				for(var i in opt.params){
					var p_value=$('#'+p_id[i]).val();
					if(i!==0){
						parameter+='&';
					}
					parameter+=p_name[i]+'='+p_value;
				}
				window.open(opt.data_url+parameter);
			});
		}
		opt.wrapper.off('click',opt.trigger.selector);
		opt.wrapper.on('click',opt.trigger.selector,function(event){
			event=event||window.event;
			var element=document.getElementById(panel_id);
			if(element===null){
				y_panel_selector(opt.title,html,panel_id);
				for(var i in opt.params){
					var param_id=$('#'+p_id[i]);
					if(typeof(opt.params[i].url)!=='undefined'){
						var database = false;
						var source=opt.params[i].url;
						if($('#input_database').length){
							database=$('#input_database').val();
							if(database!==''){
								source+='?database='+database;
							}
						}
						var ac_config={
							source:opt.params[i].url,
							select:function(event,ui){$(this).val(ui.item.data);},
							minLength:1
						};
						param_id.autocomplete(ac_config);
					}
					if(typeof(opt.params[i].type)!=='undefined'){
						if(opt.params[i].type=='date'){
							class_input='input_date float_left';
							use_input_date(param_id, '-5:+1');
						}
					}
				}
			}
			else{
				element.parentNode.style.display='';
			}

		});
	}
}

y_helper_get_field=function(object){
	var result=[];
	var i=0;
	for(var field in object){
		if(object.hasOwnProperty(field)){
			result[i]=field;
			i++;
		}
	}
	return result;
};

var y_download_csv=function(field,data,filename,regional,sender){
	sender=typeof sender!=='undefined'?sender:false;
	if(data!==null){
		var r=confirm('Are you sure want to download?');
		if(r===true){
			filename=(typeof filename === "undefined") ? "file_download.csv":filename;
			regional=typeof regional !== "undefined" ? regional:"english";
			var separator;
			switch(regional){
				case 'english':
					separator=',';
					break;
				case 'indonesia':
					separator=';';
					break;
				default:
					separator=',';
			}
			field=typeof field!='object' ? JSON.parse(field):field;
			data=typeof data!='object' ? JSON.parse(data):data;
			var label='';
			var eof='\r\n';
			var qs='"';
			var qe=qs+separator;
			var is_number=[];
			var i,j,no_of_column;
			var object_i,field_name,content;
			var title =false;
			var csv='';
			//if(this.use_csv_title)
			//{
				if(sender)
				{
					var database = typeof(sender.database)!=='undefined'?sender.database:false;
					//title=database;
					if(database)
					{
						csv+=database+eof;
					}
				}
			//}
			for(i in field){
				if(typeof field[i].multicolumn!=='undefined' && field[i].multicolumn===true){
					root_field_name=typeof field[i].name!=='undefined'?field[i].name:false;
					if(root_field_name){
						object_i=typeof data[0][root_field_name]!=='undefined'?data[0][root_field_name]:false;
						field_name=object_i?y_helper_get_field(object_i):false;
						no_of_column=typeof field_name!=='undefined'&&field_name!==false?field_name.length:0;
						for(j=0;j<no_of_column;j++){
							label+=qs+field_name[j]+qe;
						}
					}
				}
				else{
					label+=qs+field[i].label+qe;
				}
				is_number[i]=false;
				if(typeof field[i].format !== 'undefined'){
					if(field[i].format == 'number'){
						is_number[i]=true;
					}
				}
			}
			var header=label.slice(0,(label.length)-1);
			csv+=header+eof;
			for(i=0;i<data.length;i++){
				var row='';
				var k=0;
				field_no=0;
				for(j in data[i]){
					var isMulticolumn=typeof field[field_no]!=='undefined'?typeof field[field_no].multicolumn!=='undefined'?field[field_no].multicolumn:false:false;
					if(typeof data[i][j]==='object' && isMulticolumn){
						root_field_name=typeof field[field_no].name!=='undefined'?field[field_no].name:false;
						if(root_field_name && root_field_name==j){
							object_i=typeof data[0][j]!=='undefined'?data[0][j]:false;
							field_name=object_i?y_helper_get_field(object_i):false;
							no_of_column=typeof field_name!=='undefined'&&field_name!==false?field_name.length:0;
							for(var col=0;col<no_of_column;col++){
								content = typeof data[i][j][field_name[col]]!=='undefined'?data[i][j][field_name[col]]:'';
								if(is_number[k]){
									content=y_format_currency(content,'',regional);
								}
								k++;
								row+=qs+content+qe;
							}
						}
					}
					else{
						content=data[i][j];
						if(is_number[k]){
							content=y_format_currency(content,'',regional);
						}
						k++;
						row+=qs+content+qe;
					}
					field_no++;
				}
				var row_csv=row.slice(0,(row.length)-1);
				csv+=row_csv+eof;
			}
			var bb=new Blob([csv],{type:'text/csv'});
			var a = document.createElement('a');
			a.href = window.URL.createObjectURL(bb);
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
};

var y_download_tsv=function(field,data,filename,regional,sender){
	sender=typeof sender!=='undefined'?sender:false;
	if(data!==null){
		var r=confirm('Are you sure want to download?');
		if(r===true){
			filename=(typeof filename === "undefined") ? "file_download.tsv":filename;
			regional=typeof regional !== "undefined" ? regional:"english";
			var separator;
			switch(regional){
				case 'english':
					separator='\t';
					break;
				case 'indonesia':
					separator='\t';
					break;
				default:
					separator='\t';
			}
			field=typeof field!='object' ? JSON.parse(field):field;
			data=typeof data!='object' ? JSON.parse(data):data;
			var label='';
			var eof='\r\n';
			var qs='';
			var qe=qs+separator;
			var is_number=[];
			var i,j,no_of_column;
			var object_i,field_name,content;
			var title =false;
			var csv='';
			//if(this.use_csv_title)
			//{
				if(sender)
				{
					var database = typeof(sender.database)!=='undefined'?sender.database:false;
					//title=database;
					if(database)
					{
						csv+=database+eof;
					}
				}
			//}
			for(i in field){
				if(typeof field[i].multicolumn!=='undefined' && field[i].multicolumn===true){
					root_field_name=typeof field[i].name!=='undefined'?field[i].name:false;
					if(root_field_name){
						object_i=typeof data[0][root_field_name]!=='undefined'?data[0][root_field_name]:false;
						field_name=object_i?y_helper_get_field(object_i):false;
						no_of_column=typeof field_name!=='undefined'&&field_name!==false?field_name.length:0;
						for(j=0;j<no_of_column;j++){
							label+=qs+field_name[j]+qe;
						}
					}
				}
				else{
					label+=qs+field[i].label+qe;
				}
				is_number[i]=false;
				if(typeof field[i].format !== 'undefined'){
					if(field[i].format == 'number'){
						is_number[i]=true;
					}
				}
			}
			var header=label.slice(0,(label.length)-1);
			csv+=header+eof;
			for(i=0;i<data.length;i++){
				var row='';
				var k=0;
				field_no=0;
				for(j in data[i]){
					var isMulticolumn=typeof field[field_no]!=='undefined'?typeof field[field_no].multicolumn!=='undefined'?field[field_no].multicolumn:false:false;
					if(typeof data[i][j]==='object' && isMulticolumn){
						root_field_name=typeof field[field_no].name!=='undefined'?field[field_no].name:false;
						if(root_field_name && root_field_name==j){
							object_i=typeof data[0][j]!=='undefined'?data[0][j]:false;
							field_name=object_i?y_helper_get_field(object_i):false;
							no_of_column=typeof field_name!=='undefined'&&field_name!==false?field_name.length:0;
							for(var col=0;col<no_of_column;col++){
								content = typeof data[i][j][field_name[col]]!=='undefined'?data[i][j][field_name[col]]:'';
								if(is_number[k]){
									content=y_format_currency(content,'',regional);
								}
								k++;
								row+=qs+content+qe;
							}
						}
					}
					else{
						content=data[i][j];
						if(is_number[k]){
							content=y_format_currency(content,'',regional);
						}
						k++;
						row+=qs+content+qe;
					}
					field_no++;
				}
				var row_csv=row.slice(0,(row.length)-1);
				csv+=row_csv+eof;
			}
			var bb=new Blob([csv],{type:'text/tsv'});
			var a = document.createElement('a');
			a.href = window.URL.createObjectURL(bb);
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
};


// Chart
var chartDefault = {
    // Boolean - Whether to animate the chart
    animation: true,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    animationEasing: "easeOutQuart",

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: false,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 12,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#666",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: true,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: true,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#fff",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for single tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}
};

var line = {

    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether the line is curved between points
    bezierCurve : true,

    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,

    //Boolean - Whether to show a dot for each point
    pointDot : true,

    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,

    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,

    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,

    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,

    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,

    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

};
var create_2d_chart=function(el, data, type){
	data = typeof data!== 'undefined'?data:'';
	type = typeof type!== 'undefined'?type:'line_1';
	if(data!==''){
		var ctx = document.getElementById(el).getContext("2d");
		if(type == 'line')
		{
			var this_chart = new Chart(ctx).Line(data, type);
		}
		Chart.defaults.global = chartDefault;
	}
};

var contextMenu=function(param){
	that=this;
	useParam(this,param);
	this.wrapper = typeof(this.wrapper) !== 'undefined' ? this.wrapper : 'body';
	this.id = typeof(this.id) !== 'undefined' ? this.id : 'contextMenu';
	this.menuItem = typeof(this.menuItem) !== 'undefined' ? this.menuItem : [];
	var arrItem = [];
	var arrData = [];
	for(var i in this.menuItem){
		var dataMenuItem = typeof(this.menuItem[i].data) !=='undefined' ? this.menuItem[i].data : '';
		var labelMenuItem = typeof(this.menuItem[i].label) !=='undefined' ? this.menuItem[i].label : '';
		var funcMenuItem = typeof(this.menuItem[i].function) !=='undefined' ? this.menuItem[i].function : function(){} ;
		arrItem.push({element:'li',data:dataMenuItem,class:'menuItem_'+that.id,content:labelMenuItem});
		arrData.push({data:dataMenuItem, function:funcMenuItem});
	}
	this.createMenu(arrItem);
	this.currentTarget=null;
	$(that.area).off('contextmenu');
	$(that.area).on('contextmenu',function (event){
		//event.stopPropagation();
		event.preventDefault();
		that.currentTarget=event.target;
		$('#'+that.id).finish().toggle(100).
		css({
			top: event.pageY + "px",
			left: event.pageX + "px"
		});
	});
	//$(this.wrapper).off('mousedown');
	$(that.wrapper).off('mousedown',that.detail);
	$(that.detail).on('mousedown', function(e) {
		var len=$(e.target).parents('#'+that.id).length;
		if(!(len > 0)){
			$("#"+that.id).hide(100);
		}
	});
	$(this.wrapper).off('click','.menuItem_'+that.id);
	$(this.wrapper).on('click','.menuItem_'+that.id,function(e){
		var target = $(e.target);
		var thisData = $(this).attr("data");
		for(var i in arrData){
			if(arrData[i].data == thisData){
				arrData[i].function(that.currentTarget);
			}
		}
		$('#'+that.id).hide(100);
	});
};
contextMenu.prototype.createMenu =function(arrItem){
	var h=y_html([
		{element:'ul',id:this.id,class:'custom-menu menu_'+this.id,content:y_html(arrItem)}
	]);
	$(this.wrapper).append(h);
};
if(typeof window === 'object' && typeof window.document === 'object'){
	window.y_form=y_form;
	window.y_upload_form=y_upload_form;
	window.Download_Blank=Download_Blank;
	window.y_download_csv=y_download_csv;
	window.Info_Form=Info_Form;
	window.Help_Form=Help_Form;
	window.Download_Form=Download_Form;
	window.y_create_2d_chart=create_2d_chart;
	window.y_contextMenu = contextMenu;
}
})(window);
