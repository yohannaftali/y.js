//----------------------------------------------------------------------------------------------------------------------
// Y Web Framework
// version = 221111
//----------------------------------------------------------------------------------------------------------------------
// update version when updating module js
// 2022.11.11 - group icon font awesome

(function (window, undefined) {
    const version = '221111'
    const document = window.document
    const location = window.location
    const _htmlTags = new Array(
        'a', 'aside',
        'blockquote', 'body', 'br', 'button',
        'canvas', 'caption', 'cite',
        'div',
        'fieldset', 'footer', 'form',
        'header',
        'i', 'iframe', 'img', 'input',
        'label', 'li',
        'marquee', 'meta',
        'nav',
        'ol', 'option',
        'p',
        'script', 'section', 'span', 'svg',
        'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'title', 'tr',
        'u', 'ul', 'ui',
        'var', 'video', 'wbr'
    );

    //------------------------------------------------------------------------------
    // web Engine
    // Create Web Framework
    //------------------------------------------------------------------------------
    class web {
        constructor(data) {
            this.data = data;
            this.init();
            this.spotlight = true;
            this.create_click();
            this.create_wait();
            this.create_paste();
            this.createPreloader();
            this.createFormEditPassword();
            this.initListener();
            this.instancesModal;
            this.instancesTapTarget;
            //yClock(this.getElement('y_time'));
            this.setClock(this.getElement('time-header'));
            window.yData = data;
            this.showModuleCallback(document.getElementById('btn-module-home'));
        }
        setClock(selector) {
            const that = this;
            let t = this.getTime();
            selector.innerHTML = t;
            setTimeout(function () {
                that.setClock(selector);
            }, 500);

        }
        getTime() {
            const n = new Date();
            const h = preZero(n.getHours());
            const m = preZero(n.getMinutes());
            function preZero(i) {
                const r = i < 10 ? "0" + i : i;
                return r;
            }
            return (h + ":" + m);
        }
        create_paste() {
            const paste = this.createNode('textarea', 'y_paste', document.body);
            paste.style.position = 'absolute';
            paste.style.left = '-1000px';
            paste.style.top = '-1000px';
            document.designMode = 'off';
        }
        create_click() {
            const click = this.createNode('y_click', document.body);
            click.style.display = 'none';
            click.className = '_yClick';
            document.body.onclick = function (e) {
                e = e || window.event
                const x = e.pageX
                const y = e.pageY            
                click.style.left = x + 'px'
                click.style.top = y + 'px'
                click.style.display = ''
                setTimeout(function () { click.style.display = 'none'; }, 200)   
            }
        }
        create_wait() {
            const wait = this.createNode('y-progress-bar', document.body);
            wait.innerHTML = 'please wait...';
            wait.style.display = 'none';
        }
        createPreloader() {
            yM.preloaderCircular({
                parent: 'body',
                id: 'ajax-preloader'
            });
            const obj = document.getElementById('ajax-preloader');
            if (obj !== null && typeof obj !== 'undefined' && typeof obj.style !== 'undefined') {
                obj.style.display = 'none';
                obj.style.position = 'fixed';
                obj.style.top = '50%';
                obj.style.left = '50%';
                obj.style.marginTop = '-25px';
                obj.style.marginLeft = '-25px';
            }
        }
        init() {
            const loaderWrapper = this.createNode('loader-wrapper', document.body);
            this.createNode('loader', loaderWrapper);
            const loaderLeft = this.createNode(loaderWrapper);
            loaderLeft.className = 'loader-section section-left';
            const loaderRight = this.createNode(loaderWrapper);
            loaderRight.className = 'loader-section section-right';
            this.createHeader();
            this.createMain();
            this.createFooter();
            this.addNotification("<i class='material-icons tiny left'>verified_user</i><span>Login</span>", data.username + " is logged in", false, false);
            this.createNotificationBadge();
        }
        createSearch(parent) {
            // - Search
            const inputField = this.createNode('menubar_input_field', parent);
            inputField.className = 'navbar-fixed input-field gradient-45deg-red-pink yellow-text text-lighten-3';
            // -Search - Input
            const inputSearch = this.createNode('input', 'menubar_terminal', inputField);
            inputSearch.type = 'search';
            inputSearch.required = true;

            // Label Search
            const labelSearch = this.createNode('label', inputField);
            labelSearch.className = 'label-icon yellow-text text-lighten-3';
            labelSearch.setAttribute('for', 'menubar_terminal');
            // Icon Search 
            const iLabelSearch = this.createNode('i', labelSearch);
            iLabelSearch.className = 'material-icons search position-icons';
            iLabelSearch.innerHTML = 'search';
            // -Icon Close - Label
            const iconClose = this.createNode('a', 'close_search', inputField);
            iconClose.className = 'material-icons closed position-icons btn-flat';
            iconClose.innerHTML = 'close';
            //this.getElement('menubar_input_field').style.visibility='hidden';
            inputField.style.display = 'none';
        }
        createHeader() {
            const headerPage = this.createNode('header', 'header', document.body);
            headerPage.className = 'page-topbar';
            const navbarFixed = this.createNode(headerPage);
            navbarFixed.className = 'navbar-fixed';

            const navColor = this.createNode('nav', 'navColor', navbarFixed);
            navColor.className = 'nav-color';
            const navHeader = this.createNode('nav-header', navColor);
            navHeader.className = 'nav-wrapper';
            const ulLeft = this.createNode('ul', 'ulLeft', navHeader);
            ulLeft.className = 'left';
            const ulRight = this.createNode('ul', 'ulRight', navHeader);
            ulRight.className = 'right';
            const centerHeader = this.createNode('ul', 'centerHeader', navHeader);
            centerHeader.className = 'center';

            // Left
            // - btn-side-nav
            const iconMenu = this.createNavItem('btn-side-nav', 'low_priority', ulLeft);
            iconMenu.iNode.className += ' light-blue-text text-lighten-5 button-menu-utama-default';
            const liBtnSideNav = document.getElementById('li-btn-side-nav');
            if (typeof liBtnSideNav.style !== 'undefined') {
                liBtnSideNav.style.display = 'block';
            }

            // - Home
            const iconHome = this.createNavItem('btn-home', 'home', ulLeft);
            iconHome.iNode.className += ' light-blue-text text-lighten-5';
            const liBtnHome = document.getElementById('li-btn-home');
            if (typeof liBtnHome.style !== 'undefined') {
                liBtnHome.style.display = 'block';
            }

            // Search Icon
            const iconSearch = this.createNavItem('btn-search', 'search', ulLeft);
            iconSearch.iNode.className += ' light-blue-text text-lighten-5';

            const userTitle = this.createNode('li', 'title-user', ulLeft);
            userTitle.innerHTML = data.username;
            userTitle.style.display = "none";

            const timeHeader = this.createNode('li', 'time-header', ulLeft);
            timeHeader.innerHTML = "";
            timeHeader.style.display = "none";

            const moduleTitle = this.createNode('li', 'title-module', centerHeader);
            moduleTitle.innerHTML = "Home";
            moduleTitle.className = 'title_modul_expand';

            this.createSearch(headerPage);
            const liBtnSearch = document.getElementById('li-btn-search');
            if (typeof liBtnSearch.style !== 'undefined') {
                liBtnSearch.style.display = 'none';
            }
            // Right        
            // - Notification
            const iconNotification = this.createNavItem('btn-notification', 'notifications_none', ulRight);
            iconNotification.iNode.className += ' dropdown-right white-text';
            const attrDataTargetNotification = document.createAttribute("data-target");
            attrDataTargetNotification.value = "notification-dropdown";
            const attrBelowOriginNotification = document.createAttribute("data-beloworigin");
            attrBelowOriginNotification.value = "true";
            iconNotification.aNode.setAttributeNode(attrDataTargetNotification);
            iconNotification.aNode.setAttributeNode(attrBelowOriginNotification);

            const ulNotification = this.createNode('ul', 'notification-dropdown', navHeader);
            ulNotification.className = 'dropdown-content dropdown-custom';

            // - User
            const userMenu = this.createNavItem('btn-user-menu', 'settings_applications', ulRight);
            userMenu.iNode.className += ' dropdown-right white-text';
            const attrDataTargetUser = document.createAttribute("data-target");
            attrDataTargetUser.value = "user-dropdown";
            const attrBelowOriginUser = document.createAttribute("data-beloworigin");
            attrBelowOriginUser.value = "true";
            userMenu.aNode.setAttributeNode(attrDataTargetUser);
            userMenu.aNode.setAttributeNode(attrBelowOriginUser);

            const ulUser = this.createNode('ul', 'user-dropdown', navHeader);
            ulUser.className = 'dropdown-content dropdown-custom';

            // - Username Header Right
            const iconUserName = this.createDropdownItem('menubar_UserName_button', 'person', ulUser);
            const buttonUserName = this.createNode('UserName_setting', iconUserName.aNode);
            buttonUserName.innerHTML = data.username;
            // - Fullscreen
            const iconFullscreen = this.createDropdownItem('btn-fullscreen', 'settings_overscan', ulUser);
            const buttonFullscreen = this.createNode('fullscreen_setting', iconFullscreen.aNode);
            buttonFullscreen.innerHTML = 'Fullscreen Mode';

            // - Clear Cache
            const iconClearCache = this.createDropdownItem('btn-clear-cache', 'loop', ulUser);
            const buttonClearCache = this.createNode('clear-cache_setting', iconClearCache.aNode);
            buttonClearCache.innerHTML = 'Clear Cache';

            // - Update information
            // var iconUpdate = this.createDropdownItem('btn-information', 'sync_problem', ulUser);
            // var buttonUpdate = this.createNode('update_setting', iconUpdate.aNode);
            // buttonUpdate.innerHTML = 'Update Information';
            // var attrUpdate = document.createAttribute("href");
            // attrUpdate.value = "#software_update_information";
            // iconUpdate.aNode.setAttributeNode(attrUpdate);  
            // iconUpdate.aNode.className += ' waves-effect waves-light modal-trigger'; 
            // theme setting
            // var iconUserItem6 = this.createDropdownItem('user-theme-setting', 'palette', ulUser);            
            // var buttonThemeSetting = this.createNode('menubar_theme_setting', iconUserItem6.aNode);
            // buttonThemeSetting.innerHTML = 'Theme Setting';  
            // var attrHrefTheme = document.createAttribute("href");
            // attrHrefTheme.value = "#test_modal_euy";
            // iconUserItem6.aNode.setAttributeNode(attrHrefTheme);  
            // iconUserItem6.aNode.className += ' waves-effect waves-light modal-trigger'; 
            // Support setting
            /* var iconSupportItem6 = this.createDropdownItem('Support-Support-setting', 'help', ulUser);
            var buttonSupportSetting = this.createNode('menubar_Support_setting', iconSupportItem6.aNode);
            buttonSupportSetting.innerHTML = 'Support Apps';
            var attrHrefSupport = document.createAttribute("href");
            attrHrefSupport.value = "http://itsupport.ptsenopati.com/open.php";
            iconSupportItem6.aNode.setAttributeNode(attrHrefSupport);
            iconSupportItem6.aNode.className += ' waves-effect waves-light modal-trigger';  */
            // Change Password
            const iconUserItem2 = this.createDropdownItem('user-change-password', 'lock', ulUser);
            const buttonChangePassword = this.createNode('y_user_menu', iconUserItem2.aNode);
            buttonChangePassword.innerHTML = 'Change Password';
            const attrHrefChangePassword = document.createAttribute("href");
            attrHrefChangePassword.value = "#modal-form-change-password";
            iconUserItem2.aNode.setAttributeNode(attrHrefChangePassword);
            iconUserItem2.aNode.className += ' waves-effect waves-light modal-trigger';
            // Logout
            const iconUserItem5 = this.createDropdownItem('btn-logout', 'exit_to_app', ulUser);
            const buttonLogout = this.createNode('menubar_logout_button', iconUserItem5.aNode);
            buttonLogout.className += ' red-text text-lighten-3';
            buttonLogout.innerHTML = 'Logout';
        }
        createMain() {
            const mainPage = this.createNode('main', document.body);
            mainPage.className = 'main-full grey lighten-5 zzz';

            const sidebar = this.createNode('aside', 'side-nav', mainPage);
            sidebar.className = 'nav-collapsible nav-collapsed white-text';

            const sideNavCollapsible = this.createNode('ul', 'side-nav-collapsible', sidebar);
            sideNavCollapsible.className = "collapsible collapsible-side-nav panel_sidebar";

            this.addSidebarItem(sideNavCollapsible, data.modules);

            $('.side-nav-body').attr('data-collapsible', 'accordion');

            const moduleSection = this.createNode('section', 'module-section', mainPage);
            moduleSection.className = 'content-expanded';
        }
        addSidebarListGroup(parent, title, icon, child) {
            let classModuleIcon = 'material-icons';
            let contentModuleIcon = icon;
            if (icon) {
                if (icon.substring(0, 3) == 'fa-' || icon.substring(0, 4) === 'fas-') {
                    classModuleIcon = 'fa ' + icon;
                    contentModuleIcon = '';
                }
            }
            const h = title === null ? yHtml(child) : yHtml([
                {
                    element: 'li', class: 'side-nav-group no-padding', content: yHtml([
                        {
                            element: 'a', class: 'side-nav-header sidebar_item collapsible-header waves-effect waves-cyan bold', content: yHtml([
                                { element: 'i', class: classModuleIcon, content: contentModuleIcon },
                                { element: 'span', content: title }
                            ])
                        },
                        {
                            element: 'div', 
                            class: 'side-nav-body collapsible-body', 
                            content: yHtml({ element: 'ul', content: yHtml(child)})
                        }
                    ])
                }
            ]);
            parent.innerHTML += h;
        }
        addSidebarItem(parent, modules) {
            var lastModuleGroup = '';
            let groupIcon = '';
            var c = [];
            for (var i in modules) {
                let moduleIcon = '';
                if (i == 0) {
                    moduleIcon = typeof modules[i].module_icon != 'undefined' ? modules[i].module_icon : 'folder_open';
                    groupIcon = typeof modules[i].group_icon != 'undefined' ? modules[i].group_icon : 'folder_open';
                }
                const moduleGroup = typeof modules[i].group != 'undefined' ? modules[i].group : false;
                if (lastModuleGroup != '' && lastModuleGroup != moduleGroup) {
                    this.addSidebarListGroup(parent, lastModuleGroup, groupIcon, c);
                    c = [];
                    moduleIcon = typeof modules[i].module_icon != 'undefined' ? modules[i].module_icon : 'folder_open';
                    groupIcon = typeof modules[i].group_icon != 'undefined' ? modules[i].group_icon : 'folder_open';
                }

                const moduleName = typeof modules[i].name != 'undefined' ? modules[i].name : false;
                const moduleLabel = typeof modules[i].label != 'undefined' ? modules[i].label : false;
                moduleIcon = typeof modules[i].module_icon != 'undefined' ? modules[i].module_icon : false;
                let classModuleIcon = 'material-icons';
                let contentModuleIcon = moduleIcon;
                if (moduleIcon) {
                    if (moduleIcon.substring(0, 3) == 'fa-' || moduleIcon.substring(0, 4) === 'fas-') {
                        classModuleIcon = 'fa ' + moduleIcon;
                        contentModuleIcon = '';
                    }
                }
                c.push({
                    element: 'li', class: 'btn-module', id: 'btn-module-' + moduleName, mod: moduleName, ico: moduleIcon, lab: moduleLabel, content: yHtml([
                        {
                            element: 'a', class: 'side-nav-item waves-effect waves-light', content: yHtml([
                                { element: 'i', class: classModuleIcon, content: contentModuleIcon },
                                { element: 'span', content: moduleLabel }
                            ])
                        }
                    ])
                });
                lastModuleGroup = moduleGroup;
            }
            this.addSidebarListGroup(parent, lastModuleGroup, groupIcon, c);
        }
        initSidebar() {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {
                accordion: false
            });
            $(document).off('click', '.collapsible');
            $(document).off('click', '.collapsible', function () {
                setTimeout(function () {
                    instances.open();
                }, 100);
            });

        }
        createFooter() {
            var footerPage = this.createNode('footer', document.body);
            footerPage.className = 'page-footer footer-fixed';
            var footerText = this.createNode('div', 'center', footerPage);
            footerText.className = 'col s12 center';
            footerText.innerHTML = data.footer;


        }
        html(id, h) {
            // Alias of innerHTML
            if (typeof (id) !== 'undefined' && this.getElement(id) !== 'null') {
                this.getElement(id).innerHTML = h;
            }
        }
        getElement(param) {
            var result;
            if (typeof param === 'string') {
                var type = param.substring(0, 1);
                var name = param.substring(1);
                switch (type) {
                    case '#':
                        result = document.getElementById(name);
                        break;
                    case '.':
                        result = document.getElementsByClassName(name);
                        result.__isClass = result !== null ? true : false;
                        break;
                    default:
                        result = document.getElementById(param);
                        break;
                }
            } else if (typeof param === 'object') {
                result = param;
            } else {
                result = window;
            }
            return result;
        }
        createNode(a, b, c) {
            // _createNode(parent element) => <div></div>
            // _createNode(id, parent element) => <div id='id'></div>
            // _createNode(tag, parent element) => <tag></tag>
            // _createNode(tag, id, parent element) => <tag id='id'></tag> 
            var tag, id, parent;
            var with_id = true;
            if (typeof c === 'undefined') {
                if (typeof b === 'undefined') {
                    tag = 'div';
                    parent = a;
                    with_id = false;
                }
                else {
                    if (_htmlTags.includes(a)) {
                        tag = a;
                        parent = b;
                        with_id = false;
                    }
                    else {
                        tag = 'div';
                        id = a;
                        parent = b;
                    }
                }
            }
            else {
                tag = a;
                id = b;
                parent = c;
            }
            var element = document.createElement(tag);
            if (with_id) { element.id = id; }
            parent.appendChild(element);
            return element;
        }
        createNavItem(id, icon, parent) {
            var res = {};
            const list = this.createListItem('a', id, parent);
            list.aNode.className = 'btn-nav-item waves-effect waves-light btn-floating';
            var iNode = this.createNode('i', 'i-' + id, list.aNode);
            iNode.className = 'material-icons';
            iNode.innerHTML = icon;
            res.lNode = list.lNode;
            res.aNode = list.aNode;
            res.iNode = iNode;
            return res;
        }
        createDropdownItem(id, icon, parent) {
            var res = {};
            const list = this.createListItem('a', id, parent);
            list.aNode.className = 'dropdown-custom-size';
            var iNode = this.createNode('i', list.aNode);
            iNode.className = 'material-icons';
            iNode.innerHTML = icon;
            res.lNode = list.lNode;
            res.aNode = list.aNode;
            res.iNode = iNode;
            return res;
        }
        createNotificationBadge() {
            $('#li-btn-notification').append(
                yM.div({
                    id: 'notification-badge',
                    class: 'notification-badge',
                    content: '0'
                }
                ));
            this.hideNotificationBadge();
        }
        showNotificationBadge(val) {
            val = typeof val !== 'undefined' ? val : parseInt($('#notification-badge').text()) + 1;

            $('#notification-badge').text(val);
            $('#notification-badge').show();
        }
        hideNotificationBadge() {
            $('#notification-badge').text('0');
            $('#notification-badge').hide();
        }
        addNotification(param, message, toast, pulse, time, displayLength) {
            let title = '';
            // notification
            let notification = true;
            // toast
            let inDuration = 300;
            let outDuration = 375;
            let classes = 'rounded';
            let completeCallback = () => { };
            let activationPercent = 0.8;
            // canvas
            let canvas = false;
            let canvasNotification = false;
            let canvasToast = false;
            // callback after
            let afterNotification = () => { };
            let afterToast = () => { };

            if (typeof param === 'object' && !Array.isArray(param) && param !== null) {
                title = typeof param['title'] !== 'undefined' ? param['title'] : '';
                message = typeof param['message'] !== 'message' ? param['message'] : '';
                time = typeof param['time'] !== 'undefined' ? param['time'] : yGetTimeStamp();
                // notification
                notification = typeof param['notification'] !== 'undefined' ? param['notification'] : notification;
                pulse = typeof param['pulse'] !== 'undefined' ? param['pulse'] : true;
                // toast
                toast = typeof param['toast'] !== 'undefined' ? param['toast'] : true;
                // toast parameter
                displayLength = typeof param['displayLength'] !== 'undefined' ? param['displayLength'] : displayLength;
                inDuration = typeof param['inDuration'] !== 'undefined' ? param['inDuration'] : inDuration;
                outDuration = typeof param['outDuration'] !== 'undefined' ? param['outDuration'] : outDuration;
                classes = typeof param['classes'] !== 'undefined' ? param['classes'] : 'rounded';
                completeCallback = typeof param['completeCallback'] !== 'undefined' ? param['completeCallback'] : completeCallback;
                activationPercent = typeof param['activationPercent'] !== 'undefined' ? param['activationPercent'] : activationPercent;
                // canvas
                canvas = typeof param['canvas'] ? param['canvas'] : false;
                canvasNotification = typeof param['canvasNotification'] ? param['canvasNotification'] : false;
                canvasToast = typeof param['canvasToast'] ? param['canvasToast'] : false;
                // callback after
                afterNotification = typeof param['afterNotification'] !== 'undefined' ? param['afterNotification'] : afterNotification;
                afterToast = typeof param['afterToast'] !== 'undefined' ? param['afterToast'] : afterToast;
            }
            else {
                title = typeof (param) !== 'undefined' ? param : '';
                message = typeof (message) !== 'undefined' ? message : '';
                time = typeof (time) !== 'undefined' ? time : yGetTimeStamp();
                // notification
                notification = true;
                pulse = typeof (pulse) !== 'undefined' ? pulse : true;
                // toast
                toast = typeof (toast) !== 'undefined' ? toast : true;
                // toast parameter
                displayLength = typeof (displayLength) !== 'undefined' ? displayLength : 2000;
            }

            // Content
            const arrayContent = [];
            if (title) {
                arrayContent.push({ element: 'p', class: 'card-title', content: title });
            }
            if (time) {
                arrayContent.push({ element: 'p', class: 'timestamp', content: time });
            }
            if (message && message != '') {
                if (!Array.isArray(message)) {
                    arrayContent.push({ element: 'p', content: message });
                }
                else {
                    for (let i in message) {
                        arrayContent.push({ element: 'p', content: message[i] });
                    }
                }
            }

            // notification
            if (notification) {
                const arrayContentNotification = [...arrayContent];
                const guidCanvasNotification = this.guid();
                if (canvas || canvasNotification) {
                    arrayContentNotification.push({
                        element: 'div',
                        content: yHtml([{
                            element: 'canvas',
                            id: guidCanvasNotification
                        }])
                    });
                }
                const notificationContent = yHtml([{
                    element: 'li',
                    class: 'card',
                    content: yHtml([{
                        element: 'div',
                        class: 'card-content',
                        content: yHtml(arrayContentNotification)
                    }])
                }]);
                $('#notification-dropdown').prepend(notificationContent);
                if (pulse) {
                    this.getElement('btn-notification').classList.add('pulse');
                }
                this.showNotificationBadge();
                afterNotification({ guidCanvas: guidCanvasNotification });
            }

            // Toast
            if (toast) {
                const arrayContentToast = [...arrayContent];
                const guidCanvasToast = this.guid();
                if (canvas || canvasToast) {
                    arrayContentToast.push({
                        element: 'div',
                        content: yHtml([{
                            element: 'canvas',
                            id: guidCanvasToast
                        }])
                    });
                }
                const toastContent = yHtml([{
                    element: 'div',
                    class: 'card-content',
                    content: yHtml(arrayContentToast)
                }]);
                M.toast({
                    html: toastContent,
                    classes: classes,
                    displayLength: displayLength,
                    completeCallback: completeCallback,
                    inDuration: inDuration,
                    outDuration: outDuration
                });
                afterToast({ guidCanvas: guidCanvasToast });
            }
        }
        createNotification(id, icon, parent) {
            var res = {};
            list = this.createListItem('a', id, parent);
            list.aNode.className = 'waves-effect waves-light btn-flat modal-trigger';
            var iNode = this.createNode('i', list.aNode);
            iNode.className = 'material-icons';
            iNode.innerHTML = icon;
            res.lNode = list.lNode;
            res.aNode = list.aNode;
            res.iNode = iNode;
            return res;
        }
        initListener() {
            const that = this;

            // Variable search
            var searchInput = this.getElement('menubar_terminal');
            var searchField = this.getElement('menubar_input_field');
            var searchButton = this.getElement('btn-search');

            this.listenerModuleSection();
            this.listenerSideNavButton();
            this.listenerHomeButton();
            this.listenerFullscreenButton();
            this.listenerClearCacheButton();
            this.listenerNotificationButton();
            this.listenerLogoutButton();
            this.listenerModuleButton();

            // Button Search
            $('#btn-search').click(function () {
                if (searchField.style.display == 'block') {
                    searchField.style.display = 'none';
                    searchInput.value = '';
                    that.showModuleIcon(data.modules);
                }
                else {
                    searchField.style.display = 'block';
                    searchInput.focus();
                };
            });

            // Button Close Search
            $('#close_search').click(function () {
                searchField.style.display = 'none';
                searchInput.value = '';
            });

            // Button User
            $(document).on('click', '#menubar_user_info', function () {
                if ($('.y_user_menu').css('display') == 'block') {
                    $('.y_user_menu').hide();
                    that.spotlight = true;
                }
                else {
                    $('.y_user_menu').show();
                    that.spotlight = false;
                }
            });

            var elemsModal = document.querySelectorAll('.modal');
            this.instancesModal = M.Modal.init(elemsModal, {});
            var elemsTapTarget = document.querySelectorAll('.tap-target');
            this.instancesTapTarget = M.TapTarget.init(elemsTapTarget, {});
        }
        listenerModuleSection() {
            _('#side-nav').on('click', '.side-nav-item', () => {
                this.toggleModuleSection();
            });
        }
        listenerSideNavButton() {
            _('#header').on('click', 'btn-side-nav', () => {
                this.toggleSideNav();
            });
        }
        listenerHomeButton() {
            _('#header').on('click', 'btn-home', () => {
                this.showModuleCallback(document.getElementById('btn-module-home'));
            });
        }
        listenerNotificationButton() {
            _('#header').on('click', 'btn-notification', () => {
                this.getElement('btn-notification').classList.remove('pulse');
                this.hideNotificationBadge();
            });
        }
        listenerFullscreenButton() {
            _('#header').on('click', 'btn-fullscreen', () => {
                this.toggleFullScreen();
            });
        }
        listenerClearCacheButton() {
            _('#header').on('click', 'btn-clear-cache', () => {
                window.location.href = window.location.href;
                window.location.reload(true);
            });
        }
        listenerLogoutButton() {
            const url_logout = 'C_home/logout';
            const moduleSection = this.getElement('module-section');
            _('#header').on('click', 'btn-logout', () => {
                moduleSection.innerHTML = '';
                window.location = url_logout;
            });
        }
        listenerModuleButton() {
            const that = this;
            _('#side-nav').on('click', '.btn-module', function (e) {
                e.preventDefault();
                M.Toast.dismissAll();
                const withAlert = that.isFormFilled();
                if (withAlert) {
                    that.showAlertExitModule(this);
                }
                else {
                    that.showModuleCallback(this);
                    // that.toggleSideNav()
                }
            });
        }
        toggleModuleSection() {
            $("#side-nav").removeClass('nav-expanded');
            $("#side-nav").addClass('nav-collapsed');

            $("#i-btn-side-nav").removeClass('button-menu-utama');
            $("#i-btn-side-nav").addClass('button-menu-utama-default');
            const liBtnHome = document.getElementById('li-btn-home');
            if (typeof liBtnHome.style !== 'undefined') {
                liBtnHome.style.display = 'block';
            }
        }
        toggleSideNav() {
            const sideNav = this.getElement("side-nav");
            const moduleSection = this.getElement("module-section");
            const iSideNavButton = this.getElement("i-btn-side-nav");
            const navItemMenu = this.getElement('i-btn-side-nav');
            sideNav.classList.toggle('nav-expanded');
            sideNav.classList.toggle('nav-collapsed');
            sideNav.classList.toggle('title_modul_expand');
            sideNav.classList.toggle('title_modul_collapse');
            moduleSection.classList.toggle('content-expanded');
            moduleSection.classList.toggle('content-expanded');
            iSideNavButton.classList.toggle('button-menu-utama');
            iSideNavButton.classList.toggle('button-menu-utama-default');
            navItemMenu.innerText = navItemMenu.innerText == 'low_priority' ? 'low_priority' : 'low_priority';
            const liBtnHome = document.getElementById('li-btn-home');
            if (typeof liBtnHome.style !== 'undefined') {
                const value = window.getComputedStyle(liBtnHome).display === 'block' ? 'none' : 'block';
                liBtnHome.style.display = value;
            }
        }
        serializeForm(formModule) {
            var serialized = [];
            if (typeof formModule !== 'undefined' && formModule !== null && typeof formModule.elements !== 'undefined') {
                for (var i = 0; i < formModule.elements.length; i++) {
                    var field = formModule.elements[i];
                    if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button')
                        continue;
                    if (field.type === 'select-multiple') {
                        for (var n = 0; n < field.options.length; n++) {
                            if (!field.options[n].selected)
                                continue;
                            serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
                        }
                    }
                    else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                        serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                    }
                }
                return serialized.join('&');
            }
        }
        hasClass(element, selector) {
            let className = " " + selector + " ";
            if ((" " + element.className + " ").replace(/[\t\r\n\f]/g, " ").indexOf(className) >= 0) { return true; }
            else
                return false;
        }
        isFormFilled() {
            let formModule = document.querySelector('.form-module');
            if (typeof formModule !== 'undefined' && formModule !== null && typeof formModule.elements !== 'undefined') {
                for (var i = 0; i < formModule.elements.length; i++) {
                    var field = formModule.elements[i];
                    if (this.hasClass(field, 'ignore-filled'))
                        continue;
                    if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' || field.type === 'select-one' || field.className === 'select-dropdown dropdown-trigger' || field.type === 'hidden' || field.type === 'search')
                        continue;
                    if (field.type === 'select-multiple') {
                        for (var n = 0; n < field.options.length; n++) {
                            if (!field.options[n].selected)
                                continue;
                            if (field.options[n].value) {
                                return true;
                            }
                        }
                    }
                    else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                        if (field.value != '') {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        guid() {
            let r = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
            return (r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r());
        }
        showAlertExitModule(selector) {
            const that = this;
            const toastExitModule = yM.span({
                class: 'span-toast',
                content: "Are you sure want to leave?"
            }) +
                yM.buttonFlat({
                    id: 'btn-cancel-exit-module',
                    class: 'toast-action',
                    content: 'Back'
                }) +
                yM.buttonFlat({
                    id: 'btn-confirm-exit-module',
                    class: 'toast-action',
                    content: 'Yes'
                });

            const instanceToast = M.toast({
                html: toastExitModule,
                displayLength: 20000
            });
            $('#btn-confirm-exit-module').focus();

            $($('#btn-confirm-exit-module').parent()).off('drag');

            $('body').off('click', '#btn-cancel-exit-module');
            $('body').on('click', '#btn-cancel-exit-module', function (e) {
                e.preventDefault();
                instanceToast.dismiss();
            });
            $('body').off('click', '#btn-confirm-exit-module');
            $('body').on('click', '#btn-confirm-exit-module', function (e) {
                e.preventDefault();
                instanceToast.options.completeCallback = () => {
                    that.showModuleCallback(selector);
                };
                instanceToast.dismiss();
            });
        }
        showModuleCallback(selector) {
            const modName = $(selector).attr('mod');
            const modLabel = $(selector).attr('lab');
            $('.btn-module').removeClass('active');
            $(selector).addClass('active');
            $('#title-module').html(modLabel);
            if (modName != 'home') {
                window.yData.moduleOption = {};
                this.createModule(modName);
            }
            else {
                this.createDashboard();
            }
        }
        hideModuleIcon(module_list) {
            for (var i in module_list) {
                var mod = module_list[i];
                var name = mod.name;
                if (name != 'home') {
                    var button = this.getElement('wrapper_button_module_' + name);
                    button.style.display = 'none';
                }
            }
        }
        showModuleIcon(module_list) {
            for (var i in module_list) {
                var mod = module_list[i];
                var name = mod.name;
                if (name != 'home') {
                    var button = this.getElement('wrapper_button_module_' + name);
                    button.style.display = 'block';
                }
            }
        }
        sortModuleIcon(param, module_list) {
            var result = [];
            var index = 0;
            if (param !== '') {
                for (var i in module_list) {
                    var mod = module_list[i];
                    var label = mod.label;
                    if (name != 'home') {
                        var similar = false;
                        var a = param.toLowerCase();
                        var b = label.toLowerCase();
                        if (a.length < b.length) {
                            b = b.substring(0, a.length);
                        }
                        if (a == b) { similar = true; }
                        c = label.toLowerCase().split(' ');
                        for (var j in c) {
                            b = c[j];
                            if (a.length < b.length)
                                b = b.substring(0, a.length);
                            if (a == b)
                                similar = true;
                        }
                        if (similar) {
                            result[index] = module_list[i];
                            index++;
                        }
                    }
                }
            }
            else {
                result = module_list;
            }
            return result;
        }
        hideButtonSearch() {
            _('menubar_input_field').hide();
            searchInput.value = '';
            that.hideModuleIcon(data.modules);
        }
        createDashboard() {
            var that = this;
            var dashboard = this.data.dashboard;
            var url_button = 'C_dashboard_' + dashboard + '/index';
            var success = function (h) {
                if (typeof h.secure !== 'undefined' && h.secure !== '' && typeof h.secure.dashboard !== 'undefined' && h.secure.dashboard !== '' && typeof h.secure.access !== 'undefined' && h.secure.access === true && h.secure.login !== 'undefined' && h.secure.login === true) {
                    var moduleSection = that.getElement('module-section');
                    var modulePanel = yHtml({ element: 'div', id: 'module-panel', class: 'wrapper', content: '' });
                    var script = document.createElement('script');
                    script.setAttribute('src', window.location.origin + '/js/dashboard/v.' + dashboard + '.js');
                    script.type = "text/javascript";
                    moduleSection.innerHTML = modulePanel;
                    moduleSection.appendChild(script);
                    moduleSection.style.display = 'block';
                }
                else {
                    window.location = 'C_login';
                }
            };
            var complete = function () { };
            var error = function () { };
            var jsonError = function (e) {
                window.location = 'C_login';
            };
            getAjax(url_button, '', success, complete, error, jsonError);
        }
        createModule(mod_name) {
            var that = this;
            var url_button = 'C_' + mod_name + '/index';
            // const trigger = document.getElementById('btn-module-'+mod_name)
            // const modIcon = trigger.getAttribute('ico')
            // const modLabel = trigger.getAttribute('lab')
            var success = function (h) {
                if (typeof h.secure !== 'undefined' && h.secure !== '' && typeof h.secure.module !== 'undefined' && h.secure.module !== '' && typeof h.secure.access !== 'undefined' && h.secure.access === true && h.secure.login !== 'undefined' && h.secure.login === true) {
                    window.yData.module = mod_name;
                    // window.yData.icon = modIcon;
                    // window.yData.label = modLabel;
                    var moduleSection = that.getElement('module-section');
                    var modulePanel = yHtml({ element: 'div', id: 'module-panel', class: 'wrapper', content: '' });
                    var script = document.createElement('script');
                    script.setAttribute('src', window.location.origin + '/js/modules/v.' + h.secure.module + '.js?version=' + version);
                    script.type = "text/javascript";
                    moduleSection.innerHTML = modulePanel;
                    moduleSection.appendChild(script);
                    moduleSection.style.display = 'block';
                }
                else {
                    window.location = 'C_login';
                }
            };
            var complete = function () { };
            var error = function () { };
            var jsonError = function (e) {
                window.location = 'C_login';
            };
            getAjax(url_button, '', success, complete, error, jsonError);
        }
        createFormEditPassword() {
            var that = this;
            let username = typeof this.data.username !== 'undefined' ? this.data.username : '';

            var h = yM.modalForm({
                id: 'modal-form-change-password',
                form: { id: 'form-change-password' },
                title: 'Change Password',
                field: [
                    { label: 'Username', class: 'col s12', isHide: true, input: { id: 'input-username', name: 'u', autocomplete: "username", } },
                    { label: 'Old Password', class: 'col s12', input: { id: 'input-current-password', name: 'c', autocomplete: "current-password", class: 'validate input-change-password', type: 'password' } },
                    { label: 'New Password', class: 'col s12', input: { id: 'input-new-password', name: 'n', autocomplete: "new-password", class: 'validate input-change-password', type: 'password' } },
                    { label: 'New Password Confirmation', class: 'col s12', input: { id: 'input-new-password-confirmation', name: 'f', autocomplete: "new-password", class: 'validate input-change-password', type: 'password' } },
                ],
                button: [
                    { id: 'cancel-new-password', class: 'modal-close waves-effect waves-green btn-flat', content: 'Cancel' },
                    { id: 'submit-new-password', class: 'modal-close waves-effect waves-green btn-flat', content: 'Submit' }
                ]
            });
            document.body.innerHTML += h;
            $('#input-current-password').focus();
            $(document).off('click', '#submit-new-password');
            $(document).on('click', '#submit-new-password', function (event) {
                event.preventDefault();
                target = 'C_home/call_change_password';
                var parameter = $('#form-change-password').serialize();
                var callback = function (status) {
                    var title = yHtml({ element: 'i', class: 'material-icons tiny left', content: 'person' });
                    title += yHtml({ element: 'span', content: 'Password' });
                    showAjaxResult(status, false, title);
                    $('.input-change-password').val('');
                };
                postAjax(target, parameter, callback);
            });
        }
        session_check() {
            var callback = function (result) {
                var session;
                if (result) { session = result; }
                hidePreloader();
                if (!session) {
                    window.location = 'C_home/logout';
                }
                else {
                    return true;
                }
            };
            getAjaxText('C_home/get', '', callback);
        }
        toggleFullScreen() {
            if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                if (document.documentElement.requestFullScreen) {
                    document.documentElement.requestFullScreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }
        createListItem(a, b, c) {
            // listItem(parent) => <li><div></div></li>
            // listItem(id, parent) => <li><<div id='id'></div></li>
            // listItem(tag, parent) => <li><tag></tag></li>
            // listItem(tag, id, parent) => <li><tag id='id'></tag></li>
            var res = {};
            var item = false;
            var list = false;
            if (typeof c === 'undefined') {
                if (typeof b === 'undefined') {
                    list = this.createNode('li', a);
                    item = this.createNode(list);
                }
                else {
                    list = this.createNode('li', b);
                    item = this.createNode(a, list);
                }
            }
            else {
                list = this.createNode('li', 'li-' + b, c);
                item = this.createNode(a, b, list);
            }
            res.aNode = item;
            res.lNode = list;
            return res;
        }
    }
    web.prototype.gradArray = new Array(
        'gradient-45deg-amber-amber white-text',
        'gradient-45deg-indigo-purple white-text',
        'gradient-45deg-brown-brown	 white-text',
        'gradient-45deg-red-pink white-text',
        'gradient-45deg-light-blue-cyan white-text',
        'gradient-45deg-light-blue-teal blue-text text-darken-4',
        'gradient-45deg-green-teal white-text',
        'gradient-45deg-purple-amber white-text',
        'gradient-45deg-light-blue-indigo blue-text text-darken-4',
        'gradient-45deg-orange-deep-orange yellow-text text-darken-4',
        'gradient-45deg-light-green-amber teal-text text-darken-4',
        'gradient-45deg-purple-pink red-text text-darken-4'
    );
    if (typeof window === 'object' && typeof window.document === 'object') {
        window.yWeb = web;
    }
})(window);