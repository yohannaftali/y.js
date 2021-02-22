//----------------------------------------------------------------------------------------------------------------------
// RF Framework
// 2017.01.05
// create rfPanel Class
// 2017.05.23
// fixed stability
// 2017.05.26
// fixed stability
// 2017.05.29
// revise submit method
// 2017.05.30
// add alertMessage method to rfPanel Class
// 2017.05.31
// add validateInput method to rfPanel Class
// optimize code
// 2017.06.02
// optimize page creation
// 2017.06.06
// add callback function after show page
// 2017.06.07
// add space in separator
//----------------------------------------------------------------------------------------------------------------------
(function (window, undefined) {

    var rfPanel=function(param){
        param.name = param.module;
        var url=location.href;
        var baseURL=url.substring(0, url.indexOf('/', 14));
    
        // Object Variable
        this.controller=baseURL+'/C_'+param.module+'/';
        this.pageResult={};
        this.submitProgress=false;
    
        // Write Panel
        this.writePanel(param);
        
        // Call init
        this.init();
    };
    rfPanel.prototype.init = function(){
        $(document).on("keypress", ".yInputBox", function(e) {
            if(e.keyCode == 13) {
                e.preventDefault();
                var pageId = $(this).attr('parent');
                if(pageId){
                    var buttonId = 'navigationButtonNext' + pageId;
                    $("#"+buttonId).click();
                 }
             }
        });
    };
    rfPanel.prototype.writePanel=function(param){
        this.idMainPanel = 'mainPanel_'+param.name;
        this.idForm = 'form_'+param.name;
        var h=yHtml([
            {element:'form', id:this.idForm, content:yHtml([
                {element:'div', id:this.idMainPanel, className:'yMainPanel yFloatLeft'}
            ])}
        ]);
        $('#moduleArea').append(h);
        this.writePage(param);
    };
    rfPanel.prototype.writePage=function(param){
        var that = this;
        var pages = typeof param.page!=='undefined'?param.page:false;
        if(pages){
            var h = '';
            for(var i in pages){
                var page = pages[i];
                var pageName = typeof page.name!=='undefined'?page.name:false;
                var master = typeof page.master!=='undefined'?page.master:false;
                var detail = typeof page.detail!=='undefined'?page.detail:false;
                var input = typeof page.input!=='undefined'?page.input:false;
                var pageId = '_' + param.name+'_'+page.name;
                if(input && pageName){
                    //var masterHtml = '';
                    var isNumber = typeof(input.isNumber)!=='undefined'?input.isNumber:false;
                    var allowEmpty = typeof(input.allowEmpty)!=='undefined'?input.allowEmpty:false;
                    var typeValidation = isNumber === true ? 1 : 0;
                    typeValidation = allowEmpty === true ? 99 : typeValidation;
                    var masterHtml = master ? that.htmlPageMaster(master, pageId) : '';
                    var detailHtml = detail ? that.htmlPageDetail(detail, pageId) : '';
    
                    // MasterDetail Container
                    var masterDetailHtml = yHtml([
                        {element:'div', className:'yMasterDetailPanel yFloatLeft', content: masterHtml + detailHtml}
                    ]);
    
                    // Input
                    var inputHtml = input ? that.htmlPageInput(input, pageId) : '';
                    var navigationHtml = that.htmlPageNavigation(i, pages, param);
    
                    // inputHtml
                    var pageHtml = masterDetailHtml + inputHtml + navigationHtml;
                    h += yHtml([
                        {element:'div', id:'pagePanel'+pageId, className:'yPagePanel yFloatLeft', parent:i, content:pageHtml}
                    ]);
                }
                else if(pageName){
                    var masterHtml = master ? that.htmlPageMaster(master, pageId) : '';
                    var detailHtml = detail ? that.htmlPageDetail(detail, pageId) : '';
    
                    // MasterDetail Container
                    var masterDetailHtml = yHtml([
                        {element:'div', className:'yMasterDetailPanel yMasterDetailPanelNoInput yFloatLeft', content: masterHtml + detailHtml}
                    ]);
    
                    var navigationHtml = that.htmlPageNavigation(i, pages, param);
    
                    var pageHtml = masterDetailHtml + navigationHtml;
                    h += yHtml([
                        {element:'div', id:'pagePanel'+pageId, className:'yPagePanel yFloatLeft', parent:i, content:pageHtml}
                    ]);
                }
            }
            $('#'+this.idMainPanel).append(h);
            $('.yNavigationButton').click(function(){
                var gotoPage = parseInt($(this).attr('data'));
                var pageId = $(this).attr('parent');
                var string = $('#input'+pageId).val();
                var typeValidation = typeof($(this).attr('tag')) !== 'undefined' ? $(this).attr('tag') : false;
                var valid = that.validateInput(string, typeValidation);
                if(gotoPage === 99){
                    if(valid){
                        that.submitPage(param, pageId);
                    }else{
                        alert("Check Input");
                        $('#input'+pageId).focus();
                    }
                }else if(gotoPage === 98){
                    that.resetPage(param);
                }else{
                    if(valid){
                        that.showPage(gotoPage, param);
                    }else{
                        alert("Check Input");
                        $('#input'+pageId).focus();
                    }
                }
            });
            $('.yPagePanel').hide();
            that.showPage(0, param);
        }
    };
    rfPanel.prototype.htmlPageMaster=function(master, pageId){
        var master = typeof master!=='undefined'?master:false;
        var pageId = typeof pageId!=='undefined'?pageId:false;
        var result = '';
        if(master && pageId){
            var html = '';
            var fields = typeof master.field!=='undefined'?master.field:false;
            if(fields){
                var masterLabel = typeof master.label!=='undefined'?master.label:'';
                html += yHtml([{element:'div', className:'yTitleMaster yFloatLeft', content: masterLabel}]);
                for(var i in fields){
                    var field = fields[i]
                    var label = typeof(field.label)!=='undefined'?field.label:'';
                    var name = typeof(field.name)!=='undefined'?field.name:'';
                    var value = typeof(field.value)!=='undefined'?field.value:'';
                    var id = 'dataMaster' + pageId+'_'+name;
                    html += yHtml([{element:'div', className:'yRowMaster yFloatLeft', content:yHtml([
                            {element:'div', className:'yLabelRowMasterText yFloatLeft', content:label},
                            {element:'div', className:'ySeparatorRowMasterText yFloatLeft', content:' : '},
                            {element:'div', id:id, data:name, row:i, className:'yContentRowMasterText yFloatLeft', content:value}
                        ])
                    }]);
                }
            }
            result = yHtml([{element:'div', id:'masterPanel' + pageId, className:'yMasterPanel yFloatLeft', content: html}]);
        }
        return result;
    };
    rfPanel.prototype.htmlPageDetail=function(detail, pageId){
        var detail = typeof detail!=='undefined'?detail:false;
        var pageId = typeof pageId!=='undefined'?pageId:false;
        var result = '';
        if(detail && pageId){
            var fields = typeof detail.field!=='undefined'?detail.field:false;
            if(fields){
                var label = typeof detail.label!=='undefined'?detail.label:'';
                var title = yHtml([{element:'div', className:'yTitleDetail yFloatLeft', content: label}]);
                var data = yHtml([{element:'div', id: 'dataDetail'+pageId, className:'yDataDetail yFloatLeft'}]);
                result = yHtml([{element:'div', id:'detailPanel' + pageId, className:'yDetailPanel yFloatLeft', content: title + data}]);
            }
        }
        return result;
    }
    rfPanel.prototype.htmlPageInput=function(input, pageId){
        var input = typeof input!=='undefined'?input:false;
        var pageId = typeof pageId!=='undefined'?pageId:false;
        var result = '';
        if(input && pageId){
            var label = typeof input.label!=='undefined'?input.label:'';
            var name = typeof input.name!=='undefined'?input.name:false;
            var data = typeof input.data!=='undefined'?input.data:'';
            result = yHtml([
                {element:'div', id:'inputPanel'+pageId, className:'yInputPanel yFloatLeft', content: yHtml([
                    {element:'div', className:'yInputLabel yFloatLeft', content:label},
                    {element:'input', name:name, parent:pageId, data:data, id:'input'+pageId, className:'yInputBox yFloatLeft'},
                    {element:'input', type:'hidden', name:name+'_hidden', parent:pageId, data:data, id:'input'+pageId+'_hidden', className:'yInputHidden'}
                ])}
            ]);
        }
        return result;
    };
    rfPanel.prototype.htmlPageNavigation=function(noPage, pages, param){
        var noPage = typeof noPage!=='undefined'?noPage:false;
        var pages = typeof pages!=='undefined'?pages:pages;
        var result = '';
        if(noPage && pages){
            var page = typeof(pages[noPage])!=='undefined' ? pages[noPage]: false;
            var pageName = typeof page.name!=='undefined'?page.name:false;
            var input = typeof page.input!=='undefined'?page.input:false;
            if(page && pageName && input){
                var maxPages = pages.length;
                var pageId = '_' + param.name+'_'+page.name;
                var isNumber = typeof(input.isNumber)!=='undefined'?input.isNumber:false;
                var allowEmpty = typeof(input.allowEmpty)!=='undefined'?input.allowEmpty:false;
                var typeValidation = isNumber === true ? 1 : 0;
                typeValidation = allowEmpty === true ? 99 : typeValidation;
                var prevPage = parseInt(noPage)-1 >= 0 ? parseInt(noPage)-1 : 0;
                var nextPage = parseInt(noPage)+1 < maxPages ? parseInt(noPage)+1 : 99;
                var nextLabel = nextPage === 99 ? "submit" : "next";
                result = yHtml([
                    {element:'div', id:'navigationPanel' + pageId, className:'yNavigationPanel yFloatLeft', content: yHtml([
                        {element:'div', id:'navigationButtonPrev'+pageId, parent:pageId, data:prevPage, className:'yNavigationButton yNavigationButtonPrev yFloatLeft', content:'prev'},
                        {element:'div', id:'navigationButtonReset'+pageId, parent:pageId, data:98, className:'yNavigationButton yNavigationButtonReset yFloatLeft', content:'reset'},
                        {element:'div', id:'navigationButtonNext'+pageId, parent:pageId, tag:typeValidation, data:nextPage, className:'yNavigationButton yNavigationButtonNext yFloatLeft', content:nextLabel}
                    ])}
                ]);
            } 
            else if(page && pageName){
                var maxPages = pages.length;
                var pageId = '_' + param.name+'_'+page.name;
                var typeValidation = 0;
                var prevPage = parseInt(noPage)-1 >= 0 ? parseInt(noPage)-1 : 0;
                var nextPage = parseInt(noPage)+1 < maxPages ? parseInt(noPage)+1 : 99;
                var nextLabel = nextPage === 99 ? "submit" : "next";
                result = yHtml([
                    {element:'div', id:'navigationPanel' + pageId, className:'yNavigationPanel yFloatLeft', content: yHtml([
                        {element:'div', id:'navigationButtonPrev'+pageId, parent:pageId, data:prevPage, className:'yNavigationButton yNavigationButtonPrev yFloatLeft', content:'prev'},
                        {element:'div', id:'navigationButtonReset'+pageId, parent:pageId, data:98, className:'yNavigationButton yNavigationButtonReset yFloatLeft', content:'reset'},
                        {element:'div', id:'navigationButtonNext'+pageId, parent:pageId, tag:typeValidation, data:nextPage, className:'yNavigationButton yNavigationButtonNext yFloatLeft', content:nextLabel}
                    ])}
                ]);
            }
        }
        return result;
    };
    rfPanel.prototype.prepareHeaderTableDetail=function(detailField){
        var contentDetailHeaderHtml = '';
        for(var i in detailField){
            var labelContent = typeof detailField[i].label!=='undefined'?detailField[i].label:'';
            var nameContent = typeof detailField[i].name!=='undefined'?detailField[i].name:'';
            contentDetailHeaderHtml += yHtml([{element:'th', className:'yTableHeaderDetail', data:nameContent, col: i, content:labelContent}]);
        }
        var result = yHtml([{element:'tr', className:'yTableRowDetail', content: contentDetailHeaderHtml}]);
        return result;
    };
    rfPanel.prototype.prepareTableDetail=function(htmlHeader, htmlBody, htmlFooter){
        htmlHeader = typeof(htmlHeader) !== 'undefined' ? htmlHeader : '';
        htmlBody = typeof(htmlBody) !== 'undefined' ? htmlBody : '';
        htmlFooter = typeof(htmlFooter) !== 'undefined' ? htmlFooter : '';
        var htmlTableDetail = yHtml([{element:'table', className:'yTableDetail', content:yHtml([
            {element:'thead', className:'yTableHeaderDetail', content: htmlHeader},
            {element:'tfoot', className:'yTableFooterDetail', content: htmlFooter},
            {element:'tbody', className:'yTableBodyDetail', content: htmlBody}
        ])}]);
        return htmlTableDetail;
    };
    rfPanel.prototype.showPage=function(noPage, param){
        var that = this;
        var getUrl=this.controller+'get_page_'+noPage;
        var serial = $('#'+this.idForm).serialize();
        var maxWarning = 2;
        var callback=function(res){
            var resError = typeof(res.error !== 'undefined') ? res.error : false;
            var pages = typeof param.page!=='undefined'?param.page:false;
            var page = pages[noPage];
            var pageId = '_' + param.name+'_'+page.name;
            var pageFailCallback = typeof page.callbackFail!=='undefined'?page.callbackFail:false;
            if(!resError){
                that.pageResult[noPage] = res;
                var pageName = typeof page.name!=='undefined'?page.name:false;
                var master = typeof page.master!=='undefined'?page.master:false;
                var detail = typeof page.detail!=='undefined'?page.detail:false;
                var pageCallback = typeof page.callback!=='undefined'?page.callback:false;
                var resMaster = typeof(res.master !== 'undefined') ? res.master : false;
                var	resDetail = typeof(res.detail !== 'undefined') ? res.detail : false;
                // Populate Master
                if(master && resMaster){
                    var masterField = typeof(master.field)!=='undefined' ? master.field :
                        typeof(master.fields)!=='undefined' ? master.fields : false;
                    if(masterField){
                        for(var i in masterField){
                            var masterFieldName = typeof(masterField[i].name) !== 'undefined' ? masterField[i].name : false;
                            var dataMasterId = 'dataMaster' + pageId + '_' + masterFieldName;
                            var resValue = typeof(resMaster[masterFieldName])!=='undefined'?resMaster[masterFieldName]:'';
                            $('#'+dataMasterId).html(resValue);
                        }
                    }
                }
                // Populate Detail
                if(detail && resDetail){
                    that.populateTableDetail(pageId, detail, resDetail);
                }
                $('.yPagePanel').hide();
                $("[parent='"+noPage+"']").show();
                if(pageCallback){
                    pageCallback(res, that, this);
                }
                setTimeout(function() { 
                    if(pageId && document.getElementById("input"+pageId)){
                        document.getElementById("input"+pageId).focus();
                    }
                }, 100);
            }else{
                while(maxWarning > 0){
                    var resMessage = typeof(res.message !== 'undefined') ? res.message : false;
                    if(resMessage){
                        that.alertMessage(resMessage);
                        maxWarning--;
                    }
                    else{
                        alert("error");
                        maxWarning--;
                    }
                    if(pageFailCallback){
                        pageFailCallback(res, that, this);
                        maxWarning--;
                    }
                }
                setTimeout(function() { document.getElementById("input"+pageId).focus(); }, 100);
            }
        };
        getAjax(getUrl, serial, callback);
    };
    rfPanel.prototype.populateTableDetail=function(pageId, detail, resDetail){
        var that = this;
        var detailField = typeof(detail.field)!=='undefined' ? detail.field :
            typeof(detail.fields)!=='undefined' ? detail.fields : false;
        if(detailField){
            // prepare col names
            var colNames = [];
            var index = 0;
            for(var j in detailField){
                colNames[index] = typeof(detailField[j].name) !== 'undefined' ? detailField[j].name : false;
                index ++;
            }
            var htmlBodyDetail = '';
            for(var k in resDetail){
                var resDetailRow = resDetail[k];
                var tableRowHtml = '';
                if(typeof(resDetailRow['yTableDataGroup']) !== 'undefined' && resDetailRow['yTableDataGroup'] !== ''){
                    var resValueDetailRow = resDetailRow['yTableDataGroup'];
                    var noColSpan = typeof(resDetailRow['yTableDataGroupSpan']) !== 'undefined' ? resDetailRow['yTableDataGroupSpan'] : 1;
                    tableRowHtml += yHtml([{element:'td', colspan: noColSpan, className:'yTableDataGroup', col: colName, row: parseInt(k)+1, content:resValueDetailRow}]);
                }
                else{
                    for(var l in colNames){
                        var colName = colNames[l];
                        var resValueDetail = resDetailRow[colName];
                        tableRowHtml += yHtml([{element:'td', colspan: '1', className:'yTableData', col: colName, row: parseInt(k)+1, content:resValueDetail}]);
                    }
                }
                htmlBodyDetail += yHtml([{element:'tr', content: tableRowHtml}]);
            }
            var htmlHeaderDetail = that.prepareHeaderTableDetail(detailField);
            var tableHtml = that.prepareTableDetail(htmlHeaderDetail, htmlBodyDetail);
            var tableDetailId = 'dataDetail' + pageId;
            $('#'+tableDetailId).html(tableHtml);
        }
    };
    rfPanel.prototype.resetPage=function(param){
        $('.yInputBox').val('');
        $('.yContentRowMasterText').html('');
        $('.yDataDetail').html('');
        this.showPage(0, param);
    };
    rfPanel.prototype.alertMessage=function(resMessage){
        var message = '';
        for(var i in resMessage){
            message += resMessage[i] + '\n';
        }
        alert(message);
    };
    rfPanel.prototype.submitPage=function(param, pageId){
        var that = this;
        if(!that.submitProgress){
            that.submitProgress = true;
            var submitUrl=this.controller+'submit';
            var serial = $('#'+this.idForm).serialize();
            var callback_before_submit = typeof param.validation!=='undefined'?param.validation:false;
            var callback_after_submit = typeof param.callback!=='undefined'?param.callback:false;
            var isValid = true;
            if(callback_before_submit){
                isValid = callback_before_submit(that, this);
            }
            if(isValid){
                var callback=function(res){
                    var error = typeof(res.error)!=='undefined'?res.error:false;
                    var resMessage = typeof(res.message)!=='undefined'?res.message:false;
                    that.alertMessage(resMessage);
                    if(!error){
                        that.resetPage(param);
                        if(callback_after_submit){
                            callback_after_submit(res, that, this);
                        }
                    }
                    else{
                        $('#input'+pageId).focus();
                    }
                    that.submitProgress=false;
                };
                postAjax(submitUrl, serial, callback);
            }
            else{
                $('#input'+pageId).focus();
                that.submitProgress=false;
            }
        }
    };
    rfPanel.prototype.validateInput=function(string, type){
        var that = this;
        var valid = true;
        type = typeof(type) !== 'undefined' ? parseInt(type) : false;
        if(type && type !== 99){ // type 99 = allowEmpty true
            switch(type) {
                case 1: // isNumber True
                    valid = that.checkIsNumber(string);
                    break;
                case 2: // isDate True
                    valid = true;
                    break;
                default:
                    valid = string.replace(/\s/g, "").length > 0 ? true : false;
            }
        }
        return valid;
    };
    rfPanel.prototype.checkIsNumber=function(str){
        var re = /^-?\d\d*$/;
        return re.test(str);
    };
    if(typeof window === 'object' && typeof window.document === 'object'){
        window.rfPanel=rfPanel;
    }
    })(window);
    