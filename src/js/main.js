function clearOpenItems(t) {
    $("#searchBar,.quick-cart-window,.quick-login-window, .main-nav-wrap").not($(t)).removeClass("toggled");
}

$(document).foundation({
    accordion: {
        callback: function(accordion) {
            if (accordion.hasClass("active")) {
                $('html,body').animate({
                    scrollTop: (accordion.siblings("a[href=#" + accordion.attr("id") + "]").offset().top)
                }, 800);
            }
        }
    }
});
$(window).load(function(){
    $('.grid').masonry({
      // options... 
        columnWidth: '.grid-sizer',
        itemSelector: '.grid-item',
        percentPosition: true
    });
});

$(document).ready(function() {

    $('.slider').slick({
        dots: true,
        responsive: [
            {
              breakpoint: 640,
              settings: {
                arrows:false
              }
            }
        ]
    });
    $('#scrollimages ul').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true
    });
    //single product functions
    $(".swatch-element").each(function(){
        if($(this).hasClass("soldout")) {
            $(this).find("input").attr("disabled", true);
        }
    });
    $(".swatch-element.color").on("click", function(e) {
        var swatchColor = $(this).attr("data-color");
        console.log(swatchColor);
        $(".image-toggle-container").each(function(){
            if($(this).hasClass(swatchColor)) {
                $(this).removeClass("hide");
            } else {
                $(this).addClass("hide");
            }
        });
    });
    $(".product__mainimage .zoomer").zoom();
    //===================================================

    $(".product__sideimages_list li a").on("click", function(e){
        e.stopPropagation();
        $(".product__sideimages_list li a").removeClass("active");
        $(this).addClass("active");
        var $parentContainer = $(this).parent().parent().parent().parent();
        $parentContainer.find(".product__mainimage .zoomer").animate({"opacity": 0},200);
        var img = $(this).attr("data-image");
        var zoomImg = $(this).attr("data-zoom-image");
        $parentContainer.find(".product__mainimage .zoomer img").attr("src",zoomImg);
        $parentContainer.find(".product__mainimage .zoomer img").on("load", function(){
            $parentContainer.find(".product__mainimage .zoomer").animate({"opacity": 1},500);
        });
    });

    /* ALL THIS SCROLLING MESS */
    $(window).scroll(function(){
      var h = $('body').height();
      var y = $(window).scrollTop();
      if( y > (h*.05) ){ $(".topper").fadeIn("slow"); } else { $('.topper').fadeOut('slow'); }
    });
    
    $(".topper a").click(function(event){
         event.preventDefault();
         $('html,body').animate({scrollTop:0}, 800,'swing');
    });
    /*===================================*/

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
        clearOpenItems(".main-nav-wrap");
        $(".main-nav-wrap").toggleClass("toggled");
    });
    //add main nav clicks/touches for when the small menu toggle is showing
    $(".main-nav").on("click", "li", function(e) {
        if ($(".small-menu-toggle:visible").length) {
            e.stopPropagation();
            if ($(this).children("ul:hidden").length) {
                e.preventDefault();
                $(".main-nav").children("li").removeClass("active");
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
            } else if ($(this).children("ul")){
                $(this).removeClass('active').children("ul").slideUp(function(){
                    $(this).removeClass('active');
                    $(this).removeAttr('style');
                });
            }
        }
    });
    //toggle Quick Cart
    $("#adminList .icon-cart").on("click", function() {
        clearOpenItems(".quick-cart-window");
        $(".quick-cart-window").toggleClass("toggled");
    });
    //toggle Quick Login
    $("#adminList .icon-account").on("click", function() {
        clearOpenItems(".quick-login-window");
        $(".quick-login-window").toggleClass("toggled");
    });

    //closing parent containers
    $("body").on("click", ".closer", function(){
        $(this).parent().removeClass("toggled");
    });
    $("body").on("click", ".icon-search", function(){
        clearOpenItems("#searchBar");
        $("#searchBar").toggleClass("toggled");
        $("#searchBar #q").focus();
    });

    $("#forgot_password a").on("click", function(e){
        e.preventDefault();
        $(".flipper").addClass("flip");
    });
    $("#cancel_password").on("click", function(e){
        e.preventDefault();
        $(".flipper").removeClass("flip");
    });

    //product variant functions
    //=====================================================
    $(".variant").hover(
      function () {
        var $parent = $(this).parent().parent();
        var parentImg = $(this).attr("data-variant");
        $parent.find(".variant-image").attr("src", parentImg);
        $(this).addClass("active");
      }, 
      function () {
        var $parent = $(this).parent().parent();
        var parentDefaultImg = $parent.find(".variant-image").attr("data-holder");
        $parent.find(".variant-image").attr("src", parentDefaultImg);
        $(this).removeClass("active");
      }
    );



    //-----------------------------------------------------

    //sticky side bar functions
    //=====================================================
        var stickySidebar = $('.sticky');

        if (stickySidebar.length > 0) { 
          var stickyHeight = stickySidebar.height(),
              sidebarTop = stickySidebar.offset().top;
        }

        // on scroll move the sidebar
        $(window).scroll(function () {
          if (stickySidebar.length > 0) { 
            var scrollTop = $(window).scrollTop();
                    
            if (sidebarTop < scrollTop) {
              stickySidebar.css('top', scrollTop - sidebarTop);

              // stop the sticky sidebar at the footer to avoid overlapping
              var sidebarBottom = stickySidebar.offset().top + stickyHeight,
                  stickyStop = $('.main-content').offset().top + $('.main-content').height();
              if (stickyStop < sidebarBottom) {
                var stopPosition = $('.main-content').height() - stickyHeight;
                stickySidebar.css('top', stopPosition);
              }
            }
            else {
              stickySidebar.css('top', '0');
            } 
          }
        });

        $(window).resize(function () {
          if (stickySidebar.length > 0) { 
            stickyHeight = stickySidebar.height();
          }
        });
});
