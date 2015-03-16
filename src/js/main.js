$(document).foundation();
$(document).ready(function() {
    
    $('.hero').slick();

    //placeholder
    if (!Modernizr.input.placeholder) {
        $("input").each(function() {
            if ($(this).val() == "" && $(this).attr("placeholder") != "") {
                $(this).val($(this).attr("placeholder"));
                $(this).focus(function() {
                    if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
                });
                $(this).blur(function() {
                    if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
                });
            }
        });
    }
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
    
    //FOR EPISERVER
    $(document).on("click", "a", function(e) {
        var link = $(this).attr("href");
        //only care if the link actually has an href and we don't need to check the eld modal
        if (link != 'undefined' && ($(this).parents('.reveal-modal.external, .reveal-modal.email').length == 0)) {
            //if it's a mailto link
            if (link.indexOf('mailto:') > -1) {
                e.preventDefault();
                $('#continue-email').attr('href', link);
                $('.email.reveal-modal').foundation('reveal', 'open');
            }
            //if the current domain is not in the link and is not a path, 
            else if (link.indexOf(window.location.host) < 0 && link.indexOf('http') > -1) {
                //check each whitelist domain/url against the link
                for (i = 0; i < whiteList.length; i++) {
                    //if the whitelist domain is in the link
                    if (link.indexOf(whiteList[i]) > -1) {
                        //return, no need to keep looking
                        return;
                    }
                }
                //not whitelisted, so set link and open disclaimer modal
                e.preventDefault();
                $('#continue-external').attr('href', link);
                $('.external.reveal-modal').foundation('reveal', 'open');

            }
        }
    });
    //when you click continue, close the modal
    $(document).on('click', '#continue-email, #continue-external', function() {
        $('.close-reveal-modal').trigger('click');
    });

});
