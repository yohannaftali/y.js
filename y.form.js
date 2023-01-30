//----------------------------------------------------------------------------------------------------------------------
// Y Form Framework
// version=230118
//----------------------------------------------------------------------------------------------------------------------
// 2021.10.26
// 2021.11.23
// 2021.11.23 - add buttonSelect options
// 2021.11.30 - optimize writeTable and updateTable function
// 2022.02.07 - fix remove multiple rows
// 2022.04.20 - remove insert row message, fix clear listener
// 2022.05.17 - fix bug prevent all table listener to be called if listener remove defined in module
// 2022.06.18 - custom icon remove
// 2022.06.16 - implementasi requery
// 2022.06.22 - optimize show table info function
// 2022.08.16 - fix panel info table
// 2022.09.03 - add rowIndex on listenerButtonRemoveRow callback and fix scope button remove
// 2022.10.10 - fix bug uncheck function
// 2022.10.12 - autocomplete min length set to 0
// 2022.10.13 - add start no table
// 2022.10.14 - set title after submit (detailMode function)
// 2022.10.27 - fix load master table not empty before update
// 2022.11.10 - fix handle paste CTRL + V
// 2022.11.11 - add handle file upload and preview image
// 2023.01.10 - fix select2 label active/inactive
// 2023.01.12 - add option yearRange, minDate, maxDate to datepicker
// 2023.01.13 - fix syncDatePicker
// 2023.01.18 - add quote option at downloadCsv
//----------------------------------------------------------------------------------------------------------------------

