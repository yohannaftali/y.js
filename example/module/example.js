const param = {
    module: 'module_name',
    type: 'md', // options: 'm', 'md', 'mdh'
    label: { master: '', detail: '', history: ''},
    getInitData:true, // if no init data, set to false
    beforeLoad: (obj) => {
        // example adding new field
        const cont = { name: 'initField', label: '', row:99, col: 's12', label_info: true }
        obj.field.master.push(cont)
		},
		afterLoad: (obj) => {
        // call function inside Form class
        obj.callbackAfterLoadInit(obj.initData)
		}
}

class Form extends YForm {
    constructor() {
        super(param)
        this.field.sampleTable = [
            { name: 't1', label: 'Field t1' }, // type label
            { name: 't2', label: 'Field t2', textarea: true, newRowTrigger: true }, // type input textarea trigger new row when focus
            { name: 't3', label: 'Field t3', select: true }, // type input select
        ]
        this.field.master = [
            { name: 'id', label: 'key', is_main: true, is_key: true }, // type label
            { name: 'm1', label: 'Field m1', label_info: true, row: 1, col: 's4 m3 l3' }, // type label
            { name: 'm2', label: 'Field m2', row: 2, col: 's4 m3 l3' }, // type input
            { name: 'm3', label: 'Field m3', select: true, row: 3 }, // type input select
            { name: 'sampleTable', label: 'Sample Table', table: true, resize: true, row: 4, col: 's12 m12 l12', content: this.field.sampleTable },
        ]
        this.field.detail = [
            { name: 'id', label: 'Key', serialize: false, hidden: true },
            { name: 'd1', label: 'Field d1' },
            { name: 'd2', label: 'Field d2', filter: true },
        ]
        this.init()
    }
    init() {
       this.superinit(() => {
           this.resetMaster()
           this.writeDetail()
           this.handleAction()
           this.detailMode()
           this.hideTitleDocument()
       })
    }
    
    handleAction() {
       this.buttonSubmitAction()
       this.enableDetailHiddenKey(
           () => {
              this.masterMode();
           },
           () => {
               this.afterLoadMaster()
               this.activateLabel()
           },
           () => { }
       )
       this.createButtonBack(undefined, () => {
           $('#input_id').val('')
           $('#label_info_id').val('')
           this.resetMaster()
           this.writeDetail()
       })
       this.create_button_new('New', false, () => {
           this.afterLoadMaster();
           this.addRow('sampleTable');
           this.insertMode();
       })
       this.listenerSelectFieldT2()
       this.panel.initSelect('m3', function () {
           ...
       })
   }
   insertMode() {
       this.data = {}
       this.masterMode()
       this.resetMasterTables(() => {
           this.enableMasterInput()
           this.activateLabel()
       })
    }
    afterLoadMaster() {
        this.setAutoAddRow('sampleTable', 't2')
        this.panel.initSelect('sampleTable', function () { })
    }
    listenerSelectFieldT2() {
        ...
    }
    callbackAfterLoadInit() {
        ...
    }
}
new Form()
