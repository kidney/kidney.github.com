define('page', ['$'], function(require, exports, module) {
    var $ = require('$');

    var $win = $(window);

    var $backTop = $('#J-back-top');
    function pageInit() {
        $win.on('scroll', function() {
            var scrollTop = $win.scrollTop();

            $backTop.toggleClass('show', scrollTop > 100);
        });

        $backTop.on('click', function(event) {
            event.preventDefault();

            $('body, html').animate({
                scrollTop: 0
            }, 800);
        });

        $('#page').on('click', '[data-role]', function(event) {
            var $target = $(event.currentTarget);
            var role = $target.attr('data-role');

            if (!role) {
                return;
            }

            event.preventDefault();

            if (role == 'navbar-toggle') {
                var $nav = $('#page').find('[data-role=navbar-collapse]');
                $nav.length && $nav.toggleClass('show');
            }
        });
    }

    $(document).ready(pageInit);
});