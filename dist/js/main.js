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

    //event handler for search button on small screens
    $(".small-search-toggle").on("click", function() {
        $(this).toggleClass("active");
        $(".small-search-row").toggleClass("show-mobile-search").find("form").toggleClass("swoosh");
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
    //close alert box
    $(".alert-wrap .close").on("click", function(e) {
        $(this).parents(".alert-wrap").hide();
    });

    //change height of menu for all items if text wraps
    var fixMainMenuTextWrap = function() {
        var maxHeight = 0;
        $(".main-nav").children("li").children("a").height("auto").each(function() {
            maxHeight = Math.max(maxHeight, $(this).innerHeight());
        }).css({
            "height": maxHeight
        });
    };

    //need to wait on window load to make sure google font renders first
    $(window).load(function() {
        fixMainMenuTextWrap();
    });

    //check menu text wrap on window resize
    $(window).resize(function() {
        fixMainMenuTextWrap();
    });

    //add classes to set fluid widths in nav
    $(".main-nav > li > ul").each(function() {
        $(this).addClass("col-" + $(this).children().length);
    });
    $("#rates-product").on("change", function() {
        $(".featured-rate-section").removeClass('active').eq($(this).find(':selected').index()).addClass('active');
    });

    //if calcs are on the page add modal div and click handler
    if ($('a[href*="/calcs/"]').length) {
        $('body').append('<div id="calcModal" class="reveal-modal" data-reveal style="top: 3% !important;"><div class="close-reveal-modal">X</div></div>');

        $('a[href*="/calcs/"]').on("click", function(e) {
            e.preventDefault();
            if (!$("#calcModal").find('iframe').length) {
                $('<iframe width="100%" height="100%" />').appendTo($("#calcModal"));
            }
            $("#calcModal iframe").attr('src', $(this).attr('href'));
            $("#calcModal").foundation('reveal', 'open');
        });
    }
    //accordions
    $(".accordion-title").on("click", function(e) {
        var $parent = $(this).parents(".accordion");
        e.preventDefault();
        if ($parent.hasClass("active")) {
            $parent.removeClass("active");
            $(this).removeClass("icon-minus").addClass("icon-plus");
        } else {
            $(".accordion").removeClass("active");
            $(".accordion-title").removeClass("sprite-before-minus").addClass("icon-plus");
            $parent.addClass("active");
            var containerPos = $parent.offset().top;
            $('html, body').animate({
                scrollTop: containerPos
            }, 600);
            $(this).removeClass("icon-plus").addClass("icon-minus");
        }

    });
});