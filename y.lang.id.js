(function (window, undefined) {
    const yLang = {
        confirmationDownload: 'Download ?',
        confirmationSubmit: 'Are you sure to submit?',
        confirmationRecordCreate: 'Are you sure to create new record?',
        confirmationRecordEdit: 'Are you sure to edit record?',
        filterApply: 'Filter by',
        filterClear: 'Clear All Filters',
        download: 'Download',
        new: 'New',
        open: 'Open',
        recordClone: 'Clone',
        
        // Table Info
        processingRecordNo_Of_ :'Processing... Record No %1 of %2',
        showAll: 'Show All',
        showMore_Row: 'Show More %1 Row',
        showMore_Rows: 'Show More %1 Rows',
        showRecordLength: 'Show %1 of %2',
        
        uploadCsv: 'Upload CSV'
    }

    const yStr = function (string, param){
        string = typeof string !== 'undefined' ? string: false
        param = typeof param !== 'undefined' ? param : false
        
        let res = typeof yLang[string] !== 'undefined' ? yLang[string] : '#N/A'
        if(param){
            if(!Array.isArray(param)){
                //const reg = /(?<!\\)(?:\\\\)*(?:%1)/g
                const reg = /(?:%1)/g
                res = res.replace(reg, param)
            }
            else{
                param.map( (val, idx) => {
                    //const strReg = '\(?<!\\\\\)\(?:\\\\\\\\\)*(?:%' + (idx+1) +  '\)'
                    const strReg = '\(?:%' + (idx+1) +  '\)'
                    const reg = new RegExp(strReg, 'g')
                    res = res.replace(reg, val)
                })
            }
        }
        return res
    }
    if (typeof window === 'object' && typeof window.document === 'object') {
		window.yStr = yStr;
	}
})(window)