(function (window, undefined) {
	const document = window.document

	//------------------------------------------------------------------------------------------------------------------
	// Form
	//------------------------------------------------------------------------------------------------------------------
	class Form {
		constructor(param) {
			this.initData = {}
			this.resBeforeLoad = {}
			useParam(this, param)
			if (elvis(param.module)) {
				const module = param.module
				this.name = elvis(param.name, `form_${module}`)
				this.queryUrl = elvis(param.query_url, `c_${module}/`)
				this.query_url = this.queryUrl
				this.trigger = elvis(param.trigger, $(`#button_form_${module}`))
				this.getInitData = elvis(param.getInitData, false);
				this.initDataUrl = elvis(param.initDataUrl, this.queryUrl + 'get_init_data')
				this.beforeLoad = elvis(param.beforeLoad, false)
				this.afterLoad = elvis(param.afterLoad, () => { })
				this.label = elvis(param.label, {})
				this.type = elvis(param.type, 'm')
				this.formatDate = elvis(param.formatDate, 'dd/mm/yyyy')
				this.formatTime = elvis(param.formatTime, 'hh:ii')
			}
			this.wrapper = $('#module-panel');
			this.elWrapper = document.getElementById('module-panel')
			this.idForm = '#' + this.name
			this.labelNew = elvis(this.label.new, '')
			this.labelMaster = elvis(this.label.master, '')
			this.labelDetail = elvis(this.label.detail, '')
			this.labelHistory = elvis(this.label.history, '')
			this.field = []
			this.data = {
				detail: {},
				history: {}
			}
			this.dataFiltered
			this.vars = {
				detailShown: 0,
				historyShown: 0,
				lastKeyValue: '',
				lastMainValue: '',
				keyValue: '',
				mainValue: '',
				masterData: {},
				detailData: {},
				historyData: {},
				responseData: {},
				menuPanelOpen: false
			}
			this.titleField = false
			this.mainField = false
			this.mainFieldAfter = false
			this.keyField = false
			this.keyFieldType = false
			this.newRowTrigger = {}
			this.minRows = 0
			this.requeryCallback = {}
			this.startNo = []

			// Panel Class
			this.panel = new YPanel(this)
			this.detailHeader = this.panel.detailHeader
			this.master = this.panel.master
			this.detail = this.panel.detail
			this.historyHeader = this.panel.historyHeader
			this.history = this.panel.history

			//this.preventKeyEnter(this.idForm)
			this.preventKeyEnter('#main')
			this.pasteListener()
			this.listenerAutoSum()
			this.listenerFilterDetail()
			this.hideButtonSubmit()
			this.listenerSelect()
			this.listenerSelect2Change()
			this.listenerButtonRemoveRow()
			this.listenerTableCollapsibleTrigger()
			this.listenerTextAreaResize()
			this.handleFileUploadChange()
			this.withoutSubmitButton = false
		}
		superinit(doAfterSuperinit) {
			doAfterSuperinit = typeof doAfterSuperinit !== 'undefined' ? doAfterSuperinit : () => { }
			const hasInitData = this.getInitData
			const hasBeforeLoad = this.beforeLoad && typeof this.beforeLoad === 'function'
			const doLoad = (res) => {
				// res is init data
				res = typeof res !== 'undefined' ? res : {}
				if (typeof yData.moduleOption !== 'undefined' && typeof yData.moduleOption.callback !== 'undefined') {
					yData.moduleOption.callback(this)
				}
				this.getFieldParam()
				switch (this.type) {
					case 'm':
						this.writeMaster()
						if (this.labelMaster !== '') {
							$('#title-module').text(this.labelMaster)
						}
						break
					case 'md':
						this.writeMaster()
						this.writeHeader('detail')
						this.listenerContextMenuTable('detail')
						this.disableClickTdButton('detail')
						this.setRequery('detail')
						break
					case 'mdh':
						this.writeMaster()
						this.writeHeader('detail')
						this.writeHeader('history')
						this.listenerContextMenuTable('detail')
						this.listenerContextMenuTable('history')
						this.disableClickTdButton('detail')
						this.disableClickTdButton('history')
						this.setRequery('history')
						break
				}
				this.noTitleMode()
				this.panel.useTitleDocument()
				this.afterLoad(this, res)
				doAfterSuperinit(this, res)
			}
			const doBeforeLoad = () => {
				const promiseBeforeLoad = new Promise((resolve, reject) => {
					this.beforeLoad(this)
					resolve()
				})
				promiseBeforeLoad.then((resBeforeLoad) => {
					doLoad(resBeforeLoad)
				}, (err) => {
					console.log('Error: function before load has error ' + err)
				})
			}
			if (hasInitData) {
				// with init data
				promiseGet(this.initDataUrl).then((resInitData) => {
					this.initData = typeof resInitData !== 'undefined' ? resInitData : {}
					if (hasBeforeLoad) {
						doBeforeLoad();
					}
					else {
						doLoad(resInitData);
					}
				}, (err) => {
					console.log('Error: get init data: ' + err)
				})
			}
			else {
				// without init data
				if (hasBeforeLoad) {
					doBeforeLoad()
				} else {
					doLoad()
				}
			}
		}
		disableClickTdButton(table) {
			$(this.wrapper).off('click', '.td-button-' + table)
			$(this.wrapper).on('click', '.td-button-' + table, (e) => {
				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
			})
		}
		listenerResetTableNumber(table) {
			const startNo = typeof this.startNo[table] !== 'undefined' ? this.startNo[table] : 1
			table = elvis(table)
			if (table) {
				const no = `th.label_header_${table}_no`
				$(this.wrapper).off('click', no)
				$(this.wrapper).on('click', no, (e) => {
					e.preventDefault()
					this.resetTableNumber(table)
				})
			}
		}
		resetTableNumber(table) {
			const startNo = typeof this.startNo[table] !== 'undefined' ? this.startNo[table] : 1
			table = elvis(table)
			if (table) {
				const tablePanel = '.panel_y_' + table + '_table'
				$(`${tablePanel} > tbody > tr`).each(function (index, tr) {
					$(this).children('td.no.td-label').text(index + startNo);
				})
			}
		}
		listenerContextMenuTable(func) {
			const that = this
			func = elvis(func);
			if (func) {
				const classTable = '.panel_y_' + func + '_table'
				const idContainer = 'container-context-menu-table-' + func
				const idContext = 'context-menu-table-' + func
				const idItem = 'context-menu-item-filter-' + func
				const idItemClear = 'context-menu-item-filter-' + func + '-clear'
				const idTablePdf = 'context-menu-item-pdf-' + func + '-download'
				const idTableCsv = 'context-menu-item-csv-' + func + '-download'
				yM.div({
					id: idContainer,
					class: 'container-context-menu-table',
					parent: classTable,
					content: yM.ul({
						id: idContext,
						class: 'context-menu-table',
						style: 'position: fixed; z-index: 1000;',
						content:
							yM.li({
								content: yM.a({
									id: idItem,
									class: 'context-menu-table-item',
									before: yM.icon({ class: 'fas fa-filter fa-xs context-menu-table-item-icon' }),
									content: yStr('filterApply')
								})
							}) +
							yM.li({
								content: yM.a({
									id: idItemClear,
									class: 'context-menu-table-item',
									before: yM.icon({ class: 'fas fa-sync fa-xs context-menu-table-item-icon' }),
									content: yStr('filterClear')
								})
							}) +
							yM.li({
								content: yM.a({
									id: idTablePdf,
									class: 'context-menu-table-item',
									before: yM.icon({ class: 'fas fa-file-pdf fa-xs context-menu-table-item-icon' }),
									content: 'PDF'
								})
							}) +
							yM.li({
								content: yM.a({
									id: idTableCsv,
									class: 'context-menu-table-item',
									before: yM.icon({ class: 'fas fa-file-csv fa-xs context-menu-table-item-icon' }),
									content: 'CSV'
								})
							})
					})
				})
				$('#' + idContainer).hide();
				$(classTable).off('contextmenu', 'tr.panel_input_row_' + func + '>td');
				$(classTable).on('contextmenu', 'tr.panel_input_row_' + func + '>td', function (e) {
					e.preventDefault();
					let obj = $(this);
					if (obj.length > 0) {
						let item = $(obj[0]);
						let isLabel = item.hasClass('td-label');
						if (isLabel) {
							let text = item.text();
							if (text != '') {
								let data = item.attr('data');
								$('#' + idItem).attr('data', data);
								$('#' + idItem).attr('text', text);
							}
						}
					}
					$('#' + idContext).css("left", e.pageX + 'px');
					$('#' + idContext).css("top", e.pageY + 'px');
					$('#' + idContainer).show();
					$(classTable).on("click", function () {
						$('#' + idContainer).hide();
					});
				});
				$(classTable).off('click', '#' + idItem);
				$(classTable).on('click', '#' + idItem, function (e) {
					e.preventDefault();
					let data = $(this).attr('data');
					let text = $(this).attr('text');
					$('.input-filter-' + func + '[data="' + data + '"]').focus().val(text).trigger($.Event("keypress", { which: 13 }));
				});
				$(classTable).off('click', '#' + idItemClear);
				$(classTable).on('click', '#' + idItemClear, function (e) {
					e.preventDefault();
					$('.input-filter-' + func).val('')
					that.updateTable(func, that.data.master[func])
				});

				$(classTable).off('click', '#' + idTablePdf);
				$(classTable).on('click', '#' + idTablePdf, function (e) {
					e.preventDefault();
					const table = document.querySelector(classTable);
					const doc = new jsPDF();
					doc.autoTable({ html: table });
					doc.save("table.pdf");
				});
				$(classTable).off('click', '#' + idTableCsv);
				$(classTable).on('click', '#' + idTableCsv, function (e) {
					e.preventDefault();
					downloadCsv(that.field[func], that.data[func], `${func}.csv`)
				});
			}
		}
		setFormatDate(format) {
			this.formatDate = format
			this.panel.formatDate = format
		}
		getFormatDate() {
			return this.formatDate
		}
		setFormWithoutSubmitButton(option) {
			option = elvis(option, true);
			this.withoutSubmitButton = option;
		}
		// preventKeyEnter(selector) {
		// 	$(selector).off("keypress", 'textarea.textarea_single').on("keypress", 'textarea.textarea_single', function (e) {
		// 		const key = (e.keyCode ? e.keyCode : e.which)
		// 		const isShift = !!e.shiftKey
		// 		const data = $(this).attr('data')
		// 		if (isShift) {
		// 			if (key == 13) {
		// 				e.preventDefault();
		// 				if (data && data != '') {
		// 					$(this).parent().parent().parent().prev().children('td').children('div').children('textarea.input_' + data).focus();
		// 				}
		// 			}
		// 		}
		// 		else {
		// 			if (key == 13) {
		// 				e.preventDefault()
		// 				if (data && data != '') {
		// 					$(this).parent().parent().parent().next().children('td').children('div').children('textarea.input_' + data).focus();
		// 				}
		// 			}
		// 			if (key == 96) {
		// 				e.preventDefault();
		// 				$(selector).submit();
		// 			}
		// 		}
		// 	});
		// }
		preventKeyEnter(selector) {
			const parent = document.querySelector(selector);
			parent.addEventListener('keypress', function (e) {
				if (e.target && e.target.matches('textarea.textarea_single')) {
					const textarea = e.target;
					const key = e.which || e.keyCode;
					const isShift = e.shiftKey;
					const data = textarea.getAttribute('data');
					if (key === 13) {
						e.preventDefault();
						if (data && data !== '') {
							const target = textarea.parentNode.parentNode.parentNode[isShift ? 'previousElementSibling' : 'nextElementSibling']
								.querySelector(`textarea.input_${data}`);
							target.focus();
						}
					} else if (key === 96) {
						e.preventDefault();
						parent.querySelector(selector).submit();
					}
				}
			});
		}
		listenerSelect() {
			const that = this
			$('body').off('click', 'tr>td.no')
			$('body').on('click', 'tr>td.no', function () {
				$(this).toggleClass('selected')
				const rows = that.selectedRowToRemove()
				if (rows.length > 0) {
					that.showRemoveRowButton()
				}
				else {
					that.hideRemoveRowButton()
				}
			});
		}
		listenerSelect2Change() {
			$(this.wrapper).off('select2:select')
			$(this.wrapper).on('select2:select', function (e) {
				const newVal = $(e.target).val()
				$(e.target).siblings('label').removeClass('active')
				if (newVal != '') {
					$(e.target).siblings('label').addClass('active')
				}
			})
		}
		selectedRowToRemove() {
			let count = 0
			const data = []
			const selector = []
			$('tr>td.no.selected').each(function () {
				data[count] = $(this).text();
				selector[count] = this;
				count++;
			})
			return { length: count, data: data, selector: selector };
		}
		showRemoveRowButton() {
		}
		hideRemoveRowButton() {
		}
		stopListenerAutoSum() {
			$(this.wrapper).off('focus', '.sum-item')
			$(this.wrapper).off('change', '.sum-item')
		}
		listenerAutoSum(callback) {
			callback = elvis(callback)
			const that = this
			let lastValue = 0
			$(this.wrapper).off('focus', '.sum-item')
			$(this.wrapper).on('focus', '.sum-item', function () {
				lastValue = that.getValue(this)
			});
			$(this.wrapper).off('change', '.sum-item')
			$(this.wrapper).on('change', '.sum-item', function () {
				const newValue = that.getValue(this)
				if (!callback) {
					that.setValue(this, lastValue, newValue)
				}
				else {
					callback(this, lastValue, newValue)
				}
			});
		}
		listenerTableCollapsibleTrigger() {
			$(this.wrapper).off('click', '.button-collapsible-trigger')
			$(this.wrapper).on('click', '.button-collapsible-trigger', function () {
				const name = $(this).attr('data')
				if (name && name !== 'undefined') {
					$('table.panel_y_' + name + '_table').toggleClass('collapsed-table')
				}
			});
		}
		listenerInputNumber(option) {
			const selector = typeof option === 'object' && typeof option.selector !== 'undefined' ? option.selector : option;
			const callback = typeof option === 'object' && typeof option.callback !== 'undefined' ? option.callback : function () { };
			const max = typeof option === 'object' && typeof option.max !== 'undefined' ? option.max : false;
			const min = typeof option === 'object' && typeof option.min !== 'undefined' ? option.min : false;
			const decimal = typeof option === 'object' && typeof option.decimal !== 'undefined' ? option.decimal : false;
			let caretPos = 0
			const leftUpRightDownKeys = [37, 38, 39, 40]
			const tabEnterKeys = [9, 13]
			const deleteKeys = [8, 46]
			const decimalPointKeys = [110, 190]
			const allowedKeys = decimal ? [...deleteKeys, ...decimalPointKeys, ...leftUpRightDownKeys, ...tabEnterKeys] : [...deleteKeys, ...leftUpRightDownKeys, ...tabEnterKeys];
			const dotRegex = /\./g
			$(this.wrapper).off('keydown', selector)
			$(this.wrapper).on('keydown', selector, function (event) {
				const key = event.which
				if (!(
					(key >= 48 && key <= 57) ||
					(key >= 96 && key <= 105) ||
					allowedKeys.includes(key)
				)) {
					event.preventDefault()
				}
				const selection = window.getSelection().toString();
				if (selection !== '') return false
				//if (leftUpRightDownKeys.includes(key)) return false
			})
			$(this.wrapper).off('keyup', selector)
			$(this.wrapper).on('keyup', selector, function (event) {
				$(this).removeClass('invalid')
				const key = event.which
				caretPos = getCaret(this)
				if (!(
					(key >= 48 && key <= 57) ||
					(key >= 96 && key <= 105) ||
					allowedKeys.includes(key)
				)) {
					event.preventDefault()
				}
				const selection = window.getSelection().toString()
				if (selection !== '') return false
				//if (leftUpRightDownKeys.includes(key)) return false
				let input = $(this).val()
				const prevLength = input.length
				if (decimal && decimalPointKeys.includes(key)) {
					const dot = ((input.toString() || '').match(dotRegex) || []).length;
					if (dot > 1) {
						event.preventDefault()
					}
					if ((input.toString() || '').substr(input.length - 1) === '.') {
						return false;
					}
				}

				if (!decimal) {
					input = input.replace(/[\D\s\._\-]+/g, "");
					input = input ? Number(input) : 0;
				}
				else {
					input = input.replace(/[^0-9.]/g, "");
					input = input ? Number(input) : 0;
				}
				callback(input);
				if (max && input > max) {
					$(this).addClass('invalid');
				}
				if (min && input < min) {
					$(this).addClass('invalid');
				}
				$(this).val(function () {
					let result = "";
					if (!decimal) {
						result = (input === 0) ? "" : input.toLocaleString("en-US");
					}
					else {
						result = (input === 0) ? "" : input.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimal });
					}
					const newLength = result.length;
					caretPos += (newLength - prevLength);
					setTimeout(() => { setCaret(this, caretPos); }, 1);
					return result;
				});
			});
		}
		listenerStickyTable(table) {
			this.panel.listenerStickyTable(table);
		}
		listenerFilterDetail() {
			const that = this;
			$(this.wrapper).off('click', '.btn-filter-detail');
			$(this.wrapper).on('click', '.btn-filter-detail', function (e) {
				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
				$('.row-y-filter-detail').toggle();
			});
			$(this.wrapper).off('keypress', '.input-filter-detail');
			$(this.wrapper).on('keypress', '.input-filter-detail', function (e) {
				const key = (e.keyCode ? e.keyCode : e.which);
				if (key == '13') {
					e.stopPropagation();
					e.stopImmediatePropagation();
					e.preventDefault();
					that.writeDetail();
					that.showPanelDetail();
				}
			});
			$(this.wrapper).off('change', '.input-filter-select-detail');
			$(this.wrapper).on('change', '.input-filter-select-detail', function (e) {
				that.writeDetail();
				that.showPanelDetail();
			});
			$(this.wrapper).off('click', '.btn-filter-clear-detail');
			$(this.wrapper).on('click', '.btn-filter-clear-detail', function (e) {
				e.stopPropagation();
				e.stopImmediatePropagation();
				e.preventDefault();
				$('.input-filter-detail').val('');
				that.writeDetail();
				that.showPanelDetail();
			});
		}

		//
		// Listener Filter Table With Ajax
		// Options {
		//   table: string 				// name table (default 'detail')
		//   simple: boolean	 		// use simple table or normal (default true)	
		//   masterTable: boolean		// default true	
		//   showAjaxResultSuccess: boolean		// default true	
		//   controller: string			// override default get_[table] controller
		//   param: string				// ajax parameter, if blank will be use serilaize function	
		//   callbackAjax: function		// override ajax callback function	
		//   callbackBefore: function	// function run before handle response
		//   callbackAfter: function	// function run after handle response	
		//   callbackSuccess: function	// function run when response data is success	
		//   callbackError: function	// function run when response data is error
		//   callbackErrorRes: function	// function run when response ajax is error
		// }

		listenerFilterTableWithAjax(opt) {
			opt = typeof opt !== 'undefined' ? opt : {}
			const table = typeof opt === 'string' ? opt : typeof opt.table !== 'undefined' ? opt.table : 'detail'
			opt = typeof opt === 'string' ? {} : opt
			opt.showAjaxResultSuccess = typeof opt.showAjaxResultSuccess !== 'undefined' ? opt.showAjaxResultSuccess : false
			const that = this;
			$(this.wrapper).off('click', '.btn-filter-' + table)
			$(this.wrapper).on('click', '.btn-filter-' + table, function (e) {
				e.stopPropagation()
				e.stopImmediatePropagation()
				e.preventDefault()
				$('.row-y-filter-' + table).toggle()
			})
			$(this.wrapper).off('keypress', '.input-filter-' + table);
			$(this.wrapper).on('keypress', '.input-filter-' + table, function (e) {
				const key = (e.keyCode ? e.keyCode : e.which);
				if (key == '13') {
					e.stopPropagation()
					e.stopImmediatePropagation()
					e.preventDefault()
					that.updateTableFromAjax(opt)
				}
			})
			$(this.wrapper).off('change', '.input-filter-select-' + table)
			$(this.wrapper).on('change', '.input-filter-select-' + table, function (e) {
				that.updateTableFromAjax(opt)
			})
			$(this.wrapper).off('click', '.btn-filter-clear-' + table)
			$(this.wrapper).on('click', '.btn-filter-clear-' + table, function (e) {
				e.stopPropagation()
				e.stopImmediatePropagation()
				e.preventDefault()
				$('.input-filter-' + table).val('')
				that.updateTableFromAjax(opt)
			})
		}

		//---------------------------------------------------------------------
		// listener Filter Table without Ajax
		//---------------------------------------------------------------------
		listenerFilterTable(opt, callback) {
			opt = typeof opt !== 'undefined' ? opt : {}
			const table = typeof opt === 'string' ? opt : typeof opt.table !== 'undefined' ? opt.table : 'detail'
			opt = typeof opt === 'string' ? {} : opt
			opt.showAjaxResultSuccess = typeof opt.showAjaxResultSuccess !== 'undefined' ? opt.showAjaxResultSuccess : false
			callback = typeof callback !== 'undefined'
				? callback
				: typeof opt.callback !== 'undefined'
					? opt.callback
					: () => { }
			const that = this
			$(this.wrapper).off('click', '.btn-filter-' + table)
			$(this.wrapper).on('click', '.btn-filter-' + table, function (e) {
				e.stopPropagation()
				e.stopImmediatePropagation()
				e.preventDefault()
				$('.row-y-filter-' + table).toggle()
			})
			$(this.wrapper).off('keypress', '.input-filter-' + table);
			$(this.wrapper).on('keypress', '.input-filter-' + table, function (e) {
				const key = (e.keyCode ? e.keyCode : e.which);
				if (key == '13') {
					e.stopPropagation()
					e.stopImmediatePropagation()
					e.preventDefault()
					that.updateTable(table, that.filterTable(table))
					callback()
				}
			})
			$(this.wrapper).off('change', '.input-filter-select-' + table)
			$(this.wrapper).on('change', '.input-filter-select-' + table, function (e) {
				that.updateTable(table, that.filterTable(table))
				callback()
			})
			$(this.wrapper).off('click', '.btn-filter-clear-' + table)
			$(this.wrapper).on('click', '.btn-filter-clear-' + table, function (e) {
				e.stopPropagation()
				e.stopImmediatePropagation()
				e.preventDefault()
				$('.input-filter-' + table).val('')
				that.updateTable(table, that.data.master[table])
				callback()
			})
		}
		filterTable(table) {
			const fields = '.input-filter-' + table
			const data = this.data.master[table]
			const param = this.getFilterParam(fields)
			return this.filterData(data, param)
		}
		getFilterParam(fields) {
			let p = []
			$(fields).each(function () {
				p.push({
					field: $(this).attr("data"),
					criteria: $(this).val()
				})
			});
			return p
		}
		filterData(o, p) {
			let c = cloneObject(o);
			if (p) {
				for (let i in p) {
					let x = p[i].criteria;
					let f = p[i].field;
					if (x !== '') {
						let s = 0;
						for (let num in c) { s++; }
						let j = 0;
						for (let count = 0; count < s; count++) {
							let d = c[j][f];
							let r = this.filterLike(d, x);
							if (r < 0) { c.splice(j, 1); }
							else { j++; }
						}
					}
					c = cloneObject(c);
				}
			}
			return c;
		}
		filterLike(a, b) {
			if (b !== '') {
				let c = a.toString().toLocaleLowerCase();
				let d = b.toString().toLocaleLowerCase();
				let l = d.length;
				let e = d.substring(0, 1);
				let f = d.substring(1, l);
				if (e == '=') {
					if (c == f) { return 0; }
					else { return -1; }
				}
				else if (e == '>') {
					if (Number(c) > Number(f)) { return 0; }
					else { return -1; }
				}
				else if (e == '<') {
					if (Number(c) < Number(f)) { return 0; }
					else { return -1; }
				}
				else if (e == '!') {
					if (c != f) { return 0; }
					else { return -1; }
				}
				else { return c.indexOf(d); }
			}
			else { return 0; }
		}

		//---------------------------------------------------------------------
		// Getter and setter value of element
		//---------------------------------------------------------------------
		getValue(selector) {
			selector = elvis(selector);
			let res = 0
			if (selector) {
				const a = $(selector).val() || false
				const val_a = a ? a.replace(/[\D\s\._\-]+/g, "") : false
				const b = $(selector).text() || false
				const val_b = b ? b.replace(/[\D\s\._\-]+/g, "") : false
				const value = a ? parseFloat(val_a) : b ? parseFloat(val_b) : 0
				res = $.isNumeric(value) ? value : 0
			}
			return res
		}
		getValueLabel(field) {
			let element = document.getElementById('label_info_' + field);
			let result = typeof element !== 'undefined' && element !== null && typeof element.innerHTML !== 'undefined' ? element.innerHTML : false;
			return result;
		}
		get_value_label(field) {
			this.getValueLabel(field)
		}
		setValue(obj, value, value2) {
			let isSumHeader = $(obj).hasClass('sum-header-item');
			let isSumFooter = $(obj).hasClass('sum-footer-item');
			if (typeof value2 !== 'undefined') {
				let fieldName = $(obj).attr('data');
				let lastValue = parseFloat(value);
				let newValue = parseFloat(value2);

				if (isSumHeader) {
					let currentTotal = this.getValue('.header-sum-' + fieldName);
					let newTotal = currentTotal - lastValue;
					newTotal += newValue;
					$('.header-sum-' + fieldName).text(newTotal.toLocaleString('en-US'));
				}
				if (isSumFooter) {
					let currentTotal = this.getValue('.footer-sum-' + fieldName);
					let newTotal = currentTotal - lastValue;
					newTotal += newValue;
					$('.footer-sum-' + fieldName).text(newTotal.toLocaleString('en-US'));
				}
			}
			else if (typeof value !== 'undefined') {
				let fieldName = $(obj).attr('data');
				let lastValue = this.getValue(obj);

				if (isSumHeader) {
					let currentTotal = this.getValue('.header-sum-' + fieldName);
					let newTotal = parseFloat(currentTotal) - parseFloat(lastValue);
					newTotal = parseFloat(newTotal) + parseFloat(value);
					$('.header-sum-' + fieldName).text(newTotal.toLocaleString('en-US'));
				}
				if (isSumFooter) {
					let currentTotal = this.getValue('.footer-sum-' + fieldName);
					let newTotal = parseFloat(currentTotal) - parseFloat(lastValue);
					newTotal = parseFloat(newTotal) + parseFloat(value);
					$('.footer-sum-' + fieldName).text(newTotal.toLocaleString('en-US'));
				}
				let isInput = $(obj).is('input');
				let isTextarea = $(obj).is('textarea');
				if (isInput || isTextarea) {
					$(obj).val(value);
				} else {
					$(obj).text(parseFloat(value).toLocaleString('en-US'));
				}
			}
		}
		setLabelInfo(field, text) {
			const id = 'label_info_' + field;
			document.getElementById(id).innerHTML = text;
		}
		set_label_info(field, text) { this.setLabelInfo(field, text); }
		setMasterInput(field, text) {
			const id = 'input_' + field;
			document.getElementById(id).value = text;
		}
		set_master_input(field, text) { this.setMasterInput(field, text); }
		recalculate(table, callback) {
			table = elvis(table, 'detail');
			callback = elvis(callback, function () { });
			const fieldTable = typeof this.field[table] !== 'undefined' ? this.field[table] : typeof this.field.master[table] !== 'undefined' ? this.field.master[table] : []
			fieldTable.filter(field => elvis(field.sum_header)).forEach((field) => { this.calculateSumValue(table, typeof field.name !== 'undefined' ? field.name : false, 'header'); })
			fieldTable.filter(field => elvis(field.sumHeader)).forEach((field) => { this.calculateSumValue(table, typeof field.name !== 'undefined' ? field.name : false, 'header'); })
			fieldTable.filter(field => elvis(field.sum_footer)).forEach((field) => { this.calculateSumValue(table, typeof field.name !== 'undefined' ? field.name : false, 'footer'); })
			fieldTable.filter(field => elvis(field.sumFooter)).forEach((field) => { this.calculateSumValue(table, typeof field.name !== 'undefined' ? field.name : false, 'footer'); })
			callback();
		}
		calculateSumValue(table, name, type) {
			const that = this;
			const elT = type === 'header' ? 'thead' : 'tfoot';
			table = elvis(table);
			name = elvis(name);
			type = elvis(type);
			if (table && name && type) {
				let sum = 0;
				const classObj = 'tbody.panel_y_' + table + '_table_data .sum-' + type + '-item-' + name;
				$(classObj).each(function () {
					const value = that.getValue(this);
					sum += value;
				});
				this.setValue('table.panel_y_' + table + '_table>' + elT + '>tr>td.' + type + '-sum-' + name, sum);
			}
		}
		calculateSumValueWithSign(table, name, type) {
			const that = this;
			const elT = type === 'header' ? 'thead' : 'tfoot';
			table = elvis(table);
			name = elvis(name);
			type = elvis(type);
			if (table && name && type) {
				let sum = 0;
				const classObj = 'tbody.panel_y_' + table + '_table_data .sum-' + type + '-item-' + name;
				$(classObj).each(function () {
					const sign = $(this).attr('sign');
					if (elvis(sign) && sign !== '') {
						const value = that.getValue(this);
						switch (sign) {
							case '+':
								sum += value;
								break;
							case '-':
								sum -= value;
								break;
						}
					}
				});
				this.setValue('table.panel_y_' + table + '_table>' + elT + '>tr>td.' + type + '-sum-' + name, sum);
			}
		}
		pasteListener() {
			$('body').off('keydown', '.input-table-cell');
			$('body').on('keydown', '.input-table-cell', function (e) {
				const obj = this
				if (e.which == 86 && (e.ctrlKey || e.metaKey)) { //Ctrl + V
					// const ta = document.getElementById('y_paste')
					// ta.focus()
					// setTimeout(function () {
					// 	const clipText = ta.value
					// 	console.log('cliptext')
					// 	console.log(clipText)
					// 	ta.value = ''
					// 	gridPaste(obj, clipText)
					// }, 10);
					handlePaste(obj)
				}
			});
			$('body').off('paste', '.input-table-cell');
			$('body').on('paste', '.input-table-cell', function (e) {
				const obj = this
				if (!(e.which == 86 && (e.ctrlKey || e.metaKey))) { //Ctrl + V
					handlePaste(obj)
				}
			});
			const handlePaste = function (obj) {
				setTimeout(function () { setPasteValue(obj); }, 4);
			};
			const setPasteValue = function (obj) {
				const pasteValue = $(obj).val()
				$(obj).val('')
				return gridPaste(obj, pasteValue)
			};
			const gridPaste = function (obj, pasteValue) {
				const name = $(obj).attr('name')
				const arr = typeof name !== 'undefined' ? name.split('[') : [];
				const head = elvis(arr[0]);
				const tail = elvis(arr[1]);
				if (head && tail) {
					const startIndex = parseInt(tail.replace(']', ''));
					if (!isNaN(startIndex)) {
						let rows = pasteValue.split('\n')
						for (let i = 0; i < rows.length; i++) {
							const inputName = head + '[' + (startIndex + i) + ']'
							$('textarea[name="' + inputName + '"]').focus()
							yM.setInputValue('textarea[name="' + inputName + '"]', rows[i])
						}
					}
				}
				return false;
			};
		}
		getFieldParam() {
			if (typeof this.field.master !== 'undefined') {
				let master = this.field.master;
				this.mainFieldAfter = false;
				for (let i in master) {
					const field = master[i]
					if (typeof field.table !== 'undefined' && field.table == true) {
						const tableName = typeof field.name !== 'undefined' ? field.name : false;
						this.field[tableName] = typeof field.content !== 'undefined' ? field.content : false;
						this.setNewRowTrigger(tableName);
					}
					else {
						if (isParam(field, 'isTitle')) {
							this.titleField = field
						}
						if (isParam(field, 'is_key') || isParam(field, 'isKey')) {
							this.keyField = field.name
							if (isParam(field, 'label_info') || isParam(field, 'labelInfo')) {
								this.keyFieldType = 'label'
							} else {
								this.keyFieldType = 'input'
							}
						}
						if (isParam(field, 'is_main') || isParam(field, 'isMain')) {
							this.mainField = field.name
							for (let j = parseInt(i) + 1; j < master.length; j++) {
								const fieldNext = typeof master[j] !== 'undefined' ? master[j] : false
								if (fieldNext) {
									const isLabelInfo = isParam(fieldNext, 'label_info') || isParam(fieldNext, 'labelInfo')
									if (!isLabelInfo) {
										this.mainFieldAfter = master[j].name;
										break;
									}
								}
							}
						}
					}
				}
			}
			this.setNewRowTrigger('detail');
			this.setNewRowTrigger('history');
		}
		setNewRowTrigger(table) {
			table = typeof table !== 'undefined' ? table : false;
			const field = table && typeof this.field[table] !== 'undefined' ? this.field[table] : false;
			if (field) {
				this.newRowTrigger[table] = false;
				for (let i in field) {
					const fieldName = typeof field[i].name !== 'undefined' ? field[i].name : false;
					if (fieldName && typeof field[i].newRowTrigger !== 'undefined' && field[i].newRowTrigger !== false) {
						this.newRowTrigger[table] = fieldName;
					}
				}
			}
		}

		//---------------------------------------------------------------------
		// Show / Hide Form Element
		//---------------------------------------------------------------------
		// Title
		showTitleDocument() {
			$('.input-field-title-document').show()
		}
		hideTitleDocument() {
			$('.input-field-title-document').hide()
		}

		// Toolbar
		showToolbar() {
			this.panel.showToolbar();
		}
		hideToolbar() {
			this.panel.hideToolbar();
		}

		// Button Submit
		showButtonSubmit() {
			if (!this.withoutSubmitButton) {
				$('.button-submit').show();
			}
		}
		show_button_submit() { this.showButtonSubmit() }
		hideButtonSubmit() {
			$('.button-submit').hide();
		}
		hide_button_submit() { this.hideButtonSubmit() }

		// Button Back
		showButtonBack() {
			$('.btn-back').show();
		}
		hideButtonBack() {
			$('.btn-back').hide();
		}

		// Button New
		showButtonNew() {
			$('#button-new-record').show();
		}
		hideButtonNew() {
			$('#button-new-record').hide();
		}

		//---------------------------------------------------------------------
		// Post Form function
		//---------------------------------------------------------------------
		postForm(newMessage, editMessage, callback, extra) {
			callback = typeof callback !== 'undefined' ? callback : false;
			extra = typeof extra !== 'undefined' ? extra : false;
			newMessage = typeof newMessage !== 'undefined' ? newMessage : yStr('confirmationRecordCreate');
			editMessage = typeof editMessage !== 'undefined' ? editMessage : yStr('confirmationRecordEdit');
			let value
			if (typeof this.keyFieldType !== 'undefined' && this.keyFieldType) {
				if (this.keyFieldType == 'input') {
					value = $('#input_' + this.keyField).val()
				} else {
					value = $('#label_info_' + this.keyField).text()
				}
			}
			if (typeof this.type !== 'undefined' && this.type == 'image') {
				console.log('type files image')
			}
			const message = value === '' ? newMessage : editMessage
			const r = confirm(message)
			if (r === true) {
				let extraParam = this.keyField + '=' + value
				if (extra) {
					extraParam += '&' + extra;
				}
				this.submitForm(extraParam, callback);
			}
		}
		post_form(newMessage, editMessage, callback, extra) { this.postForm(newMessage, editMessage, callback, extra) }
		postMaster(newMessage, editMessage, callback, extra) { this.postForm(newMessage, editMessage, callback, extra) }
		post_master(newMessage, editMessage, callback, extra) { this.postMaster(newMessage, editMessage, callback, extra) }

		//---------------------------------------------------------------------
		// Submit Form function
		// submit_form() ... type 1
		// submit_form(extraParam) ... type 2
		// submit_form(callback) ... type 3
		// submit_form(extraParam, callback) ... type 4
		//---------------------------------------------------------------------
		submitForm(arg_a, arg_b, submitUrl) {
			const that = this;
			submitUrl = typeof submitUrl !== 'undefined' ? submitUrl : this.queryUrl + 'submit';
			let data = this.serializeInputAsArrayExcludeFilter(this.idForm);
			let callback = false;
			let setCallback = function (fn) {
				callback = fn;
				return false;
			};
			let setExtraParam = function (extraParam) {
				const extraString = '{"' + decodeURI(extraParam.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}';
				const extraObject = JSON.parse('{"' + decodeURI(extraParam.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
				Object.keys(extraObject).forEach(function (k) {
					data.push({
						name: k,
						value: extraObject[k]
					});
				});
				return true;
			};
			let handle_a = typeof arg_a !== 'undefined' ? (
				typeof arg_a !== 'function' ? setExtraParam(arg_a) : setCallback(arg_a)
			) : false;
			if (handle_a) {
				let handle_b = typeof arg_b !== 'undefined' && typeof arg_b === 'function' ? setCallback(arg_b) : false;
			}

			$.each($(this.idForm).find('input[type="file"]'), function (i, tag) {
				$.each($(tag)[0].files, function (i, file) {
					data.push({
						name: tag.name,
						value: file
					});
				});
			});
			document.querySelector(this.idForm)
			let formData = new FormData()
			for (let i in data) {
				formData.append(data[i].name, data[i].value);
			}
			const dataFile = this.getFileFormData()
			for (let i in dataFile) {
				formData.append(dataFile[i].name, dataFile[i].value);
			}

			showPreloader()
			const onSuccess = (status) => {
				let success = true;
				for (let i in status) {
					const arrayStatus = status[i].toString().split(' ');
					if (arrayStatus[0] == 'error:') {
						success = false;
					}
				}
				showAjaxResult(status);
				if (success) {
					if (callback !== false) {
						callback(status);
					} else {
						that.resetMaster()
						that.writeDetail()
					}
				}
				y_wait_hide()
			};
			postAjaxMultipart(submitUrl, formData, onSuccess);
		}
		submit_form(paramA, paramB) { this.submitForm(paramA, paramB) }

		displayResult(res) {
			let success = true;
			for (let i in res) {
				const status = res[i].split(' ');
				if (status[0] == 'error:') {
					success = false;
				}
			}
			showAjaxResult(res)
			return success
		}

		getFileFormData(table) {
			table = typeof table !== 'undefined' ? table : 'master'
			// append file
			const fileData = []
			for (let i in this.field[table]) {
				const field = this.field[table][i]
				if (typeof field.type !== 'undefined' && field.type == 'file') {
					if (typeof field.name !== 'undefined') {
						if (table === 'master') {
							const id = 'input_' + field.name
							const inputObject = document.getElementById(id)
							if (typeof inputObject.files[0] !== 'undefined') {
								fileData.push({
									name: field.name,
									value: inputObject.files[0]
								})
							}
						}
						else {
							$('.input_' + table + '_text.input_' + field.name).each(function () {
								const name = $(this).attr('name')
								if ($(this)[0].files[0] !== 'undefined') {
									fileData.push({
										name: name,
										value: $(this)[0].files[0]
									})
								}
							})

						}

					}
				}
			}
			return fileData
		}

		//---------------------------------------------------------------------
		// Write Master wrapper from class Panel
		// Read documentation on y.panel.js
		//---------------------------------------------------------------------
		writeMaster() { this.panel.writeMaster(this.field.master) }
		write_master() { this.writeMaster() }

		writeHeader(table) {
			const all = typeof table !== 'undefined' ? false : true
			if (all) {
				this.panel.writeHeader('detail')
				this.panel.writeHeader('history')
			} else {
				this.panel.writeHeader(table)
			}
		}
		write_header(table) { this.writeHeader(table) }

		setReadonly(selector) {
			selector = typeof selector !== 'undefined' ? selector : false;
			if (selector) {
				$(selector).prop('readOnly', true);
			}
		}
		setDefaultReadonly(field) {
			for (let i in field) {
				const row = field[i];
				const readonly = typeof row['readonly'] !== 'undefined' ? row['readonly'] : false;
				if (readonly) {
					const name = typeof row['name'] !== 'undefined' ? row['name'] : false;
					if (name) {
						this.setReadonly('#input_' + name);
					}
				}
			}
		}
		unsetReadonly(selector) {
			selector = typeof selector !== 'undefined' ? selector : false;
			if (selector) {
				$(selector).removeProp('readOnly');
			}
		}
		activateLabel(selector) {
			selector = typeof selector !== 'undefined' ? selector : "input[id*='input']";
			$(selector).siblings('label').removeClass('active').addClass('active');
		}

		buttonSubmitAction() {
			const that = this;
			$(this.wrapper).off('click', '.button-submit');
			$(this.wrapper).on('click', '.button-submit', function (event) {
				event = event || window.event;
				event.preventDefault();
				that.submit();
			});
		}
		button_submit_action() { this.buttonSubmitAction() }

		setMainField(field) {
			this.mainField = field;
		}
		setTitleField(field) {
			this.titleField = field;
		}

		//---------------------------------------------------------------------
		// Load data.master to master form
		//---------------------------------------------------------------------
		loadMaster(callbackAfterInitSelect) {
			const data = typeof this.data !== 'undefined' ? this.data : {}
			const dataMaster = typeof data.master !== 'undefined' ? data.master : false
			const field = typeof this.field !== 'undefined' && typeof this.field.master !== 'undefined' ? this.field.master : false
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : () => { }
			if (dataMaster && field) {
				for (let i in field) {
					const name = typeof field[i].name !== 'undefined' ? field[i].name : false
					if (isParam(field[i], 'table')) {
						if (name && typeof dataMaster[name] !== 'undefined') {
							this.data.master = typeof this.data.master !== 'undefined' ? this.data.master : {}
							this.data[name] = dataMaster[name]
							this.data.master[name] = dataMaster[name]
							this.updateTable(name, this.data[name], callbackAfterInitSelect)
						}
					}
					else {
						let value = '';
						if (name && typeof dataMaster[name] !== 'undefined') {
							value = dataMaster[name]
						}
						if (typeof field[i].format !== 'undefined' && field[i].format == 'medium_datetime') {
							value = y_datetime_convert(value, 'datetime_sql_to_medium_datetime');
						}
						// Image
						if (isParam(field[i], 'image')) {
							$('#preview-image-' + name).attr('src', value);
							$('#title-preview-image-' + name).addClass("active");
						}
						if (isParam(field[i], 'radio')) {
							$('input[name=' + name + '][notvalue=' + value + ']').prop('checked', true);
							if (value !== null) {
								$('input[name=' + name + '][value=' + value + ']').prop('checked', true);
							}
							else {
								$('input[name=' + name + ']').prop('checked', false);
							}
						}
						else if (isParam(field[i], 'label_info') || isParam(field[i], 'labelInfo')) {
							yM.setTextValue('#label_info_' + name, value);
						}
						else if (!(isParam(field[i], 'label_only') || isParam(field[i], 'labelOnly'))) {

							if (!(typeof field[i].type !== 'undefined' && field[i].type === 'file')) {
								// type input not file
								// All input type will be update here
								yM.setInputValue('#input_' + name, value)
								$('#input_' + name).trigger('change')
							}
							else {
								// type file
							}
						}
						else if (isParam(field[i], 'checkbox') || isParam(field[i], 'checkBox')) {
							yM.setInputValue('#input_' + name, value);
						}
						if (isParam(field[i], 'isTitle')) {
							const label = typeof field[i].label !== 'undefined' ? field[i].label + ': ' : ''
							$('#master-title').text(label + value)
						}
					}
				}
			}
		}

		autocompleteTable(field, callback, source, addParam) {
			const that = this;
			field = elvis(field);
			callback = elvis(callback, function () { });
			source = elvis(source, that.queryUrl + 'call_' + field + '_autocomplete');
			addParam = elvis(addParam, '');
			let instance = {};
			const initAcDetail = function () {
				instance = M.Autocomplete.init(this, {
					data: {},
					onAutocomplete: function (res) {
						let dataQuery = typeof (instance.queryResult) !== 'undefined' ? instance.queryResult : false;
						let dataSelected = {};
						if (dataQuery && dataQuery.length > 0) {
							let selectedIndex = false;
							for (let i in dataQuery) {
								if (typeof (dataQuery[i].data !== 'undefined') && dataQuery[i].data === res) {
									selectedIndex = i;
									break;
								}
							}
							if (selectedIndex && typeof (dataQuery[selectedIndex]) !== 'undefined') {
								dataSelected = dataQuery[selectedIndex];
							}
						}
						let obj = this;
						callback(res, dataSelected, obj.el);
					},
					minLength: 0
				});
			};
			const handleKeyUp = function (event) {
				const key = event.keyCode;
				let serializeParam = '';
				if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
					let term = $(this).val();
					term = term.toLowerCase();
					if (addParam == 'serialize') {
						serializeParam = that.serializeInputExcludeFilter(that.idForm);
					}
					let objData = {};
					let success = function (res) {
						if (typeof res !== 'undefined' && res.length > 0) {
							for (let i in res) {
								const val = elvis(res[i].value, null);
								if (val !== null) {
									const label = elvis(res[i].label, null);
									objData[res[i].value] = label;
								}
							}
							instance.queryResult = res;
						}
						instance.close();
						instance.updateData(objData);
						instance.open();
					}
					let xhrAutocomplete
					try {
						xhrAutocompete.abort();
					} catch (e) { }
					xhrAutocomplete = that.ajaxAutocomplete(source, 'term=' + term + '&' + serializeParam, success);
				}
			};
			$(this.wrapper).off('focusin', '.input_' + field);
			$(this.wrapper).on('focusin', '.input_' + field, initAcDetail);
			$(this.wrapper).off('keyup', '.input_' + field);
			$(this.wrapper).on('keyup', '.input_' + field, handleKeyUp);
		}
		autocompleteDetail(field, callback, source, addParam) { this.autocompleteTable(field, callback, source, addParam) }

		autocompleteBySelector(selector, url, callback, showData, isDetailPopulated, showSubmitButton, externalSource, addParam) {
			const that = this;
			let elem = document.querySelector(selector);
			let before = function () { };
			let after = function () { };
			showData = elvis(showData, true);
			isDetailPopulated = elvis(isDetailPopulated, true);
			showSubmitButton = elvis(showSubmitButton, true);

			if (typeof callback !== 'undefined' && callback !== 'off' && (typeof callback === 'function' || typeof callback === 'object')) {
				before = elvis(callback.before, typeof callback === 'function' ? callback : before);
				after = elvis(callback.after, after);
				showData = elvis(showData, true);
				isDetailPopulated = elvis(isDetailPopulated);
			} else if (callback === 'value_only') {
				showData = false;
				isDetailPopulated = false;
			} else {
				showData = true;
				isDetailPopulated = true;
			}
			const instance = M.Autocomplete.init(elem, {
				data: {},
				onAutocomplete: function (res) {
					let dataQuery = elvis(instance.queryResult);
					let dataSelected = {};
					if (dataQuery) {
						let selectedIndex = false;
						for (let i in dataQuery) {
							if (typeof (dataQuery[i].data !== 'undefined') && dataQuery[i].data === res) {
								selectedIndex = i;
								break;
							}
						}
						if (selectedIndex) {
							dataSelected = dataQuery[selectedIndex];
						}
					}
					let obj = this;
					before(res, dataSelected, obj.el);
					if (showData) {
						that.showData(isDetailPopulated, true, true, function () {
							after(res, dataSelected, obj.el);
						});
					} else {
						after(res, dataSelected, obj.el);
					}
					if (!showSubmitButton) {
						that.hideButtonSubmit();
					}
				},
				minLength: 0
			});

			if (callback === 'off') {
				$(this.wrapper).off('keyup', selector);
			} else {
				$(this.wrapper).off('keyup', selector);
				$(this.wrapper).on('keyup', selector, function (event) {
					let key = event.keyCode;
					let serializeParam = '';
					if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
						let term = $(this).val();
						term = term.toLowerCase();
						let source = typeof externalSource !== 'undefined' ? externalSource : url;
						addParam = typeof addParam !== 'undefined' ? addParam : '';
						if (addParam == 'serialize') {
							serializeParam = that.serializeInputExcludeFilter(that.idForm);
						}
						else if (Array.isArray(addParam) && addParam.length > 0) {
							for (let i in addParam) {
								let name = typeof addParam[i].name !== 'undefined' ? addParam[i].name : false;
								let value = '';
								if (name) {
									let selector = typeof addParam[i].selector !== 'undefined' ? addParam[i].selector : false;
									if (name && !selector) {
										selector = '#input_' + name;
									}
									let label = typeof addParam[i].label !== 'undefined' ? addParam[i].label : false;
									if (name && selector) {
										if (!label) {
											value = $(selector).val();
										}
										else {
											value = $(selector).text();
										}
									}
								}
								else {
									name = addParam[i];
									value = $('#input_' + name).val();
								}
								serializeParam += name + '=' + value + '&';
							}
						}
						else {
							let value = $('#input_' + addParam).val();
							serializeParam = addParam + '=' + value;
						}
						let objData = {};
						const success = function (res) {
							if (typeof res !== 'undefined' && res.length > 0) {
								for (let i in res) {
									let val = typeof (res[i].value != 'undefined') ? res[i].value : null;
									let label = typeof (res[i].label != 'undefined') ? res[i].label : null;
									if (val !== null) {
										objData[res[i].value] = label;
									}
								}
								instance.queryResult = res;
							}
							instance.close();
							instance.updateData(objData);
							instance.open();
						}
						let xhrAutocomplete
						try {
							xhrAutocomplete.abort();
						} catch (e) { }
						xhrAutocomplete = that.ajaxAutocomplete(source, 'term=' + term + '&' + serializeParam, success);
					}
				})
			}
			$(this.wrapper).off('focus', selector);
			$(this.wrapper).on('focus', selector, function () {
				instance.close()
				instance.updateData({})
			});
			return instance;
		}
		autocomplete(field, callback, showData, isDetailPopulated, showSubmitButton, externalSource, addParam) {
			let selector = '#input_' + field;
			let url = this.queryUrl + 'call_' + field + '_autocomplete';
			return this.autocompleteBySelector(selector, url, callback, showData, isDetailPopulated, showSubmitButton, externalSource, addParam);
		}

		ajaxAutocomplete(url, data, success, complete, timeout) {
			const ajax = new XMLHttpRequest();
			if (typeof url !== 'undefined' && url !== '') {
				data = typeof data !== 'undefined' && data !== '' ? '?' + data : '';
				success = typeof success === 'function' ? success : function () { };
				complete = typeof complete === 'function' ? complete : function () { };
				timeout = typeof timeout !== 'undefined' ? timeout : 0;
				ajax.open('GET', url + data, true);
				ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				ajax.onreadystatechange = function () {
					if (ajax.readyState == 4) {
						if (ajax.status >= 200 && (ajax.status < 300 || ajax.status === 304)) {
							let res;
							try {
								res = JSON.parse(ajax.responseText);
								success(res);
							} catch (e) {
								console.log('Error: cannot parse response to json');
								console.log(e);
								console.log(ajax.responseText);
							}
						} else {
							console.log(`Error: status ${ajax.status}`);
						}
						complete();
					}
				};
				ajax.timeout = timeout;
				try {
					ajax.send(null);
					return ajax;
				} catch (e) {
					console.log(e);
				}
			}
			else {
				console.log('Error: invalid url for autocomplete controller');
			}
			return ajax;
		}

		queryDetail(field, callback) {
			callback = elvis(callback, function () { });
			const that = this;
			$(this.master).off('focusin', '#input_' + field);
			$(this.master).on('focusin', '#input_' + field, function (e) {
				let element, evt = e ? e : window.event;
				if (evt.srcElement)
					element = evt.srcElement;
				else if (evt.target)
					element = evt.target;
				let acConfig = {
					source: that.queryUrl + 'call_' + field + '_autocomplete',
					select: function (event, ui) {
						$('#input_' + field).val(ui.item.value);
						callback(ui);
						that.writeDetail('get_detail', field + '=' + ui.item.value);
						that.showButtonSubmit();
					},
					minLength: 0
				};
				$('#input_' + field).autocomplete(acConfig);
			});
		}
		query_detail(field, callback) { this.queryDetail(field, callback) }

		//---------------------------------------------------------------------
		// Show data on form
		//---------------------------------------------------------------------
		showData(isDetailPopulated, isHistoryPopulated, showSubmitButton, callbackAfter, callbackAfterInitSelect, callbackAfterMaster) {
			const that = this;
			const defaultDetailPopulated = this.type == 'm' ? false : true;
			const defaultHistoryPopulated = this.type == 'mdh' ? true : false;
			isDetailPopulated = typeof isDetailPopulated !== 'undefined' ? isDetailPopulated : defaultDetailPopulated;
			isHistoryPopulated = typeof isHistoryPopulated !== 'undefined' ? isHistoryPopulated : defaultHistoryPopulated;
			showSubmitButton = typeof showSubmitButton !== 'undefined' ? showSubmitButton : true;
			callbackAfter = typeof callbackAfter !== 'undefined' ? callbackAfter : false;
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : () => { };
			callbackAfterMaster = typeof callbackAfterMaster !== 'undefined' ? callbackAfterMaster : () => { };
			const value = $('#input_' + this.mainField).val()
			if (value !== '') {
				const callbackDetail = isDetailPopulated ? function () { that.writeDetail() } : function () { }
				const callbackHistory = this.type === 'mdh' && isHistoryPopulated ? function () { that.writeHistory() } : function () { }
				const callbackMaster = function () {
					that.enableMasterInput()
					callbackDetail()
					callbackHistory()
					$('#button-clone-record').show()
					if (showSubmitButton) {
						that.showButtonSubmit()
					} else {
						that.hideButtonSubmit()
					}
					if (callbackAfter) {
						callbackAfter()
					}
				};
				this.populateMaster(callbackMaster, callbackAfterInitSelect, '', callbackAfterMaster);
			}
		}
		show_data(isDetailPopulated, isHistoryPopulated, showSubmitButton, callbackAfter, callbackAfterInitSelect, callbackAfterMaster) { this.showData(isDetailPopulated, isHistoryPopulated, showSubmitButton, callbackAfter, callbackAfterInitSelect, callbackAfterMaster) }

		//---------------------------------------------------------------------
		// Populate data to master form
		// required by showData function
		//---------------------------------------------------------------------
		populateMaster(callback, callbackAfterInitSelect, additionalParam, callbackAfterMaster) {
			const that = this
			additionalParam = typeof additionalParam !== 'undefined' ? '&' + additionalParam : ''
			callback = elvis(callback, function () { })
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : () => { }
			callbackAfterMaster = typeof callbackAfterMaster !== 'undefined' ? callbackAfterMaster : () => { }

			const mainParam = $('#input_' + this.mainField).val()
			const param = this.mainField + '=' + mainParam + additionalParam

			const callbackMaster = function (data) {
				that.data = typeof that.data !== 'undefined' ? that.data : {}
				that.data.master = typeof data.master !== 'undefined' ? data.master : undefined
				if (that.data.master !== undefined) {
					that.loadMaster(callbackAfterInitSelect)
				}
				callback(data)
				callbackAfterMaster(data)
			}
			getAjax(this.queryUrl + 'get', param, callbackMaster)
		}
		populate_master(callback, callbackAfterInitSelect, additionalParam, callbackAfterMaster) { this.populateMaster(callback, callbackAfterInitSelect, additionalParam, callbackAfterMaster) }

		// Legacy show data function
		show_data_md() {
			const that = this;
			let mainParam = $('#input_' + this.mainField).val();
			if (mainParam !== '') {
				let param = this.mainField + '=' + mainParam;
				let callback = function (data) {
					that.data = typeof data !== 'undefined' ? data : {};
					if (typeof data.master !== 'undefined' && typeof that.field !== 'undefined' && typeof that.field.master !== 'undefined') {
						let field = that.field.master;
						for (let i in field) {
							let value = '';
							if (typeof field[i].name !== 'undefined' && typeof data.master[field[i].name] !== 'undefined') {
								value = data.master[field[i].name];
							}
							if (typeof field[i].format !== 'undefined' && field[i].format == 'medium_datetime') {
								value = y_datetime_convert(value, 'datetime_sql_to_medium_datetime');
							}
							if (typeof field[i].label_info !== 'undefined' && (field[i].label_info === 'yes' || field[i].label_info === true)) {
								$('#label_info_' + field[i].name).text(value);
							} else if (!(typeof field[i].label_only !== 'undefined' && (field[i].label_only === 'yes' || field[i].label_only === true))) {
								$('#input_' + field[i].name).val(value);
							}
						}
					}
					that.writeTable('detail');
				};
				getAjax(this.queryUrl + 'get', param, callback);
			}
		}
		show_data_mdh() {
			const that = this;
			let mainParam = $('#input_' + this.mainField).val();
			if (mainParam !== '') {
				let param = this.mainField + '=' + mainParam;
				let callback = function (data) {
					that.data = typeof data !== 'undefined' ? data : {};
					if (typeof data.master !== 'undefined' && typeof that.field !== 'undefined' && typeof that.field.master !== 'undefined') {
						let field = that.field.master;
						for (let i in field) {
							let value = '';
							if (typeof field[i].name !== 'undefined' && typeof data.master[field[i].name] !== 'undefined') {
								value = data.master[field[i].name];
							}
							if (typeof field[i].format !== 'undefined' && field[i].format == 'medium_datetime') {
								value = y_datetime_convert(value, 'datetime_sql_to_medium_datetime');
							}
							if (typeof field[i].label_info !== 'undefined' && (field[i].label_info === 'yes' || field[i].label_info === true)) {
								$('#label_info_' + field[i].name).text(value);
							} else if (!(typeof field[i].label_only !== 'undefined' && (field[i].label_only === 'yes' || field[i].label_only === true))) {
								$('#input_' + field[i].name).val(value);
							}
						}
					}
					that.writeTable('detail');
					that.writeTable('history');
				};
				getAjax(this.queryUrl + 'get', param, callback);
			}
		}
		selectDetailAction() {
			let value = $('#input_' + this.keyField).val();
			value = typeof value !== 'undefined' ? value : $('#label_info_' + this.keyField).text();
			$('.panel_input_row_detail').removeClass('active');
			$('.' + this.keyField).each(function () {
				let _thisValue = $(this).text();
				if (_thisValue == value) {
					$(this).parent().addClass('active');
					return false;
				}
			});
		}
		//----------------------------------------------------------------------------------------------------
		// Reset
		//----------------------------------------------------------------------------------------------------
		reset() {
			$(this.idForm)[0].reset();
			$(this.detail).html('');
			$(this.history).html('');
			$('.label_info').html('');
			yM.setTextValue('.label_info');
		}
		reset_master(callback) { this.resetMaster(callback); }
		resetMaster(callback) {
			callback = elvis(callback, function () { });
			this.disableMasterInput();
			yM.setInputValue('.input_master_text');
			yM.setTextValue('.label_info');
			$('.preview-image').attr('src', '/images/no_image.webp')
			$('.span-input-type-file').text('No file chosen')
			this.resetMasterTables(callback);
		}
		resetMasterTable(table, callback) {
			table = elvis(table);
			callback = elvis(callback, function () { });
			if (table) {
				if (typeof table !== 'function') {
					const selector = table ? '.panel_y_' + table + '_table_data' : false;
					$(selector).html('')
					const tableShown = `${table}Shown`
					this.vars[tableShown] = 0
					this.data.master[table] = []
					this.data[table] = []
					callback()
				}
				else {
					callback = table;
					this.resetMasterTables(callback);
				}
			}
		}
		resetMasterTables(callback) {
			callback = elvis(callback, function () { });
			for (let i in this.panel.masterTable) {
				const table = this.panel.masterTable[i]
				const selector = '.panel_y_' + table + '_table_data';
				$(selector).html('')
				$('.panel-record-info-' + table).html('')
				const tableShown = `${table}Shown`
				this.vars[tableShown] = 0
				if (typeof this.data.master !== 'undefined' && typeof this.data.master[table] !== 'undefined') {
					this.data.master[table] = []
				}
				this.data[table] = []
			}
			callback();
		}
		reset_detail(resetData, letEmpty) { this.resetDetail(resetData, letEmpty); }
		resetDetail(resetData, letEmpty) {
			resetData = typeof resetData !== 'undefined' ? resetData : false;
			letEmpty = typeof letEmpty !== 'undefined' ? letEmpty : false;
			this.disableDetailInput()
			$(this.detail).html('')
			this.vars['detailShown'] = 0
			this.data['detail'] = []
			$('.header-sum').text('');
			$('.footer-sum').text('');
			if (resetData) {
				this.data = {};
			}
			if (!letEmpty) {
				this.writeDetail();
			}
		}
		reset_history(resetData, letEmpty) { this.resetHistory(resetData, letEmpty); }
		resetHistory(resetData, blank) {
			resetData = typeof resetData !== 'undefined' ? resetData : false;
			letEmpty = typeof letEmpty !== 'undefined' ? letEmpty : false;
			this.disable_history_input();
			$(this.history).html('')
			this.vars['historyShown'] = 0
			this.data['history'] = []
			if (resetData) {
				this.data = {};
			}
			if (!letEmpty) {
				this.writeHistory();
			}
		}

		//----------------------------------------------------------------------------------------------------
		// Enable Disable Input
		//----------------------------------------------------------------------------------------------------
		enable_master_input(field) { this.enableMasterInput(field); }
		enableMasterInput(field) {
			const selector = typeof field !== 'undefined' ? '#input_' + field : '.input_master_text';
			$(selector).prop('readonly', false);
			$(selector).prop('disable', false);
			$(selector).removeAttr("disabled");
			$(selector).removeClass("disabled");
			if (typeof field === 'undefined') {
				$('select.input-master-select').parent().removeClass("disabled");
			}
		}
		enable_detail_input(field) { this.enableDetailInput(field); }
		enableDetailInput(field) {
			const selector = typeof field !== 'undefined' ? '#input_' + field : '.input_detail_text';
			$(selector).prop('readonly', false);
			$(selector).prop('disabled', false);
		}
		enable_history_input(field) { this.enableHistoryInput(field); }
		enableHistoryInput(field) {
			const selector = typeof field !== 'undefined' ? '#input_' + field : '.input_history_text';
			$(selector).prop('readonly', false);
			$(selector).prop('disabled', false);
		}
		enableSelectInput(field) {
			const selector = typeof field !== 'undefined' ? '#' + field : false;
			if (selector) {
				$(selector).siblings('input.select-dropdown').removeProp('disabled');
			}
		}
		readonly_master_input(field) { this.readonlyMasterInput(field); }
		readonlyMasterInput(field) {
			const selector = typeof field !== 'undefined' ? '#input_' + field : '.input_master_text';
			$(selector).prop('readonly', true);
			if (typeof field === 'undefined') {
				$('.input-field-master>input').prop('readonly', true);
			}
		}
		disable_master_input(field) { this.disableMasterInput(field); }
		disableMasterInput(field) {
			const selector = typeof field !== 'undefined' ? '#input_' + field : '.input_master_text';
			$(selector).prop('disabled', true);
			if (typeof field === 'undefined') {
				$('select.input-master-select').each(function () {
					$(this).siblings('input').prop('disabled', null);
					$(this).parent().addClass('disabled');
				});
			}
			else {
				if ($(selector).is('select')) {
					$(selector).siblings('input').prop('disabled', null);
					$(selector).parent().addClass('disabled');
				}
			}
			this.hidePanelMaster();
		}
		disable_detail_input(field) { this.disableDetailInput(field); }
		disableDetailInput(field) {
			const selector = typeof field !== 'undefined' ? '#input_' + field : '.input_detail_text';
			$(selector).prop('disabled', true);
		}
		disable_history_input(field) { this.disableHistoryInput(field); }
		disableHistoryInput(field) {
			const selector = typeof field !== 'undefined' ? '#input_' + field : '.input_history_text';
			$(selector).prop('disabled', true);
		}
		disableSelectInput(field) {
			const selector = typeof field !== 'undefined' ? '#' + field : false;
			if (selector) {
				$(selector).siblings('input.select-dropdown').prop('disabled', 'disabled');
			}
		}
		unselect_detail() { this.unselectDetail() }
		unselectDetail() {
			$('.panel_input_row_detail').removeClass('active');
		}

		//----------------------------------------------------------------------------------------------------
		// Listener click event on row table
		//----------------------------------------------------------------------------------------------------
		enable_select_detail(callback, callbackAfter, callbackAfterInitSelect) { this.enableSelectDetail(callback, callbackAfter, callbackAfterInitSelect); }
		enableSelectDetail(callback, callbackAfter, callbackAfterInitSelect, callbackAfterMaster) {
			const that = this;
			callback = typeof (callback) !== 'undefined' ? callback : function () { };
			callbackAfter = typeof callbackAfter !== 'undefined' ? callbackAfter : function () { };
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { };
			$(this.detail).off('click', '.panel_input_row_with_sidebar');
			$(this.detail).on('click', '.panel_input_row_with_sidebar', function (event) {
				let row = this;
				event = event || window.event;
				event.preventDefault();
				that.showPanelMaster();
				$('#button_submit_edit_record').click();
				let value = $(this).children('.' + that.mainField).text();
				$('#input_' + that.mainField).val(value)
				that.showData(false, undefined, undefined, callbackAfter, callbackAfterInitSelect, callbackAfterMaster);
				if (typeof that.mainFieldAfter !== 'undefined') {
					$('#input_' + that.mainFieldAfter).focus();
				}
				if (that.labelMaster != '') {
					$('#title-module').text(that.labelMaster)
				}
				callback();
			});
			$('.panel_y_detail_table_data').css('cursor', 'pointer');
		}
		enable_select_history() { this.enableSelectHistory(); }
		enableSelectHistory() {
			const that = this;
			$(this.history).off('click', '.panel_input_row_with_sidebar');
			$(this.history).on('click', '.panel_input_row_with_sidebar', function (event) {
				event = event || window.event;
				event.preventDefault();
				$('#button_submit_edit_record').click();
				const value = $(this).children('.' + that.mainField).text();
				$('#input_' + that.mainField).val(value);
				that.showData(false);
				if (typeof that.mainFieldAfter !== 'undefined') {
					$('#input_' + that.mainFieldAfter).focus();
				}
			});
			$('.panel_y_history_table_data').css('cursor', 'pointer');
		}
		// Set listener to show master panel when row on table detail clicked
		enableDetailHiddenKey(callback, callbackAfter, callbackAfterInitSelect, callbackAfterMaster) {
			callback = elvis(callback, function () { });
			callbackAfter = typeof callbackAfter !== 'undefined' ? callbackAfter : function () { };
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { };
			callbackAfterMaster = typeof callbackAfterMaster !== 'undefined' ? callbackAfterMaster : function () { };
			const that = this;
			$(this.detail).off('click', '.panel_input_row_with_sidebar');
			$(this.detail).on('click', '.panel_input_row_with_sidebar', function (event) {
				event = event || window.event;
				event.preventDefault();
				that.showMaster();
				const value = $(this).children().children('.input_' + that.mainField).val()
				$('#input_' + that.mainField).val(value)
				that.showData(false, false, true, callbackAfter, callbackAfterInitSelect, callbackAfterMaster);
				if (typeof that.mainFieldAfter !== 'undefined') {
					$('#input_' + that.mainFieldAfter).focus();
				}
				if (that.labelMaster != '') {
					$('#title-module').text(that.labelMaster)
				}
				callback();
			});
			$('.panel_y_detail_table_data').css('cursor', 'pointer');
		}
		enable_select_detail_to_history() { this.enableSelectDetailToHistory(); }
		enableSelectDetailToHistory() {
			const that = this;
			$(this.detail).off('click', '.panel_input_row_detail_clickable');
			$(this.detail).on('click', '.panel_input_row_detail_clickable', function (event) {
				event = event || window.event;
				event.preventDefault();
				that.assignCommandHistory($(this).children('.cl_key_param').val());
			});
		}
		assignCommandHistory(param) {
			const that = this;
			$(this.history).html('');
			const contoller = typeof contoller !== 'undefined' ? contoller : 'call_history_data?param=';
			param = typeof param !== 'undefined' ? param : '';
			let callback = typeof callback !== 'undefined' ? callback : function (data) {
				that.panel.writeTableData('history', data.history);
			};
			getAjax(this.queryUrl + contoller + param, param, callback);
		}
		fill_label_info(field, data) { this.fillLabelInfo(field, data); }
		fillLabelInfo(field, data) {
			for (let i in field) {
				let data_field = typeof data[field[i]] !== 'undefined' ? data[field[i]] : '';
				let elTarget = document.getElementById('label_info_' + field[i]);
				if (elTarget !== null) {
					elTarget.innerHTML = data_field;
				}
			}
		}

		/////////////////////////////////////////////////////////////////////////////////////
		// Add Row on Table
		/////////////////////////////////////////////////////////////////////////////////////
		// addRow(table, i, data, last, triggerField, option) {

		// 	data = typeof data !== 'undefined' ? data : { no: (i + 1) }
		// 	table = typeof table !== 'undefined' ? table : 'detail'
		// 	last = typeof last !== 'undefined' ? last : false
		// 	option = typeof option !== 'undefined' ? option : 'show'
		// 	if (table != 'detail' || table != 'history') {
		// 		this.data.master = typeof this.data.master !== 'undefined' ? this.data.master : {}
		// 		this.data.master[table] = typeof this.data.master[table] !== 'undefined' ? this.data.master[table] : []
		// 		this.data.master[table][i] = data
		// 		this.data[table] = typeof this.data[table] !== 'undefined' ? this.data[table] : []
		// 		this.data[table][i] = data
		// 	}
		// 	else {
		// 		this.data[table] = typeof this.data[table] !== 'undefined' ? this.data[table] : []
		// 		this.data[table][i] = data
		// 	}
		// 	const callbackBefore = typeof option !== 'undefined' && typeof option.callbackBefore !== 'undefined' ? option.callbackBefore : function () { }
		// 	const callback = typeof option !== 'undefined' && typeof option.callback !== 'undefined' ? option.callback : function () { }
		// 	const callbackLast = typeof option !== 'undefined' && typeof option.callbackLast !== 'undefined' ? option.callbackLast : function () { }
		// 	const callbackNotLast = typeof option !== 'undefined' && typeof option.callbackNotLast !== 'undefined' ? option.callbackNotLast : function () { }
		// 	callbackBefore(i)
		// 	const tr = this.panel.writeRow(i, table, data, option)
		// 	if (last) {
		// 		this.newRowTrigger[table] = typeof this.newRowTrigger[table] !== 'undefined' ? this.newRowTrigger[table] : false;
		// 		triggerField = typeof triggerField !== 'undefined' ? triggerField : this.newRowTrigger[table]
		// 		if (triggerField) {
		// 			$(':input[name="' + triggerField + '[' + i + ']"]').addClass('new-row-trigger')
		// 		}
		// 		if ($(tr).children('.td-button-remove').length > 0) {
		// 			let prevTr = $(tr).prev()
		// 			if (prevTr.length > 0) {
		// 				const prevTd = $(prevTr).children('.td-button-remove')
		// 				const icon = prevTd.children('button').children('i').html();
		// 				if (icon === 'check_circle' || icon === 'radio_button_unchecked') {
		// 					const td = $(tr).children('.td-button-remove')
		// 					td.children('button').children('i').html('radio_button_unchecked')
		// 				}
		// 			}
		// 		}
		// 		callbackLast(tr)
		// 		this.resetTableNumber(table)
		// 	}
		// 	else {
		// 		callbackNotLast(tr)
		// 	}
		// 	this.showTableInfo(table)
		// 	callback(tr)
		// }
		addRow(table = 'detail', i, data, last = false, triggerField, option = 'show') {
			data = data || { no: (i + 1) }
			switch (table) {
				case 'detail':
				case 'history':
					this.data[table][i] = data;
					break;
				default:
					this.data[table][i] = data;
			}
			const { callbackBefore = () => { }, callback = () => { }, callbackLast = () => { }, callbackNotLast = () => { } } = option;
			callbackBefore(i);
			const tr = this.panel.writeRow(i, table, data, option);
			if (last) {
				this.newRowTrigger[table] = this.newRowTrigger[table] || false;
				triggerField = triggerField || this.newRowTrigger[table];
				if (triggerField) {
					$(':input[name="' + triggerField + '[' + i + ']"]').addClass('new-row-trigger')
				}
				if ($(tr).children('.td-button-remove').length > 0) {
					let prevTr = $(tr).prev()
					if (prevTr.length > 0) {
						const prevTd = $(prevTr).children('.td-button-remove')
						const icon = prevTd.children('button').children('i').html();
						if (icon === 'check_circle' || icon === 'radio_button_unchecked') {
							const td = $(tr).children('.td-button-remove')
							td.children('button').children('i').html('radio_button_unchecked')
						}
					}
				}
				callbackLast(tr)
				this.resetTableNumber(table)
			}
			else {
				callbackNotLast(tr)
			}
			this.showTableInfo(table)
			callback(tr)
		}
		recordInfo(table, message, append) {
			append = typeof append !== 'undefined' ? append : false
			if (!append) {
				$('.panel-record-info-' + table).html('')
			}
			yM.span({
				parent: '.panel-record-info-' + table,
				id: 'record-info-message-' + table,
				class: 'record-info-message-text',
				content: message
			})
		}
		setAutoAddRow(table, trigger, option) {
			const that = this
			trigger = typeof trigger !== 'undefined' ? trigger : this.newRowTrigger[table]
			this.newRowTrigger[table] = trigger
			const addButton = yM.buttonFloating({
				class: 'panel-info-button-add waves-effect waves-light panel-info-button-add-' + table,
				icon: 'add_circle_outline'
			})
			if (trigger != '') {
				$(this.wrapper).off('focusin', ".new-row-trigger[data='" + trigger + "']");
				$(this.wrapper).on('focusin', ".new-row-trigger[data='" + trigger + "']", function (e) {
					e.preventDefault();
					let element, evt = e ? e : window.event
					if (evt.srcElement)
						element = evt.srcElement;
					else if (evt.target)
						element = evt.target;
					$(this).removeClass('new-row-trigger');
					const lastIndex = parseInt(element.name.substring((trigger + '[').length, element.name.length - 1)) + 1
					that.addRow(table, lastIndex, {
						no: lastIndex + 1
					}, true, trigger, option)
					const tableShown = `${table}Shown`
					that.vars[tableShown] = lastIndex + 1
					that.showTableInfo(table)
					that.panel.rePopulateSelect(table, lastIndex, option);
				});
				$(this.wrapper).off('click', ".panel-info-button-add-" + table);
				$(this.wrapper).on('click', ".panel-info-button-add-" + table, function (e) {
					e.preventDefault();
					$(".new-row-trigger[data='" + trigger + "']").focus()
				});
			}
			$('.panel-record-info-' + table).parent().append(addButton);
		}
		setRequery(table, controller, callbackAfter) {
			callbackAfter = typeof callbackAfter !== 'undefined' ? callbackAfter : () => { }
			controller = typeof controller !== 'undefined' ? controller : `get_${table}`
			this.requeryCallback[table] = (obj) => {
				const length = typeof this.data !== 'undefined' && typeof this.data[table] !== 'undefined' ? this.data[table].length : 0
				const url = this.queryUrl + controller
				const serialize = this.serializeInputExcludeFilter(this.idForm)
				const param = serialize + '&' + this.serializeInputFilter(table) + '&offset=' + length
				const callback = (res) => {
					const dataTable = typeof this.data !== 'undefined' && typeof this.data[table] !== 'undefined' ? this.data[table] : []
					if (res && res.length > 0) {
						const total = typeof res[0]['db_num_rows'] !== 'undefined' ? res[0]['db_num_rows'] : res.length
						dataTable.push(...res)
						for (let i in res) {
							const isLast = i == (res.length - 1) ? true : false
							const noRow = parseInt(i) + parseInt(length)
							this.addRow(table, noRow, res[i], isLast)
						}
						const tableShown = `${table}Shown`
						const shown = typeof this.vars[tableShown] !== 'undefined' ? this.vars[tableShown] : 0
						this.vars[tableShown] = shown + res.length
						this.showTableInfo(table)
					}
					else {
						alert('no more data')
					}
					callbackAfter(res)
				}
				getAjax(url, param, callback)
			}
		}
		unsetAutoAddRow(table, trigger) {
			trigger = this.newRowTrigger[table]
			if (trigger != '') {
				$(this.wrapper).off('focusin', ".new-row-trigger[data='" + trigger + "']");
			}
		}
		setAutoAddRowDetail(triggerName) {
			const that = this;
			triggerName = typeof triggerName !== 'undefined' ? triggerName : this.newRowTrigger.detail;
			$(this.detail).off('focusin', '.new-row-trigger');
			$(this.detail).on('focusin', '.new-row-trigger', function (e) {
				e.preventDefault();
				let element, evt = e ? e : event;
				if (evt.srcElement)
					element = evt.srcElement;
				else if (evt.target)
					element = evt.target;
				$(this).removeClass('new-row-trigger');
				let last_index = parseInt(element.name.substring((triggerName + '[').length, element.name.length - 1)) + 1;
				that.addRow('detail', last_index, {
					no: last_index + 1
				}, true, triggerName);
			});
			this.writeDetail = function () { that.writeTable('detail'); };
		}
		set_auto_add_row_detail(triggerName) {
			this.setAutoAddRowDetail(triggerName);
		}
		unsetAutoAddRowDetail() {
			$(this.detail).off('focusin', '.new-row-trigger');
		}
		unset_auto_add_row_detail() {
			this.unsetAutoAddRowDetail();
		}
		add_row_detail(i, data, last, triggerField, option) {
			this.addRow('detail', i, data, last, triggerField, option);
		}
		setAutoAddRowHistory(triggerName) {
			const that = this;
			triggerName = typeof triggerName !== 'undefined' ? triggerName : this.newRowTrigger.history;
			$(this.history).off('focusin', '.new-row-trigger');
			$(this.history).on('focusin', '.new-row-trigger', function (e) {
				$(this).removeClass('new-row-trigger');
				let element, evt = e ? e : event;
				if (evt.srcElement)
					element = evt.srcElement;
				else if (evt.target)
					element = evt.target;
				let last_index = parseInt(element.name.substring((triggerName + '[').length, element.name.length - 1)) + 1;
				that.addRow('history', last_index, {
					no: last_index + 1
				}, true, triggerName);
			});
			this.writeHistory = this.writeHistoryAutoAddRow;
		}
		set_auto_add_row_history(triggerName) { this.setAutoAddRowHistory(triggerName) }
		writeHistoryAutoAddRow() {
			const data = typeof this.data.history !== 'undefined' ? this.data.history : {}
			const minRows = this.minRows;
			const length = typeof data.length !== 'undefined' ? data.length : 0
			const rows = minRows + length
			for (let i = 0; i < rows; i++) {
				const last = (i == rows - 1) ? true : false;
				const param = typeof data[i] !== 'undefined' ? data[i] : { no: (i + 1) }
				this.addRow('history', i, param, last);
			}
		}
		write_history_auto_add_row() { this.writeHistoryAutoAddRow() }
		write_detail(table, param, callback) { this.writeDetail(table, param, callback) }
		write_history(table, param, callback) { this.writeHistory(table, param, callback) }

		/////////////////////////////////////////////////////////////////////////////////////
		// Write Table
		/////////////////////////////////////////////////////////////////////////////////////
		writeTable(table, callbackAfterInitSelect) {
			showPreloader()
			table = typeof table !== 'undefined' ? table : 'detail'
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { }

			const data = typeof this.data[table] !== 'undefined' ? this.data[table] : {}
			const minRows = this.minRows
			const dataLength = typeof data.length !== 'undefined' ? data.length : 0
			const rows = minRows + dataLength
			const maxShownRows = rows < 20 ? rows : 20
			const varShown = table + 'Shown'

			// Write first show rows
			for (let i = 0; i < maxShownRows; i++) {
				data[i] = typeof data[i] !== 'undefined' ? data[i] : {}
				data[i].no = typeof data[i].no !== 'undefined' ? data[i].no : i + 1
				const param = typeof data[i] !== 'undefined' ? data[i] : { no: (i + 1) }
				const isLast = (i == rows - 1) ? true : false
				this.addRow(table, i, param, isLast)
			}
			this.vars[varShown] = maxShownRows

			// Continue write rest of rows but hidden
			if (maxShownRows < rows) {
				this.processRow(table, maxShownRows)
				const moreId = '#btn-more-' + table
				const moreAllId = '#btn-more-all-' + table
				$(this.wrapper).off('click', moreId)
				$(this.wrapper).on('click', moreId, () => {
					const start = this.vars[varShown]
					const end = start + maxShownRows > dataLength ? dataLength : start + maxShownRows
					this.showRows(table, end)
				})
				$(this.wrapper).off('click', moreAllId)
				$(this.wrapper).on('click', moreAllId, () => {
					const end = dataLength
					this.showRows(table, end)
				})
			}
			else {
				this.showTableInfo(table)
			}
			this.panel.initSelect(table, undefined, callbackAfterInitSelect)
			hidePreloader()
		}
		write_table(table, callbackAfterInitSelect) { this.writeTable(table, callbackAfterInitSelect) }

		showRows(table, end) {
			const varShown = table + 'Shown'
			const start = this.vars[varShown]
			for (let i = start; i < end; i++) {
				$('.panel_input_row_' + table + '[row="' + i + '"]').removeAttr('hidden')
			}
			this.vars[varShown] = end
			this.showTableInfo(table)
		}

		processRow(table, row) {
			const rows = this.minRows + this.data[table].length
			const maxShownRows = rows < 20 ? rows : 20
			const end = row + maxShownRows > rows ? rows : row + maxShownRows
			while (row < end) {
				this.data[table][row] = typeof this.data[table][row] !== 'undefined' ? this.data[table][row] : {}
				this.data[table][row].no = typeof this.data[table][row].no !== 'undefined' ? this.data[table][row].no : row + 1
				const last = (row == rows - 1) ? true : false
				const data = typeof this.data[table][row] !== 'undefined' ? this.data[table][row] : { no: (row + 1) }
				this.addRow(table, row, data, last, this.newRowTrigger[table], 'hidden')
				row++
			}
			if (row < rows) {
				this.recordInfo(table, yStr('processingRecordNo_Of_', [(row + 1)]))
				this.processRow(table, row)
			}
			else {
				this.showTableInfo(table)
			}
		}

		// Show Information of Table
		showTableInfo(table, simple) {
			simple = typeof simple !== 'undefined' ? simple : false
			if (simple) {
				this.recordInfo(table, '')
			}
			else {
				const tableDom = document.querySelector(`.panel_y_${table}_table`)
				const length = tableDom.tBodies[0].rows.length
				const tableShown = `${table}Shown`
				let shown = typeof this.vars[tableShown] !== 'undefined' ? this.vars[tableShown] : false
				if (!shown) {
					this.vars[tableShown] = length
					shown = length
				}
				if (shown > length) {
					shown = length
					this.vars[tableShown] = length
				}
				if (length == 0) {
					this.recordInfo(table, '')
				}
				else {
					const data = typeof this.data[table] !== 'undefined' ? this.data[table] : {}
					const minRows = this.minRows
					const dataLength = typeof data.length !== 'undefined' ? data.length : 0
					const rows = minRows + dataLength
					const maxShownRows = rows < 20 ? rows : 20
					const dbRows = typeof data[0] !== 'undefined' && typeof data[0].db_num_rows !== 'undefined' ? data[0].db_num_rows : false
					const str = dbRows ? yStr('showRecordLength', [shown, dbRows]) : yStr('showRecordLength', [shown, length])
					this.recordInfo(table, str)
					if (shown < length) {
						this.writeButtonMore(table, length)
					}
					else {
						if ((maxShownRows < dataLength && dataLength < dbRows) || (dataLength < dbRows)) {
							this.writeButtonRequery(table)
						}
					}
				}
			}
		}

		writeButtonMore(table, length) {
			const tableShown = `${table}Shown`
			const shown = this.vars[tableShown]
			const data = typeof this.data[table] !== 'undefined' ? this.data[table] : {}
			const minRows = this.minRows
			const dataLength = typeof data.length !== 'undefined' ? data.length : 0
			const rows = minRows + dataLength
			const maxShownRows = rows < 20 ? rows : 20
			const moreRows = (length - shown) > maxShownRows ? maxShownRows : (length - shown)
			const moreRowsString = moreRows > 1 ? yStr('showMore_Rows', moreRows) : yStr('showMore_Row', moreRows)

			$('.panel-record-info-' + table).append(
				yM.button({
					class: 'btn-tiny btn-left-margin btn-more',
					id: 'btn-more-' + table,
					content: moreRowsString,
					icon: 'expand_more'
				}) +
				yM.button({
					class: 'btn-tiny btn-left-margin btn-more-all',
					id: 'btn-more-all-' + table,
					content: yStr('showAll'),
					icon: 'expand_more'
				})
			)
		}
		writeButtonRequery(table) {
			const that = this
			$('.panel-record-info-' + table).append(
				yM.button({
					class: 'btn-tiny btn-left-margin btn-requery',
					id: 'btn-requery-' + table,
					content: 'Load more...',
					icon: 'loop'
				})
			)
			const requeryID = '#btn-requery-' + table
			$(this.wrapper).off('click', requeryID)
			$(this.wrapper).on('click', requeryID, function (e) {
				e = e || window.e
				e.preventDefault()
				if (typeof that.requeryCallback && typeof that.requeryCallback[table] !== 'undefined') {
					if (typeof that.requeryCallback[table] === 'function') {
						that.requeryCallback[table](this)
					}
					else {
						webApp.addNotification({
							title: 'Load more...',
							message: 'Data length shown is limited, please use filter',
							time: false,
							displayLength: 5000,
						})
					}
				}
				else {
					webApp.addNotification({
						title: 'Load more...',
						message: 'Not yet implemented, please contact IT Support',
						time: false,
						displayLength: 5000,
					})
				}
			})
		}

		//---------------------------------------------------------------------
		// Update Table with new data
		// Usage:
		// 1. Update with current data
		//    updateTable('table_name')
		// 2. Update table with new array of table
		//    updateTable('table_name', data)
		// 3. Update table with new array of table and callback after init select
		//    updateTable('table_name', data, callbackAfterInitSelect)
		// 4. Update table with current data only and callback after init select
		//    updateTable('table_name', undefined, callbackAfterInitSelect)
		//---------------------------------------------------------------------
		updateTable(table, data, callbackAfterInitSelect) {
			const tempData = typeof this.data !== 'undefined' && typeof this.data[table] !== 'undefined' ? this.data[table] : []
			data = typeof data !== 'undefined' ? data : tempData
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { }
			this.data[table] = []
			this.resetTable(table)
			this.data[table] = data
			this.writeTable(table, callbackAfterInitSelect)
			this.showTableInfo(table)
		}

		//---------------------------------------------------------------------
		// Update Table Simple with new data
		// Usage:
		// 1. Update with current data
		//    updateTableSimple('table_name')
		// 2. Update table with new array of table
		//    updateTableSimple('table_name', data)
		//---------------------------------------------------------------------
		updateTableSimple(table, data) {
			const tempData = typeof this.data !== 'undefined' && typeof this.data[table] !== 'undefined' ? this.data[table] : []
			data = typeof data !== 'undefined' ? data : tempData
			this.data[table] = []
			this.resetTable(table)
			this.data[table] = data
			this.writeTableSimple(table)
			this.showTableInfo(table, true)
		}

		//
		// Update Table With Ajax
		//
		updateTableFromAjax(opt) {
			opt = typeof opt !== 'undefined' ? opt : {}
			const requestMethod = typeof opt.requestMethod !== 'undefined' ? opt.requestMethod : 'get'
			const table = typeof opt === 'string' ? opt : typeof opt.table !== 'undefined' ? opt.table : 'detail'
			opt = typeof opt !== 'string' ? opt : {}
			const serialize = this.serializeInput(this.idForm)
			const param = typeof opt.param !== 'undefined' ? opt.param : serialize
			const controller = typeof opt.controller !== 'undefined' ? opt.controller : `get_${table}`
			const callbackAjax = typeof opt.callbackAjax !== 'undefined' ? opt.callbackAjax : (res) => {
				this.handleAjaxResponseTable(opt, res)
			}
			if (requestMethod == 'get') {
				getAjax(this.queryUrl + controller, param, callbackAjax)
			}
			else {
				postAjax(this.queryUrl + controller, param, callbackAjax)
			}
		}
		handleAjaxResponseTable(opt, res) {
			opt = typeof opt !== 'undefined' ? opt : {}
			const table = typeof opt === 'string' ? opt : typeof opt.table !== 'undefined' ? opt.table : 'detail'
			opt = typeof opt !== 'string' ? opt : {}
			const title = typeof opt.title !== 'undefined' ? opt.title : ''
			const masterTable = typeof opt.masterTable !== 'undefined' ? opt.masterTable : true
			const simple = typeof opt.simple !== 'undefined' ? opt.simple : false
			const showAjaxResultSuccess = typeof opt.showAjaxResultSuccess !== 'undefined' ? opt.showAjaxResultSuccess : true
			const callbackBefore = typeof opt.callbackBefore !== 'undefined' ? opt.callbackBefore : () => { }
			// Error
			const callbackAfterError = typeof opt.callbackAfterError !== 'undefined' ? opt.callbackAfterError : () => { }
			const callbackError = typeof opt.callbackError !== 'undefined' ? opt.callbackError : (error, res) => {
				showAjaxResult(error, false, title)
				callbackAfterError(error, res)
			}
			// Success
			const callbackAfterSuccess = typeof opt.callbackAfterSuccess !== 'undefined' ? opt.callbackAfterSuccess : () => { }
			const callbackSuccess = typeof opt.callbackSuccess !== 'undefined' ? opt.callbackSuccess : (res) => {
				const dataTable = typeof res.data !== 'undefined' && typeof res.data[table] !== 'undefined' ? res.data[table] : typeof res.data !== 'undefined' ? res.data : res
				this.data[table] = dataTable
				if (masterTable) { this.data.master[table] = dataTable }
				if (showAjaxResultSuccess) { showAjaxResult([`success`], false, title) }
				if (simple) {
					this.updateTableSimple(table, dataTable)
				} else {
					this.updateTable(table, dataTable)
				}
				callbackAfterSuccess(res, dataTable)
			}
			const callbackAfter = typeof opt.callbackAfter !== 'undefined' ? opt.callbackAfter : () => { }
			const callbackResError = typeof opt.callbackResError !== 'undefined' ? opt.callbackResError : () => {
				showAjaxResult(['Error: kesalahan response dari server'], false, title)
			}

			callbackBefore(res)
			if (res && res.length !== null) {
				const error = typeof res.error !== 'undefined' ? res.error : []
				if (error.length > 0) {
					callbackError(error.res)
				}
				else {
					callbackSuccess(res)
				}
				callbackAfter(res)
			}
			else {
				callbackResError(res)
			}
		}

		resetTable(table) {
			$('.panel_y_' + table + '_table_data').html('')
			const tableShown = `${table}Shown`
			this.vars[tableShown] = 0
			if (typeof this.data.master !== 'undefined' && typeof this.data.master[table] !== 'undefined') {
				this.data.master[table] = []
			}
			this.data[table] = []
		}
		// Auto Add Row
		writeTableSimple(table, callbackAfterInitSelect) {
			showPreloader()
			table = typeof table !== 'undefined' ? table : 'detail'
			callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { }
			const data = typeof this.data[table] !== 'undefined' ? this.data[table] : {}
			const minRows = this.minRows;
			const length = typeof data.length !== 'undefined' ? data.length : 0;
			const rows = minRows + length;
			for (let i = 0; i < rows; i++) {
				const last = (i == rows - 1) ? true : false
				const param = typeof data[i] !== 'undefined' ? data[i] : { no: (i + 1) }
				this.addRow(table, i, param, last)
			}
			this.panel.initSelect(table, undefined, callbackAfterInitSelect);
			hidePreloader()
		}

		//----------------------------------------------------------------------------------------------------------------------
		// Button
		//----------------------------------------------------------------------------------------------------------------------
		// Button Set - Edit - New - Clone
		//----------------------------------------------------------------------------------------------------------------------
		createButtonSet(param) {
			let clear_detail = false;
			let callbackEdit = function () { };
			let callbackInsert = function () { };
			let callbackClone = function () { };
			if (typeof param !== 'undefined') {
				if (typeof param === 'boolean') {
					clear_detail = typeof clear_detail !== 'undefined' ? clear_detail : false;
				} else if (typeof param === 'object') {
					callbackEdit = typeof param.callback.open !== 'undefined' ? param.callback.open : function () { };
					callbackEdit = typeof param.callback.edit !== 'undefined' ? param.callback.edit : function () { };
					callbackInsert = typeof param.callback.new !== 'undefined' ? param.callback.new : function () { };
					callbackInsert = typeof param.callback.insert !== 'undefined' ? param.callback.insert : function () { };
					callbackClone = typeof param.callback.clone !== 'undefined' ? param.callback.clone : function () { };
				}
			}
			this.create_button_insert('New', clear_detail, callbackInsert);
			this.create_button_edit('Open', clear_detail, callbackEdit);
			this.createButtonClone('Clone', callbackClone);
			$('#button-clone-record').hide();
		}
		create_button_set(param) {
			this.createButtonSet(param);
		}
		createButtonLeft(id, content, icon, href) {
			yM.li({
				parent: '#toolbar-module-left',
				content: yM.button({
					element: 'a',
					class: 'btn light-blue darken-1 white-text waves-effect waves-blue btn-small btn-back tooltipped modal-trigger',
					href: href,
					id: id,
					content: content,
					icon: icon
				})
			});
		}
		// createButtonLeftBaru(id, content, icon, href) {
		//     yM.li({
		//         parent: '#toolbar-module-left',
		//         content: yM.button({
		//             element: 'a',
		//             class: 'btn light-blue darken-1 white-text waves-effect waves-blue btn-small btn-back  ',
		//             href: href,
		//             id: id,
		//             content: content,
		//             icon: icon
		//         })
		//     });
		// }
		// Button Get
		//----------------------------------------------------------------------------------------------------------------------
		create_button_get(label) {
			this.createButtonGet(label);
		}
		createButtonGet(label) {
			label = typeof label !== 'undefined' ? label : 'Query';
			const that = this;
			let button = this.panel.create_button('post', label, 'query_record');
			this.panel.command($(this.wrapper), button, function () {
				that.showButtonSubmit();
			});
		}
		// Button Query
		//----------------------------------------------------------------------------------------------------------------------
		// Automatic call get_detail ajax when pressed
		create_button_query(label) {
			this.createButtonQuery(label);
		}
		createButtonQuery(label) {
			label = typeof label !== 'undefined' ? label : 'Query';
			const that = this;
			let button = this.panel.create_button('submit', label, 'query_record');
			this.panel.command($(this.wrapper), button, function () {
				that.showButtonSubmit();
				that.writeDetailWithKeyParam();
			});
		}
		writeDetailWithKeyParam(url) {
			url = typeof url !== 'undefined' ? url : 'get_detail';
			let value;
			if (typeof this.keyFieldType !== 'undefined' && this.keyFieldType) {
				if (this.keyFieldType == 'input') {
					value = $('#input_' + this.keyField).val();
				} else {
					value = $('#label_info_' + this.keyField).text();
				}
			}
			this.writeDetail(url, this.keyField + '=' + value);
		}
		// Button Post
		//----------------------------------------------------------------------------------------------------------------------
		create_button_post(label) {
			label = typeof label !== 'undefined' ? label : 'Upload';
			const that = this;
			let button_post = this.panel.create_button('post', label, 'post_record');
			this.panel.command($(this.wrapper), button_post, function () {
				$('.button-submit').click();
			});
		}
		// Button Insert
		//----------------------------------------------------------------------------------------------------------------------
		create_button_insert(label, clear_detail, callback) {
			callback = elvis(callback, function () { });
			label = typeof label !== 'undefined' ? label : 'Insert';
			clear_detail = typeof clear_detail !== 'undefined' ? clear_detail : false;
			const that = this;
			let button = this.panel.addButton({
				icon: 'content_paste',
				label: label,
				id: 'button-insert-record'
			});
			this.panel.command($(this.wrapper), '#' + button, function () {
				that.showButtonSubmit();
				that.resetMaster();
				that.enableMasterInput();
				$('#button-clone-record').hide();
				if (that.keyFieldType != 'input') {
					$('#input_' + that.mainField).focus();
				} else {
					$('#input_' + that.keyField).focus();
				}
				that.unselect_detail();
				if (clear_detail) {
					that.resetDetail();
				}
				callback();
				that.showPanelMaster();
			});
		}
		// Button New
		//----------------------------------------------------------------------------------------------------------------------
		createButtonNew(label, clear_detail, callback) {
			callback = elvis(callback, function () { });
			label = typeof label !== 'undefined' ? label : yStr('new');
			clear_detail = typeof clear_detail !== 'undefined' ? clear_detail : false;
			const that = this;
			let button = this.panel.addButton({
				icon: 'create_new_folder',
				label: label,
				id: 'button-new-record',
			});
			this.panel.command($(this.wrapper), '#' + button, function () {
				that.showButtonSubmit();
				$('.title-document').val("New Document");
				that.resetMaster();
				that.enableMasterInput();
				$('#button-clone-record').hide();
				if (that.keyFieldType != 'input') {
					$('#input_' + that.mainField).focus();
				} else {
					$('#input_' + that.keyField).focus();
				}
				that.unselect_detail();
				if (clear_detail) {
					that.resetDetail()
				}
				callback()
				if (that.labelNew != '') {
					$('#title-module').text(that.labelNew)
				}
				that.showPanelMaster();
			});
		}
		create_button_new(label, clear_detail, callback) {
			this.createButtonNew(label, clear_detail, callback);
		}
		showPanelMaster() {
			//this.panel.collapsibleMaster.open();
			$('.panel_y_master>li').addClass('active');
			$('.panel_y_master>li>.collapsible-body').show();
		}
		hidePanelMaster() {
			//this.panel.collapsibleMaster.close();
			$('.panel_y_master>li').removeClass('active');
			$('.panel_y_master>li>.collapsible-body').hide();
		}
		showPanelMasterTitle() {
			$('.panel-title-master').show();
		}
		hidePanelDetailTitle() {
			$('.panel-title-master').hide();
		}
		showPanelDetailTitle() {
			$('.panel-title-detail').show();
		}
		hidePanelMasterTitle() {
			$('.panel-title-detail').hide();
		}
		showPanelHistoryTitle() {
			$('.panel-title-history').show();
		}
		hidePanelHistoryTitle() {
			$('.panel-title-history').hide();
		}
		noTitleMode() {
			this.hidePanelMasterTitle();
			this.hidePanelDetailTitle();
			this.hidePanelHistoryTitle();
		}
		showPanelDetail() {
			//this.panel.collapsibleDetail.open();
			$('.panel_y_detail>li').addClass('active');
			$('.panel_y_detail>li>.collapsible-body').show();
		}
		hidePanelDetail() {
			//this.panel.collapsibleDetail.close();
			$('.panel_y_detail>li').removeClass('active');
			$('.panel_y_detail>li>.collapsible-body').show();
		}
		// Button Open
		//----------------------------------------------------------------------------------------------------------------------
		buttonOpen(options) {
			const that = this;
			let label = typeof (options.label) !== 'undefined' ? options.label : yStr('open');
			let callback = typeof (options.callback) !== 'undefined' ? options.callback : function () { };
			let icon = typeof (options.icon) !== 'undefined' ? options.icon : 'folder_open';
			let id = typeof (options.id) !== 'undefined' ? options.id : 'button-open-record';
			let button = this.panel.addButton({
				icon: icon,
				label: label,
				id: id
			});
			this.panel.command($(this.wrapper), '#' + button, function () {
				that.hideButtonSubmit();
				that.resetMaster();
				that.enableMasterInput(that.mainField);
				$('#button-clone-record').hide();
				$('#input_' + that.mainField).focus();
				that.showPanelMaster();
				callback();
			});
		}
		createButtonOpen(label, callback) {
			this.buttonOpen({
				label: label,
				callback: callback
			});
		}
		create_button_open(label, callback) {
			this.createButtonOpen(label, callback);
		}
		// Button Edit
		//----------------------------------------------------------------------------------------------------------------------
		create_button_edit(label, clear_detail, callback) {
			callback = elvis(callback, function () { });
			label = typeof label !== 'undefined' ? label : 'Edit Record';
			clear_detail = typeof clear_detail !== 'undefined' ? clear_detail : false;
			const that = this;
			let button = this.panel.addButton({
				icon: 'edit',
				label: label,
				id: 'button-edit-record'
			});
			this.panel.command($(this.wrapper), '#' + button, function () {
				that.hideButtonSubmit();
				that.resetMaster();
				that.enableMasterInput(that.mainField);
				$('#button-clone-record').hide();
				$('#input_' + that.mainField).focus();
				if (clear_detail) {
					that.resetDetail();
				}
				that.showPanelMaster();
				callback();
			});
		}
		showMaster(callback) {
			callback = elvis(callback, function () { });
			this.hideButtonSubmit();
			this.resetMaster(callback);
			this.enableMasterInput(this.mainField);
			$('#input_' + this.mainField).focus();
			this.showPanelMaster();
		}
		// Button Clone
		//----------------------------------------------------------------------------------------------------------------------
		createButtonClone(label, callback) {
			callback = elvis(callback, function () { });
			label = typeof label !== 'undefined' ? label : yStr('recordClone');
			let button = this.panel.addButton({
				icon: 'content_copy',
				label: label,
				id: 'button-clone-record',
				class: 'button-clone'
			});
			this.listenerButtonClone('#' + button, callback);
		}
		create_button_clone(label, callback) {
			this.createButtonClone(label, callback);
		}
		listenerButtonClone(selector, callback) {
			const that = this;
			callback = elvis(callback, function () { });
			this.panel.command($(this.wrapper), selector, function () {
				let input = '#input_';
				that.showButtonSubmit();
				$('.label_info').text('');
				if (typeof that.keyField !== 'undefined' && that.keyField) {
					if (that.keyFieldType != 'input') {
						$('#label_info_' + that.keyField).text('');
					} else {
						$(input + that.keyField).val('');
					}
				}
				if (typeof that.keyFieldType !== 'undefined') {
					if (that.keyFieldType != 'input') {
						$(input + that.keyField).select();
						$(input + that.keyField).focus();
					} else {
						$(input + that.mainField).select();
						$(input + that.mainField).focus();
					}
				}
				that.unselect_detail();
				callback();
			});
		}
		// Button Action
		//----------------------------------------------------------------------------------------------------------------------
		// Create button action and add callback
		create_button_action(param, label, type, callback) {
			param = elvis(param, '');
			type = elvis(type, 'submit');
			label = elvis(label, 'action');
			let button = this.panel.create_button(type, label, 'action_' + param);
			this.panel.command($(this.wrapper), button, function () {
				callback();
			});
		}
		createButtonParam(param, label, type) {
			param = elvis(param, '');
			label = elvis(label, param);
			type = elvis(type, 'submit');
			const that = this;
			let button = this.panel.create_button(type, label, 'query_record_' + param);
			this.panel.command($(this.wrapper), button, function () {
				that.listenerButtonParam(param);
			});
		}
		create_button_param(param, label, type) { this.createButtonParam(param, label, type); }
		listenerButtonParam(param) {
			const that = this;
			let key = this.serializeInput(this.idForm);
			key += '&param=' + param;
			const callback = elvis(callback, function (data) {
				if (typeof data.detail !== 'undefined') {
					$(that.detail).html('');
					that.data.detail = data.detail;
					that.writeTable('detail');
				}
				if (typeof data.history !== 'undefined') {
					$(that.history).html('');
					that.data.history = data.history;
					that.writeTable('history');
				}
			});
			postAjax(that.queryUrl + 'get', key, callback);
		}
		serializeInput(selector) {
			return $(selector + ' :input:not(.input-filter-readonly):not(.unserialize)').serialize();
		}
		serializeInputAsArray(selector) {
			return $(selector + ' :input:not(.input-filter-readonly):not(.unserialize)').serializeArray();
		}
		serializeInputExcludeFilter(selector) {
			return $(selector + ' :input:not(.input-filter):not(.input-filter-readonly):not(.unserialize)').serialize();
		}
		serializeInputAsArrayExcludeFilter(selector) {
			return $(selector + ' :input:not(.input-filter):not(.input-filter-readonly):not(.unserialize)').serializeArray();
		}
		serializeInputFilter(table) {
			return $(`input.input-filter-${table}`).serialize()
		}
		serializeInputFilterAsArray(table) {
			return $(`input.input-filter-${table}`).serializeArray()
		}

		// Materialize Icon
		getButtonIcon(obj) {
			// get current icon name from object obj
			// obj can be #id or .class of button
			return $(obj).children('i').html()
		}
		setButtonIcon(obj, icon) {
			// set icon on object obj
			// obj can be #id or .class of button
			// icon is string of icon name
			return $(obj).children('i').html(icon)
		}
		getButtonIconFontAwesome(obj) {
			// get current icon name from object obj
			// obj can be #id or .class of button
			return $(obj).children('i').html()
		}
		toggleButtonCheck(obj, checkIcon, uncheckIcon) {
			const current = this.getButtonIcon(obj)
			checkIcon = typeof checkIcon !== 'undefined' ? checkIcon : 'check_circle'
			uncheckIcon = typeof uncheckIcon !== 'undefined' ? uncheckIcon : 'radio_button_unchecked'
			if (current == uncheckIcon) {
				this.setButtonIcon(obj, checkIcon);
			}
			else {
				this.setButtonIcon(obj, uncheckIcon);
			}
		}
		// Button Remove
		// add buttonRemove: true in field[table] options
		// example 
		// this.field.table_name = [
		//	 {name: 'id'},
		//	 ...
		//	 {name: 'delete', label: 'Delete Row', buttonRemove: true },
		// ]
		// Custom icon remove
		// add icon in {name: 'delete', label: 'Delete Row', buttonRemove: true, icon: 'archive' },
		// and set iconRemove in options
		listenerButtonRemoveRow(options, callbackRow, callbackHeader) {
			const that = this
			let table
			let iconRemove = 'delete'
			const iconCheckHeader = 'check'
			const iconCheckRow = 'check_circle'
			const iconUncheckRow = 'radio_button_unchecked'
			let messageDelete = 'Apakah anda yakin akan menghapus?'
			let messageDeleteMultiple = 'Apakah anda yakin akan menghapus baris terpilih?'
			let messageBack = 'Kembali'
			let messageBackCancel = 'Kembali dan batalkan'
			// let messageBackSelect = 'Kembali memilih lainnya'
			let messageDeleteConfirmation = 'Ya'

			if (typeof options !== 'undefined' && typeof options === 'function') {
				callbackRow = typeof options !== 'undefined' ? options : () => { }
				table = ''
				callbackHeader = typeof callbackHeader !== 'undefined' ? callbackHeader : () => { }
			}
			else if (typeof options !== 'undefined' && typeof options === 'object') {
				table = typeof options.table !== 'undefined' ? options.table : ''
				callbackRow = typeof options.callbackRow !== 'undefined' ? options.callbackRow : () => { }
				callbackHeader = typeof options.callbackHeader !== 'undefined' ? options.callbackHeader : () => { }
				iconRemove = typeof options.iconRemove !== 'undefined' ? options.iconRemove : iconRemove
				messageDelete = typeof options.messageDelete !== 'undefined' ? options.messageDelete : messageDelete
				messageDeleteMultiple = typeof options.messageDeleteMultiple !== 'undefined' ? options.messageDeleteMultiple : messageDeleteMultiple
				messageBack = typeof options.messageBack !== 'undefined' ? options.messageBack : messageBack
				messageBackCancel = typeof options.messageBackCancel !== 'undefined' ? options.messageBackCancel : messageBackCancel
				// messageBackSelect = typeof options.messageBackSelect !== 'undefined' ? options.messageBackSelect : messageBackSelect
				messageDeleteConfirmation = typeof options.messageDeleteConfirmation !== 'undefined' ? options.messageDeleteConfirmation : messageDeleteConfirmation
			}
			else {
				table = typeof options !== 'undefined' ? options : ''
				callbackRow = typeof callbackRow !== 'undefined' ? callbackRow : () => { }
				callbackHeader = typeof callbackHeader !== 'undefined' ? callbackHeader : () => { }
			}
			const suffix = table != '' ? `-${table}` : ''
			const classRowAllTable = `.btn-remove-row`
			const classRow = `.btn-remove-row${suffix}`
			const classHeaderAllTable = `.btn-remove-row-header`
			const classHeader = `.btn-remove-row-header${suffix}`

			const guid = this.panel.guid()
			const idConfirmRemove = '#btn-confirm-remove-row-' + guid
			const idCancelRemove = '#btn-cancel-remove-row-' + guid
			const idCancelClear = '#btn-cancel-remove-and-clear-row-' + guid
			const toastRemoveSingleRow =
				yM.span({
					class: 'span-toast',
					content: messageDelete
				}) +
				yM.buttonFlat({
					id: idCancelRemove.substring(1),
					class: 'toast-action',
					content: messageBack
				}) +
				yM.buttonFlat({
					id: idConfirmRemove.substring(1),
					class: 'toast-action-delete-confirm',
					content: messageDeleteConfirmation
				})

			const toastRemoveMultipleRow =
				yM.span({
					class: 'span-toast',
					content: messageDeleteMultiple
				}) +
				yM.buttonFlat({
					id: idCancelClear.substring(1),
					class: 'toast-action',
					content: messageBackCancel
				}) +
				// yM.buttonFlat({
				// 	id: idCancelRemove.substring(1),
				// 	class: 'toast-action',
				// 	content: messageBackSelect
				// }) +
				yM.buttonFlat({
					id: idConfirmRemove.substring(1),
					class: 'toast-action-delete-confirm',
					content: messageDeleteConfirmation
				})

			const removeSingleRow = function (obj, fromMultiple) {
				fromMultiple = typeof fromMultiple !== 'undefined' ? fromMultiple : false
				let row = $(obj).closest('tr')
				let rowIndex = row.index()
				let table = $(obj).attr('data')
				let trObj = $(obj).closest('tr')
				if ($(trObj).is(':last-child')) {
					$('.panel-info-button-add-' + table).click();
				}
				$(trObj).remove()
				callbackRow(obj, classRow, fromMultiple, rowIndex)
				return rowIndex
			}
			const removeMultipleRows = function (objButtonHeader, table) {
				let rowIndex = []
				let i = 0
				$('.btn-remove-row-' + table).each(function () {
					const currentRowIcon = that.getButtonIcon(this)
					if (currentRowIcon == iconCheckRow) {
						rowIndex[i] = $(this).closest('tr').index();
						i++
					}
				})
				$('.btn-remove-row-' + table).each(function () {
					const currentRowIcon = that.getButtonIcon(this)
					if (currentRowIcon == iconCheckRow) {
						removeSingleRow(this, true)
					}
				})
				callbackHeader(objButtonHeader, classRow, rowIndex)
				return rowIndex
			}

			const returnToDeleteSingleRow = function (obj, table) {
				// Header
				that.setButtonIcon(obj, iconCheckHeader)
				// Rows
				$('.btn-remove-row-' + table).each(function () {
					that.setButtonIcon(this, iconRemove)
				});
			};

			// listener button row
			if (table != '') {
				$(this.wrapper).off('click', classRowAllTable)
			}

			$(this.wrapper).off('click', classRow)
			$(this.wrapper).on('click', classRow, function (event) {
				const buttonObj = this
				event = event || window.event
				event.preventDefault()
				event.stopPropagation()
				const table = $(this).attr('data')
				const currentRowIcon = that.getButtonIcon(this);
				if (currentRowIcon == iconRemove) {
					M.toast({
						html: toastRemoveSingleRow,
						displayLength: 10000
					})
					$(idCancelRemove).off('click');
					$(idCancelRemove).on('click', function () {
						const inst = M.Toast.getInstance($(this).parent());
						inst.dismiss()
					})
					$(idConfirmRemove).off('click')
					$(idConfirmRemove).on('click', function () {
						const inst = M.Toast.getInstance($(this).parent())
						inst.dismiss()
						const index = removeSingleRow(buttonObj)
						that.resetTableNumber(table)
						that.showTableInfo(table)
					})
				}
				else {
					that.toggleButtonCheck(this)
				}
			})

			// listener header
			if (table != '') {
				$(this.wrapper).off('click', classHeaderAllTable)
			}
			$(this.wrapper).off('click', classHeader);
			$(this.wrapper).on('click', classHeader, function (event) {
				let objButtonHeader = this

				event = event || window.event
				event.preventDefault()
				const currentHeaderIcon = that.getButtonIcon(this)
				const table = $(this).attr('data')
				const classRowTable = '.btn-remove-row-' + table
				if (event.shiftKey) {
					if (currentHeaderIcon == iconRemove) {
						// Header
						that.setButtonIcon(this, iconCheckHeader)
						// Rows
						$(classRowTable).each(function () {
							that.setButtonIcon(this, iconRemove)
						})
					}
					else {
						// Header
						that.setButtonIcon(this, iconRemove)
						// Rows
						$(classRowTable).each(function () {
							that.setButtonIcon(this, iconUncheckRow)
						})
					}
				}
				else {
					if (currentHeaderIcon == iconCheckHeader) {
						// multiple mode
						// Header
						that.setButtonIcon(this, iconRemove)
						// Rows
						$(classRowTable).each(function () {
							that.setButtonIcon(this, iconCheckRow)
						})
					}
					else {
						let noOfRowToBeDeleted = 0
						$(classRowTable).each(function () {
							if (that.getButtonIcon(this) != iconUncheckRow) {
								noOfRowToBeDeleted++
							}
						})
						if (noOfRowToBeDeleted > 0) {
							M.toast({
								html: toastRemoveMultipleRow,
								displayLength: 10000
							})
							$(idCancelClear).off('click');
							$(idCancelClear).on('click', function () {
								const inst = M.Toast.getInstance($(this).parent())
								inst.dismiss();
								returnToDeleteSingleRow(objButtonHeader, table)
							})
							$(idCancelRemove).off('click')
							$(idCancelRemove).on('click', function () {
								const inst = M.Toast.getInstance($(this).parent())
								inst.dismiss()
							})
							$(idConfirmRemove).off('click');
							$(idConfirmRemove).on('click', function () {
								const inst = M.Toast.getInstance($(this).parent())
								inst.dismiss();
								const index = removeMultipleRows(objButtonHeader, table)
								let message = '#'
								for (let i in index) {
									if (message !== '#') {
										message += ', #'
									}
									message += (index[i] + 1)
								}
								that.recordInfo(table, '')
								that.resetTableNumber(table)
								that.showTableInfo(table)
								returnToDeleteSingleRow(objButtonHeader, table)
							})
						}
						else {
							returnToDeleteSingleRow(objButtonHeader, table)
						}
					}
				}
			})
		}

		// Button Print
		// add buttonPrint: true in field[table] options
		// example 
		// this.field.table_name = [
		//	 {name: 'id'},
		//	 ...
		//	 {name: 'print', buttonPrint: true },
		// ]
		// Define options
		// options = {
		//	 table: 'table_name'
		//   callbackRow: (obj) => {
		//       ...
		//   },
		//   callbackHeader: (obj, classRow) => { 
		//     $(classRow).each( function () { 
		//		 ...
		//     })
		//   }
		// }
		listenerButtonPrint(options, field, callbackRow, callbackHeader) {
			const that = this
			let table
			if (typeof options !== 'undefined' && typeof options === 'object') {
				table = typeof options.table !== 'undefined' ? options.table : ''
				field = typeof options.field !== 'undefined' ? options.field : ''
				callbackRow = typeof options.callbackRow !== 'undefined' ? options.callbackRow : () => { }
				callbackHeader = typeof options.callbackHeader !== 'undefined' ? options.callbackHeader : () => { }
			}
			else {
				table = typeof options !== 'undefined' ? options : ''
				field = typeof field !== 'undefined' ? field : ''
				callbackRow = typeof callbackRow !== 'undefined' ? callbackRow : () => { }
				callbackHeader = typeof callbackHeader !== 'undefined' ? callbackHeader : () => { }
			}
			const suffix = table != '' ? field != '' ? `-${table}-${field}` : `-${table}` : ''
			const classRow = `.btn-print-row${suffix}`
			const classHeader = `.btn-print-row-header${suffix}`

			//Icon
			const iconCheckHeader = 'check'
			const iconPrint = 'print'
			const iconCheckRow = 'check_circle'
			const iconUncheckRow = 'radio_button_unchecked'

			// listener button row
			$(this.wrapper).off('click', classRow);
			$(this.wrapper).on('click', classRow, function (event) {
				event = event || window.event
				event.preventDefault()
				// Row
				let currentRowIcon = that.getButtonIcon(this)
				if (currentRowIcon == iconPrint) {
					callbackRow(this, classRow)
				}
				else {
					// Row
					that.toggleButtonCheck(this, iconCheckRow, iconUncheckRow)
				}
			})

			// listener header
			$(this.wrapper).off('click', classHeader)
			$(this.wrapper).on('click', classHeader, function (event) {
				event = event || window.event
				event.preventDefault()
				const currentHeaderIcon = that.getButtonIcon(this)
				table = table != '' ? table : $(this).attr('data')
				if (event.shiftKey) {
					if (currentHeaderIcon == iconPrint) {
						// Header
						that.setButtonIcon(this, iconCheckHeader)
						// Rows
						$('.btn-print-row-' + table).each(function () {
							that.setButtonIcon(this, iconPrint);
						})
					}
					else {
						// Header
						that.setButtonIcon(this, iconPrint)
						// Rows
						$('.btn-print-row-' + table).each(function () {
							that.setButtonIcon(this, iconUncheckRow);
						})
					}
				}
				else {
					if (currentHeaderIcon == iconCheckHeader) {
						// Header
						that.setButtonIcon(this, iconPrint)
						// Rows
						$('.btn-print-row-' + table).each(function () {
							that.setButtonIcon(this, iconCheckRow);
						})
					}
					else {
						let noOfRowToBePrinted = 0;
						$('.btn-print-row-' + table).each(function () {
							if (that.getButtonIcon(this) != iconUncheckRow) {
								noOfRowToBePrinted++;
							}
						})
						if (noOfRowToBePrinted > 0) {
							callbackHeader(this, classRow)
						}
						else {
							// Header
							that.setButtonIcon(obj, iconCheckHeader)
							// Rows
							$('.btn-print-row-' + table).each(function () {
								that.setButtonIcon(this, iconPrint);
							})
						}

					}
				}
			})
		}

		// Button Check
		// add buttonCheck: true in field[table] options
		// example 
		// this.field.table_name = [
		//	 {name: 'id'},
		//	 ...
		//	 {name: 'print', buttonCheck: true },
		// ]
		// Define options
		// options = {
		//	 table: 'table_name'
		//   callbackRow: (obj) => {
		//       ...
		//   },
		//   callbackRowCheck: (obj) => {
		//       ...
		//   },
		//   callbackRowUncheck: (obj) => {
		//       ...
		//   },
		//   callbackHeader: (obj, classRow) => { 
		//     $(classrow).each( function () { 
		//		 ...
		//     })
		//   }
		// }
		listenerButtonCheck(options, field, callbackRow, callbackRowCheck, callbackRowUncheck, callbackHeader) {
			const that = this
			let table
			if (typeof options !== 'undefined' && typeof options === 'object') {
				table = typeof options.table !== 'undefined' ? options.table : ''
				field = typeof options.field !== 'undefined' ? options.field : ''
				callbackRow = typeof options.callbackRow !== 'undefined' ? options.callbackRow : () => { }
				callbackRowCheck = typeof options.callbackRowCheck !== 'undefined' ? options.callbackRowCheck : () => { }
				callbackRowUncheck = typeof options.callbackRowUncheck !== 'undefined' ? options.callbackRowUncheck : () => { }
				callbackHeader = typeof options.callbackHeader !== 'undefined' ? options.callbackHeader : () => { }
			}
			else {
				table = typeof options !== 'undefined' ? options : ''
				field = typeof field !== 'undefined' ? field : ''
				callbackRow = typeof callbackRow !== 'undefined' ? callbackRow : () => { }
				callbackRowCheck = typeof callbackRowCheck !== 'undefined' ? callbackRowCheck : () => { }
				callbackRowUncheck = typeof callbackRowUncheck !== 'undefined' ? callbackRowUncheck : () => { }
				callbackHeader = typeof callbackHeader !== 'undefined' ? callbackHeader : () => { }
			}
			const suffix = table != ''
				? field != ''
					? `-${table}-${field}`
					: `-${table}`
				: ''
			const classRow = `.btn-check-row${suffix}`
			const classHeader = `.btn-check-row-header${suffix}`

			//Icon
			const iconCheckRow = 'check_circle'
			const iconUncheckRow = 'radio_button_unchecked'

			// listener button row
			$(this.wrapper).off('click', classRow);
			$(this.wrapper).on('click', classRow, function (event) {
				event = event || window.event
				event.preventDefault()
				const fromMultiple = false
				// Row
				let currentRowIcon = that.getButtonIcon(this)
				callbackRow(this, classRow, currentRowIcon, fromMultiple)
				if (currentRowIcon != iconCheckRow) {
					callbackRowCheck(this, classRow, fromMultiple)
				}
				else {
					callbackRowUncheck(this, classRow, fromMultiple)
				}
				that.toggleButtonCheck(this, iconCheckRow, iconUncheckRow)
			})

			// listener header
			$(this.wrapper).off('click', classHeader)
			$(this.wrapper).on('click', classHeader, function (event) {
				event = event || window.event
				event.preventDefault()
				const fromMultiple = true
				table = table != '' ? table : $(this).attr('data')
				const listChanged = []
				const listChecked = []
				const listUnchecked = []
				if (event.shiftKey) {
					// Unselect all rows
					$('.btn-check-row' + suffix).each(function () {
						const currentRowIcon = that.getButtonIcon(this)
						callbackRow(this, classRow, currentRowIcon, fromMultiple)
						if (currentRowIcon != iconUncheckRow) {
							that.setButtonIcon(this, iconUncheckRow)
							callbackRowUncheck(this, classRow, fromMultiple)
							listChanged.push(this)
							listUnchecked.push(this)
						}
					})
				}
				else {
					// Check all rows
					$('.btn-check-row' + suffix).each(function () {
						const currentRowIcon = that.getButtonIcon(this)
						callbackRow(this, classRow, currentRowIcon, fromMultiple)
						if (currentRowIcon != iconCheckRow) {
							that.setButtonIcon(this, iconCheckRow)
							callbackRowCheck(this, classRow, fromMultiple)
							listChanged.push(this)
							listChecked.push(this)
						}
					})
				}
				const list = {
					classRow: classRow,
					changed: listChanged,
					checked: listChecked,
					unchecked: listUnchecked
				}
				callbackHeader(this, list)
			})
		}

		// Checkbox (Select)
		// add checkbox: true in field[table] options
		// example 
		// this.field.table_name = [
		//	 {name: 'id'},
		//	 ...
		//	 {name: 'select', label: 'Select Row', checkbox: true },
		// ]
		listenerCheckbox(options, callback, callbackCheck, callbackUncheck, callbackHeader) {
			const that = this
			let table
			if (typeof options !== 'undefined' && typeof options === 'object') {
				table = typeof options.table !== 'undefined' ? options.table : ''
				field = typeof options.field !== 'undefined' ? options.field : ''
				callback = typeof options.callback !== 'undefined' ? options.callback : function () { }
				callbackCheck = typeof options.callbackCheck !== 'undefined' ? options.callbackCheck : function () { }
				callbackUncheck = typeof options.callbackUncheck !== 'undefined' ? options.callbackUncheck : function () { }
				callbackHeader = typeof options.callbackHeader !== 'undefined' ? options.callbackHeader : function () { }
			}
			else {
				table = typeof options !== 'undefined' ? options : ''
				field = typeof field !== 'undefined' ? field : ''
				callback = typeof callback !== 'undefined' ? callback : function () { }
				callbackCheck = typeof callbackCheck !== 'undefined' ? callbackCheck : function () { }
				callbackUncheck = typeof callbackUncheck !== 'undefined' ? callbackUncheck : function () { }
				callbackHeader = typeof callbackHeader !== 'undefined' ? callbackHeader : function () { }
			}

			// listener button row
			const classRow = `.checkbox-${table}-${field}`
			const classHeader = `.header-${table}-${field}`
			$(this.wrapper).off('click', classRow);
			$(this.wrapper).on('click', classRow, function (event) {
				event = event || window.event
				event.preventDefault()
				const valprop = $(this).prop("checked")
				if (valprop) {
					// check
					callbackCheck(this)
				}
				else {
					// uncheck
					callbackUncheck(this)
				}
				callback(this)
			})

			// listener header
			$(this.wrapper).off('click', classHeader);
			$(this.wrapper).on('click', classHeader, function (event) {
				event = event || window.event;
				event.preventDefault()
				callbackHeader(this)
			})
		}
		// Button Download CSV
		//----------------------------------------------------------------------------------------------------------------------
		buttonDownloadCsv(name) {
			const that = this;
			name = typeof name !== 'undefined' ? name : 'download';
			let buttonEng = this.panel.create_button('download', 'csv', 'csv_english');
			this.panel.command(this.wrapper, buttonEng, function () {
				let filename = name + '.csv';
				downloadCsv(that.field.detail, that.data.detail, filename);
			});
			let buttonInd = this.panel.create_button('download', 'csv indonesia', 'csv_indonesia');
			this.panel.command(this.wrapper, buttonInd, function () {
				let filename = name + '.csv';
				downloadCsv(that.field.detail, that.data.detail, filename, 'indonesia');
			});
		}
		// Button Download XLS
		//----------------------------------------------------------------------------------------------------------------------
		buttonDownloadXls(obj, name) {
			const that = this;
			name = typeof name !== 'undefined' ? name : 'download';
			let buttonXls = this.panel.create_button('download', 'xls', name);
			this.panel.command(this.wrapper, buttonXls, function () {
				let key = that.serializeInput(obj.idForm);
				window.open(obj.queryUrl + 'get_xls_' + name + '?' + key);
			});
		}
		// Button Read Files
		//----------------------------------------------------------------------------------------------------------------------
		createButtonReader(param) {
			const that = this;
			const fileType = typeof param !== 'undefined' && param.fileType !== 'undefined' ? param.fileType : 'csv';
			const buttonLabel = typeof param !== 'undefined' && param.buttonLabel !== 'undefined' ? param.buttonLabel : 'Read CSV';
			const table = typeof param !== 'undefined' && param.table !== 'undefined' ? param.table : 'query_record_read';
			let accept = '';
			switch (fileType) {
				case 'csv':
					accept = '.csv';
					break;
				case 'csv2':
					accept = '.csv';
					break;
				case 'tsv':
					accept = '.tsv, .txt';
					break;
				case 'xls':
					accept = '.xls, .xlsx';
					break;
				case 'xlsx':
					accept = '.xlsx';
					break;
			}
			const button = this.panel.createButtonFile('open', buttonLabel, table + '_' + fileType, accept);
			$(button).change(function () {
				switch (fileType) {
					case 'csv':
						that.readFileText('csv', param);
						break;
					case 'csv2':
						that.readFileText('csv2', param);
						break;
					case 'tsv':
						that.readFileText('tsv', param);
						break;
					case 'txt':
						that.readFileText('tsv', param);
						break;
					case 'xls':
						that.readFileText('xls', param);
						break;
					case 'xlsx':
						that.readFileText('xlsx', param);
						break;
				}
			});
		}
		shortcutFileTable(table, fileType, titleDownload, titleUpload) {
			fileType = typeof fileType !== 'undefined' ? fileType : 'xls';
			titleDownload = typeof titleDownload !== 'undefined' ? titleDownload : 'Download';
			titleUpload = typeof titleUpload !== 'undefined' ? titleUpload : 'Upload';
			const classButton = 'waves-effect waves-light btn btn-flat btn-small ';
			return [
				{ name: `download_${table}_${fileType}`, content: titleDownload, icon: 'cloud_download', class: classButton + `btn-download-${fileType}-${table}` },
				{ name: `upload_${table}_${fileType}`, content: titleUpload, icon: 'cloud_upload', class: classButton + `btn-upload-${fileType}-${table}` },
			];
		}
		shortcutFileTableDownload(table, fileType, titleDownload) {
			fileType = typeof fileType !== 'undefined' ? fileType : 'xls';
			titleDownload = typeof titleDownload !== 'undefined' ? titleDownload : 'Download';
			const classButton = 'waves-effect waves-light btn btn-flat btn-small ';
			return [
				{ name: `download_${table}_${fileType}`, content: titleDownload, icon: 'cloud_download', class: classButton + `btn-download-${fileType}-${table}` }
			];
		}
		setButtonUploadShortcut(table, fileType) {
			$(this.wrapper).off('click', `.btn-upload-${fileType}-${table}`);
			$(this.wrapper).on('click', `.btn-upload-${fileType}-${table}`, function (e) {
				e.preventDefault();
				$(`#button_file_open_${table}_${fileType}`).click();
			});
		}
		// same as create classbutton
		createHeaderButton(param, upload, download, master) {
			upload = typeof showToolbar !== 'undefined' ? upload : true
			download = typeof download !== 'undefined' ? download : true
			master = typeof master !== 'undefined' ? master : true
			let table = 'query_record_read'
			let masterLabel = 'Master'
			let masterIcon = 'system_update_alt'
			let downloadLabel = 'Download'
			let downloadIcon = 'cloud_download'
			let uploadLabel = 'Upload'
			let uploadIcon = 'cloud_upload'
			let fileType = 'xls'
			if (typeof param !== 'undefined' && typeof param === 'object') {
				table = typeof param.table !== 'undefined' ? param.table : table
				upload = typeof param.upload !== 'undefined' ? param.upload : true
				download = typeof param.download !== 'undefined' ? param.download : true
				master = typeof param.master !== 'undefined' ? param.master : true
				masterLabel = typeof param.masterLabel !== 'undefined' ? param.masterLabel : masterLabel
				masterIcon = typeof param.masterIcon !== 'undefined' ? param.masterIcon : masterIcon
				downloadLabel = typeof param.downloadLabel !== 'undefined' ? param.downloadLabel : downloadLabel
				downloadIcon = typeof param.downloadIcon !== 'undefined' ? param.downloadIcon : downloadIcon
				uploadLabel = typeof param.uploadLabel !== 'undefined' ? param.uploadLabel : uploadLabel
				uploadIcon = typeof param.uploadIcon !== 'undefined' ? param.uploadIcon : uploadIcon
				fileType = typeof param.fileType !== 'undefined' ? param.fileType : fileType
			}
			else {
				table = typeof param !== 'undefined' ? param : table
			}
			const classButton = 'waves-effect waves-light btn btn-flat btn-small '
			const headerButton = []
			if (master) {
				headerButton.push({
					name: `download_master_${fileType}_${table}`,
					content: masterLabel,
					icon: masterIcon,
					class: classButton + `btn-master-download-${fileType}-${table}`
				})
			}
			if (download) {
				headerButton.push({
					name: `download_${fileType}_${table}`,
					content: downloadLabel,
					icon: downloadIcon,
					class: classButton + `btn-download-${fileType}-${table}`
				})
			}
			if (upload) {
				headerButton.push({
					name: `upload_${fileType}_${table}`,
					content: uploadLabel,
					icon: uploadIcon,
					class: classButton + `btn-upload-${fileType}-${table}`
				})
			}
			return headerButton
		}
		setFileDownload(param, fileType, fileName, sheetName) {
			let table = 'query_record_read'
			fileType = typeof fileType !== 'undefined' ? fileType : 'xls'
			if (typeof param !== 'undefined' && typeof param === 'object') {
				table = typeof param.table !== 'undefined' ? param.table : table
				fileType = typeof param.fileType !== 'undefined' ? param.fileType : fileType
				fileName = typeof param.fileName !== 'undefined' ? param.fileName : table
				sheetName = typeof param.sheetName !== 'undefined' ? param.sheetName : table
			}
			else {
				table = typeof param !== 'undefined' ? param : table
				fileName = typeof fileName !== 'undefined' ? fileName : table
				sheetName = typeof sheetName !== 'undefined' ? sheetName : table
			}
			$(`.btn-download-${fileType}-${table}`).attr('data-filename', fileName)
			$(`.btn-download-${fileType}-${table}`).attr('data-sheetname', sheetName)
			$(`.btn-download-${fileType}-${table}`).attr('data-filetype', fileType)
		}
		listenerSetButtonDownloadUpload(param, fileType, fileName, sheetName, showToolbar, withShortcut) {
			fileType = typeof fileType !== 'undefined' ? fileType : 'xls'
			showToolbar = typeof showToolbar !== 'undefined' ? showToolbar : false
			withShortcut = typeof withShortcut !== 'undefined' ? withShortcut : true
			let table = 'query_record_read'
			if (typeof param !== 'undefined' && typeof param === 'object') {
				table = typeof param.table !== 'undefined' ? param.table : table
				fileType = typeof param.fileType !== 'undefined' ? param.fileType : fileType
				showToolbar = typeof param.showToolbar !== 'undefined' ? param.showToolbar : showToolbar
				withShortcut = typeof param.withShortcut !== 'undefined' ? param.withShortcut : withShortcut
				fileName = typeof param.fileName !== 'undefined' ? param.fileName : fileName
				sheetName = typeof param.sheetName !== 'undefined' ? param.sheetName : sheetName
			}
			else {
				table = typeof param !== 'undefined' ? param : table
				fileName = typeof fileName !== 'undefined' ? fileName : table
				sheetName = typeof sheetName !== 'undefined' ? sheetName : table
			}
			const that = this;
			$(this.wrapper).off('click', `.btn-download-${fileType}-${table}`)
			$(this.wrapper).on('click', `.btn-download-${fileType}-${table}`, function (e) {
				e.preventDefault()
				const dataFileName = $(this).attr('data-filename')
				const dataSheetName = $(this).attr('data-sheetname')
				const dataFiletype = $(this).attr('data-filetype')
				fileName = typeof dataFileName !== 'undefined' ? dataFileName : fileName
				sheetName = typeof dataSheetName !== 'undefined' ? dataSheetName : sheetName
				fileType = typeof dataFiletype !== 'undefined' ? dataFiletype : fileType
				switch (fileType) {
					case 'xls':
						that.getXls(table, fileName, sheetName)
						break;
					case 'xlsx':
						that.getXlsx(table, fileName, sheetName)
				}
			});
			$(this.wrapper).off('click', `.btn-master-download-${fileType}-${table}`);
			$(this.wrapper).on('click', `.btn-master-download-${fileType}-${table}`, function (e) {
				e.preventDefault();
				const url = `${that.queryUrl}get_download_master_${table}`;
				window.open(url);
			});
			this.createButtonReader({
				fileType: fileType,
				buttonLabel: 'Read Excel File',
				field: this.field[table],
				table: table,
				useLabel: true
			});
			if (!showToolbar) {
				$(`#button_open_${table}_${fileType}`).parent().hide();
			}
			$(this.wrapper).off('click', `.btn-upload-${fileType}-${table}`);
			$(this.wrapper).on('click', `.btn-upload-${fileType}-${table}`, function (e) {
				e.preventDefault();
				$(`#button_open_${table}_${fileType}`).click();
			});

			if (withShortcut) {
				this.setButtonUploadShortcut(table, fileType);
			}
		}
		readFileText(fileType, param) {
			const that = this;
			const table = typeof param.table !== 'undefined' ? param.table : 'detail';
			const name = typeof param.table !== 'undefined' ? param.table : 'query_record_read';
			const complete = typeof param.complete !== 'undefined' && param.complete === 'function' ? param.complete : function () { };
			const field = typeof param.field !== 'undefined' ? param.field : false;
			const useLabel = typeof param.useLabel !== 'undefined' ? param.useLabel : false;
			const noHeader = typeof param.noHeader !== 'undefined' ? param.noHeader : false;
			const skipHeader = typeof param.skipHeader !== 'undefined' ? param.skipHeader : false;
			const lockMinRow = typeof param.lockMinRow !== 'undefined' ? param.lockMinRow : false;
			const lockMaxRow = typeof param.lockMaxRow !== 'undefined' ? param.lockMaxRow : false;
			const key = typeof param.key !== 'undefined' ? param.key : false;
			const fileInput = document.getElementById('button_file_open_' + name + '_' + fileType);
			const formData = new FormData();
			formData.append(fileType + "_file", fileInput.files[0]);
			this.data = typeof this.data !== 'undefined' ? this.data : {};
			this.data[table] = typeof this.data[table] !== 'undefined' ? this.data[table] : [];
			const noRows = that.data[table].length;
			const valArray = that.data[table].map(v => {
				if (typeof v[key] !== 'undefined') {
					return v[key] || '';
				}
			});
			const success = function (res) {
				that.resetTable(table);
				const noRes = res.length;
				const isOver = lockMaxRow && noRes > noRows;
				const isShort = lockMinRow && noRes < noRows;
				that.data[table] = {};
				if (!useLabel) {
					that.data[table] = res;
				}
				else if (field) {
					let resName = [];
					if (useLabel) {
						resName = res.map(v => {
							const obj = {};
							field.forEach(w => {
								const name = w.name;
								const label = w.label;
								obj[name] = v[label];
							});
							return obj;
						});
					}
					else if (noHeader) {
						resName = res.map(v => {
							const obj = {};
							field.forEach(w, i => {
								const name = w.name;
								obj[name] = v[i];
							});
							return obj;
						});
					}
					else if (skipHeader) {
						for (let i in res) {
							if (i != 0) {
								resName[i - 1] = {};
								for (let j in field) {
									const name = field[j].name;
									let stringRes = res[i][j];
									const dateFormat = typeof field[j].date !== 'undefined' ? field[j].date : false;
									if (dateFormat) {
										stringRes = y_datetime_convert(stringRes, dateFormat);
									}
									resName[i - 1][name] = stringRes;
								}
							}
						}
					}
					if (isOver) {
						resName = resName.slice(0, noRows);
					}
					if (isShort) {
						for (let i = 0; i < noRows - noRes; i++) {
							resName.push({});
						}
					}
					if (key && valArray.length > 0) {
						resName.forEach((v, i, arr) => {
							arr[i][key] = valArray[i] || '';
						});
					}
					that.data[table] = resName;
				}
				that.writeTable(table);
				fileInput.value = '';
				//fileInput.files = []
			};
			const url = noHeader ? 'get_' + fileType + '_file_no_header' : 'C_home/get_' + fileType + '_file';
			fileAjax(url, formData, success, complete);
		}
		// Handle legacy function
		buttonReadCsv(complete, obj, option, table) {
			complete = typeof complete !== 'undefined' ? complete : function () { };
			table = typeof table !== 'undefined' ? table : 'detail';
			const field = typeof obj !== 'undefined' && typeof obj.field !== 'undefined' && typeof obj.field[table] ? obj.field[table] : false;
			const useLabel = typeof option !== 'undefined' && option === 'label' ? true : false;
			const noHeader = typeof option !== 'undefined' && option === 'noheader' ? true : false;
			const skipHeader = typeof option !== 'undefined' && option === 'skipheader' ? true : false;
			if (noHeader || skipHeader) {
				field = typeof header !== 'undefined' ? header : false;
			}
			const param = {
				fileType: 'csv',
				buttonLabel: 'Read CSV',
				complete: complete,
				table: table,
				field: field,
				useLabel: useLabel,
				noHeader: noHeader,
				skipHeader: skipHeader
			};
			this.createButtonReader(param);
		}
		// Handle legacy function
		buttonReadTsv(complete, obj, option, header, table) {
			complete = typeof complete !== 'undefined' ? complete : function () { };
			table = typeof table !== 'undefined' ? table : 'detail';
			let field = typeof obj !== 'undefined' && typeof obj.field !== 'undefined' && typeof obj.field[table] ? obj.field[table] : false;
			const useLabel = typeof option !== 'undefined' && option === 'label' ? true : false;
			const noHeader = typeof option !== 'undefined' && option === 'noheader' ? true : false;
			const skipHeader = typeof option !== 'undefined' && option === 'skipheader' ? true : false;
			if (noHeader || skipHeader) {
				field = typeof header !== 'undefined' ? header : false;
			}
			const param = {
				fileType: 'tsv',
				buttonLabel: 'Read TSV',
				complete: complete,
				table: table,
				field: field,
				useLabel: useLabel,
				noHeader: noHeader,
				skipHeader: skipHeader
			};
			this.createButtonReader(param);
		}
		// Handle legacy function
		buttonReadXls(complete, obj, option, header) {
			complete = typeof complete !== 'undefined' ? complete : function () { };
			table = typeof table !== 'undefined' ? table : 'detail';
			let field = typeof obj !== 'undefined' && typeof obj.field !== 'undefined' && typeof obj.field[table] ? obj.field[table] : false;
			const useLabel = typeof option !== 'undefined' && option === 'label' ? true : false;
			const noHeader = typeof option !== 'undefined' && option === 'noheader' ? true : false;
			const skipHeader = typeof option !== 'undefined' && option === 'skipheader' ? true : false;
			if (noHeader || skipHeader) {
				field = typeof header !== 'undefined' ? header : false;
			}
			const param = {
				fileType: 'xls',
				buttonLabel: 'Read XLS',
				complete: complete,
				table: table,
				field: field,
				useLabel: useLabel,
				noHeader: noHeader,
				skipHeader: skipHeader
			};
			this.createButtonReader(param);
		}
		// Button Upload CSV
		//----------------------------------------------------------------------------------------------------------------------
		buttonUploadCsv(complete) {
			const that = this;
			complete = typeof complete !== 'undefined' ? complete : function () { };
			complete = typeof complete !== 'function' ? function () { } : complete;
			let button = this.panel.createButtonFile('submit', 'Upload CSV', 'query_record_upload_submit');
			$(button).change(function () {
				that.uploadCsv(complete);
			});
		}
		uploadCsv(complete) {
			const that = this;
			let formData = new FormData();
			let objButtonFile = document.getElementById('button_file_submit_query_record_upload_submit');
			formData.append("csv_file", objButtonFile.files[0]);
			let serialData = this.serializeInput(this.idForm);
			formData.append("data", serialData);
			if (this.mainField) {
				let mainElement = document.getElementsByName(that.mainField)[0];
				if (typeof mainElement !== 'undefined') {
					this.vars.lastMainValue = typeof mainElement.value !== 'undefined' ? mainElement.value : mainElement.innerHTML;
				}
			}
			if (this.keyField) {
				let keyElement = document.getElementsByName(that.keyField)[0];
				if (typeof keyElement !== 'undefined') {
					this.vars.lastKeyValue = typeof keyElement.value !== 'undefined' ? keyElement.value : keyElement.innerHTML;
				}
			}
			let success = function (res) {
				let with_print = false;
				showAjaxResult(res, with_print);
				if (that) {
					that.reset(that.idForm);
				}
				objButtonFile.files = [];
			};
			complete = typeof complete !== 'undefined' ? complete : function () { };
			complete = typeof complete !== 'function' ? function () { } : complete;
			fileAjax(this.queryUrl + 'submit_csv_file', formData, success, complete);
		}
		// Button Upload CSV Write Detail
		//----------------------------------------------------------------------------------------------------------------------
		buttonUploadCsvWriteDetail(complete) {
			const that = this;
			complete = typeof complete !== 'undefined' ? complete : function () { };
			complete = typeof complete !== 'function' ? function () { } : complete;
			let button = this.panel.createButtonFile('submit', yStr('uploadCsv'), 'query_record_upload_submit');
			$(button).change(function () {
				that.uploadCsvWriteDetail(complete);
			});
		}
		uploadCsvWriteDetail(complete) {
			const that = this;
			let formData = new FormData();
			let objButtonFile = document.getElementById('button_file_submit_query_record_upload_submit');
			formData.append("csv_file", objButtonFile.files[0]);
			let serialData = this.serializeInput(this.idForm);
			formData.append("data", serialData);
			if (that.mainField) {
				let mainElement = document.getElementsByName(that.mainField)[0];
				if (typeof mainElement !== 'undefined') {
					that.vars.lastMainValue = typeof mainElement.value !== 'undefined' ? mainElement.value : mainElement.innerHTML;
				}
			}
			if (that.keyField) {
				let keyElement = document.getElementsByName(that.keyField)[0];
				if (typeof keyElement !== 'undefined') {
					that.vars.lastKeyValue = typeof keyElement.value !== 'undefined' ? keyElement.value : keyElement.innerHTML;
				}
			}
			let success = function (res) {
				that.data.detail = res;
				that.writeTable('detail');
			};
			complete = typeof complete !== 'undefined' ? complete : function () { };
			complete = typeof complete !== 'function' ? function () { } : complete;
			fileAjax(that.queryUrl + 'submit_csv_file_write_detail', formData, success, complete);
		}
		// Button with PopUp Menu
		//----------------------------------------------------------------------------------------------------------------------
		createPopUpMenu(id, param, label) {
			const that = this;
			label = typeof label !== 'undefined' ? label : 'Menu';
			const button = this.panel.create_button('menu', label, 'button_' + id);
			let childArray = [];
			for (let i in param) {
				let model = typeof param[i].model !== 'undefined' ? param[i].model : false;
				let src = '../images/button/' + model + '.png';
				let img = {
					element: 'img',
					class: '_yFL iconMenuImage',
					src: src
				};
				let callback = typeof param[i].callback !== 'undefined' && typeof param[i].callback === 'function' ? param[i].callback : function () { };
				let childId = typeof param[i].id !== 'undefined' ? param[i].id : 'buttonPopUpMenu_' + i;
				let childLabel = typeof param[i].label !== 'undefined' ? param[i].label : '';
				if (!model) {
					img = {
						element: 'div',
						class: '_yFL _yDropDownItemLabel',
						content: childLabel
					};
				}
				let childObject = {
					element: 'div',
					id: childId,
					class: '_yPopUpButtonMenu _yFL',
					content: yHtml([img])
				};
				childArray.push(childObject);
				$(this.master).off('click', '#' + childId);
				$(this.master).on('click', '#' + childId, callback);
			}
			let panel = [{
				element: 'div',
				class: '_yPanelPopUpMenu',
				content: yHtml(childArray)
			}];
			let h = yHtml([{
				element: 'div',
				class: 'yPanelTransparent',
				id: id,
				content: yHtml(panel)
			}]);
			$(this.wrapper).append(h);
			$('#' + id).hide();
			$('#' + id).click(function () {
				$('#' + id).hide();
			});
			$(this.master).off('click', button);
			$(this.master).on('click', button, function () {
				$('#' + id).show();
			});
		}
		// Button with DropDown Menu
		//----------------------------------------------------------------------------------------------------------------------
		createDropDownMenu(id, param, label) {
			const that = this;
			label = typeof label !== 'undefined' ? label : 'Menu';
			button = this.panel.create_button('menu', label, 'button_' + id);
			$(button).addClass('_yDropDownCategory');
			$(button).addClass('_yFL');
			let childArray = [];
			for (let i in param) {
				let model = typeof param[i].model !== 'undefined' ? param[i].model : false;
				let src = '../images/button/' + model + '.png';
				let img = {
					element: 'img',
					class: '_yFL _yDropDownItemImage',
					src: src
				};
				let callback = typeof param[i].callback !== 'undefined' && typeof param[i].callback === 'function' ? param[i].callback : function () { };
				let childId = typeof param[i].id !== 'undefined' ? param[i].id : 'buttonPopUpMenu_' + i;
				let childLabel = typeof param[i].label !== 'undefined' ? param[i].label : '';
				let lbl = {
					element: 'div',
					class: '_yFL _yDropDownItemLabel',
					content: childLabel
				};
				if (!model) {
					img = lbl;
				}
				let childObject = {
					element: 'div',
					id: childId,
					class: '_yDropDownItem _yFL',
					content: yHtml([img, lbl])
				};
				childArray.push(childObject);
				$(this.master).off('click', '#' + childId);
				$(this.master).on('click', '#' + childId, callback);
			}
			let panel = yHtml([{
				element: 'div',
				id: '_yDropDown_' + id,
				class: '_yDropDownPanel _yFL',
				content: yHtml(childArray)
			}]);
			$('.panelMasterMenu').append(panel);
			$(this.master).off('click', button);
			$(this.master).on('click', button, function () {
				let panelHeight = $('#_yDropDown_' + id).outerHeight(true);
				if (panelHeight !== 0) {
					that.closePanelMenu(that.vars.menuPanelOpen);
					$(this).css('background', '#6A6A6A');
					$('#_yDropDown_' + id).height(0);
					$('#_yDropDown_' + id).width(0);
				} else {
					that.openPanelMenu(that.vars.menuPanelOpen);
					$(this).css('background', '#AAAAAA');
					$('#_yDropDown_' + id).height(72);
					$('#_yDropDown_' + id).width('auto');
				}
			});
		}
		openPanelMenu(isOpen) {
			const that = this;
			// close other panel
			$('._yDropDownPanel').width(0);
			$('._yDropDownPanel').height(0);
			$('._yDropDownCategory').css('background', '#6A6A6A');
			// is necessary to open menu panel?
			if (!isOpen) {
				let mainHeight = $('.panel_master_content').outerHeight(true);
				let height = mainHeight - 72;
				$('.panel_master_menu').height(72);
				$('.panel_master_content').height(height);
				this.vars.menuPanelOpen = true;
			}
		}
		closePanelMenu(isOpen) {
			if (isOpen) {
				let mainHeight = $('.panel_master_content').outerHeight(true);
				let height = mainHeight + 72;
				$('.panel_master_menu').height(0);
				$('.panel_master_content').height(height);

				this.vars.menuPanelOpen = false;
			}
		}
		// Textarea Listener
		listenerTextAreaResize() {
			$(this.wrapper).on('keydown', '.materialize-textarea', function (e) {
				const height = $(this).height()
				console.log(height)
				const newHeight = height > 0 ? height + 18 : false;
				if (newHeight) {
					$(this).parent('div.input-field').height(newHeight)
				}
			})
			// const resizeObserver = new ResizeObserver((entries) => {
			// 	for (const entry of entries) {
			// 		console.log(entry)
			// 	}
			// })
			// resizeObserver.observe(document.getElementsByClassName('materialize-te2xtarea'))
		}
		// Filter Function
		filter() {
			let object = this;
			let s = object.filter_class;
			let param = getFilterParam($(s));
			let data = filterData(object.data, param);
			object.dataFiltered = cloneObject(data);
			this.writeTable(data);
			function getFilterParam(f) {
				let p = [];
				let i = 0;
				f.each(function () {
					p[i] = {};
					let d = $(this).attr("id");
					p[i].field = d;
					let v = $(this).val();
					if (v !== '') { p[i].criteria = v; }
					else { p[i].criteria = ''; }
					i++;
				});
				return p;
			}
			function filterData(o, p) {
				let c = cloneObject(o);
				if (p) {
					for (let i in p) {
						let x = p[i].criteria;
						let f = p[i].field;
						if (x !== '') {
							let s = 0;
							for (let num in c) { s++; }
							let j = 0;
							for (let count = 0; count < s; count++) {
								const d = c[j][f];
								const r = filterLike(d, x);
								if (r < 0) { c.splice(j, 1); }
								else { j++; }
							}
						}
						c = cloneObject(c);
					}
				}
				return c;
			}
			function filterLike(a, b) {
				if (b !== '') {
					let c = a.toString().toLocaleLowerCase();
					let d = b.toString().toLocaleLowerCase();
					let l = d.length; let e = d.substring(0, 1);
					let f = d.substring(1, l);
					if (e == '=') {
						if (c == f) { return 0; }
						else { return -1; }
					}
					else if (e == '>') {
						if (Number(c) > Number(f)) { return 0; }
						else { return -1; }
					}
					else if (e == '<') {
						if (Number(c) < Number(f)) { return 0; }
						else { return -1; }
					}
					else if (e == '!') {
						if (c != f) { return 0; }
						else { return -1; }
					}
					else { return c.indexOf(d); }
				}
				else { return 0; }
			}
		}
		createButtonCancel(title, callback) {
			this.createButtonBack(title, callback);
		}

		//---------------------------------------------------------------------
		// Create Button Back from master to detail
		//---------------------------------------------------------------------
		createButtonBack(title, callback) {
			title = typeof (title) !== 'undefined' ? title : 'Back';
			callback = typeof (callback) !== 'undefined' ? callback : function () { };
			const that = this;
			yM.li({
				parent: '#toolbar-module-left',
				content: yM.a({
					class: 'light-blue darken-1 white-text waves-effect waves-blue btn btn-small btn-back tooltipped',
					['data-tooltip']: title,
					['data-position']: 'bottom',
					content: title,
					icon: { content: 'arrow_back', position: 'left' }
				})
			});
			$('.btn-back').off('click');
			$('.btn-back').on('click', function (e) {
				e.preventDefault()
				that.resetMaster()
				that.detailMode()
				that.resetScrollMaster()
				if (that.labelDetail !== '') {
					$('#title-module').text(that.labelDetail)
				}
				callback()
			});

			let elm = document.querySelectorAll('.btn-back');
			M.Tooltip.init(elm, {});
			$('.btn-back').hide();
		}
		resetScrollMaster() {
			let master = document.querySelector('#panel-y-master > li');
			master.scrollTop = 0;
		}

		//---------------------------------------------------------------------
		// Create Shortcut to another module from toolbar
		// this.createButtonModule( options )
		// options = {
		//     module: 'moduleName'
		//     callback: () => {}
		//     callbackBefore: () => {}
		//     callbackAfter: () => {}
		// }
		//---------------------------------------------------------------------
		createButtonModule(param) {
			param = typeof param !== 'undefined' ? param : {};
			const modName = typeof param.module !== 'undefined' ? param.module : function () { };
			const title = typeof param.title !== 'undefined' ? param.title : modName;
			const mainTrigger = document.getElementById('btn-module-' + modName);

			const modIcon = mainTrigger !== null ? mainTrigger.getAttribute('ico') : false;
			if (!modIcon) {
				console.log(`Error: call IT Support to check module ${modName} icon`);
			}
			const icon = typeof param.icon !== 'undefined' ? param.icon : modIcon;
			const iconObject = { class: 'material-icons', content: icon, position: 'left' }
			if (icon.substring(0, 3) == 'fa-' || icon.substring(0, 4) === 'fas-') {
				iconObject.class = 'fa ' + icon
				iconObject.content = ''
			}
			const callback = typeof param.callback !== 'undefined' ? param.callback : function () { };
			const callbackBefore = typeof param.callbackBefore !== 'undefined' ? param.callbackBefore : function () { };
			const callbackAfter = typeof param.callbackAfter !== 'undefined' ? param.callbackAfter : function () { };
			const that = this;
			yM.li({
				parent: '#toolbar-module-left',
				content: yM.a({
					id: 'btn-toolbar-module-' + modName,
					class: 'light-blue darken-1 white-text waves-effect waves-blue btn btn-small btn-back tooltipped',
					['data-tooltip']: title,
					['data-position']: 'bottom',
					content: title,
					icon: iconObject
				})
			});
			$('#btn-toolbar-module-' + modName).off('click');
			$('#btn-toolbar-module-' + modName).on('click', function (e) {
				e.preventDefault();
				callbackBefore();
				window.yData.triggerModule = $(this).get(0).id;
				M.Toast.dismissAll();
				const withAlert = webApp.isFormFilled();

				if (withAlert) {
					that.showAlertExitModule(modName, callback, callbackAfter);
				}
				else {
					that.showModuleCallback(modName, callback, callbackAfter);
				}
			});

			// let elm = document.querySelector('#btn-toolbar-module-' + modName)
			// M.Tooltip.init(elm, {})
			// $('#btn-toolbar-module-' + modName).hide()
			return '#btn-toolbar-module-' + modName;
		}
		showModuleCallback(modName, callback, callbackAfter) {
			callback = callback || function () { };
			callbackAfter = callbackAfter || function () { };
			const mainTrigger = document.getElementById('btn-module-' + modName);
			const modLabel = mainTrigger.getAttribute('ico');
			$('.btn-module').removeClass('active');
			$(mainTrigger).addClass('active');
			$('#title-module').html(modLabel);
			if (modName != 'home') {
				window.yData.moduleOption = {
					callback: callback,
					callbackAfter: callbackAfter
				};
				webApp.createModule(modName);
			}
			else {
				webApp.createDashboard();
			}
		}
		showAlertExitModule(modName, callback, callbackAfter) {
			const that = this;
			const guid = webApp.guid();
			const toastExitModule =
				yM.span({
					class: 'span-toast',
					content: "Are you sure want to leave?"
				}) +
				yM.buttonFlat({
					id: 'btn-cancel-exit-module-' + guid,
					class: 'toast-action',
					content: 'Back'
				}) +
				yM.buttonFlat({
					id: 'btn-confirm-exit-module-' + guid,
					class: 'toast-action',
					content: 'Yes'
				})
			M.toast({
				html: toastExitModule,
				displayLength: 20000
			})

			$('#btn-confirm-exit-module-' + guid).focus()
			$($('#btn-confirm-exit-module-' + guid).parent()).off('drag')

			$('#btn-cancel-exit-module-' + guid).off('click')
			$('#btn-cancel-exit-module-' + guid).on('click', function (e) {
				e.preventDefault()
				const inst = M.Toast.getInstance($(this).parent());
				inst.dismiss()
			})
			$('#btn-confirm-exit-module-' + guid).off('click')
			$('#btn-confirm-exit-module-' + guid).on('click', function (e) {
				e.preventDefault()
				const inst = M.Toast.getInstance($(this).parent());
				inst.dismiss()
				that.showModuleCallback(modName, callback, callbackAfter);
			});
		}

		masterDetailMode() {
			$('#panel-y-master').show();
			$('#panel-y-detail').show();
			$('.btn-back').hide();
		}
		masterDetailHistoryMode() {
			$('#panel-y-master').show();
			$('#panel-y-detail').show();
			$('#panel-y-history').show();
			$('.btn-back').hide();
		}
		detailMode() {
			$('#panel-y-master').hide();
			$('#panel-y-detail').show();
			$('#button-new-record').show();
			$('#button-open-record').show();
			$('#button-insert-record').show();
			$('.btn-back').hide();
			$('#button-submit').hide();
			$('#master-title').html('')
			if (this.labelDetail !== '') {
				$('#title-module').text(this.labelDetail)
			}
		}
		masterMode(showSubmit) {
			showSubmit = typeof (showSubmit) !== 'undefined' ? showSubmit : true;
			$('#panel-y-master').show();
			$('#panel-y-detail').hide();
			$('#button-new-record').hide();
			$('#button-open-record').hide();
			$('#button-insert-record').hide();
			$('.btn-back').show();
			if (showSubmit) {
				$('#button-submit').show();
			}
			if (this.labelMaster !== '') {
				$('#title-module').text(this.labelMaster)
			}
		}
		setInputToday(obj) {
			let today = new Date();
			let dd = String(today.getDate()).padStart(2, '0');
			let mm = String(today.getMonth() + 1).padStart(2, '0');
			let yyyy = today.getFullYear();

			today = mm + '/' + dd + '/' + yyyy;
			yM.setInputValue(obj, today);
		}
		submit() {
			let message = yStr('confirmationSubmit');
			this.postForm(message, message, () => {
				this.completeSubmit();
			});
		}
		completeSubmit() {
			this.data = {}
			this.resetMaster()
			this.writeDetail()
			this.detailMode()
		}
		appendInput(form, name, value) {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = value;
			form.appendChild(input);
			return form;
		}
		prepareDataXls(name, sheetname) {
			sheetname = typeof sheetname !== 'undefined' ? sheetname : name;
			const res = {
				title: sheetname,
				data: []
			};
			const table = 'table.panel_y_' + name + '_table'
			const thisField = this.field[name] || {}
			const fieldNoHidden = thisField.filter((val) => { return !(typeof val.hidden !== 'undefined' && val.hidden === true); })
			const field = fieldNoHidden.filter((val) => { return !(typeof val.buttonRemove !== 'undefined' && val.buttonRemove === true); })
			res.data[0] = field.map((val) => { return val.label || ''; });
			const rows = $(table).children('tbody').children('tr');
			let index = 1;
			rows.each(function () {
				const cell = $(this).children().filter(function () { return !($(this).hasClass('td-input-hidden')); }).filter(function () { return !($(this).hasClass('td-button-remove')); });
				res.data[index] = cell.map((i, val) => {
					if ($(val).hasClass('td-input-select')) {
						return $(val).children('div.input-field').children('div.select-wrapper').children('input').val();
					}
					else if ($(val).hasClass('td-input-checkbox')) {
						return $(val).children('label').children('input').prop("checked");
					}
					else if ($(val).hasClass('td-input-text')) {
						return $(val).children('div.input-field').children('.input_text').val();
					}
					else {
						return $(val).text().trimEnd();
					}
				}).get()
				index++
			})
			return res
		}
		getXls(name, filename, sheetname) {
			filename = typeof filename !== 'undefined' ? filename : name;
			sheetname = typeof sheetname !== 'undefined' ? sheetname : name;
			const xlsForm = document.createElement("form")
			xlsForm.target = "_blank";
			xlsForm.method = "POST";
			xlsForm.action = "C_home/download_as_xls";
			const dataSheet = this.prepareDataXls(name, sheetname);
			const params = {
				filename: filename,
				title: filename,
				data: [dataSheet]
			};
			const data = JSON.stringify(params)
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'data';
			input.value = data;
			xlsForm.appendChild(input);
			document.body.appendChild(xlsForm);
			xlsForm.submit();
			document.body.removeChild(xlsForm);
		}
		getXlsx(name, filename, sheetname) {
			filename = typeof filename !== 'undefined' ? filename : name;
			sheetname = typeof sheetname !== 'undefined' ? sheetname : name;
			const xlsForm = document.createElement("form");
			xlsForm.target = "_blank";
			xlsForm.method = "POST";
			xlsForm.action = "C_home/download_as_xlsx";
			const dataSheet = this.prepareDataXls(name, sheetname)
			const params = {
				filename: filename,
				title: filename,
				data: [dataSheet]
			};
			const data = JSON.stringify(params)
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'data';
			input.value = data;
			xlsForm.appendChild(input);
			document.body.appendChild(xlsForm);
			xlsForm.submit();
			document.body.removeChild(xlsForm);
		}
		appendArray(formData, values, name) {
			if (!values && name) {
				formData.append(name, '');
			}
			else {
				if (typeof values == 'object') {
					for (key in values) {
						if (typeof values[key] == 'object')
							appendArray(formData, values[key], name + '[' + key + ']');
						else
							formData.append(name + '[' + key + ']', values[key]);
					}
				}
				else
					formData.append(name, values);
			}
			return formData;
		}
		tableToExcel(table, name, filename) {
			table = table || false;
			name = name || 'Sheet1';
			filename = filename || 'Workbook.xls';
			if (table) {
				const obj = document.querySelector(table);
				const uri = 'data:application/vnd.ms-excel;base64,';
				const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
				const toBase64 = (s) => { return window.btoa(unescape(encodeURIComponent(s))); };
				const fmt = (s, c) => { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };
				const ctx = {
					worksheet: name,
					table: obj.innerHTML
				};
				const link = document.createElement('a');
				link.href = uri + toBase64(fmt(template, ctx));
				link.download = filename;
				link.target = '_blank';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
		// Form Input Modal
		createInputModal(param) {
			const that = this;
			param = typeof param !== 'undefined' ? param : {};
			const group = param.group !== 'undefined' ? param.group : 'group-modal';
			const title = typeof param.title !== 'undefined' ? param.title : '';
			const master = typeof param.master !== 'undefined' ? param.master : group;
			const field = typeof param.field !== 'undefined' ? param.field : false;
			const titleIcon = typeof param.titleIcon !== 'undefined' ? param.titleIcon : false;
			const triggerIcon = typeof param.triggerIcon !== 'undefined' ? param.triggerIcon : 'control_point_duplicate';
			const cancelButton = param.cancel == '1' ? param.cancel : 0;
			const hideNav = typeof param.hideNav !== 'undefined' ? param.hideNav : false;
			const modalId = 'modal-form-' + group;
			const trigger = typeof param.trigger !== 'undefined' ? param.trigger : false;
			const labelButtonCancel = typeof param.labelButtonCancel !== 'undefined' ? param.labelButtonSubmit : 'Cancel';
			const labelButtonClose = typeof param.labelButtonClose !== 'undefined' ? param.labelButtonSubmit : 'Close';
			const labelButtonSubmit = typeof param.labelButtonSubmit !== 'undefined' ? param.labelButtonSubmit : 'Submit';
			let defaultButton = []
			if (!trigger) {
				this.createModalTriggerButton('button-' + group, title, triggerIcon, '#' + modalId);
				$('#button-' + group).hide();
			}
			else {
				$(trigger).addClass('modal-trigger');
				$(trigger).attr('href', '#modal-form-' + group);
			}
			if (cancelButton == '1') {
				defaultButton = [
					{ id: 'cancel-' + group, class: 'modal-close waves-effect waves-green btn-flat', content: labelButtonCancel },
					{ id: 'close-' + group, class: 'modal-close waves-effect waves-green btn-flat', content: labelButtonClose },
					{ id: 'submit-' + group, class: 'modal-close waves-effect waves-green btn-flat', content: labelButtonSubmit }
				]
			} else {
				defaultButton = [
					{ id: 'close-' + group, class: 'modal-close waves-effect waves-green btn-flat', content: labelButtonClose },
					{ id: 'submit-' + group, class: 'modal-close waves-effect waves-green btn-flat', content: labelButtonSubmit }
				]
			}
			const button = typeof param.button !== 'undefined' ? param.button : defaultButton;
			const onOpenStart = typeof param.onOpenStart !== 'undefined' ? param.onOpenStart : function () { };
			const onOpenEnd = typeof param.onOpenEnd !== 'undefined' ? param.onOpenEnd : function () { };
			const onCloseStart = typeof param.onCloseStart !== 'undefined' ? param.onCloseStart : function () { };
			const onCloseEnd = typeof param.onCloseEnd !== 'undefined' ? param.onCloseEnd : function () { };
			const inDuration = typeof param.inDuration !== 'undefined' ? param.inDuration : 250;
			const outDuration = typeof param.outDuration !== 'undefined' ? param.outDuration : 250;
			const callback = typeof param.callback !== 'undefined' ? param.callback : function () { };
			const ajaxUrl = typeof param.submitUrl !== 'undefined' ? param.submitUrl : this.queryUrl + 'submit_' + group;
			const ajaxUrlCancel = typeof param.cancelUrl !== 'undefined' ? param.cancelUrl : this.queryUrl + 'cancel_' + group;
			const mainParam = typeof param.mainParam !== 'undefined' ? param.mainParam : [];
			yM.modalForm({
				parent: '#module-content',
				id: modalId,
				class: 'modal-fixed-footer',
				form: {
					id: 'form-' + group,
					content: this.createModalHeader(group, title, titleIcon) +
						this.createModalNav(group) +
						this.createModalContent(group)
				},
				button: button
			});
			if (hideNav) {
				$('form>nav').hide();
			}
			this.panel.writeMaster(field, '#form-modal-content-' + group, master);
			$(document).off('click', '#submit-' + group);
			$(document).on('click', '#submit-' + group, function (event) {
				event.preventDefault();
				let key = '';
				for (let i in field) {
					if (typeof field[i].table !== 'undefined') {
						const name = field[i].name !== 'undefined' ? field[i].name : false;
						if (name) {
							const paramX = $('table.panel_y_' + name + '_table :input').serialize();
							key += '&' + paramX;
						}
					}
					else {
						const row = field[i];
						const keyName = typeof row['name'] !== 'undefined' ? row['name'] : false;
						if (keyName) {
							const keyValue = $('#input_' + keyName).val();
							const and = i == 0 ? '' : '&';
							key += and + keyName + '=' + keyValue;
						}
					}
				}
				for (let i in mainParam) {
					const keyName = typeof mainParam[i]['name'] !== 'undefined' ? mainParam[i]['name'] : false;
					const selector = typeof mainParam[i]['id'] !== 'undefined' ? mainParam[i]['id'] : false;
					const fixValue = typeof mainParam[i]['value'] !== 'undefined' ? mainParam[i]['value'] : false;
					const keyValue = selector ? $(selector).val() : fixValue;
					const and = key !== '' ? '&' : '';
					key += and + keyName + '=' + keyValue;
				}
				postAjax(ajaxUrl, key, callback);
			});

			$(document).off('click', '#cancel-' + group);
			$(document).on('click', '#cancel-' + group, function (event) {
				event.preventDefault();
				let key = '';
				for (let i in field) {
					if (typeof field[i].table !== 'undefined') {
						const name = field[i].name !== 'undefined' ? field[i].name : false;
						if (name) {
							const paramX = $('table.panel_y_' + name + '_table :input').serialize();
							key += '&' + paramX;
						}
					}
					else {
						const row = field[i];
						const keyName = typeof row['name'] !== 'undefined' ? row['name'] : false;
						if (keyName) {
							const keyValue = $('#input_' + keyName).val();
							const and = i == 0 ? '' : '&';
							key += and + keyName + '=' + keyValue;
						}
					}
				}
				for (let i in mainParam) {
					const keyName = typeof mainParam[i]['name'] !== 'undefined' ? mainParam[i]['name'] : false;
					const selector = typeof mainParam[i]['id'] !== 'undefined' ? mainParam[i]['id'] : false;
					const keyValue = $(selector).val();
					const and = key !== '' ? '&' : '';
					key += and + keyName + '=' + keyValue;
				}
				postAjax(ajaxUrlCancel, key, callback);
			});
			const elemsModal = document.querySelectorAll('#' + modalId);
			M.Modal.init(elemsModal, {
				onOpenStart: onOpenStart,
				onOpenEnd: onOpenEnd,
				onCloseStart: onCloseStart,
				onCloseEnd: onCloseEnd,
				inDuration: inDuration,
				outDuration: outDuration
			});
			this.initModalDatePicker(group, field);
		}
		createModalHeader(group, title, icon) {
			const iconHtml = typeof icon !== 'undefined' ? yM.icon(icon) : '';
			return yM.div({
				class: 'form-modal-header-' + group,
				content: yM.h5({
					content: yM.span({ id: 'form-' + group + '-title', content: title })
				})
			});
		}
		createModalNav(group) {
			return yM.nav({
				content: yM.div({
					class: 'form-modal-nav nav-wrapper',
					content: yM.ul({
						id: 'form-modal-nav-list-' + group,
						class: 'left hide-on-med-and-down',
						content: ''
					})
				})
			});
		}
		createModalContent(group) {
			return yM.div({
				id: 'form-modal-content-' + group,
				class: 'form-modal-content',
				content: ''
			});
		}
		initModalDatePicker(group, field) {
			const that = this
			let inputArrayName = [];
			let inputArrayYearRange = [];
			let inputArrayMinDate = [];
			let inputArrayMaxDate = [];
			let inputArrayTable = [];
			for (let i in field) {
				if (typeof field[i].type !== 'undefined' && field[i].type == 'date') {
					const name = typeof field[i].name !== 'undefined' ? field[i].name : false;
					const yearRange = typeof field[i].yearRange !== 'undefined' ? field[i].yearRange : false;
					const minDate = typeof field[i].minDate !== 'undefined' ? field[i].minDate : false;
					const maxDate = typeof field[i].maxDate !== 'undefined' ? field[i].maxDate : false;
					if (name) {
						inputArrayName.push(name);
						inputArrayYearRange.push(yearRange);
						inputArrayMinDate.push(minDate);
						inputArrayMaxDate.push(maxDate);
					}
				}
				if (typeof field[i].table !== 'undefined' && field[i].table == true) {
					const contentField = field[i].content !== 'undefined' ? field[i].content : false;
					const name = typeof field[i].name !== 'undefined' ? field[i].name : false;
					if (name && contentField) {
						for (let j in contentField) {
							if (typeof contentField[j].type !== 'undefined' && contentField[j].type == 'date') {
								const contentName = typeof contentField[j].name !== 'undefined' ? contentField[j].name : false;
								if (contentName) {
									inputArrayTable.push(contentName);
								}
							}
						}
					}
				}
			}
			const prefId = '#input_'
			inputArrayName.forEach(function (subId, index) {
				yM.div({
					id: 'container-datepicker-' + subId,
					class: 'parent-container-datepicker',
					data: prefId + subId,
					parent: '#module-content'
				});
				const elem = document.querySelectorAll(prefId + subId);
				const opt = {
					autoClose: true,
					format: that.formatDate,
					container: '#container-datepicker-' + subId,
					onOpen: function () {
						const dateString = $('#input_' + subId).val();
						that.syncDatePicker(this, dateString);
					}
				};
				const yearRange = typeof inputArrayYearRange[index] !== 'undefined' ? inputArrayYearRange[index] : false
				if (yearRange) {
					opt.yearRange = yearRange
				}
				const minDate = typeof inputArrayMinDate[index] !== 'undefined' ? inputArrayMinDate[index] : false
				if (minDate) {
					opt.minDate = minDate
				}
				const maxDate = typeof inputArrayMaxDate[index] !== 'undefined' ? inputArrayMaxDate[index] : false
				if (maxDate) {
					opt.maxDate = maxDate
				}
				M.Datepicker.init(elem, opt);
			});
			$(this.wrapper).off('click', '.datepicker-done');
			$(this.wrapper).on('click', '.datepicker-done', function () {
				const inputId = $(this).closest('.parent-container-datepicker').attr('data');
				const dateStr = $(this).closest('.datepicker-container').find('.date-text').text();
				const yearStr = $(this).closest('.datepicker-container').find('.year-text').text();
				const dateObj = new Date(dateStr + ' ' + yearStr);
				const date = dateObj.getDate();
				const month = dateObj.getMonth() + 1;
				const dateFormat = String(date).padStart(2, '0') + '/' + String(month).padStart(2, '0') + '/' + yearStr;
				yM.setInputValue(inputId, dateFormat);
			});
		}
		syncDatePicker(el, dateString) {
			const inputDate = getDateObject(dateString, this.formatDate)
			el.setDate(inputDate)
		}
		createModalTriggerButton(id, content, icon, href) { yM.li({ parent: '#toolbar-module-left', content: yM.button({ element: 'a', class: 'btn light-blue darken-1 white-text waves-effect waves-blue btn-small btn-back tooltipped modal-trigger', href: href, id: id, content: content, icon: icon }) }); }

		/////////////////////////////////////////////////////////////////////////////////////
		// writeDetail
		// 1. Serialize active Form
		// 2. call controller
		// 3. write response data to table detail
		// @todo write response data to master and history table if ajax response has response
		/////////////////////////////////////////////////////////////////////////////////////
		writeDetail(table, param, callback) {
			const that = this
			$(this.detail).html('')
			$('.header-sum').text('')
			$('.footer-sum').text('')
			let serialize = this.serializeInput(this.idForm)
			table = typeof table !== 'undefined' ? table : 'get_detail'
			param = typeof param !== 'undefined' ? param : serialize
			callback = typeof callback !== 'undefined' ? callback : function (data) {
				let res = typeof data.detail !== 'undefined' ? data.detail : data
				that.data.detail = res
				that.writeTable('detail')
				if (that.labelDetail !== '') {
					$('#title-module').text(that.labelDetail)
				}
			}
			getAjax(this.queryUrl + table, param, callback)
		}
		writeHistory(table, param, callback) {
			const that = this
			$(this.history).html('');
			let serialize = this.serializeInput(this.idForm)
			table = typeof table !== 'undefined' ? table : 'get_history';
			param = typeof param !== 'undefined' ? param : serialize;
			callback = typeof callback !== 'undefined' ? callback : function (data) {
				that.panel.writeTableData('history', data.history)
			}
			getAjax(this.queryUrl + table, param, callback);
		}

		/////////////////////////////////////////////////////////////////////////////////////
		// Handle File Input
		/////////////////////////////////////////////////////////////////////////////////////
		handleFileUploadChange() {
			$('body').off('change', 'input.input_upload_file')
			$('body').on('change', 'input.input_upload_file', function (e) {
				const id = this.id
				const preview = this.getAttribute('preview')
				const labelFile = document.getElementById('span-' + id)
				labelFile.textContent = this.files[0].name
				if (preview != null) {
					const previewImage = document.getElementById('preview-image-' + preview)
					if (previewImage != null) {
						previewImage.src = URL.createObjectURL(this.files[0])
					}
				}
			})
		}
	}

	//----------------------------------------------------------------------------------------------------------------------
	// Upload Form
	//----------------------------------------------------------------------------------------------------------------------
	function y_upload_form(param) {
		useParam(this, param);
		this.wrapper = $('#module-panel');
		this.idForm = '#' + this.name;
		this.type = 'md';
		this.labelMaster = this.title;
		this.labelDetail = 'ITEM';
		const panel = new YPanel(this);
		panel.set_default_panel_height(1, 3);
		this.panel = panel;
		this.master = panel.master;
		this.detail = panel.detail;
		this.data = [];
		this.data.detail = [];
		this.field = [];
		this.field.detail = param.field_data;
		this.init();
	}
	y_upload_form.prototype.init = function () {
		this.writeMaster();
		this.panel.writeHeader('detail');
		const that = this
		that.hideButtonSubmit();
		prevent_key_enter(this.idForm);
		this.wrapper.off('click', this.trigger.selector);
		this.wrapper.on('click', this.trigger.selector, function (event) {
			$('.panel_info').hide();
			$('.panel_setup').hide();
		});
		this.set_form_attribute();
		this.set_command();
	};
	y_upload_form.prototype.set_command = function () {
		let button_file = document.getElementById('button_file');
		let button_preview = document.getElementById('button_preview');
		let button_upload = document.getElementById('button_upload');
		button_preview.style.display = 'none';
		button_upload.style.display = 'none';
		$('.tick').hide();
		button_file.addEventListener('click', function (event) {
			event = event || window.event;
			button_upload.style.display = 'none';
			$('#tick_2').hide();
			$('#tick_3').hide();
		});
		button_file.addEventListener('change', function () {
			let value = this.value;
			if (value !== '') {
				$('#tick_1').show();
				button_file.style.display = 'none';
				button_preview.style.display = '';
			} else {
				$('#tick_1').hide();
				button_preview.style.display = 'none';
			}
		});
		const that = this
		let result_data;
		$(this.idForm).ajaxForm({
			dataType: 'json',
			beforeSend: function () {
				showPreloader();
				$(this.detail).html('');
			},
			complete: function () {
				y_wait_hide();
			},
			success: function (data) {
				result_data = data;
				$('#tick_2').show();
				button_preview.style.display = 'none';
				button_upload.style.display = '';
				if (typeof result_data[0][0] !== 'undefined' && result_data[0][0].substring(0, 5) == 'error') {
					showAjaxResult(result_data[0], false);
				} else {
					that.data.detail = result_data;
					for (let i in data) {
						that.panel.writeRow(i, 'detail', data[i]);
					}
				}
			}
		});
		button_upload.addEventListener('click', function (event) {
			event = event || window.event;
			event.preventDefault();
			let callback = function (status) {
				button_upload.style.display = 'none';
				$('#tick_3').show();
				showAjaxResult(status);
			};
			postAjax(that.queryUrl + 'upload_csv_file', '{value:' + result_data + '}', callback);
		});
	};
	y_upload_form.prototype.set_form_attribute = function () {
		let form_element = document.getElementById(this.name);
		form_element.setAttribute('method', 'post');
		form_element.setAttribute('enctype', 'multipart/form-data');
		form_element.setAttribute('action', this.submit_url);
	};
	y_upload_form.prototype.writeMaster = function () {
		let cl_row = 'panel_input_row_with_sidebar_with_margin';
		const h = yHtml([{
			element: 'div',
			class: cl_row,
			content: yHtml([{
				element: 'div',
				class: 'label_step',
				content: 'Step 1'
			},
			{
				element: 'input',
				type: 'file',
				id: 'button_file',
				name: 'csv_file'
			},
			{
				element: 'div',
				id: 'tick_1',
				class: 'tick'
			}
			])
		},
		{
			element: 'div',
			class: cl_row,
			content: yHtml([{
				element: 'div',
				class: 'label_step',
				content: 'Step 2'
			},
			{
				element: 'input',
				type: 'submit',
				id: 'button_preview',
				name: 'button_preview',
				value: 'Preview'
			},
			{
				element: 'div',
				id: 'tick_2',
				class: 'tick'
			}
			])
		},
		{
			element: 'div',
			class: cl_row,
			content: yHtml([{
				element: 'div',
				class: 'label_step',
				content: 'Step 3'
			},
			{
				element: 'input',
				type: 'submit',
				id: 'button_upload',
				name: 'button_upload'
			},
			{
				element: 'div',
				id: 'tick_3',
				class: 'tick'
			}
			])
		}
		]);
		$(this.master).append(h);
	};
	let Download_Blank = function (p) {
		p.wrapper.on('click', p.trigger.selector, function () {
			let d = [];
			downloadCsv(p.field, d, p.filename);
		});
	};
	let DownloadTsv = function (p) {
		p.wrapper.on('click', p.trigger.selector, function () {
			let d = [];
			downloadCsv(p.field, d, p.filename, 'tab');
		});
	};
	let y_panel_selector = function (title, text, id) {
		let h = yM.div({
			class: 'y_transparent_outer',
			content: yM.div({
				class: 'y_panel_selector',
				id: id,
				content: yM.div({
					class: 'panel_title',
					content: title
				}) +
					yM.div({
						class: 'y_message_box_text',
						content: text
					})
			})
		});
		$('body').append(h);

		$('.panel_title').click(function (event) {
			event = event || window.event;
			$('.y_transparent_outer').hide();
		});
	};

	function Download_Form(opt) {
		const that = this
		opt = typeof opt !== 'undefined' ? opt : false;
		if (opt) {
			let single = typeof opt.list_url !== 'undefined' ? false : true;
			let data_field = typeof opt.data !== 'undefined' && typeof opt.data.field !== 'undefined' ? opt.data.field : false;
			let data_key = typeof opt.data !== 'undefined' && typeof opt.data.key !== 'undefined' ? opt.data.key : false;
			let name = opt.name;
			let panel_id = 'y_panel_selector_' + name;
			let p_name = [];
			let p_id = [];
			let i;
			for (i in opt.params) {
				p_name[i] = opt.params[i].name;
				p_id[i] = name + '_' + p_name[i];
			}
			let html = '';
			for (i in opt.params) {
				let class_input = 'input_text float_left';
				if (typeof (opt.params[i].type) !== 'undefined') {
					if (opt.params[i].type == 'date') {
						class_input = 'input_date float_left';
					}
				}
				p_label = opt.params[i].label;
				if (!single) {
					html += yHtml([{
						element: 'div',
						class: 'y_message_box_text_row',
						content: yHtml([{
							element: 'div',
							class: 'y_message_box_text_row_padding',
							content: p_label + ' : '
						},
						{
							element: 'input',
							class: class_input,
							id: p_id[i],
							name: p_name[i]
						},
						{
							element: 'div',
							id: 'download_list_' + name,
							class: 'button_circle ',
							content: yHtml([{
								element: 'img',
								class: 'button_circle_image',
								id: 'query_option_' + name,
								src: '../images/menubar/generate.png'
							},
							{
								element: 'div',
								class: 'button_circle_text',
								content: 'Generate'
							}
							])
						}
						])
					},
					{
						element: 'div',
						id: 'data_table_-' + name,
						content: ''
					},
					]);
				} else {
					html += yHtml([{
						element: 'div',
						class: 'y_message_box_text_row',
						content: yHtml([{
							element: 'div',
							class: 'y_message_box_text_row_padding',
							content: p_label + ' : '
						},
						{
							element: 'input',
							class: class_input,
							id: p_id[i],
							name: p_name[i]
						},
						{
							element: 'div',
							id: 'print_' + name,
							class: 'button_circle',
							content: yHtml([{
								element: 'img',
								class: 'button_circle_image',
								src: '../images/menubar/print.png'
							},
							{
								element: 'div',
								class: 'button_circle_text',
								content: 'Download'
							}
							])
						}
						])
					}]);
				}
			}
			if (!single) {
				$('body').off('click', '#download_list_' + name);
				$('body').on('click', '#download_list_' + name, function () {
					target = opt.list_url;
					let parameter = '?';
					for (i in opt.params) {
						let p_value = $('#' + p_id[i]).val();
						if (i !== 0) {
							parameter += '&';
						}
						parameter += p_name[i] + '=' + p_value;
					}
					let callback = function (list_data) {
						$('#data_table_-' + name).html('');
						for (i in list_data) {
							let label = list_data[i][data_field];
							let key = list_data[i][data_key];
							let text_html = yHtml([{
								element: 'div',
								class: 'y_message_box_text_row ',
								content: yHtml([{
									element: 'div',
									class: 'float_left width_50',
									content: parseInt(i) + 1
								},
								{
									element: 'div',
									class: 'float_left width_150',
									content: label
								},
								{
									element: 'div',
									row: key,
									class: 'button_circle button_download_' + name,
									content: yHtml([{
										element: 'img',
										class: 'button_circle_image',
										src: '../images/menubar/download.png'
									},
									{
										element: 'div',
										class: 'button_circle_text',
										content: 'download'
									},

									])
								},
								{
									element: 'img',
									class: 'tick',
									src: '../images/icon/tick.png'
								}
								])
							}]);
							$('#data_table_-' + name).append(text_html);
						}
						$('.tick').hide();
						for (i in list_data) {
							$('#data_table_-' + name).off('click', '.' + 'button_download_' + name);
							$('#data_table_-' + name).on('click', '.' + 'button_download_' + name, function () {
								let key = $(this).attr('row');
								$(this).siblings('.tick').show();
								let parameter = '?param=' + key;
								window.open(opt.data_url + parameter);
							});
						}
					};
					getAjax(target + parameter, "", callback);
				});
			} else {
				$('body').off('click', '#print_' + name);
				$('body').on('click', '#print_' + name, function (event) {
					event = event || window.event;
					let parameter = '?';
					for (let i in opt.params) {
						let p_value = $('#' + p_id[i]).val();
						if (i !== 0) {
							parameter += '&';
						}
						parameter += p_name[i] + '=' + p_value;
					}
					window.open(opt.data_url + parameter);
				});
			}
			opt.wrapper.off('click', opt.trigger.selector);
			opt.wrapper.on('click', opt.trigger.selector, function (event) {
				event = event || window.event;
				let element = document.getElementById(panel_id);
				if (element === null) {
					y_panel_selector(opt.title, html, panel_id);
					for (let i in opt.params) {
						let param_id = $('#' + p_id[i]);
						if (typeof (opt.params[i].url) !== 'undefined') {
							let ac_config = {
								source: opt.params[i].url,
								select: function (event, ui) {
									$(this).val(ui.item.data);
								},
								minLength: 0
							};
							param_id.autocomplete(ac_config);
						}
						if (typeof (opt.params[i].type) !== 'undefined') {
							if (opt.params[i].type == 'date') {
								class_input = 'input_date float_left';
								use_input_date(param_id, '-5:+1');
							}
						}
					}
				} else {
					element.parentNode.style.display = '';
				}

			});
		}
	}

	const y_helper_get_field = function (object) {
		let result = [];
		let i = 0;
		for (let field in object) {
			if (object.hasOwnProperty(field)) {
				result[i] = field;
				i++;
			}
		}
		return result;
	};

	const downloadCsv = function (field, data, filename, regional, confirmation, quote) {
		confirmation = typeof confirmation !== 'undefined' ? confirmation : yStr('confirmationDownload')
		qs = typeof quote !== 'undefined' ? quote : '"'
		if (data !== null) {
			const r = confirmation ? confirm(confirmation) : true
			if (r === true) {
				filename = (typeof filename === "undefined") ? "file_download.csv" : filename;
				regional = typeof regional !== "undefined" ? regional : "english";
				let separator;
				switch (regional) {
					case 'english':
						separator = ',';
						break;
					case 'indonesia':
						separator = ';';
						break;
					case 'tab':
						separator = '\t';
						break;
					default:
						separator = ',';
				}
				field = typeof field != 'object' ? JSON.parse(field) : field;
				data = typeof data != 'object' ? JSON.parse(data) : data;
				let label = '';
				let eof = '\r\n';
				let qe = qs + separator;
				let is_number = [];
				let i, j, no_of_column;
				let object_i, field_name, content;
				for (i in field) {
					if (typeof field[i].multicolumn !== 'undefined' && field[i].multicolumn === true) {
						root_field_name = typeof field[i].name !== 'undefined' ? field[i].name : false;
						if (root_field_name) {
							object_i = typeof data[0][root_field_name] !== 'undefined' ? data[0][root_field_name] : false;
							field_name = object_i ? y_helper_get_field(object_i) : false;
							no_of_column = typeof field_name !== 'undefined' && field_name !== false ? field_name.length : 0;
							for (j = 0; j < no_of_column; j++) {
								label += qs + field_name[j] + qe;
							}
						}
					} else {
						label += qs + field[i].label + qe;
					}
					is_number[i] = false;
					if (typeof field[i].format !== 'undefined') {
						if (field[i].format == 'number') {
							is_number[i] = true;
						}
					}
				}
				let header = label.slice(0, (label.length) - 1);
				let csv = header + eof;
				for (i = 0; i < data.length; i++) {
					let row = '';
					let k = 0;
					field_no = 0;
					for (j in data[i]) {
						let isMulticolumn = typeof field[field_no] !== 'undefined' ? typeof field[field_no].multicolumn !== 'undefined' ? field[field_no].multicolumn : false : false;
						if (typeof data[i][j] === 'object' && isMulticolumn) {
							root_field_name = typeof field[field_no].name !== 'undefined' ? field[field_no].name : false;
							if (root_field_name && root_field_name == j) {
								object_i = typeof data[0][j] !== 'undefined' ? data[0][j] : false;
								field_name = object_i ? y_helper_get_field(object_i) : false;
								no_of_column = typeof field_name !== 'undefined' && field_name !== false ? field_name.length : 0;
								for (let col = 0; col < no_of_column; col++) {
									content = typeof data[i][j][field_name[col]] !== 'undefined' ? data[i][j][field_name[col]] : '';
									if (is_number[k]) {
										content = y_format_currency(content, '', regional);
									}
									k++;
									row += qs + content + qe;
								}
							}
						} else {
							content = data[i][j];
							if (is_number[k]) {
								content = y_format_currency(content, '', regional);
							}
							k++;
							row += qs + content + qe;
						}
						field_no++;
					}
					let row_csv = row.slice(0, (row.length) - 1);
					csv += row_csv + eof;
				}
				let bb = new Blob([csv], {
					type: 'text/csv'
				});
				let a = document.createElement('a');
				a.href = window.URL.createObjectURL(bb);
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
		}
	};

	if (typeof window === 'object' && typeof window.document === 'object') {
		window.y_form = Form;
		window.YForm = Form;
		window.y_upload_form = y_upload_form;
		window.Download_Blank = Download_Blank;
		window.DownloadTsv = DownloadTsv;
		window.y_download_csv = downloadCsv;
		window.downloadCsv = downloadCsv;
		window.Download_Form = Download_Form;
	}
})(window)
