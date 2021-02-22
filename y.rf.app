// 2017.01.05 Yohan Naftali
(function(window,undefined){
var document=window.document;
var location=window.location;

//------------------------------------------------------------------------------
// yHtml Engine
// Transform object to html code
//------------------------------------------------------------------------------
var _getCode=function(p){
	var e=p.element;
	var className=false;
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
	if(typeof p.className!=u){
		s += h( 'class', p.className );}
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
		//'class',  use className
		'col',
		'cols',
		'colspan',
		'data',
		'data-mod',
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
		'rowspan',
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
			if(
					a=='div'||
					a=='img'||
					a=='button'||
					a=='input'||
					a=='a'||
					a=='p'||
					a=='marquee'||
					a=='iframe'||
					a=='table'||
					a=='thead'||
					a=='tbody'||
					a=='tfoot'||
					a=='tr'||
					a=='th'||
					a=='td'){
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

// ajax
//------------------------------------------------------------------------------
// ajax
//
//------------------------------------------------------------------------------
var getAjax=function(url,data,success,complete,error,jsonError){
	if(typeof url!=='undefined' && url!==''){
		success=typeof success!=='undefined'?success:function(){};
		success=typeof success!=='function'?function(){}:success;
		complete=typeof complete!=='undefined'?complete:function(){};
		complete=typeof complete!=='function'?function(){}:complete;
		error=typeof error!=='undefined'?error:function(){};
		error=typeof error!=='function'?function(){}:error;
		jsonError=typeof jsonError!=='undefined'?jsonError:function(e){ console.log(e);};
		data=(typeof data!=='undefined') && (data !== '') ? '?'+data : '';

		var ajax=false;
		if (window.XMLHttpRequest) {
			//Firefox, Opera, IE7, and other browsers will use the native object
			ajax = new XMLHttpRequest();
		} else {
			//IE 5 and 6 will use the ActiveX control
			ajax = new ActiveXObject("Microsoft.XMLHTTP");
		}
		if(ajax){
			ajax.open('GET',url+data,true); // true = asynchronous
			ajax.send(null);
			//ajax.setRequestHeader("X-Requested-With","XMLHttpRequest");
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
					complete();
				}
			};
		}
	}
	else{
		return false;
	}
};
var getAjaxText=function(url,data,success,complete,error){
	if(typeof url!=='undefined' && url!==''){
		success=typeof success!=='undefined'?success:function(){};
		success=typeof success!=='function'?function(){}:success;
		complete=typeof complete!=='undefined'?complete:function(){};
		complete=typeof complete!=='function'?function(){}:complete;
		error=typeof error!=='undefined'?error:function(){};
		error=typeof error!=='function'?function(){}:error;
		data=(typeof data!=='undefined') && (data !== '') ? '?'+data : '';

		var ajax='';
		if (window.XMLHttpRequest) {
			//Firefox, Opera, IE7, and other browsers will use the native object
			ajax = new XMLHttpRequest();
		} else {
			//IE 5 and 6 will use the ActiveX control
			ajax = new ActiveXObject("Microsoft.XMLHTTP");
		}
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
	success=typeof success!=='undefined'?success:function(){};
	success=typeof success!=='function'?function(){}:success;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	error=typeof error!=='undefined'?error:function(){};
	error=typeof error!=='function'?function(){}:error;
	jsonError=typeof jsonError!=='undefined'?jsonError:function(e){console.log(e);};

	var ajax='';
	if (window.XMLHttpRequest) {
		//Firefox, Opera, IE7, and other browsers will use the native object
		ajax = new XMLHttpRequest();
	} else {
		//IE 5 and 6 will use the ActiveX control
		ajax = new ActiveXObject("Microsoft.XMLHTTP");
	}
	ajax.open('POST',url,true);
	ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	ajax.send(data);
	ajax.onreadystatechange=function(){
		if(ajax.readyState == 4){
			if((ajax.status == 200) || (ajax.status == 304)){
				var res=JSON.parse(ajax.responseText);
				success(res);
			}
			else{
				error(ajax.status);
			}
			complete();
		}
	};
};
var fileAjax=function(url,formData,success,complete,error,jsonError){
	success=typeof success!=='undefined'?success:function(){};
	success=typeof success!=='function'?function(){}:success;
	complete=typeof complete!=='undefined'?complete:function(){};
	complete=typeof complete!=='function'?function(){}:complete;
	error=typeof error!=='undefined'?error:function(){};
	error=typeof error!=='function'?function(){}:error;
	jsonError=typeof jsonError!=='undefined'?jsonError:function(e){ console.log(e);};

	var ajax='';
	if (window.XMLHttpRequest) {
		//Firefox, Opera, IE7, and other browsers will use the native object
		ajax = new XMLHttpRequest();
	} else {
		//IE 5 and 6 will use the ActiveX control
		ajax = new ActiveXObject("Microsoft.XMLHTTP");
	}
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
			complete();
		}
	};
};


//------------------------------------------------------------------------------
// appStart Engine
// Starting Application
//------------------------------------------------------------------------------
var appStart=function(data){
	this.create = _createNode;
	this.htmlCode = _htmlCode;
	this.init();
	this.buttonModuleClicked=false;
	this.createModuleButton(data.modules);
	this.assignCommand(data);
	window.yData={};
	window.yData=data;
};
appStart.prototype.init=function(){
	var containerArea=this.create('containerArea',document.body);
	$(containerArea).prop('className','yContainerArea');
	var headerArea=this.create('headerArea',containerArea);
	$(headerArea).prop('className','yHeaderArea');
	var menubarHomeButton=this.create('menubarHomeButton',headerArea);
	$(menubarHomeButton).prop('className','yMenubarButton');
	var imageMenubarHomeButton=this.create('img',menubarHomeButton);
	$(imageMenubarHomeButton).attr('src',"images/menubar/button_home.png");
	$(imageMenubarHomeButton).attr('alt','Home');
	var menubarTitle=this.create('div',headerArea);
	$(menubarTitle).prop('className','yMenubarTitle yFloatLeft');
	$(menubarTitle).text("senologsys");
	var menubarLogoutButton=this.create('menubarLogoutButton',headerArea);
	$(menubarLogoutButton).prop('className','yMenubarButton');
	var imageMenubarLogoutButton=this.create('img',menubarLogoutButton);
	$(imageMenubarLogoutButton).prop('src',"images/menubar/button_logout.png");
	$(imageMenubarLogoutButton).prop('alt','Home');
	var pageArea=this.create('pageArea',containerArea);
	$(pageArea).prop('className','yPageArea');
	var homeArea=this.create('homeArea',pageArea);
	$(homeArea).prop('className','yHomeArea');
	var homeAreaPanel=this.create('homeAreaPanel',homeArea);
	$(homeAreaPanel).prop('className','yHomePanel');
	var moduleArea=this.create('moduleArea',pageArea);
	$(moduleArea).prop('className','yModuleArea');
};
appStart.prototype.html=function(id,h){
	if(document.getElementById(id) !== 'null'){
		document.getElementById(id).innerHTML=h;
	}
};
appStart.prototype.load_script=function(url){
	var script=document.createElement('script');
	script.type='text/javascript';
	script.src=url;
	document.getElementsByTagName("head")[0].appendChild(script);
};
// Assign basic command of application framework
appStart.prototype.assignCommand=function(data){
	var that=this;
	var url_logout = 'C_home/logout';
	var moduleArea=document.getElementById('moduleArea');
	var homeArea=document.getElementById('homeArea');
	$('#moduleArea').css('display','none');
	$('#menubarHomeButton').click(function(){
		that.buttonModuleClicked=false;
		that.show_modules(data.modules);
		moduleArea.innerHTML='';
		$('#moduleArea').css('display','none');
		$('#homeArea').css('display','block');
	});
	$('#menubarLogoutButton').click(function(){
		that.buttonModuleClicked=false;
		moduleArea.innerHTML='';
		homeArea.innerHTML='';
		window.location=url_logout;
	});
};
appStart.prototype.createModuleButton=function(module_list){
	var that=this;
	var homeAreaPanel=document.getElementById('homeAreaPanel');
	homeAreaPanel.innerHTML='';
	var doCommand=function(){
		var mod_name=$(this).attr('mod');
		that.createModule(mod_name);
	};
	for(var i in module_list){
		var mod=module_list[i];
		var name=mod.name;
		var type=mod.type;
		if(name!='home'){
			var label=mod.label;
			var url_image='images/icon/'+name+'.png';
			var button=this.create('moduleButton_'+name,homeAreaPanel);
			$(button).prop('className','yModuleIcon');
			$(button).attr('mod',name);
			$(button).attr('type',type);
			$(button).attr('tabindex',i);

			var image=this.create('img',button);
			$(image).attr('src',url_image);
			$(image).attr('alt',name);
			$(image).attr('mod',name);
			var text=this.create('p',button);
			text.innerHTML=label;
		}
	}
	$(document).off('click','.yModuleIcon');
	$(document).on('click','.yModuleIcon',function(){
		if(!that.buttonModuleClicked){
			that.buttonModuleClicked=true;
			var mod_name=$(this).attr('mod');
			that.createModule(mod_name);
		}
		else{
			alert("Please wait, module is loading...");
		}
	});
};
appStart.prototype.show_modules=function(module_list){
	for(var i in module_list){
		var mod=module_list[i];
		var name=mod.name;
		if(name!='home'){
			var button=document.getElementById('moduleButton_'+name);
			$(button).css('display','block');
		}
	}
};
appStart.prototype.createModule=function(mod_name){
	var that=this;
	var url_button='C_'+mod_name+'/index';
	var success=function(h){
		if(typeof h.secure!=='undefined' &&  h.secure!=='' && typeof h.secure.module!=='undefined' && h.secure.module!=='' && typeof h.secure.access!=='undefined' && h.secure.access===true  && h.secure.login!=='undefined' && h.secure.login===true ){
			window.yData.module=mod_name;
			var moduleArea=document.getElementById('moduleArea');
			var objParam = {element:'div', id:'module_panel', className:'yModulePanel', content:''};
			var module_panel=that.htmlCode([objParam]);
			$('#moduleArea').html=module_panel;
			var script = document.createElement( 'script' );
			var windowLocationOrigin = window.location.origin;
			if (!windowLocationOrigin){
				windowLocationOrigin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
			}
			$(script).attr('src',windowLocationOrigin+'/js/v.rf.'+h.secure.module+'.js');
			$(script).attr('type','text/javascript');
			$(script).attr('language','javascript');
			$(script).attr('charset','UTF-8');
			document.getElementById('moduleArea').appendChild(script);
			$('#homeArea').css('display','none');
			$('#moduleArea').css('display','block');
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
appStart.prototype.session_check=function(){
	var callback=function(result){
		var session;
		if(result){session=result;}
		if(!session){
			window.location='C_home/logout';
		}
		else{
			return true;
		}
	};
	getAjaxText('C_home/get','',callback);
};

function yTab(field, event) {
    if (event.which == 13 /* IE9/Firefox/Chrome/Opera/Safari */ || event.keyCode == 13 /* IE8 and earlier */ ) {

		var tabIndex = $(field).attr('tabindex');
		var nextTabIndex = parseInt(tabIndex) + 1;
		var objNext = $('[tabindex='+nextTabIndex+']');
		objNext.focus();
		if( objNext.is('input:text')){
			objNext.select();
		}
        return false;
    }
    return true;
}

if(typeof window === 'object' && typeof window.document === 'object'){
	window.appStart = appStart;
	window.yHtml = _htmlCode;
	window.postAjax = postAjax;
	window.getAjax = getAjax;
	window.yTab = yTab;
}

})(window);
