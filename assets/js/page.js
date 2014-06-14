define('page', ['$'], function(require, exports, module) {
    var $ = require('$');

    var $win = $(window);

    var $backTop = $('#J-back-top');
    function pageInit() {
        $win.on('scroll', function() {
            var scrollTop = $win.scrollTop();

            $backTop.toggleClass('show', scrollTop > 100);
        });

        var handleEvent = function(event) {
            var $target = $(event.currentTarget);
            var role = $target.attr('data-role');

            if (!role || role == 'ignore') {
                return;
            }

            event.preventDefault();

            switch (role) {
                case 'navbar-toggle':
                    var $nav = $page.find('[data-role=navbar-collapse]');
                    $nav.length && $nav.toggleClass('show');
                    break;
                case 'go-top':
                    $('body, html').animate({
                        scrollTop: 0
                    }, 800);
                    break;
            }
        };

        var $page = $('#page');
        $page.on('click', 'a[data-role=go-top]', handleEvent);
        $page.on('click', 'button[data-role=navbar-toggle]', handleEvent);
    }

    $(document).ready(pageInit);
});