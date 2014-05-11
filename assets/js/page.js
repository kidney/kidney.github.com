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
    }

    $(document).ready(pageInit);
});