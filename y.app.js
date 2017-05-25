// 2016.07.21 Yohan Naftali
// Add scrolldelay tag
(function(window,undefined){
var document=window.document;
var location=window.location;
//------------------------------------------------------------------------------
// y Engine
// Foundation for Application
//------------------------------------------------------------------------------
var y=function(selector){
	this.selector=false;
	this.dummy=false;
	return new y.prototype.init(selector);
};
var _eventHandlers={};
var readyHandle=function(callback){
	if(document.readyState==='complete'){
		callback();
	}
	else{
		var completed=_completed(callback);
		y(document).on('DOMContentLoaded',completed);
		y(window).on('load',completed);
	}
};
var _completed=function(callback){
	y(document).off('DOMContentLoaded',_completed);
	y(window).off('load',_completed );
	callback();
};
var getElement=function(param){
	var result;
	if(typeof param==='string'){
		var type=param.substring(0,1);
		var name=param.substring(1);
		switch(type){
			case '#':
				result=document.getElementById(name);
				break;
			case '.':
				result=document.getElementsByClassName(name);
				result.__isClass=result!==null?true:false;
				break;
			default:
				result=document.getElementById(name);
				break;
		}
	}else if(typeof param==='object'){
		result=param;
	}else{
		result=window;
	}
	return result;
};
var _createEvent=function(node,event,handler,capture){
	if(typeof handler!=='undefined'){
		_eventHandlers[node]=typeof _eventHandlers[node]!=='undefined'?_eventHandlers[node]:{};
		_eventHandlers[node][event]=typeof _eventHandlers[node][event]!=='undefined'?_eventHandlers[node][event]:[];
		_eventHandlers[node][event].push({'handler':handler,'capture':capture});
		if(node.addEventListener){
			node.addEventListener(event,handler,capture);
		}
		else if(node.attachEvent){
			node.attachEvent('on'+event,handler);
		}
		else{
			selector['on' + event]=handler;
		}
		return true;
	}
	return false;
};
var _delegationFunction=function(parent,child,handler){
	var delegation_function=function(e){
		var evt = e ? e:event;
		var element=evt.srcElement?evt.srcElement:evt.target?evt.target:false;
		while(element && element != child){
			if(element==parent) break;
			if(element.ParentNode!=document) element=element.parentNode;
		}
		if(element==child) handler.apply(element);
	};
	return delegation_function;
};
var _removeEvent=function(node,event,handler,capture){
	var this_handler;
	if(_eventHandlers[node]){
		if(_eventHandlers[node][event]){
			for(var i in _eventHandlers[node][event]){
				var handler_array=_eventHandlers[node][event][i];
				if((handler_array.handler.toString()==handler.toString())&&handler_array.capture.toString()==capture.toString()){
					this_handler=handler_array.handler;
				}
			}
		}
	}
	if(typeof handler==='function'){
		capture=typeof capture!=='undefined'?capture:false;
		if(node.removeEventListener){
			node.removeEventListener(event,this_handler,capture);
		}
		else if(node.detachEvent){
			node.detachEvent('on'+event,this_handler);
		}
		else{
			node['on'+event]=null;
		}
		return true;
	}
	return false;
};
var _removeAllEvents=function(node,event){
	if(node in _eventHandlers){
		var handlers=_eventHandlers[node];
		if(event in handlers) {
			var eventHandler=handlers[event];
			for(var i=eventHandler.length;i--;){
				var handler=eventHandler[i][0];
				var capture=eventHandler[i][1];
				_removeEvent(node,event,handler,capture);
			}
		}
		return true;
	}
	return false;
};
var _createNode=function(a,b,c){
	var type,child,parent;
	var with_id=true;
	if(typeof c==='undefined'){
		if(typeof b === 'undefined'){
			type='div';
			parent=a;
			with_id=false;
		}
		else{
			if(a=='div'||a=='img'||a=='button'||a=='input'||a=='a'||a=='p'||a=='marquee'||a=='iframe'){
				type=a;
				parent=b;
				with_id=false;
			}
			else{
				type='div';
				child=a;
				parent=b;
			}
		}
	}
	else{
		type=a;
		child=b;
		parent=c;
	}
	var element=document.createElement(type);
	if(with_id){element.id=child;}
	parent.appendChild(element);
	return element;
};
y_print_html=function(html){
	var name='y_print_frame';
	if(typeof window.y_print_frame!=='undefined'){
		delete window.y_print_frame;
	}
	else{
		var print_frame=document.createElement('iframe');
		var clear=function(){
			setTimeout(function(){
				print_frame.parentNode.removeChild(print_frame);
			},1);
		};
		print_frame.name = name;
		print_frame.id = name+'_id';
		print_frame.style.display = 'none';
		print_frame.style.width = '1px';
		print_frame.style.height = '1px';
		print_frame.style.position = 'absolute';
		print_frame.style.left = '-999px';
		document.body.appendChild(print_frame);
		var frame=window.frames[name];
		var doc=frame.document;
		doc.open();
		doc.write('<!DOCTYPE HTML>');
		h=y_html([
			{element:'html',content:y_html([
				{element:'head',content:y_html([{element:'title'}])},
				{element:'body',content:html}
			])}
		]);
		doc.write(h);
		doc.close();
		clear();
		frame.focus();
		frame.print();
		frame.close();
	}
};
//------------------------------------------------------------------------------
// yHtml Engine
// Transform object to html code
//------------------------------------------------------------------------------

var _getCode=function(p){
	var e=p.element;
	var a='<'+e+' ';
	var b='>';
	var c='</'+e+b;
	var d=' />';
	var s='';
	var t='';
	var u='undefined';
	var h=function (x,y){return x+'="'+y+'" ';};
	if(typeof p.content!=u){t=p.content;}
	if(typeof p.rel!=u){t=p.rel;}
	if(typeof p.rev!=u){t=p.rev;}
	if(typeof p.href!=u){t=p.href;}
	var attr=[
		'accept',
		'action',
		'alt',
		'background',
		'bind',
		'capture',
		'cell',
		'cells',
		'checked',
		'class',
		'col',
		'cols',
		'data',
		'dir',
		'display',
		'draggable',
		'dropzone',
		'enctype',
		'for',
		'group',
		'height',
		'hidden',
		'href',
		'id',
		'label',
		'lang',
		'max',
		'maxlength',
		'min',
		'mod',
		'name',
		'parent',
		'pattern',
		'placeholder',
		'progress',
		'readonly',
		'row',
		'rows',
		'scrolldelay',
		'spellcheck',
		'src',
		'step',
		'style',
		'tabindex',
		'tag',
		'title',
		'translate',
		'type',
		'value',
		'width'
	];
	for(var i in attr){
		if(typeof p[attr[i]] !== u) {
			s += h( attr[i], p[attr[i]] );
		}
	}
	if(typeof p.style_width!=u){
		s+='style="width:'+p.style_width+'"';
	}
	if(typeof p.style_height!=u){
		s+='style="height:'+p.style_height+'"';
	}
	if(!(e=='input'||e=='img'||e=='link')){
		return a+s+b+t+c;
	}else{
		return a+s+d;
	}
};
var _htmlCode=function(p){
	var r='';
	for(var i in p){
		r+=_getCode(p[i]);
	}
	return r;
};

//------------------------------------------------------------------------------
// yStyle Engine
// Give selector style
//------------------------------------------------------------------------------
var _style=function(selector,param,value){
	value=typeof value!=='undefined'&&value!=='undefined'?value:'';
	var element=getElement(selector);
	if(typeof element!=='undefined'&&element!=='undefined'&&element!==null&&typeof element==='object'){
		if(value!==''){
			if( typeof element.__isClass !== 'undefined' && element.__isClass === true){
				for(var i=0;i<element.length;i++){
					element[i].style[param]=value;
				}
			}
			else{element.style[param]=value;}
			return true;
		}
		else{
			if(typeof element.__isClass!=='undefined'&&element.__isClass===true){
				if(typeof element[0]!=='undefined'&&typeof element[0].style !== 'undefined'&&typeof element[0].style[param]!=='undefined'){
					return element[0].style[param];
				}
				else{
					return false;
				}
			}
			else{
				if(typeof element.style!=='undefined'&&typeof element.style[param]!=='undefined'){
					return element.style[param];
				}
				else{
					return false;
				}
			}
		}
	}
	else return false;
};
y.prototype={
	init: function(selector){
		if(selector){
			this.selector=getElement(selector);
		}
		else{
			this.selector=document;
		}
		return this;
	},
	start: function(data){
		var webApp=new web(data);
	},
	on: function(a,b,c){
		var parent, child, node, event, handler;
		event=a;
		if(typeof c==='undefined'){
			// y(selector).on(event,handler)
			handler=b;
			node=this.selector;
		}
		else{
			handler=c;
			if(parent==document){
				// y().off(event,node,handler)
				node=b;
			}
			else{
				// y(parent).on(event,child,handler)
				node=parent=this.selector;
				child=b;
			}
		}
		if(typeof parent === 'object'){
			if(typeof child !== 'object'){
				child=getElement(child);
			}
			parent_handler=_delegationFunction(parent,child,handler);
			handler=parent_handler;
		}
		if(typeof node !== 'object'){
			node=getElement(node);
		}
		if(typeof handler==='function'){
			_createEvent(node,event,handler,false);
		}
		return this;
	},
	off: function(a,b,c){
		var parent, child, node, event, handler;
		event=a;
		if(typeof c!=='undefined'){
			handler=c;
			if(parent==document){
				// y().off(event,node,handler)
				node=b;
			}
			else{
				// y(parent).off(event,child,handler)
				parent=this.selector;
				child=b;
			}
		}
		else{
			if(typeof b!=='undefined'){
				if(typeof b==='function'){
					// y(node).off(event,handler)
					node=this.selector;
					handler=b;
				}
				else{
					// y(parent).off(event,child)
					parent=this.selector;
					child=b;
				}
			}
			else{
				// y(node).off(event)
				node=this.selector;
			}
		}
		if(typeof parent==='object'){
			node=parent;
			if(typeof child!=='object'){
				child=getElement(child);
			}
			parent_handler=_delegationFunction(parent,child,handler);
			handler=parent_handler;
		}
		if(typeof node!=='object'){
			node=getElement(node);
		}
		if(typeof handler==='function'){
			_removeEvent(node,event,handler,false);
		}
		else{
			_removeAllEvents(node,type);
		}
		return this;
	},
	click: function(fn){
		selector=this.selector;
		this.on('click',selector,fn);
		return this;
	},
	ready: function(fn){
		readyHandle(fn);
		return this;
	}
};
y.prototype.init.prototype = y.prototype;
//y.fn.init.prototype = y.fn;
var web=function(data){
	this.init();
	this.spotlight=true;
	this.create_click();
	this.create_wait();
	this.create_paste();
	var message= data.footer;
	var footer_text=message;
	this.html('y_date',data.date);
	this.html('menubar_user_info',data.username);
	this.create_user_click_action();
	this.html('footer_text',footer_text);
	this.createModuleButton(data.modules,true);
	this.assign_command(data);
	yClock(document.getElementById('y_time'));
	window.y_data={};
	//window.y_data.username=data.username;
	window.y_data=data;
};
web.prototype.create_paste=function(){
	var paste=this.create('textarea','y_paste',document.body);
	paste.style.position = 'absolute';
	paste.style.left = '-1000px';
	paste.style.top = '-1000px';
	document.designMode = 'off';
};
web.prototype.create_click=function(){
	var click=this.create('y_click',document.body);
	click.style.display='none';
	click.className='_yClick';
	document.body.onclick=function(ev){
		var isIE=document.all;
		var p=[];
		if(ev){
			var x=isIE?(ev.clientX+document.body.scrollLeft):ev.pageX;
			var y=isIE?(ev.clientY+document.body.scrollTop):ev.pageY;
			click.style.left=x+'px';
			click.style.top=y+'px';
			click.style.display='';
			setTimeout(function(){click.style.display='none';},200);
		}
	};
};
web.prototype.create_wait=function(){
	var wait=this.create('y_wait',document.body);
	wait.className='_yWait';
	wait.innerHTML='please wait...';
	wait.style.display='none';
};
web.prototype.init=function(){
	var container=this.create('container',document.body);
	container.className='_yContainer';
	var header=this.create('header',container);
	header.className='_yFL _yHeader';
	var menubar_home_button=this.create('menubar_home_button',header);
	var menubar_fullscreen_button=this.create('menubar_fullscreen_button',header);
	var menubar_logout_button=this.create('menubar_logout_button',header);

	var page_area=this.create('page_area',container);
	page_area.className='_yFL _yPage';
	var home_area=this.create('home_area',page_area);
	home_area.setAttribute('class','_yFL _yFull');
	var home_area_panel=this.create('home_area_panel',home_area);
	home_area_panel.className='_yFL _yHomePanel';
	var module_area=this.create('module_area',page_area);
	module_area.setAttribute('class','_yFL _yFull _yModuleArea');
	var infobar=this.create('infobar',container);
	infobar.className='_yInfobar';
	var infobar_message=this.create('infobar_message',infobar);
	infobar_message.className='_yInfobarMessage';
	var menubar_company_logo=this.create('menubar_company_logo',infobar);
	menubar_company_logo.className='_yInfobarLogo';
	var footer=this.create('footer',container);
	footer.className='_yFooter _yFL';
	var menubar_terminal=this.create('input','menubar_terminal',footer);
	menubar_terminal.style.visibility='hidden';
	menubar_terminal.setAttribute('type','search');
	menubar_terminal.setAttribute('tabindex',0);
	var footer_text=this.create('div','footer_text',footer);
	footer_text.className='_yFL _yFooterText';
	var menubar_date=this.create('menubar_date',footer);
	var y_date=this.create('y_date',menubar_date);
	var y_time=this.create('y_time',menubar_date);
	var user_logged=this.create('menubar_user_info',menubar_date);
};
web.prototype.html=function(id,h){
	if(document.getElementById(id) !== 'null'){
		document.getElementById(id).innerHTML=h;
	}
};
web.prototype.create=_createNode;
web.prototype.load_script=function(url){
	var script=document.createElement('script');
	script.type='text/javascript';
	script.src=url;
	document.getElementsByTagName("head")[0].appendChild(script);
};
// Assign basic command of application framework
web.prototype.assign_command=function(data){
	var that=this;
	var url_logout = 'C_home/logout';
	var module_area=document.getElementById('module_area');
	var home_area=document.getElementById('home_area');
	var infobar=document.getElementById('infobar');
	var menubarHomeButton=document.getElementById('menubar_home_button');
	var menubarFullScreenButton=document.getElementById('menubar_fullscreen_button');
	var menubarLogoutButton=document.getElementById('menubar_logout_button');
	css.style('#module_area','display','none');
	_('#menubar_home_button').click(function(){
		y_playClick(this);
		y_wait_hide();
		that.show_modules(data.modules);
		module_area.innerHTML='';
		css.style('#module_area','display','none');
		css.style("#home_area",'display','block');
		$('#footer').show();
	});
	_('#menubar_fullscreen_button').click(function(){
		y_playClick(this);
		if(fullScreenApi.supportsFullScreen){
			if(!fullScreenApi.isFullScreen()){
				fullScreenApi.requestFullScreen(document.body);
			}
			else{
				fullScreenApi.cancelFullScreen(document.body);
			}
		}
		redimension(css);
	});
	_('#menubar_logout_button').click(function(){
		y_playClick(this);
		module_area.innerHTML='';
		home_area.innerHTML='';
		window.location=url_logout;
	});

	infobar.style.top='-352px';
	_(infobar).click(function(){
		y_playClick(this);
		var top=infobar.style.top;
		var up='-352px';
		if(!(top===0 || top==='0px')){
			css.animate('#infobar','top','0px',300);
		}
		else{
			css.animate('#infobar','top',up,500);
		}
	});
	document.addEventListener('keydown', function(event) {
		var key=event.keyCode;
		var home_area=document.getElementById('home_area');
		var obj;
		if(home_area.style.display!='none' && that.spotlight)
		{
			if(key >=65 && key <=90){
				obj=document.getElementById('menubar_terminal');
				obj.style.visibility='visible';
				if(obj.value===''){
					obj.focus();
				}
			}
			else if (key==27){
				obj=document.getElementById('menubar_terminal');
				obj.style.visibility='hidden';
				obj.value='';
			}
		}

		if(event.shiftKey){
			switch(key){
				case 27:
					infobar.click();
					break;
				case 36:
					menubarHomeButton.click();
					break;
				case 122:
					menubarFullScreenButton.click();
					break;
				case 123:
					menubarLogoutButton.click();
					break;
				default:
					break;
			}

		}
	});
	document.addEventListener('keyup',function(event){
		var key=event.keyCode;
		var home_area=document.getElementById('home_area');
		if(home_area.style.display!='none' && that.spotlight){
			if((key>=65 && key<=90) || key==13 || key== 8 || key == 46){
				var obj=document.getElementById('menubar_terminal');
				var new_module=that.sort_module(obj.value,data.modules);
				that.respring(data.modules,new_module);
			}
			else if(key==27){
				that.show_modules(data.modules);
			}
		}
	});
};
web.prototype.createModuleButton=function(module_list,assign_command){
	assign_command=typeof assign_command !== 'undefined' ? assign_command:false;
	var that=this;
	var home_area_panel=document.getElementById('home_area_panel');
	home_area_panel.innerHTML='';
	var doCommand=function(){
		var mod_name=this.getAttribute('mod');
		that.createModule(mod_name);
	};
	for(var i in module_list){
		var mod=module_list[i];
		var name=mod.name;
		var type=mod.type;
		if(name!='home'){
			var label=mod.label;
			var url_image='images/icon/'+name+'.png';
			var button=this.create('button_module_'+name,home_area_panel);
			button.setAttribute('class','module_icon');
			button.setAttribute('mod',name);
			button.setAttribute('type',type);
			button.setAttribute('tabindex',i);
			var image=this.create('img',button);
			image.setAttribute('src',url_image);
			image.setAttribute('alt',name);
			var text=this.create('p',button);
			text.innerHTML=label;
			if(assign_command){
				_(document).on('click',button,doCommand);
			}
		}
	}

};
web.prototype.callback_function_module_icon=function(e){
	var mod_name=obj.getAttribute('mod');
	this.createModule(mod_name);
};
web.prototype.respring=function(module_list,module_list_new){
	this.hide_modules(module_list);
	this.show_modules(module_list_new);
};
web.prototype.hide_modules=function(module_list){
	for(var i in module_list){
		var mod=module_list[i];
		var name=mod.name;
		if(name!='home'){
			var button=document.getElementById('button_module_'+name);
			button.style.display='none';
		}
	}
};
web.prototype.show_modules=function(module_list){
	for(var i in module_list){
		var mod=module_list[i];
		var name=mod.name;
		if(name!='home'){
			var button=document.getElementById('button_module_'+name);
			button.style.display='block';
		}
	}
};
web.prototype.sort_module=function(param,module_list){
	var result=[];
	var index=0;
	if(param!==''){
		for(var i in module_list){
			var mod=module_list[i];
			var label=mod.label;
			if(name!='home'){
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
					result[index]=module_list[i];
					index++;
				}
			}
		}
	}
	else{
		result=module_list;
	}
	return result;
};
web.prototype.createModule=function(mod_name){
	var that=this;
	var button=$('[mod='+mod_name+']');
	var url_button='C_'+mod_name+'/index';
	var success=function(h){
		if(typeof h.secure!=='undefined' &&  h.secure!=='' && typeof h.secure.module!=='undefined' && h.secure.module!=='' && typeof h.secure.access!=='undefined' && h.secure.access===true  && h.secure.login!=='undefined' && h.secure.login===true ){
			window.y_data.module=mod_name;
			var module_area=document.getElementById('module_area');
			var module_panel=y_html([{element:'div',id:'module_panel',class:'_yFL _yModulePanel',content:''}]);
			var script = document.createElement( 'script' );
 			script.setAttribute('src',window.location.origin+'/js/v.'+h.secure.module+'.js');
			module_area.innerHTML=module_panel;
			module_area.appendChild(script);
			var home_area=document.getElementById('home_area');
			var menubar_terminal=document.getElementById('menubar_terminal');
			home_area.style.display='none';
			module_area.style.display='block';
			menubar_terminal.value='';
			menubar_terminal.style.visibility='hidden';
		}
		else{
			window.location = 'C_login';
		}
	};
	var complete=function(){};
	var error=function(){};
	var jsonError=function(e){
		window.location = 'C_login';
	};
	getAjax(url_button,'',success,complete,error,jsonError);
};
web.prototype.create_user_click_action=function(){
	var that=this;
	$(document).on('click','#menubar_user_info',function(ev){
		if($('.y_user_menu').css('display')=='block'){
			$('.y_user_menu').hide();
			that.spotlight=true;
		}
		else{
			$('.y_user_menu').show();
			that.spotlight=false;
		}
	});
	var h=y_html([{element:'div',class:'y_user_menu',content:'change password...'}]);
	$('body').append(h);
	$('.y_user_menu').hide();
	$(document).on('click','.y_user_menu',function(ev){
		$('.y_user_menu').hide();
		var r=confirm('Are you sure want to change your password?');
		if(r===true){
			that.createFormEditPassword();
		}
		else{
			that.spotlight=true;
		}

	});
};
web.prototype.createFormEditPassword=function(){
	var that=this;
	id='y_message-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*100)+1);
	$('.y_message_box').remove();
	var blank_row={element:'div',class:'y_message_box_text_row',content:''};
	var h=y_html([
		{element:'form',class:'y_message_box',id:id,content:y_html([
			{element:'div',class:'panel_title',content:'Change Password'},
			{element:'div',class:'y_message_box_text',content:y_html([
				blank_row,
				{element:'div',class:'y_message_box_text_row',content:y_html([
					{element:'div',class:'float_left width_150',content:'current password: '},
					{element:'input',id:'current_password',type:'password',class:'input_text p_form',name:'c'}
				])},
				blank_row,
				{element:'div',class:'y_message_box_text_row',content:y_html([
					{element:'div',class:'float_left width_150',content:'new password: '},
					{element:'input',type:'password',class:'input_text p_form',name:'n'}
				])},
				{element:'div',class:'y_message_box_text_row',content:y_html([
					{element:'div',class:'float_left width_150',content:'confirm new password: '},
					{element:'input',type:'password',class:'input_text p_form',name:'f'}
				])},
				blank_row,
				{element:'div',class:'y_message_box_text_row',content:y_html([
					{element:'div',class:'y_cancel_button',id:'cancel_change_password',content:'cancel'},
					{element:'div',class:'float_left width_60 height_38',content:''},
					{element:'div',class:'y_ok_button',id:'ok_change_password',content:'submit'}
				])}
			])}
		])}
	]);
	$('body').append(h);
	$('#current_password').focus();
	$('#'+id).off('click','.panel_title');
	$('#'+id).on('click','.panel_title',function(){
		$('#'+id).hide();
		$('.p_form').val('');
	});
	$(document).off('click','#ok_change_password');
	$(document).on('click','#ok_change_password',function(event){
		target='C_home/call_change_password';
		parameter=$('#'+id).serialize();
		event.preventDefault();

		var callback=function(status){
			y_show_ajax_result(status);
			$('#'+id).hide();
			$('.p_form').val('');
			that.spotlight=true;
		};
		postAjax(target,parameter,callback);
	});
	$(document).off('click','#cancel_change_password');
	$(document).on('click','#cancel_change_password',function(ev){
		$('#'+id).hide();
		$('.p_form').val('');
		that.spotlight=true;
	});
};
web.prototype.session_check=function(){
	var callback=function(result){
		var session;
		if(result){session=result;}
		y_wait_hide();
		if(!session){
			window.location='C_home/logout';
		}
		else{
			return true;
		}
	};
	getAjaxText('C_home/get','',callback);
};

var style=function(){
	this.file=document.createElement('style');
	this.file.type='text/css';
	this.file.innerHTML='';
};
style.prototype.responsive=function(callback){
	var res;
	var css=this;
	window.onresize=function(){
		if(res){
			clearTimeout(res);
		}
		res = setTimeout( function(){
			callback(css);
		}, 100 );
	};
};
style.prototype.swing=function(p){
	return 0.5-Math.cos(p*Math.PI)/2;
};
style.prototype.linear=function(p){
	return p;
};
style.prototype.animate=function(selector,param,value,time,option){
	time=typeof time!=='undefined'?time:1000;
	option=typeof option!=='undefined'?option:'';
	time=parseInt(time);
	var interval_time=13;
	var section=parseInt(time/interval_time);
	if(section<1){section=1;}
	var current_value=this.style(selector,param);

	var px=value.substr(value.length-2);

	var is_px=false;
	var start=current_value;
	var end=value;
	if(px=='px'){
		is_px=true;
		start=parseFloat(current_value.substr(0,current_value.length-2));
		end=parseFloat(value.substr(0,value.length-2));
	}
	var temp=start;
	var step=(end-start)/section;
	var diff=end-start;
	var data=[];
	for(var i=0;i<section;i++){
		var p=(i+1)/section;
		switch(option){
			case '':
				data[i]=start+(this.swing(p)*diff);
				break;
			case 'linear':
				data[i]=start+(this.linear(p)*diff);
				break;
		}
		if(is_px){data[i]=parseInt(data[i])+'px';}
	}
	if(data[section-1]!=value){
		data[section-1]=value;
	}
	var element=this.get_element(selector);
	if(element!= 'null' && typeof element === 'object'){
		if(value!==''){
			i=0;
			var animate;
			if(typeof element.__isClass !== 'undefined' && element.__isClass===true){
				animate=setInterval(function(){
					for(var i = 0; i < element.length; i++){
						element[i].style[param]=data[i];
					}
					i++;
				},interval_time);
			}
			else{
				animate=setInterval(function(){element.style[param]=data[i];i++;},interval_time);
			}
		}
	}
};
style.prototype.set_width=function(selector,width){
	this.style(selector,'width',css.px(width));
};
style.prototype.get_element=getElement;
style.prototype.style=_style;
style.prototype.add=function(param){
	var text='';
	for(var i in param){
		p=param[i];
		var is_name=(typeof p.name!='undefined');
		var is_class=(typeof p.class!='undefined');
		var is_id=(typeof p.id!='undefined');
		if((!(is_name&&is_class&&is_id))&&(is_name||is_class||is_id)){
			if(is_class){text+='.'+p.class+'{';}
			if(is_id){text+='#'+p.id+'{';}
			if(is_name){text+=p.name+'{';}
			for(var f in p){
				if(p.hasOwnProperty(f)){
					if(!(f=='name'||f=='class'||f=='id')){
						var _f=f.replace("_","-");
						var _p=p[f];
						text+=(_f+':'+_p+';');
					}
				}
			}
			text+='}';
		}
	}
	this.file.innerHTML+=text;
};
style.prototype.create=function(){
	document.getElementsByTagName('head')[0].appendChild(this.file);
};
style.prototype.px=function(num){
	return typeof num !== 'undefined' ? num+'px' : 'px';
};
style.prototype.wpx=function(num){
	return {width:num+'px'};
};
style.prototype.url_image=function(folder,image,param){
	param=typeof param!=='undefined'?param:'';
	var url='url("../images/'+folder+'/'+image+'") '+param;
	return url;
};
style.prototype.copy=function(object){
	return JSON.parse(JSON.stringify(object));
};
style.prototype.id=function(id_name){
	var result={id:id_name};
	return result;
};
style.prototype.class=function(cl_name){
	var result={class:cl_name};
	return result;
};
style.prototype.bg=function(folder,image,param){
	param=typeof param!=='undefined'?param:'';
	var result={background:this.url_image(folder,image,param)};
	return result;
};
style.prototype.use=function(cl_name,object){
	var result=this.copy(object);
	result.class=cl_name;
	return result;
};
style.prototype.merge=function(object_1,object_2){
	var result;
	if(object_1 instanceof Array){
		for(var i in object_1){
			if(i===0){
				result=JSON.parse(JSON.stringify(object_1[i]));
			}
			else{
				result=JSON.parse((JSON.stringify(result)+JSON.stringify(object_1[i])).replace('}{',','));
			}
		}
	}
	else{
		result=JSON.parse((JSON.stringify(object_1)+JSON.stringify(object_2)).replace('}{',','));
	}
	return result;
};
style.prototype.get_width=function(){
	var width=0;
	if(typeof(window.innerWidth)=='number'){
		width=window.innerWidth;
	}
	else if(document.documentElement && document.documentElement.clientWidth){
		width=document.documentElement.clientWidth;
	}
	else if(document.body && document.body.clientWidth){
		width=document.body.clientWidth;
	}
	return width;
};
style.prototype.get_scroll_width=function(){
	var scrollDiv=document.createElement("div");
	scrollDiv.className="scrollbar-measure";
	document.body.appendChild(scrollDiv);
	var width=scrollDiv.offsetWidth-scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return width;
};
style.prototype.get_height=function(){
	var height=0;
	if(typeof(window.innerHeight)=='number'){
		height=window.innerHeight;
	}else if(document.documentElement && document.documentElement.clientHeight){
		height=document.documentElement.clientHeight;
	}else if(document.body && document.body.clientHeight){
		height=document.body.clientHeight;
	}
	return height;
};
style.prototype.requestFullScreen=function(){
	if(fullScreenApi.supportsFullScreen){
		if(!fullScreenApi.isFullScreen())
		{
			fullScreenApi.requestFullScreen(document.body);
		}
	}
};
function y_wait_show(){document.getElementById('y_wait').style.display='block';}
function y_wait_hide(){document.getElementById('y_wait').style.display='none';}
function y_handle_paste(obj){
	setTimeout(function(){y_get_paste_value(obj);},10);
}
function y_get_paste_value(obj){
	var paste_value=$(obj).val();
	$(obj).val('');
	var name=$(obj).attr('name');
	var arr=typeof name!== 'undefined' ? name.split('['):[];
	if(typeof arr[0]!=='undefined' && typeof arr[1]!=='undefined'){
		var start_index=parseInt(arr[1].replace(']',''));
		if(!isNaN(start_index)){
			var rows=paste_value.split('\n');
			var no_of_rows=rows.length;
			var this_name;
			for (i=0;i<no_of_rows;i++){
				this_name=arr[0]+'['+(start_index+i)+']';
				$('textarea[name="'+this_name+'"]').focus();
				$('textarea[name="'+this_name+'"]').val(rows[i]);
			}
		}
	}
	return false;
}
function y_grid_paste(obj, paste_value){
	var name=$(obj).attr('name');
	var arr=typeof name!== 'undefined' ? name.split('['):[];
	if(typeof arr[0]!=='undefined' && typeof arr[1]!=='undefined'){
		var start_index=parseInt(arr[1].replace(']',''));
		if(!isNaN(start_index)){
			var rows=paste_value.split('\n');
			var no_of_rows=rows.length;
			var this_name;
			for (i=0;i<no_of_rows;i++){
				this_name=arr[0]+'['+(start_index+i)+']';
				$('textarea[name="'+this_name+'"]').focus();
				$('textarea[name="'+this_name+'"]').val(rows[i]);
			}
		}
	}
	return false;
}
function yClock(selector){
	var t=yGetTime();selector.innerHTML=t;setTimeout(function(){yClock(selector);},500);
}
function y_pre_zero(i){
	var r=i<10?"0"+i:i;
	return r;
}
function yGetDate(){
	var n=new Date();
	var yyyy=n.getFullYear();
	var mm=y_pre_zero(n.getMonth()+1);
	var dd=y_pre_zero(n.getDate());
	return (yyyy+"-"+mm+"-"+dd);
}
function yGetTime(){
	var n=new Date();
	var h=y_pre_zero(n.getHours());
	var m=y_pre_zero(n.getMinutes());
	var s=y_pre_zero(n.getSeconds());
	return (h+":"+m+":"+s);
}
var getAjax=function(url,data,success,complete,error,jsonError,wait_hide,timeout){
	wait_hide=typeof wait_hide!=='undefined'?wait_hide:false;
	if(typeof url!=='undefined' && url!==''){
		if(!wait_hide){y_wait_show();}
		success=typeof success!=='undefined'?success:function(){};
		success=typeof success!=='function'?function(){}:success;
		complete=typeof complete!=='undefined'?complete:function(){};
		complete=typeof complete!=='function'?function(){}:complete;
		error=typeof error!=='undefined'?error:function(){};
		error=typeof error!=='function'?function(){}:error;
		jsonError=typeof jsonError!=='undefined'?jsonError:function(e){ console.log(e);};
		data=(typeof data!=='undefined') && (data !== '') ? '?'+data : '';
		timeout=typeof timeout!=='undefined'?timeout:0;
		var ajax=new XMLHttpRequest();
		ajax.open('GET',url+data,true); // true = asynchronous
		ajax.setRequestHeader("X-Requested-With","XMLHttpRequest");
		ajax.onreadystatechange=function(){
			if(ajax.readyState==4){
				if(ajax.status >= 200 && (ajax.status < 300 || ajax.status === 304)){
					var res;
					try{
						res=JSON.parse(ajax.responseText);
						success(res);
					} catch(e){
						jsonError(e);
					}
				}
				else{
					error(ajax.status);
				}
				if(!wait_hide){y_wait_hide();}
				complete();
			}
		};
		ajax.timeout=timeout;
		try{
			ajax.send(null);
			return (ajax.status >= 200 && (ajax.status < 300 || ajax.status === 304));
		}
		catch(e){
			console.log(e);
			return false;
		}
	}
	else{
		return false;
	}
};
var getAjaxText=function(url,data,success,complete,error){
	if(typeof url!=='undefined' && url!==''){
		y_wait_show();
		success=typeof success!=='undefined'?success:function(){};
		success=typeof success!=='function'?function(){}:success;
		complete=typeof complete!=='undefined'?complete:function(){};
		complete=typeof complete!=='function'?function(){}:complete;
		error=typeof error!=='undefined'?error:function(){};
		error=typeof error!=='function'?function(){}:error;
		data=(typeof data!=='undefined') && (data !== '') ? '?'+data : '';
		var ajax=new XMLHttpRequest();
		ajax.open('GET',url+data,true); // true = asynchronous
		ajax.setRequestHeader("X-Requested-With","XMLHttpRequest");
		ajax.send(null);
		ajax.onreadystatechange=function(){
			if(ajax.readyState == 4){
				if((ajax.status == 200) || (ajax.status == 304)){
					res=ajax.responseText;
					success(res);
				}
				else{
					error(ajax.status);
				}
				y_wait_hide();
				complete();
				return;
			}
		};
	}
	else
	{
		return;
	}
};
var postAjax=function(url,data,success,complete,error,jsonError){
	y_wait_show();
	success=typeof success!=='undefined'?success:function(){};
	success=typeof success!=='function'?function(){}:success;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	error=typeof error!=='undefined'?error:function(){};
	error=typeof error!=='function'?function(){}:error;
	jsonError=typeof jsonError!=='undefined'?jsonError:function(e){console.log(e);};
	var ajax=new XMLHttpRequest();
	ajax.open('POST',url,true);
	ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	ajax.send(data);
	ajax.onreadystatechange=function(){
		if(ajax.readyState == 4){
			if((ajax.status == 200) || (ajax.status == 304)){
				var res;
				try{
					res=JSON.parse(ajax.responseText);
					success(res);
				} catch(e){
					jsonError(e);
				}
			}
			else{
				error(ajax.status);
			}
			y_wait_hide();
			complete();
		}
	};
};
var fileAjax=function(url,formData,success,complete,error,jsonError){
	y_wait_show();
	success=typeof success!=='undefined'?success:function(){};
	success=typeof success!=='function'?function(){}:success;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	error=typeof error!=='undefined'?error:function(){};
	error=typeof error!=='function'?function(){}:error;
	jsonError=typeof jsonError!=='undefined'?jsonError:function(e){ console.log(e);};
	var ajax=new XMLHttpRequest();
	ajax.open('POST',url,true);
	ajax.send(formData);
	ajax.onreadystatechange=function(){
		if(ajax.readyState === 4){
			if((ajax.status === 200) || (ajax.status === 0)){
				var res;
				try{
					res=JSON.parse(ajax.responseText);
					success(res);
				} catch(e){
					jsonError(e);
				}
			}
			else{
				error();
			}
			y_wait_hide();
			complete();
		}
	};
};
function y_post_action(form,target,object,with_print){
	with_print=typeof with_print!=='undefined'?with_print:false;
	$(form).submit(function(event) {
		event.preventDefault();
		var r=confirm('Are you sure want to save?');
		if(r===true){
			var data_form=$(form).serialize();
			var callback=function(status){
				y_show_ajax_result(status,with_print);
				if(object){object.reset(form);}
			};
			postAjax(target,data_form,callback);
		}
	});
}
function y_show_ajax_result(status,with_print){
	with_print=typeof with_print!=='undefined'?with_print:false;
	if(status){
		var t=yGetTime();
		var d=yGetDate();
		var string='';
		string='<p> Report Start </p>';
		string+='<p> Module: '+window.y_data.module+' </p>';
		string+='<p> User: '+window.y_data.username+' </p>';
		string+='<p> Time: '+d+' '+t+' </p>';
		for(var i in status){
			string+='<p>'+status[i]+'</p>';
		}
		string+='<p> Report End </p>';
		y_show_infobar(string);
		if(with_print!==false){
			y_print_html(string);
		}
	}
}
function y_show_infobar(message){
	var infobar=document.getElementById('infobar');
	var infobar_message=document.getElementById('infobar_message');

	var curSH=infobar_message.scrollHeight;

	$('#infobar_message').append(message);
	var newSH=infobar_message.scrollHeight;
	if(newSH>curSH){
		infobar_message.scrollTop=infobar_message.offsetTop;
	}
	css.animate('#infobar','top','0px',150);
	setTimeout(function(){css.animate('#infobar','top','-352px',500);},5000);
}
function prevent_key_enter(selector){
	$(selector).on("keypress",function(e){
		if(e.which==13){e.preventDefault();}
		if(e.which==96){e.preventDefault();$(selector).submit();}
	});
}
function y_get_click_position(ev){
	var isIE=document.all;
	var p=[];
	if(ev){
		p.x=isIE?(ev.clientX+document.body.scrollLeft):ev.pageX;
		p.y=isIE?(ev.clientY+document.body.scrollTop):ev.pageY;
	}
	return p;
}
function y_object_clone(object){
	var object_copy=JSON.parse(JSON.stringify(object));
	return object_copy;
}
function y_moveable(wrapper,panel,trigger){
	wrapper.on('mousedown',trigger,function(event){
		event=event||window.event;
		document.onselectstart=function(){return false;};
		wrapper.bind('mousemove', start_drag);
		wrapper.bind('mouseup', end_drag);
		wrapper.css('-webkit-user-select','none');
		function start_drag(event){
			event=event||window.event;
			var p=[];
			p=y_get_click_position(event);
			$(panel).css('left',p.x);
			$(panel).css('top',p.y);
		}
		function end_drag(event){
			event=event||window.event;
			wrapper.unbind('mousemove',start_drag);
			wrapper.unbind('mouseup',end_drag);
			wrapper.css('-webkit-user-select','text');
			document.onselectstart=function(){return true;};
		}
	});
}
function y_message(title,text,id){
	if(!id) id='y_message-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*100)+1);
	$('.y_message_box').remove();
	var h=y_html([
		{element:'div',class:'y_message_box',id:id,content:y_html([
			{element:'div',class:'panel_title',content:title},
			{element:'div',class:'y_message_box_text',content:text}
		])}
	]);
	$('body').append(h);
	$('#'+id).off('click','.panel_title');
	$('#'+id).on('click','.panel_title',function(){
		$('#'+id).hide();
	});
}
var y_object_button=function(model,label,id,option,width){
	var cl_bt='button_circle';
	var cl_img=cl_bt+'_image';
	var cl_txt=cl_bt+'_text';
	var img='../images/button/'+model+'.png';
	if(typeof id=='undefined'){
		id=(new Date()).getTime()+'-'+Math.floor((Math.random()*100)+1);
	}
	if(typeof label=='undefined'){
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
			button={element:'div',id:'button_'+model+'_'+id,class:'float_left width_'+width,content:button_content};
		}
	}
	else{
		button_content=y_html([object_image,{element:'div',class:cl_txt,content:label}]);
		button={element:'div',id:'button_'+model+'_'+id,class:cl_bt,content:button_content};
	}
	return button;
};
y_command=function(wrapper,button_id,callback){

	if(typeof callback!=='undefined'){
		wrapper.off('click',button_id);
		wrapper.on('click',button_id,function(event){
			event=event||window.event;
			event.preventDefault();
			callback(this);
		});
	}
	else if(typeof button_id!=='undefined'){
		callback=button_id;
		button_id=wrapper;
		wrapper=$(document.body);
		y_command(wrapper,button_id,callback);
	}
	else if(typeof wrapper!=='undefined' && typeof wrapper==='object'){
		a=typeof wrapper.wrapper!=='undefined'?wrapper.wrapper:$(document.body);
		if(typeof wrapper.data!=='undefined'){
			for(var i in wrapper.data){
				if(typeof wrapper.data[i].button!=='undefined' && typeof wrapper.data[i].callback!=='undefined' && typeof  wrapper.data[i].callback==='function'){
					button_id=wrapper.data[i].button;
					callback=wrapper.data[i].callback;
					y_command(a,button_id,callback);
				}
			}
		}
	}
};
function use_input_date(obj,range){
	obj=typeof obj!=='undefined' && typeof obj==='object'?obj:$('.input_date');
	range=typeof range!=='undefined'?range:'-1:+0';
	obj.datepicker({
		dateFormat:'mm/dd/yy',
		changeMonth:true,
		changeYear:true,
		yearRange:range,
		showOn:'button',
		buttonText:'Select Date',
		buttonImage:'images/themes/default/calendar.png',
		buttonImageOnly:true
	});
}
function use_input_date_time(){
	$('.input_date_time').datetimepicker({
		showOn:'button',
		changeMonth:true,
		changeYear:true,
		yearRange:'-1:+0',
		buttonText:'Select Date Time',
		buttonImage:'images/themes/default/calendar.png',
		buttonImageOnly:true,
		onClose:function(){
			this.focus();
		}
	});
}
function use_input_month(){
	$('.input_month').datepicker({
		changeMonth:true,
		changeYear:true,
		showButtonPanel:true,
		dateFormat:'MM yy',
		onClose:function(dateText,inst){
			var month=$('#ui-datepicker-div .ui-datepicker-month :selected').val();
			var year=$('#ui-datepicker-div .ui-datepicker-year :selected').val();
			$(this).datepicker('setDate',new Date(year,month,1));
		},
		showOn:'button',
		buttonText:'Select Month',
		buttonImage:'images/themes/default/calendar.png',
		buttonImageOnly:true
	});
	$('.input_month').focus(function(){
		$('.ui-datepicker-calendar').hide();
		$('.ui-datepicker-current').hide();
		$('#ui-datepicker-div').position({
			my:'center top',
			at:'center bottom',
			of:$(this)
		});
	});
}
function y_valid_numeric(selector)
{
	var format=new RegExp(/^\d+$/);
	var value=$.trim(selector.val());
	if (value===''||!format.test(value))
	{
		y_warning_invalid(selector);
	}
	else
	{
		y_reset_warning(selector);
	}
	return false;
}

