// version=202203101721

$(document).ready(function(){
    window._ = window.y = y;
	window.__ = y(document);
    window.webApp = new yWeb(data);
    
    M.AutoInit();

	const elemsTapTarget = document.querySelectorAll('.tap-target');
	window.instTapTarget = M.TapTarget.init(elemsTapTarget, {});

    // Dropdown
    const optionsDropdownRight = {
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false,
        // hover: true,
        gutter: 0,
        belowOrigin: true,
        alignment: 'right',
        stopPropagation: false
    };
    const elemsDropdownNotification = document.getElementById('btn-notification');
    window.instDropdownNotification = M.Dropdown.init(elemsDropdownNotification, optionsDropdownRight);
    const elemsDropdownUser = document.getElementById('btn-user-menu');
    window.instDropdownUser = M.Dropdown.init(elemsDropdownUser, optionsDropdownRight);

    // Collapsible
    const elemsCollapsible = document.querySelectorAll('.collapsible-side-nav');
    const optionsCollapsible = {
        accordion: true
    };
    window.instCollapsible = M.Collapsible.init(elemsCollapsible, optionsCollapsible);
    
    $(document).off('click','.collapsible');
    $(document).off('click','.collapsible',function(){
        setTimeout(function() {
            window.instCollapsible.open();
        }, 100);
        });
        
    // Fix toast on desktop
    $(document).off('click', '#toast-container .toast');
    $(document).on('click', '#toast-container .toast', function() {
        $(this).fadeOut(function(){
            $(this).remove();
        });
    });

    // Fix select and dropdown touch
    $(document).click(function(){
        $('li[id^="select-options"]').on('touchend', function (e) {
            e.stopPropagation();
        });

        $('ul.dropdown-content>li').on('touchend', function (e) {
            e.stopPropagation();
        });
    });
});