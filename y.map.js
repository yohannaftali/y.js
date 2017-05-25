(function(window,undefined){
var document=window.document;
var location=window.location;
//------------------------------------------------------------------------------
// y Map
// Object for Map
//------------------------------------------------------------------------------
var map=function(selector){
	this.selector=false;
	this.dummy=false;
	return new map.prototype.init(selector);
};
map.prototype={
	init: function(selector){
		
	},
	start: function(data){
		
	},
	on: function(a,b,c){
		
	},
	off: function(a,b,c){
		
	},
	click: function(fn){
		
	},
	ready: function(fn){
		
	}
};
map.prototype.init.prototype = map.prototype;
//y.fn.init.prototype = y.fn;
if(typeof window === 'object' && typeof window.document === 'object'){
	window._=window.y=y;
	window.yMap=map(document);
}
})(window);