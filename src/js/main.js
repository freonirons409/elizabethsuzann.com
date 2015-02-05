$(document).foundation();
$(document).ready(function() {
    $('.hero').slick({
        responsive: [{
            breakpoint: 640,
            settings: {
                arrows: false
            }
        }]
    });

    //toggle small device menu
    $(".small-menu-toggle").on("click", function() {
        $(".main-nav-wrap").toggleClass("show-small-menu");
    });
    //add main nav clicks/touches for when the small menu toggle is showing
    $(".main-nav").on("click", "li", function(e) {
        if ($(".small-menu-toggle:visible").length) {
            e.stopPropagation();
            if ($(this).children("ul:hidden").length) {
                e.preventDefault();
                $(this).addClass('active');
                $(this).siblings("li").children("ul").slideUp(function() {
                    $(this).removeClass('active');
                    $(this).removeAttr('style');
                });
                $(this).children("ul").slideDown(function() {
                    $(this).addClass('active');
                    //$(this).height("auto");
                    $(this).removeAttr('style');
                });
            }
        }
    });

});