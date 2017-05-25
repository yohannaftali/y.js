//----------------------------------------------------------------------------------------------------------------------
// Panel Framework
// 2016.02.23
// - fixes bugs vertical scroll disappear on google chrome, change vertical_scrool width from 14 to 16
// 2016.06.30
// - Add checkbox_input type for detail/history
// - Add red, green, yellow, blue, grey, orange background options for row in table detail/history
//----------------------------------------------------------------------------------------------------------------------
(function (window, undefined) {
var s='sidebar_';
var sd=s+'data';var sg=s+'group';var sh=s+'header';var sb=s+'button';var si=' '+s+'item';var sbb=sb+' '+sb+'_bottom';

//----------------------------------------------------------------------------------------------------------------------
// Sidebar_Panel Object
//----------------------------------------------------------------------------------------------------------------------
var Sidebar_Panel= function(param){
	useParam(this,param);
	var all_class=typeof param.class!=='undefined'?si+' '+param.class:si;
	var row=param.field.length;
	var list=false;
	var c=[{element:'div',class:sh+si,content:param.title}];
	for(var i=0;i<row;i++){
		this.field[i].id=typeof this.field[i].id!='undefined'?this.field[i].id:(
			typeof this.field[i].name!=='undefined'?'button_'+this.field[i].name:'button_default'
		);
		if(typeof this.field[i].list!=='undefined' && this.field[i].list=='yes'){
			c.push({element:'div',id:this.field[i].id});
		}
		else{
			var class_name = i != (row-1) ? sb : sbb;
			c.push({element:'div',id:this.field[i].id,class:class_name+all_class,content:this.field[i].label});
		}
	}
	h=y_html([{element:'div',class:sg,content:y_html(c)}]);
	$('#'+sd).append(h);
	$('.'+sh).off('click');
	$('.'+sh).on('click',function(){
		//y_playClick(this);
		if($(this).parent().height()==45){$(this).parent().css('height','auto');}
		else{$(this).parent().animate({height:'45'},300);}
	});
};
Sidebar_Panel.prototype.create=function(){
	if(typeof this.field!=='undefined'){
		for(var i in this.field){
			var param={
				item:this.field[i],
				controller:this.controller
			};
			var form=new Info_Form(param);
		}
	}
};
var Sidebar_Help_Panel=function(param){
	useParam(this,param);
	var all_class=typeof param.class!=='undefined'?si+' '+param.class:si;
	var row=param.field.length;
	var list=false;
	var c=[{element:'div',class:sh+si,content:param.title}];
	for(var i=0;i<row;i++){
		this.field[i].id=typeof this.field[i].id!='undefined'?this.field[i].id:(
			typeof this.field[i].name!=='undefined'?'button_'+this.field[i].name:'button_default'
		);
		if(typeof this.field[i].list!=='undefined' && (this.field[i].list===true || this.field[i].list=='yes') ){
			c.push({element:'div',id:this.field[i].id});
		}
		else{
			var class_name=i!=(row-1)?sb:sbb;
			c.push({element:'div',id:this.field[i].id,class:class_name+all_class,content:this.field[i].label});
		}
	}
	h=y_html([{element:'div',class:sg,content:y_html(c)}]);
	$('#'+sd).append(h);
	$('.'+sh).off('click');
	$('.'+sh).on('click',function(){
		//y_playClick(this);
		if($(this).parent().height()==45){$(this).parent().css('height', 'auto');}
		else{$(this).parent().animate({height:'45'},300);}
	});
};
Sidebar_Help_Panel.prototype.create=function(){
	if(typeof this.field!=='undefined'){
		for(var i in this.field){
			var param={
				item:this.field[i],
				controller:this.controller
			};
			var form=new Help_Form(param);
		}
	}
};
var panel=function(param){
	var that=this;
	var res;
	this.object=param;
	this.master=false;
	this.detail_header=false;
	this.detail=false;
	this.history_header=false;
	this.history=false;
	this.default_ph=dim.module.main.height-34;
	this.default_mh=false;
	this.default_hh=false;
	this.default_dh=false;
	this.default_th=26;
	this.default_xh=this.default_ph-(2*this.default_th);
	this.write_panel(param);
	this.callback={
		detailScrollBottom:function(){}
	};
	var vsd=$('.panel_y_detail_table_vertical_scroll');
	var vsh=$('.panel_y_history_table_vertical_scroll');
	var pdtd=$('.panel_y_detail_table_data');
	var phtd=$('.panel_y_history_table_data');
	var sbarToogle=$('#sidebar_toogle');
	vsd.scroll(function(){
		var st=vsd.scrollTop();
		pdtd.scrollTop(st);
	});
	pdtd.scroll(function(){
		var st=pdtd.scrollTop();
		vsd.scrollTop(st);
		var oh=pdtd[0].scrollHeight-pdtd.outerHeight();
		if(st >= oh){
			that.callback.detailScrollBottom();
		}
	});
	vsh.scroll(function(){
		var st=vsh.scrollTop();
		phtd.scrollTop(st);
	});
	phtd.scroll(function(){
		var st=phtd.scrollTop();
		vsh.scrollTop(st);
	});
	sbarToogle.off('click');
	sbarToogle.on('click',function(){
		dim.onSidebarToogle();
	});
	redimension(css);
	window.onresize=function(){
		if(res){
			clearTimeout(res);
		}
		res=setTimeout(that.on_resize(),1);
	};
};
panel.prototype.on_resize=function(){
	var module_area=document.getElementById('module_area');
	if(module_area.innerHTML!==''){
		redimension(css);
		this.default_ph=dim.module.main.height-34;
		this.default_xh=this.default_ph-(2*this.default_th);
		var height;
		switch(this.object.panel_type){
			case 'm':
				this.default_mh=this.default_ph;
				this.default_dh=0;
				this.default_hh=0;
				this.y_m();
				break;
			case 'md':
				height=parseInt(this.default_ph/3);
				this.default_mh=height-4;
				this.default_dh=this.default_ph-height;
				this.default_hh=0;
				this.y_md(this.object.wrapper);
				break;
			case 'mdh':
				height=this.default_ph;
				var height_sub=parseInt(height/3);
				this.default_mh=parseInt(height-(2*height_sub))-8;
				this.default_dh=height_sub;
				this.default_hh=height_sub;
				this.y_mdh(this.object.wrapper);
				break;
		}
	}
};
panel.prototype.set_default_panel_height=function(mh,dh,hh){
	hh=typeof hh!=='undefined' ? hh : 0;
	var _height=dim.module.main.height-34;
	var _total=mh+dh+hh;
	this.default_dh=parseInt(_height*(dh/_total));
	this.default_hh=parseInt(_height*(hh/_total));
	this.default_mh=_height-(this.default_dh+this.default_hh)-4;
	if(hh!==0){
		this.default_mh=this.default_mh-4;
	}
	this.redimension_panel(this.default_mh,this.default_dh,this.default_hh);
};
panel.prototype.create_button=function(model,label,id){
	model=typeof model!=='undefined'?model:'submit';
	label=typeof label!=='undefined'?label:'button';
	id=typeof id!=='undefined'? id : '';
	var cl_pn_toolbar='panel_master_toolbar';
	var wrapper=$('.panel_master_toolbar');
	var button=this.object_button(model,label,id);
	wrapper.append(y_html([button]));
	return '#button_'+model+'_'+id;
};
panel.prototype.create_button_file=function(model,label,id){
	id=typeof id!=='undefined'? id : '';
	var cl_pn_toolbar='panel_master_toolbar';
	var wrapper=$('.panel_master_toolbar');
	var buttonTrigger=this.object_button(model,label,id);
	wrapper.append(y_html([buttonTrigger]));
	var buttonFile=this.object_button_file(model,id);
	wrapper.append(y_html([buttonFile]));
	var bObjFile = document.getElementById('button_file_'+model+'_'+id);
	var bObjTrigger = document.getElementById('button_'+model+'_'+id);
	bObjTrigger.addEventListener("click", function(){
	    bObjFile.click();
	});
	return '#button_file_'+model+'_'+id;
};
panel.prototype.command=function(wrapper,selector,callback){
	wrapper.off('click',selector);
	wrapper.on('click',selector,function(event){
		event=event||window.event;
		event.preventDefault();
		//y_playClick(event);
		callback(this);
	});
};
panel.prototype.reconfigure_default_dimension=function(param){
	this.default_ph=dim.module.main.height-34;
	this.default_xh=this.default_ph-(2*this.default_th);
	var height;
	switch(param.panel_type){
		case 'm':
			this.default_mh=this.default_ph;
			this.default_dh=0;
			this.default_hh=0;
			this.y_m();
			break;
		case 'md':
			height=parseInt(this.default_ph/3);
			this.default_mh=height-4;
			this.default_dh=this.default_ph-height;
			this.default_hh=0;
			this.y_md(param.wrapper);
			break;
		case 'mdh':
			height=this.default_ph;
			var height_sub=parseInt(height/3);
			this.default_mh=parseInt(height-(2*height_sub))-8;
			this.default_dh=height_sub;
			this.default_hh=height_sub;
			this.y_mdh(param.wrapper);
			break;
	}
};
// Write Panel inside page module (#module_panel)
// - _yPage
// -- _yModuleArea
// --- _yModulePanel
// ---- _yPanelSidebar
// ---- _yPanelMain
panel.prototype.write_panel=function(param){
	var h=y_html([
		{element:'div',id:'panel_sidebar',class:'_yFL _yPanelSidebar',content:y_html([
			{element:'div',id:'sidebar_title',class:'_yFL _ySidebarTitle',content:y_html([
				{element:'div',id:'sidebar_toogle', class:'_ySidebarToogle'}
			])},
			{element:'div',id:'sidebar_data',class:'_yFL _ySidebarData'}
		])},
		{element:'div',id:'panel_main',class:'_yFL _yPanelMain',content:y_html([
			{element:'form',id:param.name}
		])}
	]);
	$('#module_panel').append(h);
	var height;
	switch(param.panel_type){
		case 'm':
			this.default_mh=this.default_ph;
			this.default_dh=0;
			this.default_hh=0;
			this.write_m(param);
			break;
		case 'md':
			height=parseInt(this.default_ph/3);
			this.default_mh=height-4;
			this.default_dh=this.default_ph-height;
			this.default_hh=0;
			this.write_md(param);
			break;
		case 'mdh':
			height=this.default_ph;
			var height_sub=parseInt(height/3);
			this.default_mh=parseInt(height-(2*height_sub))-8;
			this.default_dh=height_sub;
			this.default_hh=height_sub;
			this.write_mdh(param);
			break;
	}
};
panel.prototype.writeMobileLayout=function(fields){
	var obj=[];
	for(var i in fields){
		var field=fields[i];
		if(field.name){
			var type = typeof field.type!=='undefined'?field.type:'text';
			var hideVirtualKeyboardClass=typeof field.virtualKeyboard!=='undefined' && field.virtualKeyboard===false ? ' yMInputNoVirtKey': '';
			obj.push({element:'div',class:'yMLabel label_form',content:field.label});
			if(typeof field.format!=='undefined' && field.format.length > 0){
				for(var j in field.format){
					var item = field.format[j];

					var inputField={element:'input',type:type,class:'_yFL yMInput input_master_'+type+hideVirtualKeyboardClass,name:item.name,id:'input_'+item.name,style:''};
					if(typeof item.pattern!=='undefined'){
						inputField.pattern=item.pattern;
					}
					if(typeof item.maxlength!=='undefined'){
						inputField.maxlength=item.maxlength;
					}
					obj.push(inputField);
				}
			}
			else{
				var inputObj={element:'input',type:type,class:'_yFL yMInput input_master_'+type+hideVirtualKeyboardClass,name:field.name,id:'input_'+field.name,style:''};
				if(typeof field.pattern!=='undefined'){
					inputObj.pattern=field.pattern;
				}
				if(typeof field.maxlength!=='undefined'){
					inputObj.maxlength=field.maxlength;
				}
				obj.push(inputObj);
			}
			obj.push({element:'div',class:'yMSeparator _yFL',content:' '});
		}
	}
	html=y_html([
		{element:'div',class:'yMWrapper',content:y_html([
			{element:'div',class:'yMHeader'},
			{element:'div',class:'yMContent',content:y_html(obj)}
		])}
	]);
	document.getElementById("module_panel").innerHTML = html;
};
panel.prototype.write_master=function(param,col){
	col=typeof col!=='undefined'?col:1;
	var that=this;
	var master=$(this.master);
	var cl_span='panel_input_row_with_sidebar panel_row_master _yFL';
	var cl_input='input_multi_select input_text input_master_text';
	var cl_datetime='input_type_datetime input_master_text';
	var cl_date='input_type_date input_master_text';
	var cl_time='input_type_time input_master_text';
	var cl_simple_time='input_type_simple_time input_master_text';
	var cl_simple_month='input_type_simple_month input_master_text';
	var cl_location='input_type_location input_master_text';
	var cl_trip='input_type_trip input_master_text';
	var cl_month='input_month input_master_text';
	var cl_date_ddmmyyyy='input_date_ddmmyyyy input_master_text';
	var cl_image='input_image input_master_text';
	var cl_pn_toolbar='panel_master_toolbar';
	var cl_pn_menu='panelMasterMenu';
	var cl_pn_main='panel_master_main';
	var cl_pn_main_span='panel_master_main_span';
	var cl_thousandSeparator='input_with_thousand_separator';
	var stdBtnClass='_yIconPickerMaster _yFL _yIconPicker ';
	var pn_toolbar=y_html([{element:'div',class:cl_pn_toolbar,content:y_html([this.toolbarSeparator()])}]);
	var pn_menu=y_html([{element:'div',class:cl_pn_menu}]);
	var use_month=false;
	var use_image=false;
	var html='';
	var html_col=[];
	for(var j=0;j<col;j++){html_col[j]='';}
	var p;
	var class_input;
	var yObjContent=[];
	for(var i in param){
		var use_datetime=false;
		var use_date=false;
		var use_time=false;
		var use_simple_time=false;
		var use_simple_month=false;
		var use_location=false;
		var use_trip=false;
		var use_placeholder=false;
		var span_class='';
		var width_span=dim.module.main.width;
		p=param[i];
		var placeholder=typeof p.placeholder!=='undefined'?p.placeholder:false;
		var thousandSeparator=typeof p.thousandSeparator!=='undefined'?p.thousandSeparator:false;
		var parent_data=typeof p.location_parent_id!=='undefined'?p.location_parent_id:1;
		var type_data=typeof p.location_type_id!=='undefined'?p.location_type_id:0;
		var trip_data=typeof p.trip_id!=='undefined'?p.trip_id:0;
		span_col=typeof p.col!=='undefined'?p.col-1:0;
		// Define class_input
		class_input=cl_input;
		if(typeof p.type!=='undefined'){
			switch(p.type){
				case 'date':
					class_input=cl_date;
					use_date=true;
					break;
				case 'datetime':
					class_input=cl_datetime;
					use_datetime=true;
					break;
				case 'time':
					class_input=cl_time;
					use_time=true;
					break;
				case 'simple_time':
					class_input=cl_simple_time;
					use_simple_time=true;
					break;
				case 'simple_month':
					class_input=cl_simple_month;
					use_simple_month=true;
					break;
				case 'month':
					class_input=cl_month;
					use_month=true;
					break;
				case 'image':
					class_input=cl_image;
					use_image=true;
					break;
				case 'location':
					class_input=cl_location;
					use_location=true;
					break;
				case 'trip':
					class_input=cl_trip;
					use_trip=true;
					break;
				case 'date_ddmmyyyy':
					class_input=cl_date_ddmmyyyy;
					use_placeholder=true;
					placeholder='dd/mm/yyyy';
			}
		}
		class_input=typeof p.input_width!=='undefined'?class_input+' width_'+p.input_width:class_input;
		class_input=typeof p.width!=='undefined'?class_input+' width_'+p.width:class_input;
		if(thousandSeparator){
			class_input+=' '+cl_thousandSeparator;
		}

		var labelWidth=typeof p.label_width!=='undefined'?p.label_width:200;
		if(typeof p.span!=='undefined'){
			var span_width=width_span;
			var span=Math.floor(span_width/p.span);
			span=span<10?10:span;
			span_class=cl_span+' width_'+span;
		}
		else{
			span_class=cl_span;
		}
		// Multiparam
		if(p.multiparam===true || p.multiparam==='yes'){
			var start=p.name+'_start';
			var end=p.name+'_end';
			// Create input object
			yObjContent=[
				this.object_space(),
				this.object_label(p.label+':',labelWidth),
				{element:'input',type:'text',id:start,name:start,class:class_input},
			];
			if(placeholder){
				yObjContent=[
					this.object_space(),
					this.object_label(p.label+':',labelWidth),
					{element:'input',type:'text',placeholder:placeholder,id:start,name:start,class:class_input},
				];
			}
			if(use_location){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerLocation buttonLocationPicker ',
					data:parent_data,
					cols:type_data,
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_trip){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerTrip buttonTripPicker ',
					data:trip_data,
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_datetime){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerDatetime buttonDatetimePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_date){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerDate buttonDatePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_time){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerTime buttonTimePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_simple_time){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerSimpleTime buttonSimpleTimePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_simple_month){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerSimpleMonth buttonSimpleMonthPicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			yObjContent.push(this.object_space());
			yObjContent.push(this.object_label('to',36));
			if(placeholder)
			{
				yObjContent.push({element:'input',type:'text',placeholder:placeholder,id:end,name:end,class:class_input});
			}
			else{
				yObjContent.push({element:'input',type:'text',id:end,name:end,class:class_input});
			}
			if(use_location){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerLocation buttonLocationPicker ',
					data:parent_data,
					cols:type_data,
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_trip){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerTrip buttonTripPicker ',
					data:trip_data,
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_datetime){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerDatetime buttonDatetimePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_date){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerDate buttonDatePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_time){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerTime buttonTimePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_simple_time){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerSimpleTime buttonSimpleTimePicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			if(use_simple_month){
				yObjButton={
					element:'div',
					class:stdBtnClass+' _yIconPickerSimpleMonth buttonSimpleMonthPicker ',
					content:''
				};
				yObjContent.push(yObjButton);
			}
			yObjContent.push({element:'div',class:'y_multi_select_show_filter filter_button_26',row:p.name,col:p.ac,data:start,label:p.label,id:'filter_button_'+p.name});
			html_col[span_col]+=y_html([{element:'div',class:span_class,content:y_html(yObjContent)}]);
		}
		// Single Param
		else{
			var label_info_content='';
			if(typeof p.label_info!=='undefined'&& (p.label_info===true||p.label_info==='yes')){
				label_info_content=typeof p.content!=='undefined'?p.content:'';
				html_col[span_col]+=y_html([
					{element:'div',class:span_class,content:y_html([
						this.object_space(),
						this.object_label(p.label+':',labelWidth),
						{element:'div',id:'label_info_'+p.name,class:'label_form label_info',content:label_info_content}
					])}
				]);
			}
			else if(typeof p.label_only!=='undefined'&& (p.label_only===true||p.label_only==='yes')){
				labelWidth=typeof p.width!=='undefined'?p.width:800;
				html_col[span_col]+=y_html([
					{element:'div',class:span_class,content:y_html([
						this.object_space(),
						this.object_label(p.label,labelWidth)
					])}
				]);
			}
			else if(typeof p.combobox!=='undefined'&& (p.combobox===true||p.combobox==='yes')){
				var optionHtml = '';
				if(typeof(p.option)!=='undefined' && typeof(p.option)==='object'){
					if(p.option.length > 0){
						for(var indexOption in p.option){
							optionHtml+=y_html([{element:'option', value: p.option[indexOption], content:p.option[indexOption]}]);
						}
					}else{
						optionHtml += y_html([{element:'option', value: p.option, content:p.option}]);
					}
				}
				html_col[span_col]+=y_html([
					{element:'div',class:span_class,content:y_html([
						this.object_space(),
						this.object_label(p.label+':',labelWidth),
						{element:'select',id:'combobox_'+p.name,class:'combobox_form combobox_info',content:optionHtml}
					])}
				]);
			}
			else{
				if(typeof p.span!=='undefined'){
					// Single Param with Span
					label_info_content=typeof p.span_content!=='undefined'?p.span_content:'';
					var main_input = {element:'input',type:'text',id:'input_'+p.name,name:p.name,class:class_input};
					if(placeholder)
					{
						main_input = {element:'input',type:'text',placeholder:placeholder,id:'input_'+p.name,name:p.name,class:class_input};
					}
					html_col[span_col]+=y_html([
						{element:'div',class:span_class,content:y_html([
							this.object_space(),
							this.object_label(p.label+':',labelWidth),
							main_input,
							this.object_space(),
							{element:'div',id:'label_info_'+p.span,class:'label_form label_info',content:label_info_content}
						])}
					]);
				}
				else{
					// Gidden Input
					if(typeof p.hidden!=='undefined'&&p.hidden===true){
						html_col[span_col]+=y_html([
							{element:'input',type:'hidden',id:'input_'+p.name,name:p.name,class:class_input}
						]);
					}
					else{
						// Singgle Param without Span
						yObjContent = [
							this.object_space(),
							this.object_label(p.label+':',labelWidth),
							{element:'input',type:'text',id:'input_'+p.name,name:p.name,class:class_input}
						];
						if(placeholder)
						{
							yObjContent = [
								this.object_space(),
								this.object_label(p.label+':',labelWidth),
								{element:'input',type:'text',placeholder:placeholder,id:'input_'+p.name,name:p.name,class:class_input}
							];
						}
						if(use_location){
							yObjButton={
								element:'div',
								class:stdBtnClass+'_yIconPickerLocation buttonLocationPicker ',
								data:parent_data,
								cols:type_data,
								content:''
							};
							yObjContent.push(yObjButton);
						}
						if(use_trip){
							yObjButton={
								element:'div',
								class:stdBtnClass+'_yIconPickerTrip buttonTripPicker ',
								data:trip_data,
								content:''
							};
							yObjContent.push(yObjButton);
						}
						if(use_datetime){
							yObjButton={
								element:'div',
								class:stdBtnClass+'_yIconPickerDatetime buttonDatetimePicker ',
								content:''
							};
							yObjContent.push(yObjButton);
						}
						if(use_date){
							yObjButton={
								element:'div',
								class:stdBtnClass+'_yIconPickerDate buttonDatePicker ',
								content:''
							};
							yObjContent.push(yObjButton);
						}
						if(use_time){
							yObjButton={
								element:'div',
								class:stdBtnClass+'_yIconPickerTime buttonTimePicker ',
								content:''
							};
							yObjContent.push(yObjButton);
						}
						if(use_simple_time){
							yObjButton={
								element:'div',
								class:stdBtnClass+'_yIconPickerSimpleTime buttonSimpleTimePicker ',
								content:''
							};
							yObjContent.push(yObjButton);
						}
						if(use_simple_month){
							yObjButton={
								element:'div',
								class:stdBtnClass+'_yIconPickerSimpleMonth buttonSimpleMonthPicker ',
								content:''
							};
							yObjContent.push(yObjButton);
						}
						html_col[span_col]+=y_html([{element:'div',class:span_class,content:y_html(yObjContent)}]);
					}
				}
			}
		}
	}
	var obj=[];
	for(i=0;i<col;i++){obj[i]={element:'div',class:cl_pn_main_span,content:html_col[i]};}
	var pn_main=y_html([{element:'div',class:cl_pn_main,content:y_html(obj)}]);
	$(this.master).append(pn_toolbar+pn_menu+pn_main);
	var width_percent=100/col;
	$('.'+cl_pn_main_span).css('width',width_percent+'%');
	for(i=0;i<param.length;i++){
		p=param[i];
		class_input=cl_input;
		switch(p.type){
			case 'date':
				class_input=cl_date;
				break;
			case 'datetime':
				class_input=cl_datetime;
				break;
			case 'time':
				class_input=cl_time;
				break;
			case 'simple_time':
				class_input=cl_simple_time;
				break;
			case 'simple_month':
				class_input=cl_simple_month;
				break;
			case 'month':
				class_input=cl_month;
				use_month=true;
				break;
			case 'image':
				class_input=cl_image;
				use_image=true;
				break;
			case 'location':
				class_input=cl_location;
				break;
			case 'trip':
				class_input=cl_trip;
				break;
			case 'date_ddmmyyyy':
				class_input=cl_date_ddmmyyyy;
		}
		if(typeof p.ac!=='undefined'){
			var idStart='#'+p.name+'_start';
			var idEnd='#'+p.name+'_end';
			var limit=typeof p.ac_limit!=='undefined'?p.ac_limit:3;
			this.command_ac(idStart,p.ac,limit);
			this.command_ac(idEnd,p.ac,limit);
		}
	}
	$(this.master).on('click','.y_multi_select_show_filter',function(){
		var name=$(this).attr('row');
		var ac=$(this).attr('col');
		var input_selector=$(this).attr('data');
		var label=$(this).attr('label');
		var box=document.getElementById('y_multi_select_box_'+name);
		if(box===null){that.create_multi_select(name,label,ac,input_selector);}
		else{box.style.display='block';}
		$('#y_multi_select_box_'+name+'_panel').css('opacity',0);
		$('#y_multi_select_box_'+name+'_panel').animate({opacity:'1'},300);
	});
	if(use_month){use_input_month();}
	this.on_resize();
};
panel.prototype.html_multi_select_input=function(type,name,row,ac,last){
	var yms='y_multi_select_';
	var cl_input='input_multi_select textarea_single input_master_text';
	var row_label={element:'div',class:yms+'highlight_text',content:(parseInt(row)+1)};
	var search_button={element:'div',class:yms+'single_search search_button_26 search_button_'+name,row:ac};
	var class_cell=cl_input+' input_'+yms+'box_'+name;
	if(typeof last!='undefined' && last===true){
		class_cell+=' last_input';
	}
	var text=y_html([
		{element:'div',class:yms+'text_row',content:y_html([
			row_label,
			{element:'textarea',rows:1,type:'text',row:row,id:name+'_'+row,name:name+'['+row+']',class:class_cell+' '+type+'_input_'+yms+'box_'+name},
			search_button
		])}
	]);
	return text;
};
panel.prototype.add_multi_select_input=function(wrapper,type,name,row,ac,last){
	var html=this.html_multi_select_input(type,name,row,ac,last);
	$(wrapper).append(html);
};
panel.prototype.create_multi_select=function(name,label,ac,input_selector){
	var text_select='';
	var that=this;
	var text_exclude='';
	var yms='y_multi_select_';
	var id=yms+'box_'+name;
	var input_position;
	var select=true;
	var exclude=false;
	var cl_input='input_multi_select input_text input_master_text';
	for(var j=0;j<10;j++){
		var last=false;
		if(j==9){
			last=true;
		}
		text_select+=this.html_multi_select_input('select','select_'+name,j,ac,last);
		text_exclude+=this.html_multi_select_input('exclude','exclude_'+name,j,ac,last);
	}
	var h=y_html([
		{element:'div',class:'y_transparent_outer',id:id,content:y_html([
			{element:'div',class:'y_multi_select',id:id+'_panel',content:y_html([
				{element:'div',class:'panel_title',content:label},
				{element:'div',class:yms+'toolbar_row',content:y_html([
					this.object_space(),
					this.object_button('select','select',id),
					this.object_button('clear','clear',id),
				])},
				{element:'div',class:yms+'option_row',content:y_html([
					{element:'div',id:yms+'button_select'+id,class:yms+'button_select '+yms+'option_button_selected',content:'Select Single Values'},
					{element:'div',id:yms+'button_exclude'+id,class:yms+'button_exclude '+yms+'option_button',content:'Exclude Single Values'}
				])},
				{element:'div',id:'y_select_panel_'+id,class:yms+'panel '+yms+'panel_select',content:text_select},
				{element:'div',id:'y_exclude_panel_'+id,class:yms+'panel '+yms+'panel_exclude',content:text_exclude}
			])}
		])}
	]);
	$(this.master).append(h);
	$('#y_select_panel_'+id).off('focusin','.last_input');
	$('#y_select_panel_'+id).on('focusin','.last_input',function(){
		$(this).removeClass('last_input');
		var row=$(this).attr('row');
		var new_row=parseInt(row)+1;
		var type='select';
		that.add_multi_select_input('#y_'+type+'_panel_'+id,type,name,new_row,ac,true);
	});
	$('#y_exclude_panel_'+id).off('focusin','.last_input');
	$('#y_exclude_panel_'+id).on('focusin','.last_input',function(){
		$(this).removeClass('last_input');
		var row=$(this).attr('row');
		var new_row=parseInt(row)+1;
		var type='exclude';
		that.add_multi_select_input('#y_'+type+'_panel_'+id,type,name,new_row,ac,true);
	});
	$('#y_exclude_panel_'+id).hide();
	this.assign_hide($('#'+id),$('#'+id));
	var ms=$('#'+id);
	input_position=ms.find('input[type=text]').filter(':visible:first').attr('id');
	var p_select=$('#y_select_panel_'+id);
	var p_exclude=$('#y_exclude_panel_'+id);
	this.command(ms,'.'+yms+'single_search',function(object){
		var input_object=$(object).siblings('.input_master_text');
		var selected_data=that.show_table_selection(ac,input_object);
	});
	var cl_ob=yms+'option_button';
	var cl_obs=yms+'option_button_selected';
	this.command(ms,'.'+yms+'button_exclude',function(){
		select=false;
		exclude=true;
		$('.select_input_'+id).val('');
		$('#'+input_selector).val('');
		p_select.hide();
		$('#'+yms+'button_select'+id).removeClass(cl_obs).addClass(cl_ob);
		p_exclude.show();
		$('#'+yms+'button_exclude'+id).removeClass(cl_ob).addClass(cl_obs);
	});
	this.command(ms,'.'+yms+'button_select',function(){
		select=true;
		exclude=false;
		$('.exclude_input_'+id).val('');
		$('#'+input_selector).val('');
		p_select.show();
		$('#'+yms+'button_select'+id).removeClass(cl_ob).addClass(cl_obs);
		p_exclude.hide();
		$('#'+yms+'button_exclude'+id).removeClass(cl_obs).addClass(cl_ob);
	});
	this.command(ms,'#button_select_'+id,function(){
		if(select===true){$('#'+input_selector).val('selected list');}
		else{$('#'+input_selector).val('excluded list');}
		$('#'+id).hide();
	});
	this.command(ms,'#button_clear_'+id,function(){
		$('#'+input_selector).val('');
		ms.find('textarea[type=text]').val('');
	});
	ms.off('paste','.textarea_single');
	ms.on('paste','.textarea_single',function(){
		that.handle_paste(this,name,ac);
	});
	ms.off('focusin','.input_master_text');
	ms.on('focusin','.input_master_text',function(){
		var this_id=$(this).attr('id');
		$('#button_paste_'+yms+'box_'+name).attr('row',this_id);
	});
};
panel.prototype.handle_paste=function(obj,name,ac){
	obj=$(obj);
	var fw=this;
	setTimeout(function(){
		var name=obj.attr('name');
		var name_array=name.split('[');
		var input_name=name_array[0];
		var start_index=parseInt(name_array[1].replace(']',''));
		var parent=obj.parent().parent();
		var pid='#'+$(parent).attr('id');
		var i;
		var last_row=parseInt($(parent).find('.last_input').attr('row'));
		if(!isNaN(start_index)){
			var paste_value='';
			var rows='';
			paste_value=obj.val();
			paste_value=paste_value.replace(/[\s\r\n]+$/,'');
			rows=paste_value.split('\n');
			var no_of_rows=rows.length;
			obj.val('');
			if(no_of_rows>((last_row-start_index)+1)){
				var required=no_of_rows-((last_row-start_index)+1);
				var new_last_index=(last_row+required);
				for(i=last_row;i<new_last_index;i++){
					var type='select';
					fw.add_multi_select_input(pid,type,input_name,(parseInt(i)+1),ac,false);
				}
				$('#'+input_name+'_'+last_row).removeClass('last_input');
				$('#'+input_name+'_'+new_last_index).addClass('last_input');
			}
			var this_name;
			for (i=0;i<no_of_rows;i++){
				var this_index=parseInt(start_index)+i;
				this_name=input_name+'['+this_index+']';
				var is_last=$('textarea[name="'+this_name+'"]').attr('col');
				$('textarea[name="'+this_name+'"]').val(rows[i]);
			}
			$('textarea[name="'+this_name+'"]').focus();
		}
	},0);
};
panel.prototype.assign_hide=function(wrapper,object){
	this.command(wrapper,'.panel_title',function(){object.hide();});
};
panel.prototype.write_table_selection_data=function(data){
	var yms='y_multi_select_';
	var row=0;
	var data_rows='';
	for(var i in data){
		if(data[i].data!==null){
			data_rows+=y_html([
				{element:'div',class:yms+'table_data_row',content:y_html([
					{element:'div',class:yms+'highlight_text',content:(row+1)},
					{element:'div',class:yms+'cell_data',content:data[i].data},
					{element:'input',type:'checkbox',class:yms+'table_checkbox'}
				])}
			]);
			row++;
		}
	}
	$('.'+yms+'table_data').html(data_rows);
};
panel.prototype.show_table_selection=function(ac_url,input_object){
	var that=this;

	var callback=function(data){
		var yms='y_multi_select_';
		var row=0;
		id=yms+'table_id_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*100)+1);
		var h=y_html([
			{element:'div',class:'y_transparent_outer',id:id,content:y_html([
				{element:'div',class:yms+'table',content:y_html([
					{element:'div',class:'panel_title',content:'select'},
					{element:'div',class:yms+'toolbar_row',content:y_html([
						that.object_space(),
						that.object_button('select','select','checked'),
						that.object_button('filter','filter','checked')
					])},
					{element:'div',class:yms+'filter_row',content:y_html([
						{element:'div',class:yms+'highlight_text',content:y_html([
							that.object_button('filter','filter','','no label')
						])},
						{element:'input',type:'text',class:'input_multi_select input_multi_select_param_filter input_text width_200'},
						{element:'input',type:'checkbox',class:yms+'table_checkbox_header'}
					])},
					{element:'div',class:yms+'table_data'}
				])}
			])}
		]);
		$(that.master).append(h);
		that.write_table_selection_data(data);
		$('#'+id).off('click','.y_multi_select_cell_data');
		$('#'+id).on('click','.y_multi_select_cell_data',function(){
			var data=$(this).text();
			input_object.val(data);
			$('#'+id).remove();
		});
		$('#'+id).off('click','#button_select_checked');
		$('#'+id).on('click','#button_select_checked',function(){
			var i=0;
			var data_select=[];
			$('.y_multi_select_table_checkbox').each(function(){
				var state=$(this).prop('checked');
				if(state===true){
					data_select[i]=$(this).siblings('.y_multi_select_cell_data').text();
					i++;
				}
			});
			var next=input_object;
			for(var j in data_select){
				next.val(data_select[j]);
				parent=next.parent();
				next_parent=parent.next('.y_multi_select_text_row');
				next=next_parent.children('.input_text');
			}
			$('#'+id).remove();
		});
		that.assign_hide($('#'+id),$('#'+id));
		$('#'+id).off('change','.y_multi_select_table_checkbox_header');
		$('#'+id).on('change','.y_multi_select_table_checkbox_header',function(){
			var state=$(this).prop('checked');
			$('#'+id).find('.y_multi_select_table_checkbox').each(function(){
				$(this).click();
				var chils_state=$(this).prop('checked');
				if (chils_state!=state){
					$(this).click();
				}
			});
		});
		$('#'+id).off('click','#button_filter_checked');
		$('#'+id).on('click','#button_filter_checked',function(){
			var filter_param=$('.input_multi_select_param_filter').val();
			var callback=function(this_data){
				that.write_table_selection_data(this_data);
			};
			getAjax(ac_url+'?term='+filter_param+'&limit=0','',callback);

		});
	};
	getAjax(ac_url,'',callback);
};
panel.prototype.command_ac=function(id,url,min_length,limit,offset){
	var object=$(id);
	if(typeof(min_length)==='undefined'){min_length=3;}
	if(typeof(limit)==='undefined'){limit=8;}
	if(typeof(offset)==='undefined'){offset=0;}
	var config={
		source:url+'?limit='+limit+'&offset='+offset,
		select:function(event,ui){
			object.val(ui.item.value);
		},
		minLength:min_length
	};
	object.autocomplete(config);
};
panel.prototype.redimension_panel=function(m,d,h){
	var pm=$('.panel_y_master');
	var pmd=$('.panel_y_master_data');
	var pmm=$('.panel_master_main');
	var th=26; // title height
	var md=m-th; //master
	var md_main=md-42;
	pm.css('height',m);
	pmd.css('height',md);
	pmm.css('height',md_main);
	if(typeof d!=='undefined'){
		var pd=$('.panel_y_detail');
		if(typeof pd[0]!=='undefined'){
			var pdt=$('.panel_y_detail_table');
			var pdtd=$('.panel_y_detail_table_data');
			var vsd=$('.panel_y_detail_table_vertical_scroll');
			var dt=d-th; // detail title
			var dtd=dt>th?dt-th-14:0;
			pd.css('height',d);
			pdt.css('height',dt);
			pdtd.css('height',dtd);
			vsd.css('height',dtd);
			this.reposition_vertical_scroll(pd,vsd);
		}
		var ph=$('.panel_y_history');
		if(typeof ph[0]!=='undefined'){
			var pht=$('.panel_y_history_table');
			var phtd=$('.panel_y_history_table_data');
			var vsh=$('.panel_y_history_table_vertical_scroll');
			var ht=h!=='undefined'?h-th:0;
			var htd=ht>th?ht-th-14:0;
			ph.css('height',h);
			pht.css('height',ht);
			phtd.css('height',htd);
			vsh.css('height',htd);
			this.reposition_vertical_scroll(ph,vsh);
		}
	}
};
panel.prototype.reposition_vertical_scroll=function(pn,vs){
	var p=pn.position();
	var w=pn.width();
	var left=parseInt(p.left)+parseInt(w)-16;
	var top=parseInt(p.top)+26+26;
	vs.css('top',top);
	vs.css('left',left);
};
panel.prototype.update_vertical_scroll=function(){
	var pdtd=$('.panel_y_detail_table_data');
	var phtd=$('.panel_y_history_table_data');
	var sh;
	if(typeof pdtd[0]!='undefined'){
		var pd=$('.panel_y_detail');
		var vsd=$('.panel_y_detail_table_vertical_scroll');
		var vsdi=$('.panel_y_detail_table_vertical_scroll_inside');
		sh=pdtd[0].scrollHeight;
		vsdi.css('height',sh);
		this.reposition_vertical_scroll(pd,vsd);
	}
	if(typeof phtd[0]!='undefined'){
		var ph=$('.panel_y_history');
		var vsh=$('.panel_y_history_table_vertical_scroll');
		var vshi=$('.panel_y_history_table_vertical_scroll_inside');
		sh=phtd[0].scrollHeight;
		vshi.css('height',sh);
		this.reposition_vertical_scroll(ph,vsh);
	}
};

panel.prototype.write_separator=function(row,func,data){
	if(func=='m'){func='master';}
	else if(func=='d'){func='detail';}
	else if(func=='h'){func='history';}
	var selector=func;
	var child_text='';
	var cl_span='panel_input_row_with_sidebar panel_input_row_separator_'+func;
	var total_width=0;
	for(var i in this.object.field[func]){
		var item=this.object.field[func][i];
		total_width+=item.width+6;
	}
	total_width+=14;
	var content = typeof data.label!== 'undefined'?data.label:' ';
	child_text=y_html([{
		element:'div',
		class:'y_panel_row_separator',
		content:content
	}]);
	var html_text=y_html([{element:'div',row:row,class:cl_span,content:child_text}]);
	$(this.object[selector]).append(html_text);
	this.update_vertical_scroll();
};
panel.prototype.create_split_bar=function(wrapper,type){
	var start_pos;
	var splitter;
	var prev_panel;
	var next_panel;
	var that=this;
	wrapper.off('mousedown','.panel_splitter_horizontal');
	wrapper.on('mousedown','.panel_splitter_horizontal',function(event){
		splitter=this;
		prev_panel=$(this).prev();
		next_panel=$(this).next();
		start_pos=event.clientY;
		wrapper.bind("mousemove", start_split);
		wrapper.bind("mouseup", end_split);
		wrapper.css("-webkit-user-select", "none");
		document.onselectstart=function(){return false;};
	});
	function start_split(event){
		var new_y=event.clientY;
		var move=start_pos-new_y;
		start_pos=event.clientY;
		resize_panel(move);
	}
	function end_split(event){
		wrapper.unbind("mousemove", start_split);
		wrapper.unbind("mouseup", end_split);
		wrapper.css("-webkit-user-select", "text");
		document.body.style.cursor='default';
		document.onselectstart=function(){return true;};
	}
	function resize_panel(value){
		var master_height=prev_panel.height();
		var detail_height=next_panel.height();
		var new_master_height=master_height-value;
		var new_detail_height=detail_height+value;
		var abort=false;
		if(new_master_height<26||new_detail_height<26){
			abort=true;
		}
		if(!abort){
			var prev_class=prev_panel.attr('class');
			prev_panel.css('height',new_master_height);
			next_panel.css('height',new_detail_height);
			var m, d, h;
			switch(type){
				case 'mdh':
					m=$('.panel_y_master').height();
					d=$('.panel_y_detail').height();
					h=$('.panel_y_history').height();
					that.redimension_panel(m,d,h);
					break;
				case 'md':
					m=$('.panel_y_master').height();
					d=$('.panel_y_detail').height();
					that.redimension_panel(m,d);
					break;
			}
		}
		document.body.style.cursor='ns-resize';
	}
};
panel.prototype.write_m=function(param){
	var selector=param.active_form;
	var ml=param.panel_master_label;
	this.master='.panel_y_master_data';
	var h=y_html([
		this.panel_object('master',ml,'no table')
	]);
	$(selector).append(h);
	this.write_submit_panel(selector);
	this.y_m();
};
panel.prototype.write_md=function(param){
	var selector=param.active_form;
	var ml=param.panel_master_label;
	var dl=param.panel_detail_label;
	this.master='.panel_y_master_data';
	this.detail_header='.panel_y_detail_table_header';
	this.detail='.panel_y_detail_table_data';
	var h=y_html([
		this.panel_object('master',ml,'no table'),
		this.splitter_object('h'),
		this.panel_object('detail',dl)
	]);
	$(selector).append(h);
	this.write_submit_panel(selector);
	this.y_md(param.wrapper);
};
panel.prototype.write_mdh=function(param){
	var selector=param.active_form;
	var ml=param.panel_master_label;
	var dl=param.panel_detail_label;
	var hl=param.panel_history_label;
	this.master='.panel_y_master_data';
	this.detail_header='.panel_y_detail_table_header';
	this.detail='.panel_y_detail_table_data';
	this.history_header='.panel_y_history_table_header';
	this.history='.panel_y_history_table_data';
	var h=y_html([
		this.panel_object('master',ml,'no table'),
		this.splitter_object('h'),
		this.panel_object('detail',dl),
		this.splitter_object('h'),
		this.panel_object('history',hl)
	]);
	$(selector).append(h);
	this.write_submit_panel(selector);
	this.y_mdh(param.wrapper);
};
panel.prototype.y_m=function(){
	var _height=dim.module.main.height-34;
	this.redimension_panel(_height);
};
panel.prototype.y_md=function(wrapper){
	var mh=this.default_mh;
	var dh=this.default_dh;
	var th=this.default_th;
	var _height=dim.module.main.height-34;
	var xh=_height-this.default_th;
	var that=this;
	this.redimension_panel(this.default_mh,this.default_dh);
	table=$('.panel_y_detail_table');
	this.create_split_bar(wrapper,'md');
	y_bar_split_col(table);
	wrapper.off('click','.panel_title_master');
	wrapper.on('click','.panel_title_master',function(event){
		event=event||window.event;
		//y_playClick(event);
		var height=$('.panel_y_master').height();
		if(height==that.default_mh){that.redimension_panel(xh,th);}
		else{that.redimension_panel(that.default_mh,that.default_dh);}
	});
	wrapper.off('click','.panel_title_detail');
	wrapper.on('click','.panel_title_detail',function(event){
		event=event||window.event;
		//y_playClick(event);
		var height=$('.panel_y_detail').height();
		if(height==that.default_dh){that.redimension_panel(th,xh);}
		else{that.redimension_panel(that.default_mh,that.default_dh);}
	});
};
panel.prototype.y_mdh=function(wrapper){
	var master_title='.panel_title_master';
	var detail_title='.panel_title_detail';
	var history_title='.panel_title_history';
	var mh=this.default_mh;
	var dh=this.default_dh;
	var hh=this.default_hh;
	var th=this.default_th;
	var _height=dim.module.main.height-34;
	var xh=_height-(2*th);
	var that=this;
	this.redimension_panel(mh,dh,hh);
	this.create_split_bar(wrapper,'mdh');
	wrapper.off('click',master_title);
	wrapper.on('click',master_title,function(event){
		event=event||window.event;
		var height=$('.panel_y_master').height();
		if(height==mh){that.redimension_panel(xh,th,th);}
		else{that.redimension_panel(mh,dh,hh);}
	});
	wrapper.off('click',detail_title);
	wrapper.on('click',detail_title,function(event){
		event=event||window.event;
		var height=$('.panel_y_detail').height();
		if(height==dh){that.redimension_panel(th,xh,th);}
		else{that.redimension_panel(mh,dh,hh);}
	});
	wrapper.off('click',history_title);
	wrapper.on('click',history_title,function(event){
		event=event||window.event;
		var height=$('.panel_y_history').height();
		if(height==hh){that.redimension_panel(th,th,xh);}
		else{that.redimension_panel(mh,dh,hh);}
	});
};
panel.prototype.splitter_object=function(type){
	var t;
	if(type=='h'){t='horizontal';}
	if(type=='v'){t='vertical';}
	var object={element:'div',class:'panel_splitter_'+t};
	return object;
};
panel.prototype.panel_object=function(type,content,option){
	var p='_yFL panel_y_';
	var tbl='_table';
	var hdr='_header';
	var dta='_data';
	var vs='_vertical_scroll';
	var ins='_inside';
	var child_title={element:'div',class:'panel_title panel_title_'+type,content:content};
	var child_content;
	if(typeof option!='undefined'){if(option=='no table'){child_content={element:'div',class:p+type+dta};}}
	else{
		child_content={element:'div',class:p+type+tbl,content:y_html([
			{element:'div',class:p+type+tbl+hdr},
			{element:'div',class:p+type+tbl+dta},
			{element:'div',class:p+type+tbl+vs,content:y_html([
				{element:'div',class:p+type+tbl+vs+ins}
			])}
		])};
	}
	var child=y_html([child_title,child_content]);
	var object={element:'div',class:p+type,content:child};
	return object;
};
panel.prototype.write_submit_panel=function(selector){
	var p=[
		{element:'div', class:'panel_record_info'},
		{element:'input',type:'submit',class:'button_submit _yFR',value:'Submit'}
	];
	var h=y_html([{element:'div',class:'panel_submit',content:y_html(p)}]);
	$(selector).append(h);
};
panel.prototype.helper_get_field=function(object){
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
panel.prototype.write_header=function(func){
	var selector=func+'_header';
	$(this.object[selector]).html('');

	var html_text='';
	var total_width=0;
	var label_button;
	for(var i in this.object.field[func]){
		var cl_header='label_header label_header_sortable label_header_'+func+' ';
		var item=this.object.field[func][i];
		var width=item.width;
		if(typeof item.type!=='undefined'){
			switch(item.type){
				case 'location':
					width+=26;
					cl_header+=' label_header_type_location ';
					break;
				case 'trip':
					width+=26;
					cl_header+=' label_header_type_trip ';
					break;
				case 'datetime':
					width+=26;
					cl_header+=' label_header_type_datetime ';
					break;
				case 'date':
					width+=26;
					cl_header+=' label_header_type_date ';
					break;
				case 'time':
					width+=26;
					cl_header+=' label_header_type_time ';
					break;
				case 'simple_time':
					width+=26;
					cl_header+=' label_header_type_simple_time ';
					break;
				case 'simple_month':
					width+=26;
					cl_header+=' label_header_type_simple_month ';
					break;
			}
		}
		var cl_class_name=cl_header+'label_header_'+func+'_'+item.name;
		var cl_class=cl_class_name+' width_'+width;
		if(typeof item.multicolumn!=='undefined' && (item.multicolumn===true||item.multicolumn==='yes') ){
			var object_i=typeof this.object.data[func][0][item.name]!=='undefined'?this.object.data[func][0][item.name]:false;
			var field_name=object_i?this.helper_get_field(object_i):false;
			var no_of_column=typeof field_name!=='undefined'&&field_name!==false?field_name.length:0;
			for(var j=0;j<no_of_column;j++){
				total_width+=width+6;
				html_text+=y_html([{
					element:'div',
					col:field_name,
					class:cl_class,
					content:field_name[j]
				}]);
			}
		}
		else if(this.isParam(item,'input')){
			if(typeof item.checkbox!=='undefined' &&(item.checkbox===true||item.checkbox==='yes') ){
				total_width+=22;
				html_text+=y_html([{
					element:'input',
					type:'checkbox',
					class:'input_tick input_tick_header_'+item.name
				}]);
			}
			if(typeof item.edit!=='undefined'){
				total_width+=width+6;
				html_text+=y_html([{
					element:'div',
					col:item.name,
					class:cl_class,
					content:item.label
				}]);
			}
		}
		else if(this.isParam(item,'textarea')){
			if(this.isParam(item,'checkbox')){
				total_width+=22;
				html_text+=y_html([{
					element:'input',
					type:'checkbox',
					class:'input_tick input_tick_header_'+item.name
				}]);
			}
			if(typeof item.edit!=='undefined'){
				total_width+=width+6;
				html_text+=y_html([{
					element:'div',
					col:item.name,
					class:cl_class,
					content:item.label
				}]);
			}
		}
		else if(typeof item.checkbox_with_hidden_input!=='undefined' && (item.checkbox_with_hidden_input===true||item.checkbox_with_hidden_input==='yes') ){
			html_text+=y_html([{
				element:'input',
				col:item.name,
				type:'checkbox',
				class:'input_tick input_tick_header_'+item.name
			}]);
			total_width+=width+6;
		}
		else if(typeof item.checkbox_input!=='undefined' && (item.checkbox_input===true||item.checkbox_input==='yes') ){
			html_text+=y_html(
				[{
					element:'div',
					col:item.name,
					type:'checkbox',
					class:cl_class_name+' width_20',
					content:item.label
				}]
			);
			total_width+=22;
		}
		else if(typeof item.button_up!=='undefined' && (item.button_up===true||item.button_up==='yes') ){
			item.width=typeof item.width!=='undefined'?item.width:0;
			label_button=typeof item.label!=='undefined'?label_button:'Up';
			cl_class_button=cl_class_name+' width_'+(parseInt(item.width)+20);
			html_text+=y_html([{
				element:'div',
				class:cl_class_button,
				content:label_button
			}]);
			total_width+=item.width+26;

		}
		else if(typeof item.button_down!=='undefined' && (item.button_down===true||item.button_down==='yes') ){
			item.width=typeof item.width!=='undefined'?item.width:0;
			label_button=typeof item.label!=='undefined'?label_button:'Dn';
			cl_class_button=cl_class_name+' width_'+(parseInt(item.width)+20);
			html_text+=y_html([{
				element:'div',
				class:cl_class_button,
				content:label_button
			}]);
			total_width+=item.width+26;
		}
		else if(typeof item.hidden!=='undefined' && (item.hidden===true||item.hidden==='yes') ){
			html_text+='';
		}
		else{
			// General Header
			html_text+=y_html([{
				element:'div',
				col:item.name,
				class:cl_class,
				content:item.label
			}]);
			if(typeof item.checkbox!=='undefined'){
				if(item.checkbox===true||item.checkbox==='yes'){
					total_width+=22;
					html_text+=y_html([{
						element:'input',
						type:'checkbox',
						class:'input_tick input_tick_header_'+item.name
					}]);
				}
			}
			if(typeof item.edit!=='undefined'||item.edit===true){
				if(item.edit===true||item.edit==='yes'){
					total_width+=width+6;
					html_text+=y_html([{
						element:'div',
						col:item.name,
						class:cl_class,
						content:'_/ '+item.label
					}]);
				}
				else{
					total_width+=width+6;
					html_text+=y_html([{
						element:'div',
						col:item.name,
						class:cl_class,
						content:item.label
					}]);
				}
			}
			total_width+=width+6;
		}
	}
	total_width+=14+6;
	$(this.object[selector]).append(html_text);
	if(total_width<=dim.module.main.width){total_width=dim.module.main.width;}
	$(this.object[selector]).width(total_width);
};
panel.prototype.write_table_data=function(func,data){
	var alternate=false;
	if(typeof data!=='undefined'){
		for(var i in data){
			if(typeof data[i].separator!== 'undefined' && data[i].separator === true){
				alternate=false;
				this.write_separator(i,func,data[i]);
			}
			else{
				this.write_table(i,func,data[i],alternate);
				alternate=!alternate;
			}
		}
	}
};
panel.prototype.htmlInputText=function(pclass, pname, value){
	return y_html([{
		element:'input',
		type:'text',
		class:pclass,
		name:pname,
		value:value
	}]);
};
panel.prototype.isParam=function(item, param){
	var result = typeof item[param]!=='undefined' && (item[param]==='yes'||item[param]===true) ? true : false;
	return result;
};
panel.prototype.createCell=function(row, func, item, type, cell){
	var html='';
	var buttonHtml=' ';
	var width=0;
	item=typeof item!=='undefined'?item:false;
	type=typeof type!=='undefined'?type:'input';
	if(item && this.isParam(item, type)){
		var isHidden = this.isParam(item,'hidden');
		var isCheckBox = this.isParam(item, 'checkbox');
		var isEdit = typeof item.edit!=='undefined'?true:false;
		var isEditTrue = this.isParam(item,'edit');
		var isThousandSeparator = this.isParam(item,'thousandSeparator');
		var pclass='input_text input_'+func+'_text '+ type+'_single width_'+item.width+' input_'+item.name;
		var thousandSeparator=typeof(item.thousandSeparator)!=='undefined'?item.thousandSeparator:false;
		if(isThousandSeparator){
			pclass+=' input_with_thousand_separator';
		}
		var pname=item.name+'['+row+']';
		var yObjType={element:type,class:pclass,name:pname,value:cell};
		if(type==='textarea'){
			yObjType.content=cell;
		}
		if(isHidden){
			yObjType.class='cl_key_'+item.name;
			yObjType.type='hidden';
			html+=y_html([yObjType]);
		}
		if(isCheckBox){
			width+=22;
			var yObjCB={
				element:'input',
				type:'checkbox',
				class:'input_tick input_tick_'+item.name,
				name:'tick_'+pname
			};
			if(cell=='true'){
				yObjCB.checked='checked';
			}
			html+=y_html([yObjCB]);
		}
		if(isEdit){
			width+=item.width+6;
			yObjType.type='text';
			if(!isEditTrue){
				yObjType.readonly='readonly';
			}
			if(typeof item.type!=='undefined'){
				switch(item.type){
					case 'location':
						var parent_data=typeof item.location_parent_id!=='undefined' ? item.location_parent_id : 1;
						var type_data=typeof item.location_type_id!=='undefined' ? item.location_type_id : 0;

						yObjType.class+=' input_type_location';
						yObjButton={
							element:'div',
							class:'_yFL _yIconPicker _yIconPickerLocation buttonLocationPicker',
							data:parent_data,
							cols:type_data,
							content:''
						};
						buttonHtml=y_html([yObjButton]);
						width+=26;
						break;
					case 'trip':
						var trip_data=typeof item.trip_id!=='undefined' ? item.trip_id : 0;

						yObjType.class+=' input_type_trip';
						yObjButton={
							element:'div',
							class:'_yFL _yIconPicker _yIconPickerTrip buttonTripPicker',
							data:trip_data,
							content:''
						};
						buttonHtml=y_html([yObjButton]);
						width+=26;
						break;
					case 'date':
						yObjType.class+=' input_type_date';
						yObjButton={
							element:'div',
							class:'_yFL _yIconPicker _yIconPickerDate buttonDatePicker',
							data:parent_data,
							cols:type_data,
							content:''
						};
						buttonHtml=y_html([yObjButton]);
						width+=26;
						break;
					case 'datetime':
						yObjType.class+=' input_type_datetime';
						yObjButton={
							element:'div',
							class:'_yFL _yIconPicker _yIconPickerDatetime buttonDatetimePicker',
							data:parent_data,
							cols:type_data,
							content:''
						};
						buttonHtml=y_html([yObjButton]);
						width+=26;
						break;
					case 'time':
						yObjType.class+=' input_type_time';
						yObjButton={
							element:'div',
							class:'_yFL _yIconPicker _yIconPickerTime buttonTimePicker',
							data:parent_data,
							cols:type_data,
							content:''
						};
						buttonHtml=y_html([yObjButton]);
						width+=26;
						break;
					case 'simple_time':
						yObjType.class+=' input_type_simple_time';
						yObjButton={
							element:'div',
							class:'_yFL _yIconPicker _yIconPickerSimpleTime buttonSimpleTimePicker',
							data:parent_data,
							cols:type_data,
							content:''
						};
						buttonHtml=y_html([yObjButton]);
						width+=26;
						break;
					case 'simple_month':
						yObjType.class+=' input_type_simple_month';
						yObjButton={
							element:'div',
							class:'_yFL _yIconPicker _yIconPickerSimpleMonth buttonSimpleMonthPicker',
							data:parent_data,
							cols:type_data,
							content:''
						};
						buttonHtml=y_html([yObjButton]);
						width+=26;
						break;
				}
			}
			html+=y_html([yObjType]);
		}
	}
	html+=buttonHtml;
	var result={
		html:html,
		width:width
	};
	return result;
};
panel.prototype.write_table=function(row, func, data, alternate, option){
	row=typeof row!=='undefined'?row:0;
	option=typeof option!=='undefined'?option:'';
	alternate=typeof alternate!=='undefined'?alternate:row%2;
	func=typeof func!=='undefined'?func:'d';
	switch(func){
		case 'm': func='master'; break;
		case 'd': func='detail'; break;
		case 'h': func='history'; break;
	}
	var selector=func;
	var alt=alternate?'label_data_alternate ':'label_data ';
	var r_alt=alternate?'label_data_right_alternate ':'label_data_right ';
	var child_text='';
	var cl_span='panel_input_row_with_sidebar panel_input_row_'+func+' panel_input_row_'+func+'_clickable';
	var cl_green = ' _yRowGreen';
	var cl_yellow = ' _yRowYellow';
	var cl_red = ' _yRowRed';
	var cl_blue = ' _yRowBlue';
	var cl_grey= ' _yRowGrey';
	var cl_orange= ' _yRowOrange';
	var total_width=0;
	for(var col in this.object.field[func]){
		var item=this.object.field[func][col];
		item.width=typeof item.width!=='undefined'?item.width:0;
		item.label=typeof item.label!=='undefined'?item.label:'';
		var field_class='width_'+item.width+' '+item.name+' ';
		var cl_class=alt+field_class;
		var cell=typeof data[item.name]!== 'undefined'?data[item.name]:'';
		if(typeof item.format!=='undefined'){
			switch(item.format){
				case 'currency':
					cell=!isNaN(cell) ? y_format_currency(Math.round(cell*100)/100,'Rp') : cell;
					cl_class=r_alt+field_class;
					break;
				case 'currency_no_symbol':
					cell=!isNaN(cell) ? cell=y_format_currency(Math.round(cell*100)/100,'') : cell;
					cl_class=r_alt+field_class;
					break;
				case 'number_with_thousand_separator':
					cell=!isNaN(cell) ? y_format_currency(Math.round(cell*100)/100,'') : cell;
					cl_class=r_alt+field_class;
					break;
				case 'number':
					cell=!isNaN(cell) ? y_format_currency(Math.round(cell*100)/100,'') : cell;
					cl_class=r_alt+field_class;
					break;
				case 'long_date_indonesia':
					cell=y_format_long_date_id(cell);
					cl_class=r_alt+field_class;
					break;
				case 'medium_datetime':
					cell=y_datetime_convert(cell,'datetime_sql_to_medium_datetime');
					break;
			}
		}

		// {input:'yes'} ...
		if(this.isParam(item,'input')){
			thisCell = this.createCell(row, func, item, 'input', cell);
			child_text += thisCell.html;
			total_width+= thisCell.width;
		}
		// {textarea:'yes'} ...
		else if(this.isParam(item,'textarea')){
			thisCell = this.createCell(row, func, item, 'textarea', cell);
			child_text += thisCell.html;
			total_width+= thisCell.width;
		}
		// {checkbox_with_hidden_input:'yes'}
		else if(this.isParam(item,'checkbox_with_hidden_input')){
			child_text+=y_html([
				{element:'input',type:'checkbox',class:'input_tick input_tick_'+item.name,name:'tick_'+item.name+'['+row+']'},
				{element:'input',type:'hidden',class:item.name,name:item.name+'['+row+']',value:cell}
			]);
		}
		// {checkbox_input:'yes'}
		else if(this.isParam(item,'checkbox_input')){
			var checked=false;
			if(cell === 'on'){
				checked = true;
			}
			if(checked){
				child_text+=y_html([
					{element:'input',type:'checkbox',checked:'on',class:'input_tick input_tick_'+item.name+' width_'+item.width,name:item.name+'['+row+']'}
				]);
			}
			else{
				child_text+=y_html([
					{element:'input',type:'checkbox',class:'input_tick input_tick_'+item.name+' width_'+item.width,name:item.name+'['+row+']'}
				]);
			}
			total_width+=26;
		}
		// {button:'yes'}
		else if(this.isParam(item,'button')){
			child_text+=y_html([
				{element:'div',row:row,class:'_yFL _yButtonRow yButtonRow_'+item.name+' width_'+item.width,content:item.label}
			]);
			total_width+=item.width+6;
		}
		// {button_print:'yes'}
		else if(this.isParam(item,'button_print')){
			child_text+=y_html([
				{element:'div',class:'button_print_row_40 '+item.name,content:item.label}
			]);
			total_width+=66;
		}
		// {button_detail:'yes'}
		else if(this.isParam(item,'button_detail')){
			child_text+=y_html([
				{element:'div',class:'button_detail_row_40 '+item.name,content:item.label}
			]);
			total_width+=66;
		}
		// {button_up:'yes'}
		else if(this.isParam(item,'button_up')){
			child_text+=y_html([
				{element:'div',class:'button_up width_'+item.width+' '+item.name,content:item.label}
			]);
			total_width+=item.width+26;
		}
		// {button_down:'yes'}
		else if(this.isParam(item,'button_down')){
			child_text+=y_html([
				{element:'div',class:'button_down width_'+item.width+' '+item.name,content:item.label}
			]);
			total_width+=item.width+26;
		}
		else if(this.isParam(item,'multicolumn')){
			var object_i=typeof this.object.data[func][0][item.name]!=='undefined'?this.object.data[func][0][item.name]:false;
			var field_name=object_i?this.helper_get_field(object_i):false;
			var no_of_column=typeof field_name!=='undefined' && field_name!==false? field_name.length : 0;
			for(var j=0;j<no_of_column;j++){
				cell_j = typeof cell[field_name[j]]!=='undefined'?cell[field_name[j]]:'';
				child_text+=y_html([{element:'div',class:cl_class,content:cell_j}]);
				total_width+=item.width+6;
			}
		}
		// {hidden:'yes'}
		else if(this.isParam(item,'hidden')){
			child_text+=y_html([{
				element:'input',
				type:'hidden',
				class:'input_'+item.name,
				name:item.name+'['+row+']',
				value:cell
			}]);
		}
		else{
			child_text+=y_html([{element:'div',class:cl_class,content:cell}]);
			total_width+=item.width+6;
			// {key:'yes'}
			if(this.isParam(item,'key')){
				child_text+=y_html([{
					element:'input',
					type:'hidden',
					class:'cl_key_'+item.name,
					name:'key_'+item.name+'['+row+']',
					value:cell
				}]);
			}
			// {checkbox:'yes'}
			if(this.isParam(item,'checkbox')){
				child_text+=y_html([{
					element:'input',
					type:'checkbox',
					class:'input_tick input_tick_'+item.name,
					name:'tick_'+item.name+'['+row+']'
				}]);
				total_width+=22;
			}
			// {edit:'yes'}
			if(this.isParam(item,'edit')){
				var pclass='input_text textarea_single width_'+item.width+' input_'+item.name;
				var pname=item.name+'['+row+']';
				child_text+=this.htmlInputText(pclass,pname,'');
				total_width+=item.width+6;
			}
		}
	}
	total_width+=14+6;
	var html_text;
	switch(option){
		case 'draggable':
			html_text=y_html([{element:'div',row:row,draggable:'true',class:cl_span,content:child_text}]);
			break;
		case 'hidden':
			html_text=y_html([{element:'div',row:row,hidden:'true',class:cl_span,content:child_text}]);
			break;
		case 'show':
			html_text=y_html([{element:'div',row:row,class:cl_span,content:child_text}]);
			break;
		case 'green':
			html_text=y_html([{element:'div',row:row,finished:'true',class:cl_span + cl_green,content:child_text}]);
			break;
		case 'yellow':
			html_text=y_html([{element:'div',row:row,finished:'true',class:cl_span + cl_yellow,content:child_text}]);
			break;
		case 'red':
			html_text=y_html([{element:'div',row:row,finished:'true',class:cl_span + cl_red,content:child_text}]);
			break;
		case 'blue':
			html_text=y_html([{element:'div',row:row,finished:'true',class:cl_span + cl_blue,content:child_text}]);
			break;
		case 'grey':
			html_text=y_html([{element:'div',row:row,finished:'true',class:cl_span + cl_grey,content:child_text}]);
			break;
		case 'orange':
			html_text=y_html([{element:'div',row:row,finished:'true',class:cl_span + cl_orange,content:child_text}]);
			break;
		default:
			html_text=y_html([{element:'div',row:row,class:cl_span,content:child_text}]);
			break;
	}
	$(this.object[selector]).append(html_text);
	if(total_width<dim.module.main.width){
		total_width=dim.module.main.width;
	}
	$(this.object[selector]).width(total_width);
	this.update_vertical_scroll();
};
panel.prototype.object_button=function(model,label,id,option,width,type){
	type=typeof type!=='undefined'?type:'rectangle';
	var cl_bt='button_'+type;
	var cl_img=cl_bt+'_image';
	var cl_txt=cl_bt+'_text';
	var img='../images/button/'+model+'.png';
	if(typeof id==='undefined'){
		id=(new Date()).getTime()+'-'+Math.floor((Math.random()*100)+1);
	}
	if(typeof label==='undefined'){
		label=model;
	}
	var object_image={element:'img',class:cl_img,src:img};
	var button;
	var button_content;
	if(typeof option!='undefined'){
		if(option=='no label'){button=object_image;}
		if(option=='no background'){
			if(typeof width=='undefined'){width=200;}
			button_content=y_html([object_image,{element:'div',class:cl_txt,content:label}]);
			button={element:'div',id:'button_'+model+'_'+id,class:'_yFL width_'+width,content:button_content};
		}
	}
	else{
		button_content=y_html([object_image,{element:'div',class:cl_txt,content:label}]);
		button={element:'div',id:'button_'+model+'_'+id,class:cl_bt,content:button_content};
	}
	return button;
};
panel.prototype.object_button_file=function(model,id){
	var button={element:'input',type:'file',style:'display:none',id:'button_file_'+model+'_'+id};
	return button;
};
panel.prototype.object_space=function(width){
	width=typeof width!=='undefined'?width:8;
	var cl_space='label_form width_'+width;
	var space={element:'div',class:cl_space};
	return space;
};
panel.prototype.toolbarSeparator=function(width){
	width=typeof width!=='undefined'?width:4;
	var cl_space='label_form width_'+width;
	var space={element:'div',class:cl_space};
	return space;
};
panel.prototype.object_label=function(content,width){
	if(typeof(width)==='undefined'){width=200;}
	var cl_label='label_form width_'+width;
	var label={element:'div',class:cl_label,content:content};
	return label;
};
panel.prototype.object_input_text=function(name,width){
	if(typeof(width)==='undefined'){width=142;}
	var cl_input='input_text width_'+width;
	var input={element:'input',type:'text',id:name,name:name,class:cl_input};
	return input;
};
function y_sidebar_panel_input_generic(){
	var field=[{id:'button_form_input',label:'Form'}];
	var param={title:'Input',field:field};
	var panel=new Sidebar_Panel(param);
}
function y_bar_split_col(wrapper){
	var start_pos;
	var selector;
	wrapper.off('mousedown','.bar_split_col');
	wrapper.on('mousedown','.bar_split_col',function(event){
		var col=$(this).prev().attr('col');
		selector=$('[col='+col+']');
		start_pos=event.clientX;
		wrapper.bind("mousemove",start_split);
		wrapper.bind("mouseup",end_split);
		wrapper.css("-webkit-user-select","none");
		document.onselectstart = function(){return false;};
	});
	function start_split(event){
		var new_x=event.clientX;
		var move=start_pos-new_x;
		start_pos=new_x;
		resize_panel(move);
	}
	function end_split(event){
		wrapper.unbind("mousemove",start_split);
		wrapper.unbind("mouseup",end_split);
		wrapper.css("-webkit-user-select","text");
		document.body.style.cursor='default';
		document.onselectstart=function(){return true;};
	}
	function resize_panel(value){
		var width=selector.width();
		var newWidth=width-value;
		var abort=false;
		if(newWidth<0){
			abort=true;
		}
		if(!abort){
			selector.css('width',newWidth);
		}
		document.body.style.cursor='e-resize';
	}
}
if(typeof window === 'object' && typeof window.document === 'object'){
	window.y_bar_split_col=y_bar_split_col;
	window.Sidebar_Panel=Sidebar_Panel;
	window.Sidebar_Help_Panel=Sidebar_Help_Panel;
	window.Y_Framework=panel;
	window.y_sidebar_panel_input_generic=y_sidebar_panel_input_generic;

}
})(window);