/**
 * Validate if value is date
 * @param string id of element
 * @return html
 */
function y_valid_input_date(selector)
{

	var value=$.trim(selector.val());
	if(value==='')
	{
		y_warning_invalid(selector);
		return false;
	}
	else
	{
		if(y_valid_date(value)===false)
		{
			y_warning_invalid(selector);
			return false;
		}
		else
		{
			y_reset_warning(selector);
			return true;
		}
	}
}
function y_warning_invalid(selector){
	selector.css('background-color','#ff4444');
	selector.focus();
}
function y_reset_warning(selector){
	selector.css('background-color','#e9ffe8');
}
function y_valid_date(date){
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	if(matches === null) return false;
	var d = matches[2];
	var m = matches[1] - 1;
	var y = matches[3];
	var composedDate = new Date(y, m, d);
	return composedDate.getDate() == d &&
	composedDate.getMonth() == m &&
	composedDate.getFullYear() == y;
}
var is_integer=function(value) {
	if ((undefined === value) || (null === value)) {
		return false;
	}
	return value % 1 === 0;
};
var y_is_number=function(value){return !isNaN(value-0)&&value!==null;};
var yLog=function(message){if(typeof console==='object'){console.log(message);}};
var useParam=function(object,param){
	for(var field in param){if(param.hasOwnProperty(field)){object[field]=param[field];}}
};
var y_playSound=function(el,soundfile){
	/*if(el.mp3){
		if(el.mp3.paused) el.mp3.play();
		else el.mp3.pause();
	}else{
		el.mp3=new Audio(soundfile);
		el.mp3.play();
	}*/
};
var y_playClick=function(el){
	//y_playSound(el, '../sounds/click.mp3');
};
if(typeof window === 'object' && typeof window.document === 'object'){
	window.y_html=_htmlCode;
	window.css=new style();
	window._=window.y=y;
	window.__=y(document);
	window.y_wait_show=y_wait_show;
	window.y_wait_hide=y_wait_hide;
	window.y_handle_paste=y_handle_paste;
	window.y_grid_paste=y_grid_paste;
	window.y_post_action=y_post_action;
	window.y_show_ajax_result=y_show_ajax_result;
	window.prevent_key_enter=prevent_key_enter;
	window.y_object_clone=y_object_clone;
	window.y_moveable=y_moveable;
	window.yLog=yLog;
	window.y_message=y_message;
	window.y_print_html=y_print_html;
	window.getAjax=getAjax;
	window.getAjaxText=getAjaxText;
	window.postAjax=postAjax;
	window.fileAjax=fileAjax;
	window.y_object_button=y_object_button;
	window.y_command=y_command;
	window.use_input_date=use_input_date;
	window.use_input_date_time=use_input_date_time;
	window.use_input_month=use_input_month;
	window.y_valid_numeric=y_valid_numeric;
	window.y_valid_input_date=y_valid_input_date;
	window.y_is_number=y_is_number;
	window.is_integer=is_integer;
	window.useParam=useParam;
	window.y_playSound=y_playSound;
	window.y_playClick=y_playClick;
	window.y_get_click_position=y_get_click_position;
}
})(window);
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
