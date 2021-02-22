function y_print_picking_ticket(object){
	var data=object.data;
	var book=0;
	var count_data=0;
	var max_page=100;
	var ticket_per_page=3;
	for(var i in data){count_data++;}
	if(count_data>0){
		var no_of_book=Math.floor((count_data/ticket_per_page)/max_page)+1;
		var html='';
		var message='total item ='+count_data+' no of file ='+no_of_book + ' please preview each file';
		var text_html=y_html([{element:'div',class:'y_message_box_text_row_padding',content:message}]);
		html+=y_html([{element:'div',class:'y_message_box_text_row',content:text_html}]);
		var img_print=y_html([{element:'img',class:'button_circle_image',src:'../images/menubar/print.png'}]);
		for(var i=0;i<no_of_book;i++)
		{
			var page=parseInt(i)+1;
			var start=i*max_page*ticket_per_page;
			var end=(i*max_page*ticket_per_page)+(max_page*ticket_per_page);
			if(end>count_data){end=count_data;}
			var book_message='item #'+(parseInt(start)+1)+' to #'+end;
			var book_info=y_html([{element:'div',class:'y_message_box_text_row_padding',content:book_message}]);
			var text_print=y_html([{element:'div',class:'button_circle_text',content:'file '+page}]);
			button=y_html([{element:'div',id:'print_doc_'+i,data:i,class:'button_circle',content:img_print+text_print}]);
			html+=y_html([{element:'div',class:'y_message_box_text_row',content:button+book_info}]);
			$('body').off('click','#print_doc_'+i);
			$('body').on('click','#print_doc_'+i,function(){
				var doc;
				doc=new jsPDF('landscape','mm','a4');
				doc.setProperties({
					title: 'Picking Ticket',
					subject: 'Picking Ticket',
					author: 'WTB',
					keywords: 'picing ticket',
					creator: 'WTB'
				});
				doc.setFont('helvetica');
				var this_page=parseInt($(this).attr('data'))
				var start_key=this_page*max_page*ticket_per_page;
				var end_key=(this_page*max_page*ticket_per_page)+(max_page*ticket_per_page);
				if(end_key>count_data){end_key=count_data;}
				var row=0;
				for(var key=start_key;key<end_key;key++)
				{
					y_create_picking_ticket(doc,data[key],row);row++;
					y_create_picking_ticket(doc,data[key],row);row++;
					if((row==6)&&(key+1!=end_key))
					{
						row=0;
						doc.addPage();
					}
				}
				doc.save('picking-ticket-'+this_page+'.pdf');
			});
		}
		y_message('Generate Picking Ticket',html);

	}
}
function y_create_picking_ticket(doc,data,row)
{
	var x=0;
	var xr=149;
	var y=0;
	var y2=71;
	var y3=141
	switch(row)
	{
		case 1: x=x+xr;
			break;
		case 2: y=y+y2;
			break;
		case 3: x=x+xr;y=y+y2;
			break;
		case 4: y=y+y3;
			break;
		case 5: x=x+xr;y=y+y3;
			break;
	}
	var date_field=y_format_long_date_id(data.delivery_schedule);
	var item_no=data.line_dealer;
	var item_total=data.total_line;
	var dealer_id=data.dealer_id;
	var dealer_code=data.dealer_code;
	var dealer_name=data.dealer_name;
	var dealer_city=data.dealer_city;
	var so_no=data.sales_order_no;
	var location=data.location_name;
	var part_no=data.part_no;
	var quantity=data.allocation_qty;
	var part_name=data.part_name;
	var model=data.model_code;
	var line_no='WTB-'+data.sales_period_code+'-0000/'+data.line_dealer;
	doc.setLineWidth(1);
	doc.rect(x+3,y+3,142,62);//outer old x+5
	doc.setLineWidth(0.5);
	var xa=x+8;//old x+10
	var ya=y+6;//old y+7
	// row 1
	//company box
	doc.setFontSize(14);doc.setFontType('bold');
	doc.rect(xa,ya,20,7);
	doc.text(xa+4,ya+5,'WTB');
	//title box
	doc.setFontSize(9);doc.setFontType('bold');
	doc.rect(xa+22,ya,55,7);
	doc.text(xa+35,ya+6,'PICKING TICKET');
	//date box
	doc.setFontSize(8);doc.setFontType('normal');
	doc.text(xa+80,ya+2,'DATE');
	doc.rect(xa+80,ya+3,30,4);
	doc.text(xa+82,ya+6,date_field);
	//item box
	doc.text(xa+114,ya+2,'ITEM NO');
	doc.rect(xa+114,ya+3,18,4);
	doc.text(xa+120,ya+6,item_no+'/'+item_total);
	yb=ya+12;
	//row 2
	//code dealer
	doc.setFontSize(7);doc.setFontType('normal');
	doc.text(xa,yb-1,'CODE');
	doc.rect(xa,yb,20,4);
	doc.text(xa+3,yb+3,dealer_id);
	//name dealer
	doc.text(xa+22,yb-1,'NAME');
	doc.rect(xa+22,yb,57,4);
	doc.text(xa+23,yb+3,dealer_code+'/'+dealer_name);
	//city
	doc.text(xa+83,yb-1,'CITY');
	doc.rect(xa+83,yb,22,4);
	doc.text(xa+84,yb+3,dealer_city);
	//so
	doc.text(xa+108,yb-1,'ORDER NO');
	doc.rect(xa+108,yb,24,4);
	doc.text(xa+109,yb+3,so_no);
	//row 3
	yc=yb+10
	//location
	doc.text(xa,yc-1,'LOCATION');
	doc.rect(xa,yc,20,5);
	doc.setFontSize(9);doc.setFontType('bold');
	doc.text(xa+3,yc+4,location);
	//part no
	doc.setFontSize(7);doc.setFontType('normal');
	doc.text(xa+22,yc-1,'PART NO');
	doc.rect(xa+22,yc,57,5);
	doc.setFontSize(9);doc.setFontType('bold');
	doc.text(xa+24,yc+4,part_no);
	//qty
	doc.setFontSize(7);doc.setFontType('normal');
	doc.text(xa+83,yc-1,'QUANTITY');
	doc.rect(xa+83,yc,22,5);
	doc.text(xa+84,yc+4,quantity);
	//picking
	doc.text(xa+108,yc-1,'PICKING');
	doc.rect(xa+108,yc,24,7);
	// row 4
	yd=yc+10;
	//part name
	doc.text(xa,yd-1,'PART NAME');
	doc.rect(xa,yd,62,5);
	doc.setFontSize(8);doc.setFontType('bold');
	doc.text(xa+1,yd+4,part_name);
	//model
	doc.text(xa+66,yd-1,'MODEL');
	doc.rect(xa+66,yd,15,5);
	doc.setFontSize(8);doc.setFontType('bold');
	doc.text(xa+67,yd+4,model);
	//line no
	doc.text(xa+85,yd-1,'LINE NO');
	doc.rect(xa+85,yd,47,5);
	doc.setFontSize(12);doc.setFontType('bold');
	doc.text(xa+87,yd+4,line_no);
	// page
	doc.setFontSize(8);doc.setFontType('normal');
	doc.text(x+27,y+59,item_no+' of '+item_total);
	//packer
	doc.setFontSize(7);doc.setFontType('normal');
	doc.text(x+62,y+51,'PACKER');
	doc.rect(x+61,y+48,15,5);
	doc.rect(x+61,y+53,15,9);
	//checker
	doc.text(x+77,y+51,'CHECKER');
	doc.rect(x+76,y+48,15,5);
	doc.rect(x+76,y+53,15,9);
	//case no
	doc.text(x+95,y+47,'CASE NO');
	doc.rect(x+95,y+48,15,5);
	doc.rect(x+95,y+53,15,9);
	doc.rect(x+110,y+48,15,5);
	doc.rect(x+110,y+53,15,9);
	doc.rect(x+125,y+48,15,5);
	doc.rect(x+125,y+53,15,9);
}

function y_margin_to_center(text,font_size,width)
{
	if(text!='')
	{	
		var pica=4.217;
		var len=text.length;
		return (width-(len*font_size/pica))/2;
	}
	else
	{
		return 0;
	}
}
