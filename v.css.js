// Implementation of Y_Framework_CSS for www.ptwtb.com
// 2017.09.13
// - minor fix
// - freeze coloumn on info_form
(function(window,undefined){
var document=window.document;
var location=window.location;
var css=window.css;
var min_width_with_sidebar=600;
function create_css(){
	init_css();
	css.responsive(_callback);
}
var _dimension=function(){
	var min_width = 240;
	var min_height = 240;
	this.onSidebarToogle=function(){
		var sidebar=document.getElementById('panel_sidebar');
		if(sidebar!==null && typeof sidebar.offsetWidth !== 'undefined'){
			var sidebar_data=document.getElementById('sidebar_data');
			var current_width=sidebar.offsetWidth;
			var new_width;
			if(current_width!=200) new_width=200;
			else new_width=26;
			var diff=new_width-current_width;
			this.module.sidebar.width=new_width;
			this.module.main.width-=diff;
			css.style('#panel_sidebar','width',css.px(this.module.sidebar.width),10);
			css.style('#panel_main','width',css.px(this.module.main.width),10);
			css.style('.panel_info','left',css.px(new_width));
			set_style_inside_panel_main(css,this);
			if(new_width!=200) sidebar_data.style.display='none';
			else sidebar_data.style.display='';
		}
	};
	var w=parseInt(css.get_width());if(w<min_width) w=min_width;
	var h=parseInt(css.get_height());if(h<min_height) h=min_height;
	var wPage=w;
	var h_page=h-120; // header and footer = 120px
	var w_module=wPage; var h_module=h_page;
	var w_sidebar=200; var h_sidebar=h_page;
	var w_main=w_module-w_sidebar; var h_main=h_page;
	this.body={width:w,height:h};
	this.page={width:wPage,height:h_page};
	this.module={};
	this.module={width:w_module,height:h_module};
	this.module.sidebar={width:w_sidebar,height:h_sidebar};
	this.module.main={width:w_main,height:h_main};
	this.module.sidebar.data={height:h_sidebar-26};
};
_dimension.prototype.set_width=function(id,width){
	var result=false;
	var element=css.get_Elementdocument.getElementById(id);
	if(element!== null){result=element.style.width=css.px(width);}
	return result;
};
_dimension.prototype.set_height=function(id,height){
	var result=false;
	var element=css.get_Elementdocument.getElementById(id);
	if(element!== null){result=element.style.height=css.px(height);}
	return result;
};
function init_css(){
	var themes='themes/default';
	window.dim=new _dimension();
	var frame=[
		{class:'panel_info',
			height:css.px(dim.module.main.height),
			width:css.px(dim.module.main.width)},
		{class:'panel_info_table_row',
			min_width:css.px(dim.module.main.width-14)},
		{class:'panel_info_table_wrapper',
			float:'left',
			width:css.px(dim.module.main.width),
			height:css.px(dim.module.main.height-60-26),
			overflow_x:'auto',
			overflow_y:'hidden'},
		{class:'panel_info_table_freeze',
			position:'absolute',
			height:css.px(dim.module.main.height-60-26-14),
			top:'86px',
			overflow_x:'hidden',
			overflow_y:'hidden'},
		{class:'panel_info_table_data',
			float:'left',
			height:css.px(dim.module.main.height-60-26-26-26-14),
			overflow_x:'hidden',
			overflow_y:'auto'},
		{class:'panel_info_table_freeze_data',
			float:'left',
			height:css.px(dim.module.main.height-60-26-26-26-14),
			overflow_x:'hidden',
			overflow_y:'hidden'},
		{class:'panel_help_table_data',
			float:'left',
			width:'100%',
			height:css.px(dim.module.main.height-60-26-14),
			overflow_x:'hidden',
			overflow_y:'auto'},
		{class:'panel_input_row_with_sidebar',
			float:'left',
			height:'26px',
			min_width:css.px(dim.module.main.width)
		},
		{class:'panel_footer_data_with_sidebar',
			float:'left',
			height:'14px',
			min_width:css.px(dim.module.main.width)
		},
		{class:'panel_input_row_with_sidebar_with_margin',
			float:'left',
			height:'26px',
			min_width:css.px(dim.module.main.width),
			margin_top:'8px'
		}
	];
	css.add(frame);
	var width=[];
	for(var i=1; i<1500; i++){
		var obj={
			class:'width_'+i,
			width:css.px(i)
		};
		width.push(obj);
	}
	css.add(width);
	var height_array=[26,36,38];
	var height=[];
	for(var j in height_array){
		var h_obj={
			class:'height_'+height_array[j],
			height:css.px(height_array[j])
		};
		height.push(h_obj);
	}
	css.add(height);
	css.create();
}

function set_style_inside_panel_main(css,dim){
	css.style('.panel_info','height',css.px(dim.module.main.height));
	css.style('.panel_info','width',css.px(dim.module.main.width));
	css.style('.panel_info_table_row','min-width',css.px(dim.module.main.width-14));
	css.style('.panel_info_table_wrapper','width',css.px(dim.module.main.width));
	css.style('.panel_info_table_wrapper','height',css.px(dim.module.main.height-60-26));
	css.style('.panel_info_table_freeze','height',css.px(dim.module.main.height-60-26-14));
	css.style('.panel_info_table_data','height',css.px(dim.module.main.height-60-26-26-26-14));
	css.style('.panel_info_table_freeze_data','height',css.px(dim.module.main.height-60-26-26-26-14));
	css.style('.panel_help_table_data','height',css.px(dim.module.main.height-60-26-14));
	css.style('.panel_input_row_with_sidebar','min-width',css.px(dim.module.main.width));
	if(dim.module.main.width < 600)
	{
		css.style('.panel_row_master','height',css.px(58));
	}
	else{
		css.style('.panel_row_master','height',css.px(26));
	}
	css.style('.panel_footer_data_with_sidebar','min-width',css.px(dim.module.main.width));
	css.style('.panel_input_row_with_sidebar_with_margin','min-width',css.px(dim.module.main.width));
	var w=css.style('.panel_input_row_with_sidebar_with_margin','width');
	if(w<dim.module.main.width){
		css.style('.panel_input_row_with_sidebar_with_margin','width',css.px(dim.module.main.width));
	}
}
function _callback(css){
	window.dim = new _dimension();
	var sidebar=document.getElementById('panel_sidebar');
	css.style('#panel_sidebar','width',css.px(dim.module.sidebar.width));
	css.style('#panel_main','width',css.px(dim.module.main.width));
	set_style_inside_panel_main(css,dim);
	if(sidebar!==null && typeof sidebar.offsetWidth !== 'undefined'){
		var sidebar_data=document.getElementById('sidebar_data');
		var current_width=sidebar.offsetWidth;
		if(typeof sidebar_data!=='undefined' && sidebar_data.style.display=='none'){
			var new_width=26;
			var diff=new_width-current_width;
			dim.module.sidebar.width=new_width;
			dim.module.main.width-=diff;
			css.style('#panel_sidebar','width',css.px(dim.module.sidebar.width));
			css.style('#panel_main','width',css.px(dim.module.main.width));
			css.style('.panel_info','left',css.px(new_width));
			css.set_width('.panel_info',dim.module.main.width);
			css.set_width('.panel_info_table_wrapper',dim.module.main.width);
			css.style('.panel_info_table_row','min-width',css.px(dim.module.main.width-14));
		}
		else if(sidebar_data.style.display!='none' && dim.page.width<min_width_with_sidebar && current_width==200){
			document.getElementById('sidebar_toogle').click();
		}
	}
}
if(typeof window === 'object' && typeof window.document === 'object'){
	create_css();
	window.redimension=_callback;
}
})(window);
