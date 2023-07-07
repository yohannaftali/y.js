//----------------------------------------------------------------------------------------------------------------------
// Y Panel Framework
// version=230527
//----------------------------------------------------------------------------------------------------------------------
// 2022-04-20 - remove class red from button select and print button
// 2022-06-16 - datetime array
// 2022.06.20 - fix multiparam generated id
// 2022.09.08 - fix select on modal master
// 2022.09.23 - initSelectField
// 2022.10.06 - add radio option for table
// 2022.11.11 - add input type file and preview image
// 2023.01.10 - implement select 2
// 2023.01.12 - add option yearRange, minDate, maxDate to datepickerdetailHeader
// 2023.02.20 - add class with item.name at td row on writeRow function
// 2023.03.20 - fix class radio group name
// 2023.03.23 - write cell input fix for radio without label must have span
// 2023.03.27 - fix autocomplete class on cell input
// 2023.04.17 - fix show wait
// 2023.05.27 - add locale options for table auto sum
//----------------------------------------------------------------------------------------------------------------------
(function (window, undefined) {
    var document = window.document

    /* Panel Object */
    class Panel {
        constructor(param) {
            this.form = param

            this.formatDate = typeof param.formatDate !== 'undefined' ? param.formatDate : 'dd/mm/yyyy'
            this.formatTime = typeof param.formatTime !== 'undefined' ? param.formatTime : 'hh:ii'
            this.queryUrl = typeof param.queryUrl !== 'undefined' ? param.queryUrl : ''

            this.master = '.panel_y_master_data'
            this.detailHeader = '.panel_y_detail_table_header'
            this.detail = '.panel_y_detail_table_data'
            this.historyHeader = '.panel_y_history_table_header'
            this.history = '.panel_y_history_table_data'

            this.masterTable = []

            this.collapsibleMaster
            this.collapsibleDetail
            this.collapsibleHistory

            this.withToolbar = true

            // Materialize
            this.modeSelect = 'materialize'
            this.instancesTooltip
            this.instancesDate
            this.instancesTime
            this.instancesSelect = []
            this.instancesSelectFilter = []
            this.selectList = []
            this.selectController = []
            this.resSelect = []
            this.selectFilterList = []
            this.selectFilterController = []
            this.resSelectFilter = []
            this.rowRadio = []

            this.writePanel(param)

            this.listenerWindowResize()
            this.set_default_panel_height = function () { }
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Write Panel
        /////////////////////////////////////////////////////////////////////////////////////
        writePanel(param) {
            const h = yHtml([
                this.panelToolbar(),
                {
                    element: 'div',
                    id: 'module-content',
                    class: '',
                    content: yHtml([{
                        element: 'div',
                        class: 'content-wrapper',
                        content: yHtml({
                            element: 'form',
                            id: param.name,
                            class: 'form-module',
                            enctype: 'multipart/form-data',
                        })
                    }])
                }
            ])
            //document.getElementById('module-panel').innerHTML += h
            $('#module-panel').append(h);
            switch (param.type) {
                case 'm':
                    this.writePanelM(param);
                    break
                case 'md':
                    this.writePanelMD(param);
                    break
                case 'mdh':
                    this.writePanelMDH(param);
                    break
            }
        }
        panelToolbar() {
            const submitButton = this.button({
                label: 'Submit',
                id: 'button-submit',
                icon: 'send',
                label: 'Submit',
                iconPosition: 'right',
                addClass: 'button-submit'
            })
            const object = {
                element: 'nav',
                id: 'module-toolbar',
                class: 'panel-y-toolbar',
                content: yHtml([
                    {
                        element: 'a',
                        href: '#',
                        id: 'master-title',
                        class: 'brand-logo center',
                        style: 'height: 30px; font-size: 12px; line-height:30px;',
                        content: ' ',
                    },
                    {
                        element: 'ul',
                        id: 'toolbar-module-left',
                        class: 'left',
                        content: '',
                    },
                    {
                        element: 'ul',
                        id: 'toolbar-module-right',
                        class: 'right',
                        content: yHtml({ element: 'li', content: yHtml(submitButton) }),
                    },
                ]),
            }
            return object
        }
        writePanelM(param) {
            const h = yHtml(
                this.cardPanel('master', param.labelMaster, 'no table')
            )
            $(param.idForm).append(h)
            this.collapsibleMaster = this.collapsibleListener('.panel_y_master');

        }
        writePanelMD(param) {
            const h = yHtml([
                this.cardPanel('master', param.labelMaster, 'no table'),
                this.cardPanel('detail', param.labelDetail)
            ])
            $(param.idForm).append(h)
            this.collapsibleMaster = this.collapsibleListener('.panel_y_master')
            this.collapsibleDetail = this.collapsibleListener('.panel_y_detail')
            this.listenerStickyTable('detail')
        }
        writePanelMDH(param) {
            const h = yHtml([
                this.cardPanel('master', param.labelMaster, 'no table'),
                this.cardPanel('detail', param.labelDetail),
                this.cardPanel('history', param.labelHistory)
            ])
            $(param.idForm).append(h)
            this.collapsibleMaster = this.collapsibleListener('.panel_y_master')
            this.collapsibleDetail = this.collapsibleListener('.panel_y_detail')
            this.collapsibleHistory = this.collapsibleListener('.panel_y_history')
            this.listenerStickyTable('detail')
        }
        cardPanel(type, content, option) {
            content = typeof (content) != 'undefined' ? content : '';
            var p = 'panel_y_';
            var tbl = '_table';
            var hdr = '_header';
            var dta = '_data';
            const cardTitle = {
                element: 'div',
                class: 'collapsible-header panel-title gradient-45deg-blue-grey-darken light-blue-text text-lighten-5 panel-title-' + type,
                content: content,
                ['data-target']: `panel-y-${type}`
            };
            let cardContent
            const panelRecordInfo = {
                element: 'div',
                class: 'panel-record-info panel-record-info-' + type
            };
            if (typeof option != 'undefined' && option == 'no table') {
                cardContent = {
                    element: 'div',
                    class: p + type + dta
                };
            } 
            else {
                cardContent = {
                    element: 'table',
                    col: type,
                    class: p + type + tbl + ' highlight striped responsive-table',
                    content: yHtml([
                        { element: 'thead', class: '', content: yM.tr({ element: 'tr', class: p + type + tbl + hdr, }), },
                        { element: 'tbody', class: p + type + tbl + dta, },
                    ]),
                };
            }
            const style = type !== 'master' ? 'display: block;' : 'display: none;';
            const wrapperCardBody = type !== 'master' ? yHtml([cardContent, panelRecordInfo]) : yHtml(cardContent);
            const cardBody = {
                element: 'div',
                class: 'collapsible-body no-padding panel-y-body',
                style: style,
                content: wrapperCardBody,
            };
            const child = yHtml([cardTitle, cardBody])
            const classLi = type !== 'master' ? 'active' : ''
            const object = {
                element: 'ul',
                id: 'panel-y-' + type,
                class: p + type + ' card collapsible collapsible-panel',
                content: yHtml({
                    element: 'li',
                    class: classLi,
                    content: child,
                }),
            };
            return object;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Write Master
        /////////////////////////////////////////////////////////////////////////////////////
        writeMaster(param, parent, func) {
            func = typeof func !== 'undefined' ? func : 'master';
            parent = typeof parent !== 'undefined' ? parent : this.master;
            const that = this;
            const multiparam = [];
            const h = [];
            let useDate = false;
            const dateArrayField = [];
            const dateArrayYearRange = [];
            const dateArrayMinDate = [];
            const dateArrayMaxDate = [];
            let useTime = false;
            const timeArrayField = [];
            const rowClass = [];
            rowClass[0] = false;
            const masterSelect = [];
            const masterButtonSelect = [];
            const afterWriteMaster = [];
            if (typeof this.selectList[func] === 'undefined') {
                this.selectList[func] = [];
            }
            if (typeof this.selectController[func] === 'undefined') {
                this.selectController[func] = [];
            }
            for (let i in param) {
                const p = param[i];
                let row = 0;
                const isDisabled = hasParam(p, 'is_disabled') || hasParam(p, 'isDisabled');
                const isReadonly = hasParam(p, 'is_readonly') || hasParam(p, 'isReadonly') || hasParam(p, 'isReadOnly');
                const collapsible = hasParam(p, 'collapsible');
                if (typeof p.row !== 'undefined') {
                    row = typeof p.row !== 'object' ? p.row - 1 : (p.row.no) - 1;
                    if (typeof rowClass[row] === 'undefined') {
                        rowClass[row] = false;
                    }
                    if (!rowClass[row]) {
                        rowClass[row] = typeof p.row !== 'object' ? false : p.row.class;
                    }
                }
                h[row] = typeof h[row] !== 'undefined' ? h[row] : '';
                let name = typeof p.name !== 'undefined' ? p.name : '';
                let addClass = typeof p.addClass !== 'undefined' ? p.addClass : '';
                let addClassLabel = typeof p.addClassLabel !== 'undefined' ? p.addClassLabel : '';

                // HTML
                if (hasParam(p, 'html')) {
                    p.code = typeof p.code !== 'undefined' ? p.code : '';
                    h[row] += p.code;
                }
                // Table
                else if (hasParam(p, 'table')) {
                    this.masterTable.push(name);
                    let clColTable = 'table-master col ';
                    clColTable += typeof p.col !== 'undefined' ? p.col : 's12 m12 x12 xl12';
                    let tableContent = '';
                    if (typeof p.content !== 'undefined') {
                        const headerButton = typeof p.headerButton !== 'undefined' ? p.headerButton : false;
                        tableContent = this.generateTableMaster(name, p.content, p.label, headerButton, collapsible);
                        afterWriteMaster.push(() => {
                            for (let i in this.rowRadio) {
                                const par = this.rowRadio[i];
                                const itemName = typeof par.name !== 'undefined' ? par.name : false;
                                const col = typeof par.col !== 'undefined' ? par.col : 0;
                                if (itemName && col > 0) {
                                    $(`th.th-label.label_header.header-${name}-${itemName}`).attr('colspan', col);
                                }
                            }
                        });
                    }
                    h[row] += yM.col({
                        class: clColTable,
                        content: tableContent,
                    });
                    if (typeof this.form[name] === 'undefined') {
                        this.form[name] = '.panel_y_' + name + '_table_data';
                    }
                    if (typeof this.form.field[name] === 'undefined') {
                        this.form.field[name] = [];
                        this.form.field[name] = p.content;
                    }
                }
                // Input Select
                else if (hasParam(p, 'select')) {
                    let clField = 'input-field input-field-master col '
                    clField += typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3'
                    let classInput = 'input-select input-master-select ' + addClass
                    const pIcon = typeof p.icon !== 'undefined' ? p.icon : false
                    let selectContent = ''
                    if (typeof p.option !== 'undefined') {
                        for (let j in p.option) {
                            selectContent += yM.option(p.option[j]);
                        }
                    }

                    masterSelect.push(p.name);
                    if (typeof p.label !== 'undefined') {
                        if (typeof p.label === 'string') {
                            p.label = {
                                content: p.label,
                                class: 'active'
                            };
                        }
                        else if (typeof p.label === 'object') {
                            p, label.addClass = 'active';
                        }
                    }
                    if (!this.selectList[func].includes(p.name)) {
                        this.selectList[func].push(p.name);
                    }
                    if (typeof p.controller !== 'undefined') {
                        this.selectController[func][p.name] = p.controller;
                    }
                    const selectParam = {
                        id: 'input_' + name,
                        name: name,
                        content: selectContent,
                        class: classInput,
                        addClass: addClass,
                        tag: addClass,
                    };
                    const dataInit = typeof p['data-init'] !== 'undefined' ? p['data-init'] : false;
                    if (dataInit) {
                        selectParam['data-init'] = dataInit;
                        selectParam.content = dataInit;
                        selectParam['use-content'] = true;
                    }
                    h[row] += yM.inputFieldSelect({
                        class: clField,
                        icon: pIcon,
                        select: selectParam,
                        label: p.label,
                        span: p.span
                    });
                }
                // Button Select
                else if (hasParam(p, 'button_select') || hasParam(p, 'buttonSelect')) {
                    let clField = 'input-field input-field-master col ';
                    clField += typeof p.col !== 'undefined' ? p.col : 's12';
                    let classInput = 'input-button-select input-master-button-select ' + addClass;
                    let buttonSelectContent = '';
                    const pIcon = typeof p.icon !== 'undefined' ? p.icon : false
                    if (typeof p.option !== 'undefined') {
                        for (var j in p.option) {
                            selectContent += yM.option(p.option[j]);
                        }
                    }
                    masterButtonSelect.push(p.name);
                    if (typeof p.label !== 'undefined') {
                        if (typeof p.label === 'string') {
                            p.label = {
                                content: p.label,
                                class: 'active'
                            };
                        }
                        else if (typeof p.label === 'object') {
                            p, label.addClass = 'active';
                        }
                    }
                    h[row] += yM.row({
                        class: clField,
                        icon: pIcon,
                        id: 'row-button-select-' + name,
                        name: name,
                        content: buttonSelectContent,
                        class: classInput,
                        addClass: addClass,
                        tag: addClass,
                        label: p.label,
                        span: p.span
                    });
                    const selectParam = {
                        id: 'input_' + name,
                        name: name,
                        content: '',
                        class: classInput,
                        addClass: addClass,
                        tag: addClass,
                    };
                    const dataInit = typeof p['data-init'] !== 'undefined' ? p['data-init'] : false;
                    if (dataInit) {
                        selectParam['data-init'] = dataInit;
                    }
                    h[row] += yM.inputFieldSelect({
                        class: 'hide',
                        select: selectParam
                    });
                }
                // Checkbox
                else if (hasParam(p, 'checkbox') || hasParam(p, 'checkBox')) {
                    p.label = typeof p.label !== 'undefined' ? p.label : '';
                    p.value = typeof p.value !== 'undefined' ? p.value : '';
                    let pInputCheckbox = {
                        id: 'input_' + name,
                        label: p.label,
                        value: p.value,
                        addClass: addClass
                    };
                    let colClass = typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3';
                    h[row] += yM.col({
                        class: colClass,
                        content: yM.inputCheckbox(pInputCheckbox)
                    });
                }
                // Radio
                else if (hasParam(p, 'radio')) {
                    p.label = typeof p.label !== 'undefined' ? p.label : '';
                    p.value = typeof p.value !== 'undefined' ? p.value : '';
                    let pInputRadio = {
                        id: 'input_' + name + '-' + p.value,
                        name: name,
                        label: p.label,
                        value: p.value,
                        addClass: addClass
                    };
                    let colClass = typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3';
                    h[row] += yM.col({
                        class: colClass,
                        content: yM.inputRadio(pInputRadio)
                    });
                }
                // Label for Radio
                else if (hasParam(p, 'labelRadio')) {
                    p.label = typeof p.label !== 'undefined' ? p.label : '';
                    let colClass = typeof p.col !== 'undefined' ? p.col : 's3 m4 x2 xl1';
                    h[row] += yM.col({
                        class: colClass,
                        addClass: addClass,
                        content: yM.label({
                            class: 'label_form label-radio',
                            content: p.label
                        })
                    });
                }
                // General Button
                else if (hasParam(p, 'button')) {
                    p.icon = typeof p.icon !== 'undefined' ? p.icon : '';
                    p.label = typeof p.label !== 'undefined' ? p.label : '';
                    p.name = typeof p.name !== 'undefined' ? p.name : '';
                    p.type = typeof p.type !== 'undefined' ? p.type : 'btn';
                    p.class = typeof p.class !== 'undefined' ? p.class + ' btn-small' : ' btn-small';
                    p.addClass = typeof p.addClass !== 'undefined' ? ' ' + p.addClass : '';
                    const colClass = typeof p.col !== 'undefined' ? p.col : 's1';
                    let pButton = {
                        id: 'button-master-' + name,
                        type: p.type,
                        class: p.class + addClass,
                        icon: p.icon,
                        content: p.label
                    };
                    if (typeof p['data-tooltip'] !== 'undefined') {
                        pButton['data-tooltip'] = p['data-tooltip'];
                        let dataPosition = typeof p['data-position'] !== 'undefined' ? p['data-position'] : 'right';
                        pButton['data-position'] = dataPosition;
                    }
                    h[row] += yM.col({
                        class: colClass,
                        content: yM.button(pButton)
                    });
                }
                else if (hasParam(p, 'image')) {
                    // Preview Image
                    const colClass = typeof p.col !== 'undefined' ? p.col : 's1';
                    p.label = typeof p.label !== 'undefined' ? p.label : 'Preview Image';
                    p.name = typeof p.name !== 'undefined' ? p.name : 'preview-image';
                    p.class = typeof p.class !== 'undefined' ? p.class + ' preview-image content-preview-image content-preview-image-' + p.name : ' preview-image content-preview-image content-preview-image-' + p.name;
                    p.addClass = typeof p.addClass !== 'undefined' ? ' ' + p.addClass : '';
                    p.width = typeof p.width !== 'undefined' ? p.width : '200px';
                    p.height = typeof p.height !== 'undefined' ? p.height : '200px';
                    h[row] += yM.div({
                        class: 'container-preview-image container-preview-image-' + p.name,
                        id: 'container-preview-image-' + p.name,
                        content: yM.col({
                            class: colClass,
                            content:
                                yM.label({
                                    class: 'title-preview-image title-preview-image-' + p.name,
                                    id: 'title-preview-image-' + p.name,
                                    for: 'preview-image-' + p.name,
                                    content: p.label
                                }) + yM.div({
                                    content: yM.img({
                                        class: p.class,
                                        addClass: p.addClass,
                                        id: 'preview-image-' + p.name,
                                        src: '/images/no_image.webp',
                                        height: p.height,
                                        width: p.width,
                                        name: p.name
                                    })
                                })
                        })
                    });
                }
                // Input and Label
                else {
                    let classInput = 'input_text input_master_text autocomplete' + ' ' + addClass
                    let clSpan = 'blue-text text-lighten-3 character-counter '
                    var isDatePicker = false
                    var isTimePicker = false
                    let isRightAlign = hasParam(p, 'right_align') || hasParam(p, 'rightAlign')
                    if (isRightAlign) {
                        classInput += ' right-align'
                    }
                    // Input with type date or time
                    if (typeof p.type !== 'undefined') {
                        switch (p.type) {
                            case 'date':
                                useDate = true;
                                isDatePicker = true;
                                dateArrayField.push(p.name)
                                dateArrayYearRange.push(typeof p.yearRange !== 'undefined' ? p.yearRange : false)
                                dateArrayMinDate.push(typeof p.minDate !== 'undefined' ? p.minDate : false)
                                dateArrayMaxDate.push(typeof p.maxDate !== 'undefined' ? p.maxDate : false)
                                classInput += ' datepicker input_master_text';
                                break;
                            case 'time':
                                useTime = true;
                                timeArrayField.push(p.name)
                                isTimePicker = true;
                                classInput += ' timepicker input_master_text';
                                break;
                        }
                    }
                    // Span
                    if (typeof p.span !== 'undefined' && typeof p.span === 'object') {
                        clSpan = typeof p.span.class !== 'undefined' ? clSpan + ' ' + p.span.class : clSpan;
                        p.span.class = clSpan;
                    } else if (typeof p.span === 'string') {
                        let contentSpan = p.span;
                        p.span = {
                            content: contentSpan,
                            class: clSpan
                        };
                    } else if (isDatePicker) {
                        p.span = {
                            content: this.formatDate,
                            class: clSpan
                        };
                    } else if (isTimePicker) {
                        p.span = {
                            content: this.formatTime,
                            class: clSpan
                        };
                    }

                    // Multi Param
                    if (hasParam(p, 'multiparam')) {
                        // Input with type date or time
                        if (typeof p.type !== 'undefined') {
                            switch (p.type) {
                                case 'date':
                                    useDate = true
                                    isDatePicker = true
                                    dateArrayField.push(p.name + '_start')
                                    dateArrayYearRange.push(typeof p.yearRange !== 'undefined' ? p.yearRange : false)
                                    dateArrayMinDate.push(typeof p.minDate !== 'undefined' ? p.minDate : false)
                                    dateArrayMaxDate.push(typeof p.maxDate !== 'undefined' ? p.maxDate : false)
                                    dateArrayField.push(p.name + '_end')
                                    dateArrayYearRange.push(typeof p.yearRange !== 'undefined' ? p.yearRange : false)
                                    dateArrayMinDate.push(typeof p.minDate !== 'undefined' ? p.minDate : false)
                                    dateArrayMaxDate.push(typeof p.maxDate !== 'undefined' ? p.maxDate : false)
                                    break;
                                case 'time':
                                    useTime = true
                                    isTimePicker = true
                                    timeArrayField.push(p.name + '_start')
                                    timeArrayField.push(p.name + '_end')
                                    break;
                            }
                        }

                        let r = this.inputMultiParam(p, name, classInput, clSpan, isDatePicker, isTimePicker);
                        h[row] += typeof r.h !== 'undefined' ? r.h : '';
                        if (typeof r.h !== 'undefined') {
                            multiparam.push(r.m);
                        }
                    }

                    // Main Field is_main: true
                    else if (hasParam(p, 'is_main') || hasParam(p, 'isMain')) {
                        classInput += ' browser-default title-document' + addClass;
                        yM.inputField({
                            parent: '.panel-title-master',
                            class: 'browser-default input-field-title-document',
                            input: { id: 'input_' + name, class: classInput, content: '', name: name },
                            label: '',
                            icon: 'folder_open'
                        })
                    }

                    // Single param
                    else {
                        let clField = 'input-field input-field-master col ';
                        clField += typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3';
                        if (isRightAlign) {
                            clField += ' right-align';
                        }
                        // Label Info
                        if (hasParam(p, 'label_info') || hasParam(p, 'labelInfo')) {
                            // label : label
                            let label_info_content = '';
                            label_info_content = typeof p.content !== 'undefined' ? p.content : '';
                            h[row] += yM.col({
                                class: clField,
                                content: yM.label({
                                    class: 'label_form ' + addClass,
                                    content: p.label
                                }) +
                                    yM.div({
                                        id: 'label_info_' + name,
                                        class: 'label_form label_info ',
                                        content: label_info_content
                                    })
                            });
                        }
                        // Label Only
                        else if (hasParam(p, 'label_only') || hasParam(p, 'labelOnly')) {
                            // label
                            h[row] += yM.div({
                                class: clField,
                                content: yM.label({
                                    class: 'label_form',
                                    content: p.label
                                })
                            });
                        }
                        // Input Hidden
                        else if (hasParam(p, 'hidden')) {
                            // input type=hidden
                            h[row] += yM.input({
                                type: 'hidden',
                                tabindex: '-1',
                                id: 'input_' + name,
                                name: name,
                                class: classInput
                            });
                        }
                        // Common Input Field
                        else {
                            // label : input
                            const pIcon = typeof p.icon !== 'undefined' ? p.icon : false
                            const input = {
                                type: 'text',
                                id: 'input_' + name,
                                name: name,
                                class: classInput
                            }
                            // Textarea
                            if (typeof p.textarea !== 'undefined') {
                                input.element = 'textarea'
                                if (typeof (p.textarea.rows) !== 'undefined') {
                                    input.rows = p.textarea.rows
                                }
                                input.class = "materialize-textarea " + addClass
                            }
                            if (isDisabled) {
                                input['disabled'] = true
                            }
                            if (isReadonly) {
                                input['readonly'] = true
                            }
                            if (typeof p.maxlength !== 'undefined') {
                                input.maxlength = p.maxlength
                            }
                            if (typeof p.type !== 'undefined' && p.type === 'file') {
                                input.type = 'file'
                                if (typeof p.accept !== 'undefined') {
                                    input.accept = p.accept
                                }
                                if (typeof p.preview !== 'undefined') {
                                    input.preview = p.preview
                                }
                            }
                            h[row] += yM.inputField({
                                class: clField,
                                icon: pIcon,
                                input: input,
                                label: p.label,
                                span: p.span
                            })
                        }
                    }
                }
            }
            let masterContent = '';
            for (let i in h) {
                if (rowClass[i]) {
                    masterContent += yM.row({
                        class: rowClass[i],
                        content: h[i],
                    });
                }
                else {
                    masterContent += yM.row(h[i]);
                }
            }
            const htmlResult = yM.div({
                parent: parent,
                class: 'panel_master_content container',
                content: masterContent,
            });
            if (multiparam.length > 0) {
                for (let i in multiparam) {
                    let id = multiparam[i].id;
                    let name = multiparam[i].name;
                    let label = multiparam[i].label;
                    let ac = multiparam[i].ac;
                    let selector = multiparam[i].selector;
                    that.createMultiSelectModal(id, name, label, ac);
                    that.listenerMultiSelect(id, name, ac, selector);
                    let elem = document.querySelectorAll('#' + id);
                    M.Modal.init(elem, {});
                }
            }
            if (useTime) {
                const options = {
                    defaultTime: 'now',
                    twelveHour: false,
                    vibrate: true,
                };
                for (let i in timeArrayField) {
                    const field = timeArrayField[i];
                    const target = `#input_${field}.timepicker`;
                    const el = document.querySelector(target);
                    M.Timepicker.init(el, options);
                }
            }
            if (useDate) {
                const options = {
                    format: this.formatDate,
                    defaultDate: 'now',
                    autoClose: true,
                };
                for (let i in dateArrayField) {
                    const field = dateArrayField[i];
                    const target = `#input_${field}.datepicker`;
                    const el = document.querySelector(target);
                    options.onOpen = function () {
                        const instance = M.Datepicker.getInstance(el);
                        const value = el.value;
                        const modalDate = value && value != '' ? dateFromFormat(value, that.formatDate) : new Date();
                        instance.setDate(modalDate);
                        instance.gotoDate(modalDate);
                        if (typeof el !== 'undefined' && el.readOnly) {
                            const obj = typeof instance.$modalEl !== 'undefined' ? instance.$modalEl : false;
                            if (typeof obj === 'object') {
                                for (let i = 0; i < obj.length; i++) {
                                    const modal = obj[i];
                                    setTimeout(() => {
                                        modal.classList.remove('open');
                                        modal.style.display = 'none';
                                        modal.nextElementSibling.remove();
                                    }, 10);
                                }
                            }
                        }
                    }
                    const yearRange = typeof dateArrayYearRange[i] != 'undefined' ? dateArrayYearRange[i] : false;
                    if (yearRange) {
                        options.yearRange = yearRange;
                    }
                    const minDate = typeof dateArrayMinDate[i] != 'undefined' ? dateArrayMinDate[i] : false;
                    if (minDate) {
                        options.minDate = minDate;
                    }
                    const maxDate = typeof dateArrayMaxDate[i] != 'undefined' ? dateArrayMaxDate[i] : false;
                    if (maxDate) {
                        options.maxDate = maxDate;
                    }
                    M.Datepicker.init(el, options);
                }
            }
            for (let i in masterSelect) {
                this.updateSelectItem(masterSelect[i], '', undefined, func);
            }
            for (let i in masterButtonSelect) {
                this.updateButtonSelectItem(masterButtonSelect[i], '', undefined);
            }
            for (let i in afterWriteMaster) {
                afterWriteMaster[i]();
            }
            return htmlResult;
        }
        updateSelectItem(nameSelect, param, callback, table) {
            param = typeof param !== 'undefined' ? param : '';
            callback = typeof callback !== 'undefined' ? callback : function () { };
            table = typeof table !== 'undefined' ? table : 'master';
            const that = this;
            const elem = document.getElementById('input_' + nameSelect);
            const url = this.queryUrl + 'call_' + nameSelect + '_select';
            const onSuccess = function (res) {
                elem.innerHTML = '';
                if (typeof res !== 'undefined' && res.length > 0) {
                    let optionSelect = '';
                    for (let j in res) {
                        optionSelect += yM.option(res[j]);
                    }
                    elem.innerHTML += optionSelect;
                }
            }
            const onComplete = function () {
                that.formSelectInitMaster(table, nameSelect, elem);
                callback();
            }
            getAjax(url, param, onSuccess, onComplete, undefined, undefined, true);
        }
        updateButtonSelectItem(name, param, callback) {
            name = typeof name !== 'undefined' ? name : ''
            callback = typeof callback !== 'undefined' ? callback : function () { }
            const elem = document.getElementById('row-button-select-' + name)
            const selectElem = document.getElementById('input_' + name)
            const onSuccess = function (res) {
                elem.innerHTML = ''
                if (typeof res !== 'undefined' && res.length > 0) {
                    let h = ''
                    let optionSelect = ''
                    for (let i in res) {
                        const item = res[i];
                        const value = typeof item.value !== 'undefined' ? item.value : ''
                        const label = typeof item.label !== 'undefined' ? item.label : ''
                        const icon = typeof item.icon !== 'undefined' ? item.icon : 'check'
                        h += yM.buttonLarge({
                            id: 'btn-select-item-' + name + '-' + i,
                            class: 'btn-select-item hoverable',
                            data: value,
                            icon: icon,
                            content: label
                        })
                        $('#row-button-select-' + name).on('click', '#btn-select-item-' + name + '-' + i, function (e) {
                            e.preventDefault()
                        });
                        optionSelect += yM.option(item)
                    }
                    elem.innerHTML += h
                    selectElem.innerHTML += optionSelect
                }
            };
            const onComplete = function () {
                callback()
            };
            getAjax(this.queryUrl + 'call_' + name + '_select', param, onSuccess, onComplete, undefined, undefined, true);
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Table Component on Panel Master
        /////////////////////////////////////////////////////////////////////////////////////
        generateTableMaster(name, param, label, headerButton, collapsible) {
            headerButton = typeof headerButton !== 'undefined' ? headerButton : false;
            let tableButton = '';
            if (headerButton) {
                if (typeof headerButton === 'object' && Array.isArray(headerButton) && headerButton.length > 0) {
                    for (let i in headerButton) {
                        headerButton[i].addClass = 'right';
                        tableButton += yM.button(headerButton[i]);
                    }
                }
                else if (typeof headerButton === 'object') {
                    tableButton = yM.button(headerButton);
                }
                else {
                    tableButton = yM.button({ content: headerButton });
                }
            }
            let collapsibleButton = typeof collapsible !== 'undefined' && collapsible ? yM.span({
                class: 'button-collapsible-trigger waves-effect waves-light ' + 'collapsible-trigger-panel_y_' + name,
                data: name,
                style: 'position:absolute; right:10px; cursor: pointer; user-select: none; -webkit-user-select: none;',
                content: yM.icon('indeterminate_check_box')
            }) : '';
            const caption = typeof label !== 'undefined' && label ? yM.caption({
                class: 'table-caption',
                content: label + collapsibleButton,
                style: 'width:100%;'
            }) : '';
            const tableHeader = this.generateTableHeader(name, param);
            const sumHeader = this.generateTableHeaderSum(param);
            const tableFilter = this.generateTableFilter(param, name);
            const sumFooter = this.generateTableFooterSum(param);
            let contentHeader = '';
            if (headerButton) {
                let colspan = typeof param.length !== 'undefined' ? param.length : false;
                if (colspan) { contentHeader += yM.tr(yM.th({ colspan: colspan, content: tableButton })); } else { contentHeader += yM.tr(yM.th({ content: tableButton })); }
            }
            if (tableFilter) { contentHeader += tableFilter; }
            if (sumHeader) { contentHeader += sumHeader; }
            contentHeader += yM.tr({
                element: 'tr',
                class: 'panel_y_' + name + '_table_header',
                content: tableHeader
            });
            const head = yM.thead({
                content: yM.tr({
                    element: 'tr',
                    class: 'panel_y_' + name + '_table_header',
                    content: contentHeader
                })
            });
            const body = yM.tbody({ class: 'panel_y_' + name + '_table_data' });
            let footer = '';
            if (sumFooter) { footer = yM.tfoot(yM.tr(sumFooter)); }
            const result = yM.table({
                col: name,
                class: 'table-panel highlight striped responsive-table panel_y_' + name + '_table',
                content: caption + head + body + footer
            }) + yM.div({ class: 'panel-after-table', content: yM.div({ class: 'panel-record-info panel-record-info-' + name }) });
            return result;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Input Multi Param Component on Panel Master
        /////////////////////////////////////////////////////////////////////////////////////
        inputMultiParam(p, name, classInput, clSpan, useDate, useTime) {
            let clField = 'input-field col ';
            clField += typeof p.col !== 'undefined' ? p.col : 's6';
            let start = name + '_start';
            let end = name + '_end';
            let idMultiSelect = 'modal-multi-select-' + this.guid();
            let contentFrom = [
                { element: 'input', type: 'text', id: 'input_' + start, name: start, class: classInput + ' input_' + name + ' input_' + start },
                { element: 'span', class: 'helper-text', content: 'from' },
                { element: 'label', for: start, content: p.label },
            ];
            let contentTo = [
                { element: 'input', type: 'text', id: 'input_' + end, name: end, class: classInput + ' input_' + name + ' input_' + end },
                { element: 'span', class: 'helper-text', content: 'to' },
                { element: 'label', for: end, content: '' },
            ];
            let objStyle = 'float: right; min-height: 18px; font-size: 12px;';
            let objFrom = { element: 'span', class: clSpan, style: objStyle, content: this.formatDate };
            let objTo = { element: 'span', class: clSpan, style: objStyle, content: this.formatDate };
            if (useDate) {
                objFrom.content = this.formatDate;
                objTo.content = this.formatDate;
            }
            if (useTime) {
                objFrom.content = this.formatTime;
                objTo.content = this.formatTime;
            }
            if (typeof p.span !== 'undefined') {
                objFrom.content = yM.span(p.span);
                objTo.content = yM.span(p.span);
            }
            contentFrom.push(objFrom);
            contentTo.push(objTo);

            let wrapper = yM.row({
                class: 'wrapper-input-field-multi-select',
                content: yM.div({ class: clField, content: yHtml(contentFrom) }) + yM.div({ class: clField, content: yHtml(contentTo) })
            });
            let buttonModal = yM.buttonFlat({
                class: 'light-blue darken-1 white-text modal-trigger waves-effect waves-blue btn-multi-select',
                ['data-target']: idMultiSelect,
                content: yM.icon('playlist_add')
            });

            let h = yM.row({
                content: yM.col({
                    class: 's12',
                    content: wrapper + buttonModal
                })
            });
            let m = {
                id: idMultiSelect,
                label: p.label,
                name: name,
                ac: p.ac,
                selector: start
            };
            return {
                h: h,
                m: m
            };
        }
        listenerMultiSelect(id, name, ac, selector) {
            var that = this;
            var yms = 'y_multi_select_';
            var input_position;
            var select = true;
            var exclude = false;
            $('#y_select_panel_' + id).off('focusin', '.last_input');
            $('#y_select_panel_' + id).on('focusin', '.last_input', function () {
                $(this).removeClass('last_input');
                var row = $(this).attr('row');
                var new_row = parseInt(row) + 1;
                var type = 'select';
                that.addMultiSelectInput('#y_' + type + '_panel_' + id, type, name, new_row, ac, true);
            });
            $('#y_exclude_panel_' + id).off('focusin', '.last_input');
            $('#y_exclude_panel_' + id).on('focusin', '.last_input', function () {
                $(this).removeClass('last_input');
                var row = $(this).attr('row');
                var new_row = parseInt(row) + 1;
                var type = 'exclude';
                that.addMultiSelectInput('#y_' + type + '_panel_' + id, type, name, new_row, ac, true);
            });
            $('#y_exclude_panel_' + id).hide();
            var ms = $('#' + id);
            input_position = ms.find('input[type=text]').filter(':visible:first').attr('id');
            var p_select = $('#y_select_panel_' + id);
            var p_exclude = $('#y_exclude_panel_' + id);
            this.command(ms, '.' + yms + 'single_search', function (object) {
                var selector = $(object).siblings('.input_master_text');
                that.showTableSelection(ac, selector);
            });
            var cl_ob = yms + 'option_button';
            var cl_obs = yms + 'option_button_selected';
            this.command(ms, '.button-multi-select-exclude', function () {
                select = false;
                exclude = true;
                $('.select_input_' + id).val('');
                yM.setInputValue('#' + selector, '');
                p_select.hide();
                $('#' + yms + 'button_select' + id).removeClass('active');
                p_exclude.show();
                $('#' + yms + 'button_exclude' + id).addClass('active');
            });
            this.command(ms, '.button-multi-select-include', function () {
                select = true;
                exclude = false;
                $('.exclude_input_' + id).val('');
                yM.setInputValue('#' + selector, '');
                p_select.show();
                $('#' + yms + 'button_select' + id).addClass('active');
                p_exclude.hide();
                $('#' + yms + 'button_exclude' + id).removeClass('active');
            });
            this.command(ms, '#button_select_' + id, function () {
                if (select === true) {
                    yM.setInputValue('#' + selector, 'selected list');
                } else {
                    $('#' + selector).val('excluded list');
                }
                $('#' + id).hide();
            });
            this.command(ms, '#button_clear_' + id, function () {
                yM.setInputValue('#' + selector, '');
                ms.find('textarea[type=text]').val('');
            });
            ms.off('paste', '.textarea_single');
            ms.on('paste', '.textarea_single', function () {
                that.handlePasteSelection(this, name, ac);
            });
            ms.off('focusin', '.input_master_text');
            ms.on('focusin', '.input_master_text', function () {
                var this_id = $(this).attr('id');
                $('#button_paste_' + yms + 'box_' + name).attr('row', this_id);
            });
        }
        listInput(type, name, row, ac, last) {
            var yms = 'y_multi_select_';
            var cl_input = 'input_multi_select textarea_single input_master_text';
            var class_cell = cl_input + ' input_' + yms + 'box_' + name;
            if (typeof last != 'undefined' && last === true) {
                class_cell += ' last_input';
            }
            return yM.tr({
                class: yms + 'text_row',
                content: yM.td({
                    content: yM.div({
                        class: yms + 'highlight_text', content: (parseInt(row) + 1)
                    })
                }) +
                    yM.td(yM.textarea({
                        rows: 1,
                        type: 'text',
                        row: row,
                        id: name + '_' + row,
                        name: name + '[' + row + ']',
                        class: class_cell + ' ' + type + '_input_' + yms + 'box_' + name
                    })) +
                    yM.td({
                        content: yM.buttonFlat({
                            class: yms + 'single_search search_button_26 search_button_' + name,
                            row: ac,
                            icon: 'search',
                            content: ''
                        })
                    })
            });
        }
        addMultiSelectInput(wrapper, type, name, row, ac, last) {
            const html = this.listInput(type, name, row, ac, last)
            $(wrapper).append(html)
        }
        createMultiSelectModal(id, name, label, ac) {
            var yms = 'y_multi_select_'
            var textSelect = ''
            var textExclude = ''
            for (var j = 0; j < 10; j++) {
                var last = false
                if (j == 9) {
                    last = true
                }
                textSelect += this.listInput('select', 'select_' + name, j, ac, last)
                textExclude += this.listInput('exclude', 'exclude_' + name, j, ac, last)
            }
            var h = yM.modal({
                parent: '#module-content',
                id: id,
                content: yM.modalContent({
                    class: 'y_multi_select',
                    id: id + '_panel',
                    content: yM.h4({
                        class: 'panel-title gradient-45deg-blue-grey-darken white-text panel_expanded',
                        isCenterAlign: true,
                        content: label
                    }) +
                        yM.row({
                            class: yms + 'toolbar_row',
                            content: yM.button({
                                id: 'button_select_' + id,
                                icon: 'receipt',
                                class: 'light-blue darken-1 modal-close',
                                content: 'Select'
                            }) +
                                yM.button({
                                    id: 'button_clear_' + id,
                                    icon: 'clear',
                                    class: 'light-blue darken-1',
                                    content: 'Clear'
                                })
                        }) +
                        yM.row({
                            class: yms + 'option_row',
                            content: yM.tabs({
                                content: yM.tab({
                                    id: yms + 'button_select' + id,
                                    class: 'button-multi-select button-multi-select-include active col s6',
                                    content: 'Include Values',
                                    icon: 'thumb_up'
                                }) +
                                    yM.tab({
                                        id: yms + 'button_exclude' + id,
                                        class: 'button-multi-select button-multi-select-exclude col s6',
                                        content: 'Exclude Values',
                                        icon: 'thumb_down'
                                    })
                            })
                        }) +
                        yM.table({
                            id: 'y_select_panel_' + id,
                            class: yms + 'panel ' + yms + 'panel_select',
                            content: yM.tbody(textSelect)
                        }) +
                        yM.table({
                            id: 'y_exclude_panel_' + id,
                            class: yms + 'panel ' + yms + 'panel_exclude',
                            content: yM.tbody(textExclude)
                        })
                }) +
                    yM.modalFooter({
                        content: yM.buttonFlat({
                            class: 'modal-close waves-effect waves-green',
                            content: 'Close'
                        })
                    })
            });
        }
        handlePasteSelection(obj, name, ac) {
            obj = $(obj);
            const that = this;
            setTimeout(function () {
                const name = obj.attr('name')
                const name_array = name.split('[')
                const input_name = name_array[0]
                const start_index = parseInt(name_array[1].replace(']', ''))
                const parent = obj.parent().parent()
                const parentId = '#' + $(parent).attr('id')
                const last_row = parseInt($(parent).find('.last_input').attr('row'));
                if (!isNaN(start_index)) {
                    let paste_value = ''
                    paste_value = obj.val();
                    paste_value = paste_value.replace(/[\s\r\n]+$/, '')
                    const rows = paste_value.split('\n')
                    const no_of_rows = rows.length
                    obj.val('');
                    if (no_of_rows > ((last_row - start_index) + 1)) {
                        const required = no_of_rows - ((last_row - start_index) + 1);
                        const new_last_index = (last_row + required);
                        for (let i = last_row; i < new_last_index; i++) {
                            const type = 'select'
                            that.addMultiSelectInput(parentId, type, input_name, (parseInt(i) + 1), ac, false)
                        }
                        $('#' + input_name + '_' + last_row).removeClass('last_input')
                        $('#' + input_name + '_' + new_last_index).addClass('last_input')
                    }
                    let this_name
                    for (let i = 0; i < no_of_rows; i++) {
                        let thisIndex = parseInt(start_index) + i
                        this_name = input_name + '[' + thisIndex + ']'
                        var is_last = $('textarea[name="' + this_name + '"]').attr('col')
                        $('textarea[name="' + this_name + '"]').val(rows[i])
                    }
                    $('textarea[name="' + this_name + '"]').focus()
                }
            }, 0)
        }
        writeTableSelectionData(data) {
            var yms = 'y_multi_select_';
            var row = 0;
            var data_rows = '';
            for (var i in data) {
                if (data[i].data !== null) {
                    data_rows += yM.tr({
                        class: yms + 'table_data_row',
                        content: yM.td({
                            class: yms + 'highlight_text',
                            content: (row + 1)
                        }) +
                            yM.td({
                                class: yms + 'cell_data',
                                content: data[i].data
                            }) +
                            yM.td({
                                content: yM.input({
                                    type: 'checkbox',
                                    class: yms + 'table_checkbox'
                                })
                            })
                    });
                    row++;
                }
            }
            $('.' + yms + 'table_data').html(data_rows);
        }
        showTableSelection(ac_url, input_object) {
            let that = this;

            let callback = function (data) {
                var yms = 'y_multi_select_';
                var row = 0;
                id = yms + 'table-id-' + that.guid();
                var h = yHtml([{
                    element: 'div',
                    class: 'y_transparent_outer',
                    id: id,
                    content: yHtml([{
                        element: 'div',
                        class: yms + 'table',
                        content: yHtml([{
                            element: 'div',
                            class: 'panel-title gradient-45deg-blue-grey-darken white-text panel_expanded ',
                            content: 'select'
                        },
                        {
                            element: 'div',
                            class: yms + 'toolbar_row',
                            content: yHtml([
                                that.object_button('select', 'select', 'checked'),
                                that.object_button('filter', 'filter', 'checked')
                            ])
                        },
                        {
                            element: 'div',
                            class: yms + 'filter_row',
                            content: yHtml([{
                                element: 'div',
                                class: yms + 'highlight_text',
                                content: yHtml([
                                    that.object_button('filter', 'filter', '', 'no label')
                                ])
                            },
                            {
                                element: 'input',
                                type: 'text',
                                class: 'input_multi_select input_multi_select_param_filter input_text autocomplete'
                            },
                            {
                                element: 'input',
                                type: 'checkbox',
                                class: yms + 'table_checkbox_header'
                            }
                            ])
                        },
                        {
                            element: 'div',
                            class: yms + 'table_data'
                        }
                        ])
                    }])
                }]);
                $(that.master).append(h);
                that.writeTableSelectionData(data);
                $('#' + id).off('click', '.y_multi_select_cell_data');
                $('#' + id).on('click', '.y_multi_select_cell_data', function () {
                    var data = $(this).text();
                    input_object.val(data);
                    $('#' + id).remove();
                });
                $('#' + id).off('click', '#button_select_checked');
                $('#' + id).on('click', '#button_select_checked', function () {
                    var i = 0;
                    var data_select = [];
                    $('.y_multi_select_table_checkbox').each(function () {
                        var state = $(this).prop('checked');
                        if (state === true) {
                            data_select[i] = $(this).siblings('.y_multi_select_cell_data').text();
                            i++;
                        }
                    });
                    var next = input_object;
                    for (var j in data_select) {
                        next.val(data_select[j]);
                        parent = next.parent();
                        next_parent = parent.next('.y_multi_select_text_row');
                        next = next_parent.children('.input_text');
                    }
                    $('#' + id).remove();
                });
                $('#' + id).off('change', '.y_multi_select_table_checkbox_header');
                $('#' + id).on('change', '.y_multi_select_table_checkbox_header', function () {
                    var state = $(this).prop('checked');
                    $('#' + id).find('.y_multi_select_table_checkbox').each(function () {
                        $(this).click();
                        var chils_state = $(this).prop('checked');
                        if (chils_state != state) {
                            $(this).click();
                        }
                    });
                });
                $('#' + id).off('click', '#button_filter_checked');
                $('#' + id).on('click', '#button_filter_checked', function () {
                    var filter_param = $('.input_multi_select_param_filter').val();
                    var callback = function (this_data) {
                        that.writeTableSelectionData(this_data);
                    };
                    getAjax(ac_url + '?term=' + filter_param + '&limit=0', '', callback);

                });
            };
            getAjax(ac_url, '', callback);
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Write Header of Table
        /////////////////////////////////////////////////////////////////////////////////////
        writeHeader(func) {
            const selector = `${func}Header`
            const fields = typeof this.form.field[func] !== 'undefined' ? this.form.field[func] : false;
            $(this[selector]).html('');
            const tableHeader = this.generateTableHeader(func, fields);
            $(this[selector]).append(tableHeader);
            const sumHeader = this.generateTableHeaderSum(fields);
            if (sumHeader) {
                $(this[selector]).parent().prepend(sumHeader);
            }
            const tableFilter = this.generateTableFilter(fields, func);
            if (tableFilter) {
                $(this[selector]).parent().prepend(tableFilter);
                yM.li(yM.buttonFloating({
                    icon: {
                        class: 'fas fa-filter fa-xs'
                    },
                    class: 'btn-small btn-filter btn-filter-' + func + ' waves-effect waves-light',
                    parent: '.panel-title-' + func
                }));
                yM.li(yM.buttonFloating({
                    icon: {
                        class: 'fas fa-sync fa-xs'
                    },
                    class: 'btn-small btn-filter-clear btn-filter-clear-' + func + ' waves-effect waves-light',
                    parent: '.panel-title-' + func
                }));
                this.initSelect(func + '-filter', undefined, () => { });
            }
            const sumFooter = this.generateTableFooterSum(fields);
            if (sumFooter) {
                $(this[selector]).parent().parent().append(yM.tfoot(sumFooter));
            }
            for (const par of this.rowRadio) {
                const itemName = typeof par.name !== 'undefined' ? par.name : false;
                const col = typeof par.col !== 'undefined' ? par.col : 0;
                if (itemName && col > 0) {
                    $(`th.th-label.label_header.header-${func}-${itemName}`).attr('colspan', col);
                }
            }
            this.enableTableResize(func)
        }
        generateTableHeader(name, fields) {
            if (fields) {
                let h = '';
                const lastFields = fields.length - 1;
                let columnSelector = this.columnSelector();
                this.rowRadio = []
                for (let i in fields) {
                    if (i == lastFields) {
                        columnSelector = '';
                    }
                    let classHeader = 'th-label label_header label_header_' + name + ' ';
                    const item = typeof fields[i] !== 'undefined' ? fields[i] : false;
                    if (item) {
                        if (typeof item.type !== 'undefined') {
                            switch (item.type) {
                                case 'date':
                                    classHeader += ' label_header_type_date ';
                                    break;
                                case 'time':
                                    classHeader += ' label_header_type_time ';
                                    break;
                            }
                        }
                        classHeader += ' label_header_' + name + '_' + item.name + ` header-${name}-${item.name}`;

                        if(hasParam(item, 'sort')) {
                            classHeader += ' th-header-sortable';
                        }
                        if (hasParam(item, 'radio') && hasParam(item, 'byRow')) {
                            const radioGroupLabel = typeof item.radioGroupLabel !== 'undefined' ? item.radioGroupLabel : '';
                            const itemName = typeof item.name !== 'undefined' ? item.name : false
                            const groupName = typeof item.radioGroupName !== 'undefined' ? item.radioGroupName : false
                            if (radioGroupLabel != '') {
                                this.rowRadio[groupName] = { name: itemName, col: 1, label: radioGroupLabel }
                            }
                            else {
                                this.rowRadio[groupName].col += 1
                                continue
                            }
                        }
                        if (hasParam(item, 'multicolumn')) {
                            let objectDataItem = false;
                            if (name === 'detail' || 'history') {
                                const itemName = typeof item.name !== 'undefined' ? item.name : false
                                if (itemName && typeof this.form.data[name] !== 'undefined' && typeof this.form.data[name][0] !== 'undefined' && typeof this.form.data[name][0][itemName] !== 'undefined') {
                                    objectDataItem = typeof this.form.data[name][0][itemName] !== 'undefined' ? this.form.data[name][0][itemName] : false;
                                }
                                else {
                                    objectDataItem = []
                                }
                            }
                            const fieldChild = objectDataItem ? this.getMultiColumnField(objectDataItem) : false;
                            const noCol = fieldChild ? fieldChild.length : 0;
                            for (let j = 0; j < noCol; j++) {
                                h += yM.th({
                                    col: fieldChild,
                                    class: classHeader,
                                    content: fieldChild[j] + columnSelector
                                });
                            }
                        }
                        else if (hasParam(item, 'buttonRemove')) {
                            h += yM.th({
                                class: classHeader + ' th-fix',
                                content: yM.button({
                                    class: 'btn-floating btn-td btn-remove-row-header red btn-remove-row-header-' + item.name + ` btn-remove-row-header-${name} btn-remove-row-header-${name}-${item.name}`,
                                    icon: 'check',
                                    data: name,
                                    col: item.name
                                })
                            })
                        }
                        else if (hasParam(item, 'buttonPrint')) {
                            h += yM.th({
                                class: classHeader + ' th-fix',
                                content: yM.button({
                                    class: 'btn-floating btn-td btn-print-row-header btn-print-row-header-' + item.name + ` btn-print-row-header-${name} btn-print-row-header-${name}-${item.name}`,
                                    icon: 'check',
                                    data: name,
                                    col: item.name
                                })
                            })
                        }
                        else if (hasParam(item, 'buttonCheck')) {
                            h += yM.th({
                                class: classHeader + ' th-fix',
                                content: yM.button({
                                    class: 'btn-floating btn-td btn-check-row-header btn-check-row-header-' + item.name + ` btn-check-row-header-${name} btn-check-row-header-${name}-${item.name}`,
                                    icon: 'check',
                                    data: name,
                                    col: item.name
                                })
                            })
                        }
                        else if (hasParam(item, 'buttonFixWidth')) {
                            const width = typeof item.width !== 'undefined' ? item.width : 35;
                            h += yM.th({
                                class: classHeader + ' th-fix',
                                content: yM.button({
                                    class: 'btn-floating btn-td btn-check-row-header btn-check-row-header-' + item.name + ` btn-check-row-header-${name} btn-check-row-header-${name}-${item.name}`,
                                    icon: 'check',
                                    data: name,
                                    col: item.name
                                })
                            })
                        }
                        else if (hasParam(item, 'input') || hasParam(item, 'checkbox')) {
                            if (hasParam(item, 'hidden')) {
                                h += yM.th({
                                    class: classHeader + 'hide th-hide'
                                })
                            }
                            else if (hasParam(item, 'checkbox') && (hasParam(item, 'no_title') || hasParam(item, 'noTitle'))) {
                                // checkbox
                                h += yM.th({
                                    class: classHeader,
                                    content: yM.label({
                                        content: yM.input({
                                            type: 'checkbox',
                                            class: classHeader + 'filled-in input_tick input_tick_header_' + item.name
                                        }),
                                        after: yM.span()
                                    }) + columnSelector
                                });
                            }
                            else {
                                h += yM.th({
                                    col: item.name,
                                    class: classHeader,
                                    content: item.label + columnSelector
                                });
                            }
                        }
                        else if (hasParam(item, 'textarea')) {
                            if (hasParam(item, 'hidden')) {
                                h += yM.th({
                                    class: 'hide th-hide',
                                    content: yM.input({
                                        col: item.name,
                                        type: 'checkbox',
                                        class: 'input_tick input_tick_header_' + item.name
                                    }) + columnSelector
                                });
                            } else if (hasParam(item, 'checkbox')) {
                                h += yM.th(
                                    yM.label({
                                        content: yM.input({
                                            type: 'checkbox',
                                            class: 'filled-in input_tick input_tick_header_' + item.name
                                        }),
                                        after: yM.span({
                                            element: 'span',
                                            content: ''
                                        })
                                    }) + columnSelector
                                );
                            } else {
                                h += yM.th({
                                    col: item.name,
                                    class: classHeader,
                                    content: item.label + columnSelector
                                });
                            }
                        } else if (hasParam(item, 'checkbox_with_hidden_input')) {
                            h += yM.th(
                                yM.input({
                                    col: item.name,
                                    type: 'checkbox',
                                    class: 'input_tick input_tick_header_' + item.name
                                }) + columnSelector
                            );
                        } else if (hasParam(item, 'hidden')) {
                            h += yM.th({
                                class: classHeader + ' hide th-hide'
                            });
                        } else if (hasParam(item, 'radio') && hasParam(item, 'byRow')) {
                            const radioGroupLabel = typeof item.radioGroupLabel !== 'undefined' ? item.radioGroupLabel : '';
                            const itemName = typeof item.name !== 'undefined' ? item.name : false
                            const groupName = typeof item.radioGroupName !== 'undefined' ? item.radioGroupName : false
                            if (radioGroupLabel != '') {
                                this.rowRadio[groupName] = { name: itemName, col: 1, label: radioGroupLabel }
                                h += yM.th({
                                    col: groupName,
                                    class: classHeader,
                                    content: radioGroupLabel + columnSelector
                                })
                            }
                            else {
                                h += yM.th({
                                    col: item.name,
                                    class: classHeader,
                                    content: item.label + columnSelector
                                })
                            }
                        }

                        else {
                            // General Header
                            h += yM.th({
                                col: item.name,
                                class: classHeader,
                                content: item.label + columnSelector
                            })
                            // Checkbox with no title
                            if (hasParam(item, 'checkbox') && (hasParam(item, 'no_title') || hasParam(item, 'noTitle'))) {
                                h += yM.th(
                                    yM.label(
                                        yM.input({
                                            type: 'checkbox',
                                            class: 'filled-in input_tick input_tick_header_' + item.name
                                        }) +
                                        yM.span()
                                    ) + columnSelector
                                );
                            }
                            if (typeof item.edit !== 'undefined') {
                                if (hasParam(item, 'edit')) {
                                    h += yM.th({
                                        col: item.name,
                                        class: classHeader,
                                        content: '_/ ' + item.label + columnSelector
                                    })
                                } else {
                                    h += yM.th({
                                        col: item.name,
                                        class: classHeader,
                                        content: item.label + columnSelector
                                    })
                                }
                            }
                        }
                    }
                }

                return h;
            }
        }
        generateTableHeaderSum(fields) {
            return this.generateTableSum(fields, 'header');
        }
        generateTableFooterSum(fields) {
            return this.generateTableSum(fields, 'footer');
        }
        generateTableSum(fields, position) {
            let result = false;
            if (typeof fields !== 'undefined' && fields) {
                const withSum = this.hasSum(fields, position);
                if (withSum) {
                    const h = this.generateSum(fields, position);
                    result = yM.tr(h);
                }
            }
            return result;
        }
        hasSum(fields, position) {
            let res = false;
            for (const item of fields) {
                if (hasParam_(item, `sum_${position}`)) {
                    res = true;
                    break;
                }
            }
            return res;
        }
        generateSum(fields, position) {
            let h = '';
            for (const item of fields) {
                if (hasParam(item, 'hidden')) {
                    h += yM.td({
                        class: 'hide'
                    });
                } else {
                    const paramTd = {
                        data: item.name,
                        class: `${position}-sum ${position}-sum-${item.name} right-align`,
                        data: item.name,
                        content: ''
                    };
                    const locale = elvis(item.locale, false);
                    const localeOptions = elvis(item.localeOptions, false);
                    if (locale) {
                        paramTd.locale = locale;
                    }
                    if (localeOptions) {
                        paramTd['locale-options'] = stringifyJSON(localeOptions);
                    }
                    h += yM.td(paramTd);
                }
            }
            return h;
        }


        generateTableFilter(fields, func) {
            let result = false;
            func = typeof func !== 'undefined' ? func : false;
            if (typeof fields !== 'undefined' && fields) {
                let withFilter = false;
                let withFilterSelect = false;
                for (const item of fields) {
                    if (hasParam(item, 'filter')) {
                        withFilter = true;
                    }
                    if (hasParam(item, 'filterSelect')) {
                        withFilterSelect = true;
                    }
                }
                if (withFilter || withFilterSelect) {
                    let h = '';
                    const funcFilter = func + '-filter';
                    if (typeof this.selectList[funcFilter] === 'undefined') {
                        this.selectList[funcFilter] = [];
                    }
                    if (typeof this.selectController[funcFilter] === 'undefined') {
                        this.selectController[funcFilter] = [];
                    }
                    for (const item of fields) {

                        const serialize = typeof item.serialize != 'undefined' ? item.serialize : true;
                        const serializeClass = serialize ? '' : ' unserialize';
                        if (hasParam(item, 'hidden')) {
                            h += yM.td({
                                class: 'hide'
                            });
                        }
                        else {
                            let hChild = '';
                            if (hasParam(item, 'filter')) {
                                const classInput = func ? 'input-filter input-filter-' + func : 'input-filter';
                                hChild = yM.input({
                                    data: item.name,
                                    id: item.name + '-filter',
                                    name: item.name + '-filter',
                                    class: classInput + serializeClass,
                                    type: 'search',
                                    content: ''
                                });
                            }
                            else if (hasParam(item, 'filterSelect')) {
                                // Filter with select
                                const nameFilter = item.name + '-filter'
                                const classInput = func ? 'input-filter input-filter-select input_' + funcFilter + 'input_' + nameFilter + ' input-filter-' + func + ' input-filter-select-' + func + ' input_' + nameFilter : 'input-filter';
                                let selectContent = '';
                                if (typeof item.option !== 'undefined') {
                                    for (let j in item.option) {
                                        selectContent += yM.option(item.option[j]);
                                    }
                                }
                                if (!this.selectList[funcFilter].includes(nameFilter)) {
                                    this.selectList[funcFilter].push(nameFilter);
                                }
                                if (typeof item.controller !== 'undefined') {
                                    this.selectController[funcFilter][nameFilter] = item.controller;
                                }
                                hChild = yM.inputFieldSelect({
                                    addClass: 'input-field-filter-select input-field-filter-' + func,
                                    select: {
                                        data: item.name,
                                        id: nameFilter,
                                        name: nameFilter,
                                        content: selectContent,
                                        row: 'filter',
                                        ['data-init']: '',
                                        class: classInput + serializeClass
                                    }
                                });
                            }
                            else {
                                const classInput = func ? 'input-filter-readonly input-filter-readonly-' + func : 'input-filter-readonly';
                                hChild = yM.input({
                                    data: item.name,
                                    id: item.name + '-filter',
                                    name: item.name + '-filter',
                                    class: classInput + serializeClass,
                                    readonly: true
                                });
                            }
                            h += yM.th({
                                data: item.name,
                                class: "y-filter y-filter-" + item.name,
                                data: item.name,
                                content: hChild
                            });
                        }
                    }
                    result = yM.tr({
                        class: 'row-y-filter row-y-filter-' + func,
                        content: h
                    });
                }
            }
            return result;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Write Table Data
        /////////////////////////////////////////////////////////////////////////////////////
        writeTableData(func, data) {
            if (typeof data !== 'undefined') {
                for (var i in data) {
                    this.writeRow(i, func, data[i]);
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Write Row
        // Called by writeTableData()
        /////////////////////////////////////////////////////////////////////////////////////
        writeRow(row, func, data, option) {
            const that = this;
            row = typeof row !== 'undefined' ? row : 0;
            func = typeof func !== 'undefined' ? func : 'd';
            option = typeof option !== 'undefined' ? option : '';
            switch (func) {
                case 'm':
                    func = 'master';
                    break;
                case 'd':
                    func = 'detail';
                    break;
                case 'h':
                    func = 'history';
                    break;
            }
            if (typeof this.selectList[func] === 'undefined') {
                this.selectList[func] = [];
            }
            if (typeof this.selectController[func] === 'undefined') {
                this.selectController[func] = [];
            }
            let rowContent = '';
            let useDate = false;
            const dateArrayField = [];
            const dateArrayYearRange = [];
            const dateArrayMinDate = [];
            const dateArrayMaxDate = [];
            let useTime = false;
            const timeArrayField = [];
            const classTr = `panel_input_row_with_sidebar panel_input_row_${func} panel_input_row_${func}_clickable`;
            for (const item of this.form.field[func]) {
                //const item = this.form.field[func][col]
                item.label = typeof item.label !== 'undefined' ? item.label : '';
                let classItem = item.name + ' ';
                const serialize = typeof item.serialize !== 'undefined' ? item.serialize : true;
                const serializeClass = serialize ? '' : ' unserialize';
                let cell = typeof data[item.name] !== 'undefined' ? data[item.name] : '';
                const patternMatchScript = /(<script>)(.*?)(?=<)/g;
                cell = patternMatchScript.test(cell) ? 'script injection detected' : cell;
                const addClass = typeof item.addClass !== 'undefined' ? item.addClass : '';
                if (typeof item.type !== 'undefined') {
                    switch (item.type) {
                        case 'date':
                            useDate = true;
                            dateArrayField.push(item.name)
                            dateArrayYearRange.push(typeof item.yearRange !== 'undefined' ? item.yearRange : false);
                            dateArrayMinDate.push(typeof item.minDate !== 'undefined' ? item.minDate : false);
                            dateArrayMaxDate.push(typeof item.maxDate !== 'undefined' ? item.maxDate : false);
                            break;
                        case 'time':
                            useTime = true;
                            timeArrayField.push(item.name);
                            break;
                    }
                }
                if (typeof item.format !== 'undefined') {
                    switch (item.format) {
                        case 'currency':
                            cell = !isNaN(cell) ? y_format_currency(Math.round(cell * 100) / 100, 'Rp') : cell;
                            break;
                        case 'currency_no_symbol':
                            cell = !isNaN(cell) ? cell = y_format_currency(Math.round(cell * 100) / 100, '') : cell;
                            break;
                        case 'number_with_thousand_separator':
                            cell = !isNaN(cell) ? y_format_currency(Math.round(cell * 100) / 100, '') : cell;
                            break;
                        case 'number':
                            cell = !isNaN(cell) ? y_format_currency(Math.round(cell * 100) / 100, '') : cell
                            break
                        case 'long_date_indonesia':
                            cell = y_format_long_date_id(cell);
                            break;
                        case 'medium_datetime':
                            cell = y_datetime_convert(cell, 'datetime_sql_to_medium_datetime');
                            break;
                        case 'medium_date':
                            cell = y_datetime_convert(cell, 'datetime_sql_to_medium_date');
                            break;
                    }
                }

                // {input: true}
                if (hasParam(item, 'input')) {
                    rowContent += this.writeCellInput(row, func, item, 'input', cell);
                }

                // {checkbox: true}
                else if (hasParam(item, 'checkbox')) {
                    rowContent += this.writeCellInput(row, func, item, 'checkbox', cell);
                }

                // {radio: true}
                else if (hasParam(item, 'radio')) {
                    rowContent += this.writeCellInput(row, func, item, 'radio', cell);
                }

                // {textarea:'yes'} ...
                else if (hasParam(item, 'textarea')) {
                    rowContent += this.writeCellInput(row, func, item, 'textarea', cell);
                }

                // Input Select
                // {select: true}
                else if (hasParam(item, 'select')) {
                    let classInput = 'input-select input-' + func + '-select';
                    let selectContent = '';
                    const useContent = typeof item.useContent !== 'undefined' ? item.useContent : true;
                    if (typeof item.option !== 'undefined') {
                        for (const itemOption of item.option) {
                            selectContent += yM.option(itemOption);
                        }
                    }
                    if (!this.selectList[func].includes(item.name)) {
                        this.selectList[func].push(item.name);
                    }
                    if (typeof item.controller !== 'undefined') {
                        this.selectController[func][item.name] = item.controller;
                    }
                    let classSelect = classInput + ' input_' + item.name;
                    if (this.modeSelect !== 'materialize') {
                        classSelect += ' browser-default';
                    }
                    const childObject = {
                        class: `td-input-select td-input-select-${func} td-input-select-${func}-${item.name}`,
                        content: yM.inputFieldSelect({
                            select: {
                                data: item.name,
                                id: item.name + '-' + row,
                                name: item.name + '[' + row + ']',
                                content: selectContent,
                                row: row,
                                ['use-content']: useContent,
                                ['data-init']: cell,
                                class: classSelect
                            }
                        }),
                        row: row
                    };
                    if (typeof item.controller !== 'undefined') {
                        childObject.controller = item.controller;
                    }
                    rowContent += yM.td(childObject);
                }

                // {checkbox_with_hidden_input:'yes'}
                else if (hasParam(item, 'checkbox_with_hidden_input hide')) {
                    rowContent += yHtml([{
                        element: 'td',
                        class: 'td-input-checkbox ' + 'td-input-checkbox-' + func + ' td-input-checkbox-' + func + '-' + item.name,
                        content: yHtml([
                            {
                                element: 'label',
                                content: yHtml([
                                    { element: 'input', type: 'checkbox', class: 'filled-in input_tick input_tick_' + item.name + serializeClass, name: 'tick_' + item.name + '[' + row + ']' },
                                    { element: 'span', content: '' }
                                ])
                            },
                            {
                                element: 'input',
                                type: 'hidden',
                                class: item.name + serializeClass,
                                name: item.name + '[' + row + ']',
                                value: cell
                            }
                        ])
                    }]);
                }

                // {button:'yes'}
                else if (hasParam(item, 'button')) {
                    const iconObject = typeof item.icon !== 'undefined' ? item.icon : 'check'
                    const buttonContent = typeof (item.content) !== 'undefined' ? item.content : yM.button({
                        class: 'btn-floating waves-effect waves-light center btn-td btn-td-' + func + '-' + item.name + ' btn-td-' + func + ' ' + addClass,
                        icon: iconObject,
                        data: func,
                        style: 'display: block; margin: auto !important; width: 100%;',
                        col: item.name,
                        row: row,
                        value: cell
                    });
                    rowContent += yM.td({
                        class: `td-button td-button-${func} td-button-${func}-${item.name}`,
                        content: buttonContent
                    });
                }

                // {buttonRemove: true}
                else if (hasParam(item, 'buttonRemove')) {
                    const icon = typeof item.icon !== 'undefined' ? item.icon : 'delete';
                    rowContent += yM.td({
                        class: `td-button-remove td-button-remove-${func} td-button-remove-${func}-${item.name}`,
                        content: yM.button({
                            class: 'btn-floating waves-effect waves-light btn-td btn-remove-row red btn-remove-row-' + item.name + ' btn-remove-row-' + func + ` btn-remove-row-${func}-${item.name}`,
                            icon: icon,
                            data: func,
                            col: item.name
                        }),
                        row: row
                    });
                }

                // {buttonPrint: true}
                else if (hasParam(item, 'buttonPrint')) {
                    rowContent += yM.td({
                        class: `td-button-print td-button-print-${func} td-button-print-${func}-${item.name}`,
                        content: yM.button({
                            class: 'btn-floating waves-effect waves-light btn-td btn-print-row btn-print-row-' + item.name + ' btn-print-row-' + func + ` btn-print-row-${func}-${item.name}`,
                            icon: 'print',
                            data: func,
                            col: item.name
                        }),
                        row: row
                    });
                }

                // old function, do not used
                // {button_print:'yes'}
                else if (hasParam(item, 'button_print')) {
                    rowContent += yHtml([{
                        element: 'td',
                        class: 'button_print_row_40 ' + item.name,
                        content: item.label
                    }]);
                }

                // old function, do not used
                // {button_detail:'yes'}
                else if (hasParam(item, 'button_detail')) {
                    rowContent += yHtml([{
                        element: 'td',
                        class: 'button_detail_row_40 ' + item.name,
                        content: item.label
                    }]);
                }

                // {buttonCheck: true}
                else if (hasParam(item, 'buttonCheck')) {
                    rowContent += yM.td({
                        class: `td-button-check td-button-check-${func} td-button-check-${func}-${item.name}`,
                        content: yM.button({
                            class: 'btn-floating waves-effect waves-light btn-td btn-check-row btn-check-row-' + item.name + ' btn-check-row-' + func + ` btn-check-row-${func}-${item.name}`,
                            icon: typeof cell !== 'undefined' && (cell == 'true' || cell > 0) ? 'check_circle' : 'radio_button_unchecked',
                            data: func,
                            col: item.name
                        }),
                        row: row
                    });
                }
                // Multicolumn
                else if (hasParam(item, 'multicolumn')) {
                    const objectDataItem = typeof this.form.data[func][0][item.name] !== 'undefined' ? this.form.data[func][0][item.name] : false;
                    const fields = objectDataItem ? this.getMultiColumnField(objectDataItem) : false;
                    const noCol = fields ? fields.length : 0;
                    for (let j = 0; j < noCol; j++) {
                        const cellSubColumn = typeof cell[fields[j]] !== 'undefined' ? cell[fields[j]] : '';
                        rowContent += yHtml([{
                            element: 'td',
                            class: classItem,
                            content: cellSubColumn
                        }]);
                    }
                }
                // {hidden: true}
                else if (hasParam(item, 'hidden')) {
                    rowContent += yM.td({
                        class: `td-input-hidden td-input-hidden-${func} td-input-hidden-${func}-${item.name} hide`,
                        content: yM.input({
                            type: 'hidden',
                            tabindex: '-1',
                            row: row,
                            class: 'input_' + item.name + serializeClass,
                            name: item.name + '[' + row + ']',
                            value: cell
                        }),
                        row: row
                    });
                }
                // HTML
                else if (hasParam(item, 'html')) {
                    const code = typeof item.code !== 'undefined' ? item.code : ''
                    rowContent += yM.td({
                        class: 'td td-html ' + addClass,
                        content: code,
                        row: row
                    });
                }
                else if (hasParam(item, 'image')) {
                    rowContent += yM.td({
                        class: 'td td-img ' + addClass,
                        content: yM.img({
                            class: 'preview-image-table ' + addClass,
                            src: cell,
                            width: typeof item.width !== 'undefined' ? item.width : '50px',
                            height: typeof item.height !== 'undefined' ? item.height : '50px'
                        }),
                        row: row
                    });
                }
                else {
                    // label
                    const isSumHeader = hasParam(item, 'sum_header') || hasParam(item, 'sumHeader')
                    const isSumFooter = hasParam(item, 'sum_footer') || hasParam(item, 'sumFooter')
                    if (isSumHeader) {
                        classItem += ' sum-item sum-header-item sum-header-item-' + item.name;
                    }
                    if (isSumFooter) {
                        classItem += ' sum-item sum-footer-item sum-footer-item-' + item.name;
                    }
                    const isRightAlign = hasParam(item, 'right_align') || hasParam(item, 'rightAlign')
                    if (isRightAlign) {
                        classItem += ' right-align';
                    }

                    if (!hasParam(item, 'key')) {
                        // Handle Long Word
                        if(hasParam(item, 'chip')) {
                            const arrayChip = cell?.split('|') ?? [];
                            let newCell = '';
                            for(const textChip of arrayChip) {
                                newCell += yM.div({
                                    class: 'chip',
                                    content: textChip?.trim() ?? ''
                                });
                            }

                            cell = newCell;
                        }
                        else if (cell && cell !== '' && cell.length > 12) {
                            let breakCell = cell.split(/\//);
                            if (breakCell.length > 1) {
                                let newCell = '';
                                for (let cidx in breakCell) {
                                    newCell += cidx == 0 ? breakCell[cidx] : "/<wbr>" + breakCell[cidx];
                                }
                                cell = newCell;
                            }
                            else {
                                let breakCellSpace = cell.split(" ");
                                let newCell = '';
                                for (let i in breakCellSpace) {
                                    let wordCell = breakCellSpace[i];
                                    if (wordCell.length > 12) {
                                        wordCell = wordCell.replace(/(.{10})/g, "$&" + "<wbr>");
                                    }
                                    newCell += i == 0 ? wordCell : ' ' + wordCell;
                                }
                                cell = newCell;
                            }
                        }
                        const paramTd = {
                            class: classItem + ' td-label',
                            attr: typeof item.attr !== 'undefined' ? item.attr : typeof item.attribute ? item.attribute : undefined,
                            content: cell,
                            data: item.name,
                            row: row,
                        };
                        const locale = typeof item.locale !== 'undefined' ? item.locale : false;
                        if (locale) {
                            paramTd.locale = locale;
                        }
                        const localeOptions = typeof item.localeOptions !== 'undefined' ? item.localeOptions : false;
                        if (localeOptions) {
                            paramTd['locale-options'] = stringifyJSON(localeOptions);
                        }
                        rowContent += yM.td(paramTd);
                    }
                    // Key not label but input hidden
                    // {key:'yes'}
                    else {
                        rowContent += yM.td({
                            class: 'td-input-hidden hide',
                            content: yM.input({
                                type: 'hidden',
                                tabindex: '-1',
                                class: 'cl_key_' + item.name + serializeClass,
                                name: 'key_' + item.name + '[' + row + ']',
                                value: cell,
                                row: row
                            })
                        });
                    }
                }
            }
            let h;
            switch (option) {
                case 'draggable':
                    h = yHtml([{
                        element: 'tr',
                        row: row,
                        draggable: 'true',
                        class: classTr,
                        content: rowContent
                    }]);
                    break;
                case 'hidden':
                    h = yHtml([{
                        element: 'tr',
                        row: row,
                        hidden: 'true',
                        class: classTr,
                        content: rowContent
                    }]);
                    break;
                default:
                    h = yHtml([{
                        element: 'tr',
                        row: row,
                        class: classTr,
                        content: rowContent
                    }]);
                    break;
            }
            const result = $(h);
            $(this.form[func]).append(result);

            if (useDate) {
                const options = {
                    format: this.formatDate,
                    defaultDate: 'now',
                    autoClose: true,
                }
                for (let i in dateArrayField) {
                    const field = dateArrayField[i]
                    const target = `#${field}-${row}.input_${func}_text.datepicker`
                    const el = document.querySelector(target)
                    options.onOpen = function () {
                        const instance = M.Datepicker.getInstance(el)
                        const value = el.value
                        const modalDate = value && value != '' ? dateFromFormat(value, that.formatDate) : new Date()
                        instance.setDate(modalDate)
                        instance.gotoDate(modalDate);
                        if (typeof el !== 'undefined' && el.readOnly) {
                            const obj = typeof instance.$modalEl !== 'undefined' ? instance.$modalEl : false
                            if (typeof obj === 'object') {
                                for (let i = 0; i < obj.length; i++) {
                                    const modal = obj[i]
                                    setTimeout(() => {
                                        modal.classList.remove('open')
                                        modal.style.display = 'none'
                                        modal.nextElementSibling.remove()
                                    }, 10)
                                }
                            }
                        }
                    }
                    const yearRange = typeof dateArrayYearRange[i] != 'undefined' ? dateArrayYearRange[i] : false
                    if (yearRange) {
                        options.yearRange = yearRange
                    }
                    const minDate = typeof dateArrayMinDate[i] != 'undefined' ? dateArrayMinDate[i] : false
                    if (minDate) {
                        options.minDate = minDate
                    }
                    const maxDate = typeof dateArrayMaxDate[i] != 'undefined' ? dateArrayMaxDate[i] : false
                    if (maxDate) {
                        options.maxDate = maxDate
                    }
                    M.Datepicker.init(el, options);
                }
            }

            if (useTime) {
                const options = {
                    format: this.formatTime,
                    defaultTime: 'now',
                    twelveHour: false,
                    vibrate: true,
                    autoClose: true
                }
                for (let i in timeArrayField) {
                    const field = timeArrayField[i]
                    const target = `#${field}-${row}.input_${func}_text.timepicker`
                    const el = document.querySelector(target)
                    M.Timepicker.init(el, options)
                }
            }
            return result;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Create Cell
        // Called by writeRow()
        /////////////////////////////////////////////////////////////////////////////////////
        writeCellInput(row, table, item, element, cellValue) {
            let html = ''
            let buttonHtml = ' ';
            row = typeof row !== 'undefined' ? row : 0;
            table = typeof table !== 'undefined' ? table : 'table';
            element = typeof element !== 'undefined' ? element : 'input';
            if (typeof item !== 'undefined' && hasParam(item, element)) {
                const itemName = typeof item.name !== 'undefined' ? item.name : 'input';
                const cellName = `${itemName}[${row}]`;
                const cellId = `${itemName}-${row}`;
                let tdClass = `td-${table} td-${table}-${itemName} td-`;
                const isSumHeader = hasParam(item, 'sum_header') || hasParam(item, 'sumHeader');
                const isSumFooter = hasParam(item, 'sum_footer') || hasParam(item, 'sumFooter');
                const isHidden = hasParam(item, 'hidden');
                const isCheckBox = hasParam(item, 'checkbox') || hasParam(item, 'checkBox');
                const isRadio = hasParam(item, 'radio');
                const showLabel = hasParam(item, 'showLabel');
                const autocomplete = hasParam(item, 'autocomplete');
                const isRadioColumn = hasParam(item, 'byColumn');
                const isRadioRow = isRadioColumn ? false : hasParam(item, 'byRow');
                const isReadonly = hasParam(item, 'readonly') || hasParam(item, 'readOnly');
                const isRightAlign = hasParam(item, 'right_align') || hasParam(item, 'rightAlign');
                const maxlength = typeof item.maxlength !== 'undefined' ? item.maxlength : false;
                let cellClass = `input_text input-table-cell input_${table}_text ${element}_single input_${itemName} autocomplete`;
                // if(autocomplete) {
                // 	cellClass += ' autocomplete'
                // }
                if (isSumHeader) {
                    cellClass += ' sum-item sum-header-item sum-header-item-' + item.name;
                }
                if (isSumFooter) {
                    cellClass += ' sum-item sum-footer-item sum-footer-item-' + item.name;
                }

                const yObjType = {
                    element: element,
                    class: cellClass,
                    name: cellName,
                    id: cellId,
                    value: cellValue,
                    data: itemName,
                    row: row,
                }
                const locale = typeof item.locale !== 'undefined' ? item.locale : false;
                if (locale) {
                    yObjType.locale = locale;
                }
                const localeOptions = typeof item.localeOptions !== 'undefined' ? item.localeOptions : false;
                if (localeOptions) {
                    yObjType['locale-options'] = stringifyJSON(localeOptions);
                }
                if (isRightAlign) {
                    yObjType.class += ' right-align';
                }
                if (element === 'input' || element === 'textarea') {
                    yObjType.content = cellValue;
                }
                if (isHidden) {
                    yObjType.class = 'cl_key_' + item.name;
                    yObjType.type = 'hidden';
                    yObjType.tabindex = '-1';
                    html += yHtml([yObjType]);
                    tdClass += `input-hidden hide ${item.name}`;
                }
                if (maxlength) {
                    yObjType.maxlength = maxlength;
                }
                if (element == 'checkbox' || isCheckBox) {
                    let idCB = 'checkbox-' + itemName + '-' + this.guid();
                    const yObjCB = {
                        element: 'input',
                        type: 'checkbox',
                        id: idCB,
                        class: `filled-in input_tick input_tick_${itemName} input_tick_${table}_${itemName} checkbox-${table}-${itemName}`,
                        name: 'tick_' + cellName,
                    };
                    if (cellValue == true || cellValue == 'true') {
                        yObjCB.checked = 'checked';
                    }
                    const htmlCBContent = yM.input(yObjCB) + yM.span(typeof item.span !== 'undefined' ? item.span : '');
                    html += yM.label(htmlCBContent);
                    tdClass += `input-checkbox ${item.name}`;
                }
                else if (isRadio) {
                    const radioName = typeof item.radioGroupName !== 'undefined' ? item.radioGroupName : 'radio';
                    yObjType.element = 'input';
                    yObjType.type = 'radio';
                    yObjType.name = isRadioRow ? radioName + '-' + row : radioName;
                    yObjType.value = isRadioRow ? itemName : row;
                    if (cellValue == true || cellValue == 'true' || hasParam(item, 'checked')) {
                        yObjType.checked = 'checked';
                    }
                    tdClass += `input-radio ${item.name} ${item.radioGroupName}`;
                    if (isReadonly) {
                        yObjType.readonly = true;
                    }
                    const radioLabel = typeof item.label !== 'undefined' ? item.label : '';
                    const yObjLabel = {
                        element: 'span',
                        content: showLabel ? radioLabel : '',
                    };

                    html += yHtml({
                        element: 'label',
                        class: 'input-radio',
                        content: yHtml([yObjType, yObjLabel]),
                    });
                }
                else if ((element === 'input' || element === 'textarea') && !isHidden) {
                    yObjType.type = 'text';
                    tdClass += `input-text ${item.name}`;
                    if (isReadonly) {
                        yObjType.readonly = true;
                    }
                    if (typeof item.type !== 'undefined') {
                        let yObjButton;
                        switch (item.type) {
                            case 'date':
                                yObjType.class += ' input_type_date datepicker';
                                yObjButton = {
                                    element: 'div',
                                    class: '_yFL buttonDatePicker',
                                    content: '',
                                };
                                buttonHtml = yHtml([yObjButton]);
                                break;
                            case 'time':
                                yObjType.class += ' input_type_time timepicker';
                                yObjButton = {
                                    element: 'div',
                                    class: '_yFL buttonTimePicker',
                                    content: '',
                                };
                                buttonHtml = yHtml([yObjButton]);
                                break;
                            case 'currency':
                                yObjType.style = 'text-align: right';
                                break;
                            case 'file':
                                yObjType.type = 'file';
                                if (typeof item.accept !== 'undefined') {
                                    yObjType.accept = item.accept;
                                }
                                break;
                        }
                    }
                    html += yHtml({
                        element: 'div',
                        class: 'input-field',
                        content: yHtml(yObjType),
                    });
                } else {
                    html += yHtml([yObjType]);
                }
                html += buttonHtml;
                return yM.td({
                    class: tdClass,
                    content: html,
                    row: row,
                });
            }
            return yM.td({
                class: `td-${table}`,
                content: '',
                row: row,
            });
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Button Component
        /////////////////////////////////////////////////////////////////////////////////////
        addButton(options) {
            var parent = typeof (options.parent) !== 'undefined' ? options.parent : '#toolbar-module-left';
            var button = this.button(options);
            yM.li({
                parent: parent,
                content: yHtml(button)
            });
            this.tooltipListener();
            return button.id;
        }
        create_button(model, label, id) {
            model = typeof model !== 'undefined' ? model : 'submit';
            label = typeof label !== 'undefined' ? label : 'button';
            id = typeof id !== 'undefined' ? id : '';
            var toolbarModuleLeft = $('#toolbar-module-left')
            var button = this.object_button(model, label, id)
            toolbarModuleLeft.append(yHtml({
                element: 'li',
                content: yHtml([button])
            }))
            return '#button_' + model + '_' + id
        }
        create_button_file(model, label, id, accept, parent) {
            this.createButtonFile(model, label, id, accept, parent);
        }
        createButtonFile(model, label, id, accept, parent) {
            parent = elvis(parent, '#toolbar-module-left');
            id = typeof id !== 'undefined' ? id : this.guid();
            accept = typeof accept !== 'undefined' && accept != '' ? accept : false;
            var elmParent = $(parent);
            var buttonTrigger = this.object_button(model, label, id);
            elmParent.append(yHtml({
                element: 'li',
                content: yHtml([buttonTrigger])
            }));
            let buttonFile = { element: 'input', type: 'file', style: 'display:none', id: 'button_file_' + model + '_' + id };
            if (accept) {
                buttonFile.accept = accept;
            }
            elmParent.append(yHtml({
                element: 'li',
                content: yHtml([buttonFile])
            }));
            var bObjFile = document.getElementById('button_file_' + model + '_' + id);
            var bObjTrigger = document.getElementById('button_' + model + '_' + id);
            bObjTrigger.addEventListener("click", function () {
                bObjFile.click();
            });
            return '#button_file_' + model + '_' + id;
        }
        button(options) {
            var options = this.buttonOptions(options);
            var basicClassButton = 'btn waves-effect waves-light light-blue darken-1 white-text ' + options.type;
            basicClassButton = options.showTooltip ? basicClassButton + ' tooltipped button-tooltip' : basicClassButton;
            var classButton = typeof (options.class) !== 'undefined' ? basicClassButton + ' ' + options.class : basicClassButton;
            var classButton = typeof (options.addClass) !== 'undefined' ? classButton + ' ' + options.addClass : classButton;
            var materialIcon = {
                element: 'i',
                class: 'material-icons ' + options.iconPosition,
                content: options.icon
            };
            var content = [materialIcon, {
                element: 'span',
                class: '',
                content: options.label
            }];
            var button = {
                element: 'a',
                id: options.id,
                class: classButton,
                content: yHtml(content)
            };
            button['data-position'] = options.tooltipPosition;
            button['data-tooltip'] = options.tooltip;
            if (typeof options['data-target'] !== 'undefined') {
                button['data-target'] = options['data-target'];
            }
            if (typeof options.href !== 'undefined') {
                button.href = options.href;
            }
            return button;
        }
        buttonOptions(options) {
            options.label = typeof (options.label) !== 'undefined' ? options.label : '';
            options.icon = typeof (options.icon) !== 'undefined' ? options.icon : 'radio_button_checked';
            options.type = typeof (options.type) !== 'undefined' ? options.type : 'btn-small';
            options.iconPosition = typeof (options.iconPosition) !== 'undefined' ? options.iconPosition : 'left';
            options.showTooltip = typeof (options.showTooltip) !== 'undefined' ? options.showTooltip : true;
            options.tooltip = typeof (options.tooltip) !== 'undefined' ? options.tooltip : options.label;
            options.tooltipPosition = typeof (options.tooltipPosition) !== 'undefined' ? options.tooltipPosition : 'bottom';
            options.id = typeof (options.id) !== 'undefined' ? options.id : 'btn-' + this.guid();
            return options;
        }
        object_button(model, label, id, option, type) {
            type = typeof type !== 'undefined' ? type : 'rectangle';
            var cl_bt = 'button_' + type;
            var cl_txt = cl_bt + '_text';
            var iconModel = model;
            switch (model) {
                case 'new':
                    iconModel = 'create_new_folder';
                    break;
                case 'open':
                    iconModel = 'folder_open';
                    break;
                case 'clone':
                    iconModel = 'content_copy';
                    break;
                case 'submit':
                    iconModel = 'check';
                    break;
                case 'download':
                    iconModel = 'save';
                    break;
            }
            if (typeof id === 'undefined') {
                id = 'button-' + this.guid();
            }
            if (typeof label === 'undefined') {
                label = model;
            }
            var object_image = {
                element: 'i',
                class: 'material-icons left',
                content: iconModel
            };
            var button;
            var button_content;
            if (typeof option != 'undefined') {
                if (option == 'no label') {
                    button = object_image;
                }
                if (option == 'no background') {
                    button_content = yHtml([object_image, {
                        element: 'div',
                        class: cl_txt,
                        content: label
                    }]);
                    button = {
                        element: 'a',
                        id: 'button_' + model + '_' + id,
                        class: 'waves-effect waves-light btn-flat tooltipped ' + cl_bt,
                        content: button_content
                    };
                }
            } else {
                button_content = yHtml([object_image]);
                button = {
                    element: 'a',
                    id: 'button_' + model + '_' + id,
                    class: 'waves-effect waves-light btn-small tooltipped light-blue darken-1 ' + cl_bt,
                    content: button_content + ' ' + label
                };
            }
            button['data-position'] = 'top';
            button['data-tooltip'] = label;
            return button;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Select Component
        /////////////////////////////////////////////////////////////////////////////////////
        initSelect(func, callback, callbackAfterInitSelect, forceRewrite) {
            const that = this
            forceRewrite = typeof forceRewrite !== 'undefined' ? forceRewrite : false
            callback = typeof callback !== 'undefined' ? callback : function () { };
            callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { };
            this.instancesSelect[func] = typeof this.instancesSelect[func] !== 'undefined' ? this.instancesSelect[func] : [];
            this.resSelect[func] = typeof this.resSelect[func] !== 'undefined' ? this.resSelect[func] : []
            if (typeof this.selectList[func] !== 'undefined' && this.selectList[func].length > 0) {
                for (let i in this.selectList[func]) {
                    const nameSelect = this.selectList[func][i]
                    this.instancesSelect[func][nameSelect] = []
                    let url = typeof this.selectController[func][nameSelect] !== 'undefined' ? this.selectController[func][nameSelect] : this.queryUrl + 'call_' + nameSelect + '_select';
                    url = url.replace(/-/g, "_")
                    if (typeof this.resSelect[func][nameSelect] === 'undefined' || forceRewrite) {
                        this.resSelect[func][nameSelect] = false;
                        const onSuccess = function (res) {
                            if (typeof res !== 'undefined' && res.length > 0) {
                                that.resSelect[func][nameSelect] = res;
                                that.writeSelectOption(func, nameSelect, callbackAfterInitSelect, forceRewrite);
                            }
                        };
                        const onComplete = function () {
                            if (!that.resSelect[func][nameSelect]) {
                                that.initFormSelect(func, nameSelect, callbackAfterInitSelect);
                            }
                            callback();
                        };
                        if (url) {
                            getAjax(url, '', onSuccess, onComplete);
                        }
                        else {
                            onComplete();
                        }
                    }
                    else {
                        that.writeSelectOption(func, nameSelect, callbackAfterInitSelect, forceRewrite);
                        callback();
                    }
                }
            }
        }
        initSelectField(table, field, callback, callbackAfterInitSelect, forceRewrite) {
            const that = this;
            forceRewrite = typeof forceRewrite !== 'undefined' ? forceRewrite : false
            callback = typeof callback !== 'undefined' ? callback : function () { };
            callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { };
            this.instancesSelect[table] = typeof this.instancesSelect[table] !== 'undefined' ? this.instancesSelect[table] : [];
            this.resSelect[table] = typeof this.resSelect[table] !== 'undefined' ? this.resSelect[table] : []
            this.instancesSelect[table][field] = []
            let url = typeof this.selectController[table][field] !== 'undefined' ? this.selectController[table][field] : this.queryUrl + 'call_' + field + '_select';
            url = url.replace(/-/g, "_")
            if (typeof this.resSelect[table][field] === 'undefined' || forceRewrite) {
                this.resSelect[table][field] = false;
                const onSuccess = function (res) {
                    if (typeof res !== 'undefined' && res.length > 0) {
                        that.resSelect[table][field] = res;
                        that.writeSelectOption(table, field, callbackAfterInitSelect, forceRewrite)
                    }
                };
                const onComplete = function () {
                    if (!that.resSelect[table][field]) {
                        that.initFormSelect(table, field, callbackAfterInitSelect)
                    }
                    callback();
                };
                if (url) {
                    getAjax(url, '', onSuccess, onComplete);
                }
                else {
                    onComplete();
                }
            }
            else {
                that.writeSelectOption(table, field, callbackAfterInitSelect, forceRewrite)
                callback();
            }
        }
        writeSelectOption(func, nameSelect, callbackAfterInitSelect, forceRewrite, row) {
            const that = this
            const resSelect = typeof this.resSelect[func][nameSelect] !== 'undefined' ? this.resSelect[func][nameSelect] : false;
            if (resSelect) {
                const res = JSON.parse(JSON.stringify(resSelect));
                if ($('select.input-' + func + '-select.input_' + nameSelect).length > 0) {
                    $('select.input-' + func + '-select.input_' + nameSelect).each(function () {
                        that.appendOptionSelect(this, res, forceRewrite)
                    });
                } else if ($('#input_' + nameSelect).length > 0) {
                    const elem = document.getElementById('input_' + nameSelect)
                    that.appendOptionSelect(elem, res, forceRewrite)
                }
                this.initFormSelect(func, nameSelect, callbackAfterInitSelect);
            }
        }
        appendOptionSelect(obj, res, forceRewrite) {
            const cRes = cloneObject(res)
            let selected = $(obj).attr('data-init')
            const useContent = $(obj).attr('use-content')
            if (useContent) {
                const selObject = cRes.find(s => {
                    const content = typeof s.content !== 'undefined' ? s.content : s.label;
                    return content === selected;
                })
                selected = typeof selObject !== 'undefined' && selObject.value !== 'undefined' ? selObject.value : selected;
            }
            if (forceRewrite) {
                $(obj).html('');
            }
            if (forceRewrite || $(obj).parent('.input-field').length > 0) {
                let optionSelect = '';
                for (let i in cRes) {
                    const val = typeof cRes[i].value !== 'undefined' ? cRes[i].value : typeof cRes[i].content !== 'undefined' ? cRes[i].content : cRes[i];
                    if (val === selected) {
                        cRes[i].selected = true;
                    }
                    optionSelect += yM.option(cRes[i]);
                }
                if (this.modeSelect == 'select2') {
                    // Re-clear option for select 2
                    $(obj).html('')
                }
                $(obj).append(optionSelect);
            }
        }
        initFormSelect(func, nameSelect, callbackAfterInitSelect) {
            const that = this
            callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : () => { }
            if ($('.input_' + nameSelect).length > 0) {
                $('.input_' + nameSelect).each(function () {
                    that.formSelectInitTable(func, nameSelect, this)
                })
            } else if ($('#input_' + nameSelect).length > 0) {
                const elem = document.getElementById('input_' + nameSelect)
                that.formSelectInitMaster(func, nameSelect, elem)
            }
            callbackAfterInitSelect()
        }
        formSelectInitTable(func, nameSelect, obj) {
            this.instancesSelect[func][nameSelect] = []
            if ($(obj).siblings('span').eq(0).length == 0) {
                if (this.modeSelect === 'materialize') {
                    const row = $(obj).attr('row');
                    this.instancesSelect[func][nameSelect][row] = M.FormSelect.init(obj, {
                        dropdownOptions: {
                            onOpenStart: function () {
                                const val = $(obj).val();
                                $(obj).attr('last', val);
                            }
                        }
                    })
                }
                else {
                    // include Select2 framework if use select2 options
                    $(obj).select2();
                }
            }
        }
        formSelectInitMaster(func, nameSelect, obj) {
            if (typeof this.instancesSelect[func] === 'undefined') {
                this.instancesSelect[func] = []
            }
            this.instancesSelect[func][nameSelect] = []
            if ($(obj).siblings('span').eq(0).length == 0) {
                if (this.modeSelect === 'materialize') {
                    this.instancesSelect[func][nameSelect] = M.FormSelect.init(obj, {
                        dropdownOptions: {
                            onOpenStart: function () {
                                const val = $(obj).val();
                                $(obj).attr('last', val);
                            }
                        }
                    })
                    const tag = $('#input_' + nameSelect).attr('tag')
                    $('#input_' + nameSelect).siblings('input').addClass(tag)
                }
                else {
                    // include Select2 framework if use select2 options
                    $(obj).select2()
                    $(obj).on('select2:open', function (e) {
                        const lastVal = $(obj).val()
                        $(obj).attr('last', lastVal)
                    });
                }
            }
        }
        rePopulateSelect(func, row, option) {
            typeof option !== 'undefined' ? option : undefined;
            if (typeof this.selectList[func] !== 'undefined' && this.selectList[func].length > 0) {
                for (let i in this.selectList[func]) {
                    const nameSelect = this.selectList[func][i];
                    let optionSelect = '';
                    const id = '#' + nameSelect + '-' + row;
                    if (typeof this.resSelect[func] !== 'undefined' && typeof this.resSelect[func][nameSelect] !== 'undefined') {
                        const res = this.resSelect[func][nameSelect];
                        for (let i in res) {
                            optionSelect += yM.option(res[i]);
                        }
                        $(id).append(optionSelect);
                        if (this.modeSelect === 'materialize') {
                            const elem = document.querySelector(id);
                            this.instancesSelect[func][nameSelect][row] = M.FormSelect.init(elem, {
                                dropdownOptions: {
                                    onOpenStart: function () {
                                        const val = $(elem).val();
                                        $(elem).attr('last', val);
                                    }
                                }
                            })
                        }
                        else {
                            $(id).select2();
                        }
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Toolbar Feature
        /////////////////////////////////////////////////////////////////////////////////////
        showToolbar() {
            $('#module-toolbar').show();
            $('#module-content').removeClass('no-toolbar');
            this.withToolbar = true;
        }
        hideToolbar() {
            $('#module-toolbar').hide();
            $('#module-content').addClass('no-toolbar');
            this.withToolbar = false;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Collapsible Feature
        /////////////////////////////////////////////////////////////////////////////////////
        collapsibleListener(selector) {
            var elems = document.querySelectorAll(selector);
            //return M.Collapsible.init(elems, {})[0];
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Title Document Feature
        /////////////////////////////////////////////////////////////////////////////////////
        useTitleDocument() {
            $('.input-field-title-document>input').on('click', function (e) {
                e.stopImmediatePropagation();
            });
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Tooltip for Button Feature
        /////////////////////////////////////////////////////////////////////////////////////
        tooltipListener() {
            var elems = document.querySelectorAll('.tooltipped');
            this.instancesTooltip = M.Tooltip.init(elems, {});
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Hover Table Feature
        /////////////////////////////////////////////////////////////////////////////////////
        tableHoverListener() {
            $('body').on("mouseover", 'td', function () {
                var td = $(this);
                td.closest('table').find('th').eq(td.index()).addClass('hover');
            }).on("mouseout", 'td', function () {
                $('th').removeClass("hover");
            });
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Table Resize Feature
        // Require columnSelector after cell
        /////////////////////////////////////////////////////////////////////////////////////
        enableTableResize(func) {
            let table = document.querySelector('.panel_y_' + func + '_table');
            if (table !== null) {
                let startPageX, curCol, nxtCol, curColWidth, nxtColWidth;
                let wrapper = $('body');
                wrapper.off('mousedown', '.column-selector-trigger');
                wrapper.on('mousedown', '.column-selector-trigger', function (event) {
                    let e = event || window.event;
                    let isStickyHeader = $(this).parent().parent().hasClass('stick-header');
                    let startDrag = function (event) {
                        e = event || window.event;
                        if (curCol !== 'undefined') {
                            let curPageX = getPageX(e);
                            if (curPageX) {
                                var diffX = curPageX - startPageX;
                                if (typeof nxtCol !== 'undefined') {
                                    let newNxtColWidth = nxtColWidth - (diffX);
                                    let newCurColWidth = (curColWidth + diffX);
                                    if (newNxtColWidth >= 0 && newCurColWidth >= 0) {
                                        nxtCol.style.width = (newNxtColWidth) + 'px';
                                        curCol.style.width = (newCurColWidth) + 'px';
                                        if (isStickyHeader) {

                                            let curColAttr = curCol !== null ? curCol.getAttribute("col") : null;
                                            let curColAll = curColAttr !== null ? document.querySelectorAll("td." + curColAttr) : null;
                                            let nxtColAttr = nxtCol !== null ? nxtCol.getAttribute("col") : null;
                                            let nxtColAll = nxtColAttr !== null ? document.querySelectorAll("td." + nxtColAttr) : null;

                                            curColAll.forEach(item => { item.style.width = (newCurColWidth) + 'px'; });
                                            nxtColAll.forEach(item => { item.style.width = (newNxtColWidth) + 'px'; });
                                            let isCurMin = false;
                                            let isNxtMin = false;
                                            if (typeof (curColAll[0]) !== 'undefined') {
                                                isCurMin = curColAll[0].offsetWidth > 0 && curColAll[0].offsetWidth > newCurColWidth;
                                            }
                                            if (typeof (nxtColAll[0]) !== 'undefined') {
                                                isNxtMin = nxtColAll[0].offsetWidth > 0 && nxtColAll[0].offsetWidth > newNxtColWidth;
                                            }
                                            if (isCurMin || isNxtMin) {
                                                nxtCol.style.width = (nxtColWidth) + 'px';
                                                curCol.style.width = (curColWidth) + 'px';
                                                curColAll.forEach(item => { item.style.width = (curColWidth) + 'px'; });
                                                nxtColAll.forEach(item => { item.style.width = (nxtColWidth) + 'px'; });
                                            }
                                            else {
                                                nxtColWidth = newNxtColWidth;
                                                curColWidth = newCurColWidth;
                                                startPageX = curPageX;
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    };
                    let endDrag = function (event) {
                        wrapper.unbind("mousemove", startDrag);
                        wrapper.unbind("mouseup", endDrag);
                        wrapper.css("-webkit-user-select", "text");
                        document.body.style.cursor = 'default';
                        document.onselectstart = function () { return true; };
                    };
                    let getPageX = function (event) {
                        e = event || window.event;
                        var isIE = document.all;
                        let x = false;
                        if (e) {
                            x = isIE ? (e.clientX + document.body.scrollLeft) : e.pageX;
                        }
                        return x;
                    };
                    curCol = e.target.parentElement;
                    nxtCol = curCol !== null ? curCol.nextElementSibling : null;
                    if (nxtCol !== null && !nxtCol.classList.contains("th-fix")) {
                        startPageX = getPageX(e);
                        if (startPageX) {
                            curColWidth = curCol.offsetWidth;
                            nxtColWidth = nxtCol.offsetWidth;
                            wrapper.bind("mousemove", startDrag);
                            wrapper.bind("mouseup", endDrag);
                            wrapper.css("-webkit-user-select", "none");
                            document.onselectstart = function () { return false; };
                        }
                    }
                });
                wrapper.off('dblclick', '.column-selector-trigger');
                wrapper.on('dblclick', '.column-selector-trigger', function (event) {
                    e = event || window.event;
                    curCol = e.target.parentElement;
                    $(curCol).siblings('th').not("tr.stick-header>th").css('width', '');
                    $(this).parent().parent().parent().siblings('tbody').children('tr').children('td').css('width', '');
                });
            }
            if (window.innerWidth <= 993) {
                $('.column-selector').css('background-color', '#78909c');
            }
        }
        listenerWindowResize() {
            $(window).resize(function () {
                if (window.innerWidth <= 993) {
                    $('.th-label').each(function () {
                        this.style.removeProperty('width');
                    });
                    $('.column-selector').css('background-color', '#78909c');
                }
                else {
                    $('.column-selector').css('background-color', 'azure');
                }
            });
        }
        columnSelector() {
            let res = yM.div({ class: 'column-selector-transparent column-selector-trigger' }) +
                yM.div({ class: 'column-selector column-selector-trigger' });
            return res;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Sticky Header Table Feature
        /////////////////////////////////////////////////////////////////////////////////////
        listenerStickyTable(func) {
            const that = this;
            $('#module-content').scroll(function () {
                that.handleStickyTable(func);
            });
            $(window).resize(function () {
                that.handleStickyTable(func);
            });
        }
        handleStickyTable(table) {
            const that = this;
            const classTable = `.panel_y_${table}_table`;
            const classTableHeader = `${classTable}_header`;
            const classTableData = `${classTable}_data`;
            const offset = $(classTableData).offset();
            const windowWidth = $(window).width();
            const headerHeight = $('#header').outerHeight();
            const toolbarHeight = $('#module-toolbar').outerHeight();
            const thHeight = $('th.label_header_' + table).outerHeight();
            const titleHeight = $('.panel-title-' + table).outerHeight();
            const space = thHeight - titleHeight;
            const topPanelOffset = this.withToolbar ? headerHeight + thHeight + toolbarHeight : headerHeight + thHeight;
            if (typeof offset !== 'undefined' && typeof offset.top !== 'undefined' && offset.top !== 0 && windowWidth > 992) {
                const height = $(classTableData).outerHeight();
                const bottom = height + offset.top;
                if (offset.top <= (topPanelOffset - space) && bottom > topPanelOffset) {
                    $(classTableHeader).addClass('stick-header');
                    that.recalculateStickyHeader(table);
                }
                else {
                    $(classTableHeader).removeClass('stick-header');
                    $(classTableData + '>tr>td').css('width', '');
                }
            }
        }
        recalculateStickyHeader(table) {
            const classTable = `.panel_y_${table}_table`;
            const classTableHeader = `${classTable}_header`;
            const classTableData = `${classTable}_data`;
            const tableWidth = $(classTable).width() ?? 0;
            $(classTableHeader).width(tableWidth);
            if (tableWidth === 0) return;
            const form = this.form ?? {};
            const fields = form.field ?? {};
            const field = fields[table] || [];
            for (let i in field) {
                const col = parseInt(i) + 1;
                const child1 = `:nth-child(1)`;
                const child = `:nth-child(${col})`;
                const colWidth = $(classTableData + `>tr${child1}`).children(`td${child}`).width() ?? 0;
                $(classTableHeader + `>th${child}`).width(colWidth);
            }
            return;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // Common Helper Function
        /////////////////////////////////////////////////////////////////////////////////////
        command(wrapper, selector, callback) {
            wrapper.off('click', selector);
            wrapper.on('click', selector, function (event) {
                event = event || window.event;
                event.preventDefault();
                callback(this);
            })
        }
        guid() {
            let r = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r());
        }
        htmlInputText(cellClass, cellName, cellValue) {
            return yHtml([{
                element: 'input',
                type: 'text',
                class: cellClass,
                name: cellName,
                value: cellValue
            }])
        }
        getMultiColumnField(object) {
            const result = []
            for (let field in object) {
                if (object.hasOwnProperty(field)) {
                    result.push(field)
                }
            }
            return result;
        }
    }

    if (typeof window === 'object' && typeof window.document === 'object') {
        window.Y_Framework = Panel
        window.YPanel = Panel
    }
})(window)
