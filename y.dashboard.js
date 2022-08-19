(function (window, undefined) {
    //----------------------------------------------------------------------------------------------------------------------
    // Dashboard
    //----------------------------------------------------------------------------------------------------------------------
    class Dashboard {
        constructor(param) {
            useParam(this, param)
            if (typeof param.dashboard !== 'undefined') {
                this.name = typeof param.name !== 'undefined' ? param.name : 'form_' + param.dashboard
                this.query_url = typeof param.query_url !== 'undefined' ? param.query_url : 'C_dashboard_' + param.dashboard + '/'
            }
            this.modulePanel = $('#module-panel')
            this.content
            this.containerId = 'dashboard-content-' + this.name
            this.dashboard = '#dashboard-content-' + this.name
            this.data = {}
            this.init()
        }
        init() {
            const that = this
            const callbackDashboard = typeof this.callback !== 'undefined' && typeof this.callback === 'function' ? this.callback : function () { }
            var callback = function (data) {
                that.data = data
                that.createDashboardContent()
                callbackDashboard(data)
            }
            getAjax(this.query_url + 'get', '', callback)
        }
        createDashboardContent() {
            const h = yHtml({
                element: 'div', class: 'dashboard-scroll', content: yHtml(
                    { element: 'div', id: this.containerId, class: 'dashboard-content', content: '' }
                )
            })
            this.modulePanel.append(h)
            this.content = $('#' + this.containerId)
        }
        writeTitle() {
            const h = yHtml({ element: 'div' })
            this.content.append(h)
        }
        row(options) {
            return yMaterial.row(options)
        }
        col(options) {
            return yMaterial.col(options)
        }
        guid() {
            const r = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) }
            return (r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r())
        }
        infoBox(options) {
            return yMaterial.infoBox(options)
        }
        infoBox2(options) {
            return yMaterial.infoBox2(options)
        }
        val(res, name, def) {
            res = typeof (res) !== 'undefined' ? res : false
            name = typeof (name) !== 'undefined' ? name : false
            def = typeof (def) !== 'undefined' ? def : ''
            return typeof (res[name]) !== 'undefined' ? res[name] : def
        }
    }
    if (typeof window === 'object' && typeof window.document === 'object') {
        window.yDashboard = Dashboard
    }
})(window)
