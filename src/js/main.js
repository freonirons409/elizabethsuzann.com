function clearOpenItems(t) {
    if(t) {
        $("#searchBar,.quick-cart-window,.quick-login-window, .main-nav-wrap,#newsletterPopup").not($(t)).removeClass("toggled");
    } else {
        $("#searchBar,.quick-cart-window,.quick-login-window, .main-nav-wrap,#newsletterPopup").removeClass("toggled");
    }
}
function openRecoveryWindow() {
    var hash = window.location.hash;
    if(hash) {
        if(hash === "#recovery") {
            $("#forgot_password a").trigger("click");
        }
    }
}
function resizeSingleProductImages() {
    if($(".product__mainimage")) {
        $(".product__mainimage img").load(function(){
            $(".image-toggle-container").each(function(){
                var mainImageHeight = $(this).find(".product__mainimage .zoomer").height();
                var x = $(this).find(".product__sideimages_list li").length;
                $(this).find(".product__sideimages_list li img").each(function(){
                    $(this).height(mainImageHeight/x);
                });
            });
        });
    }
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
        itemSelector: '.grid-item'
    });
    openRecoveryWindow();
});

$(document).ready(function() {
    //get recovery password hashtag for error returns
    resizeSingleProductImages();
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
    $('.user-image-slider').slick({
        dots: false,
        arrows: true,
        centerMode:true,
        slidesToShow:3,
        draggable:true,
        variableWidth:true,
        adaptiveHeight:true,
        infinite:true,
        responsive: [
            {
              breakpoint: 640,
              settings: {
                centerMode:false,
                slidesToShow:1,
              }
            }
        ]
    });
    $('.blog-slider').slick({
        dots: true,
        slidesToShow:3,
        responsive: [
            {
              breakpoint: 740,
              settings: {
                arrows:true,
                slidesToShow:1
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

    //turn groups of images into slideshow 
    //===================================================
    if($(".text-editor p").length>=1) {
        $(".text-editor p").each(function(){
            $(this).find("img");
            if($(this).find("img").length>=2) {
                $(this).find("img").each(function(){
                    $(this).wrap("<div></div>");
                });
                $(this).replaceWith($('<div class="autoSlider">' + this.innerHTML + '</div>'));
                $(".autoSlider").slick({
                    dots: false,
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 2000,
                    speed: 300,
                    centerMode:true,
                    slidesToShow: 3,
                    variableWidth: true,
                    adaptiveHeight: true,
                    responsive: [
                        {
                          breakpoint: 900,
                          settings: {
                            slidesToShow:2
                          }
                        },
                        {
                          breakpoint: 600,
                          settings: {
                            slidesToShow:1
                          }
                        }
                    ]
                });
            }
        });
    }


    $(".product__mainimage .zoomer").zoom({on: 'grab'});
    //===================================================
    //Image hover functions - based on ALT text for caption
    $("img").each(function(){
      var altText = $(this).attr("alt");
      var patt = new RegExp("HOVER");
      if(patt.test(altText)) {
        var htmlText = altText.replace("HOVER_","")
                       .replace(/\[h1\]/ig,"<h1>").replace(/\[\/h1\]/ig,"</h1>")
                       .replace(/\[h2\]/ig,"<h2>").replace(/\[\/h2\]/ig,"</h2>")
                       .replace(/\[h3\]/ig,"<h3>").replace(/\[\/h3\]/ig,"</h3>")
                       .replace(/\[h4\]/ig,"<h4>").replace(/\[\/h4\]/ig,"</h4>")
                       .replace(/\[h5\]/ig,"<h5>").replace(/\[\/h5\]/ig,"</h5>")
                       .replace(/\[h6\]/ig,"<h6>").replace(/\/h6\]/ig,"</h6>")
                       .replace(/\[p\]/ig,"<p>").replace(/\[\/p\]/ig,"</p>")
                       .replace(/\[button\]/ig,"<button>").replace(/\[\/button\]/ig,"</button>")
                       .replace(/\[br\]/ig,"<br>")
                       .replace(/\[a href\=\|/ig,"<a href=\'").replace(/\|\]/ig,"\'>").replace(/\[\/a\]/ig,"</a>");
        $(this).wrap("<div class='hover-image'></div>").after("<div class='caption'><div class='text'>"+htmlText+"</div></div>");
      }
    });

    //===================================================
    // Single Product functions
    $(".product__sideimages_list li a").on("click", function(e){
        e.stopPropagation();
        $(".product__sideimages_list li a").removeClass("active");
        $('.product__mainimage .zoomer').trigger('zoom.destroy');
        $(this).addClass("active");
        var $parentContainer = $(this).parent().parent().parent().parent();
        $parentContainer.find(".product__mainimage .zoomer").animate({"opacity": 0},200);
        var img = $(this).attr("data-image");
        var zoomImg = $(this).attr("data-zoom-image");
        $parentContainer.find(".product__mainimage .zoomer img").attr("src",zoomImg);
        $parentContainer.find(".product__mainimage .zoomer img").on("load", function(){
            $parentContainer.find(".product__mainimage .zoomer").animate({"opacity": 1},500);
            $(".product__mainimage .zoomer").zoom({on: 'grab'});
        });
    });
        // show selected swatch
        //=====================
        $(".swatch-element input[type='radio']").on("change", function(){
            $(this).parent().parent().parent().parent().find(".selected-swatch").html($(this).parent().find(".square,.circle").clone());
        });

    // more single product functions
    $(".swatch-element").each(function(){
        if($(this).hasClass("soldout")) {
            $(this).find("input").attr("disabled", true);
        }
    });
    $(".swatch-element.color").on("click", function(e) {
        var swatchColor = $(this).attr("data-color");
        //console.log(swatchColor);
        var featureImage = $("."+swatchColor).find(".product__sideimages_list li:first a").attr("data-image");
        var featureId = $("."+swatchColor).find(".product__sideimages_list li:first a").attr("data-image-id");
        //$("."+swatchColor).find(".product__mainimage .zoomer img").animate({"opacity": 0},100);
        $(".image-toggle-container").each(function(){
            if($(this).hasClass(swatchColor)) {
                $(this).removeClass("hide");
            } else {
                $(this).addClass("hide");
            }
        });
        $("."+swatchColor).find(".product__mainimage .zoomer img").attr("src",featureImage).attr("id", featureId);
        // $("."+swatchColor).find(".product__mainimage .zoomer img").on("load", function(){
        //     $("."+swatchColor).find(".product__mainimage .zoomer").animate({"opacity": 1},500);
        // });
    });
    //setting the correct SKU based on color, size, length options selected 
    function switchOption(x,y,z) {
        var searchOption = x + " / " + y;
        if(z) { searchOption += " / " + z; }
        $("div.select option").removeAttr("selected");
        $("div.select option").each(function(){
          if($(this).text()===searchOption) {
              $(this).attr("selected", true);
          }
        });
    }
    //make user images grid layout
    //==================
        if($(".user-grid-container img")){
            $(".user-grid-container").html("<ul class=\"grid user-grid-layout small-block-grid-1 medium-block-grid-2 large-block-grid-3\">\n<li class=\"grid-sizer\"></li>\n"+$(".user-grid-container").html()+"</ul>");
            $(".user-grid-container img").each(function(){
                $(this).wrap("<li class=\"grid-item\"></li>");
            });
        }

    //loader animation while slideshows load
    //==================
    $(".loader").each(function(){
        var $loader = $(this);
        var imgs = $loader.find('img');
        var loaded = 0;
        var $container = $loader.find(".load-watch");
        imgs.each(function() { if ($(this.complete)) ++loaded; });
        if (imgs.length == loaded) {
            console.log("loaded");
            $container.animate({"opacity": 1},600);
        }
    });

    $("#sizes .swatch-element input").on("change", function(){
      var size = $(this).val();
      var color = $("#colors li input:checked").val();
      var length = $("#length li input:checked").val();
      switchOption(color,size,length);
    });
    $("#colors .swatch-element input").on("change", function(){
      var color = $(this).val();
      var size = $("#sizes li input:checked").val();
      var length = $("#length li input:checked").val();
      switchOption(color,size,length);
    });
    $("#length .swatch-element input").on("change", function(){
      var length = $(this).val();
      var size = $("#sizes li input:checked").val();
      var color = $("#colors li input:checked").val();
      switchOption(color,size,length);
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
    // $("body").on("click", function(){
    //     $(".quick-cart-window,.quick-login-window").removeClass("toggled");
    // });
    // $(".quick-cart-window,.quick-login-window, .cart-toggle,.account-toggle").on("click", function(e){
    //     e.stopPropagation();
    // });

    //toggle Quick Cart
    $(".cart-toggle").on("click", function() {
        clearOpenItems(".quick-cart-window");
        $(".quick-cart-window").toggleClass("toggled");
    });
    //toggle Quick Login
    $(".account-toggle").on("click", function() {
        clearOpenItems(".quick-login-window");
        $(".quick-login-window").toggleClass("toggled");
    });
    $(".newsletter-toggle").on("click", function() {
        clearOpenItems("#newsletterPopup");
        $("#newsletterPopup").toggleClass("toggled");
    });

    //closing parent containers
    $("body").on("click", ".closer", function(e){
        e.stopPropagation();
        $(this).parent().removeClass("toggled");
    });
    // $("body").on("click", ".icon-search", function(){
    //     clearOpenItems("#searchBar");
    //     $("#searchBar").toggleClass("toggled");
    //     $("#searchBar #q").focus();
    // });

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
    $("div.variant").on("click", function(e){
        e.stopPropagation();
        var $parent = $(this).parent().parent();
        var parentImg = $(this).attr("data-variant");
        $parent.find(".variant-image").attr("src", parentImg);
        $parent.find(".variant").removeClass("active");
        $(this).addClass("active");
    });

    //make product detail accordions
    //=====================================================
      // $("#productAccordion").find("h5").each(function(i){
      //       var accordion = $(this).nextUntil("h5").andSelf();
      //       $(accordion).find("h5").replaceWith($('<a href="#panel'+i+'a">' + this.innerHTML + '</a>'));
      //       console.log(accordion);
      //   });
    if($("#productAccordion").length>0){
            $("#productAccordion").html().replace('<h5>','</div></li><li class="accordion-navigation"><a href="#panela">').replace('</h5>','</a></a><div id="panela" class="content">');
    }

    //Toggle Address functions in account settings 
    //=====================================================
    $(".cancel-address").on("click", function(){
        var target = $(this).attr("data-id");
        $('#'+target).foundation('reveal', 'close');
    });

    //-----------------------------------------------------

    //sticky side bar functions
    //=====================================================
        var stickySidebar = $('.sticky');

        if (stickySidebar.length > 0) { 
          var stickyHeight = stickySidebar.height(),
              sidebarTop = stickySidebar.offset().top;
        }

        // on scroll move the sidebar
        // $(window).scroll(function () {
        //   if (stickySidebar.length > 0) { 
        //     var scrollTop = $(window).scrollTop();
                    
        //     if (sidebarTop < scrollTop) {
        //       stickySidebar.css('top', scrollTop - sidebarTop);

        //       // stop the sticky sidebar at the footer to avoid overlapping
        //       var sidebarBottom = stickySidebar.offset().top + stickyHeight,
        //           stickyStop = $('.main-content').offset().top + $('.main-content').height();
        //       if (stickyStop < sidebarBottom) {
        //         var stopPosition = $('.main-content').height() - stickyHeight;
        //         stickySidebar.css('top', stopPosition);
        //       }
        //     }
        //     else {
        //       stickySidebar.css('top', '0');
        //     } 
        //   }
        // });

        $(window).resize(function () {
          if (stickySidebar.length > 0) { 
            stickyHeight = stickySidebar.height();
          }
        });
        $("#sidebar .toggler").on("click", function(){
            $(this).parent().toggleClass("toggled");
            $("body").toggleClass("fixed");
            $("#sidebarToggle").toggleClass("toggled");
        });
        $("#sidebarToggle").on("click", function(){
            $(this).toggleClass("toggled");
            $("body").toggleClass("fixed");
            $("#sidebar").toggleClass("toggled");
        });

        //ajax form functions
        //=================================================
        $('form.mc-embedded-subscribe-form').submit(function(e) {
          var submittableForm;
          e.preventDefault();
            submittableForm = $(this);
            if($(this).find(".required.email").val()!="") {
                actionUrl = $(this).attr("action");
                return $.ajax({
                  type: 'GET',
                  url: actionUrl,
                  data: submittableForm.serialize(),
                  cache       : false,
                  dataType    : 'json',
                  contentType: "application/json; charset=utf-8",
                  success: function() {
                    $('.mc-embedded-subscribe-form-container').hide();
                    $('.mc-embedded-subscribe-form-success').fadeIn();
                  },
                  beforeSend: function() {
                    submittableForm.find('input.button').attr('disabled', 'disabled');
                    submittableForm.find('img.loading').fadeIn();
                    return submittableForm.find('div.error').hide().attr('aria-hidden', 'true');
                  },
                  error: function(data) {
                    console.log(data);
                    submittableForm.find('button[type=submit]').removeAttr('disabled');
                    submittableForm.find('img.loading').fadeOut('500');
                    return submittableForm.find('div.error').delay('600').fadeIn().removeAttr('aria-hidden');
                  }
                });
            } else {
                alert("Please enter your email address");
            }
        });

        $('#question form').submit(function(e) {
          var submittableForm;
          e.preventDefault();
            submittableForm = $(this);
            var validationFlag = false;
            $(this).find("input.input-full").each(function(){
                if($(this).val().length<1) {
                    validationFlag = true;
                }
            });
            if(validationFlag===false) {
                actionUrl = $(this).attr("action");
                return $.ajax({
                  type: 'POST',
                  url: actionUrl,
                  data: submittableForm.serialize(),
                  // cache       : false,
                  // dataType    : 'json',
                  // contentType: "application/json; charset=utf-8",
                  success: function() {
                    $('#question .form-container').hide();
                    $('#question .ajax-success').fadeIn();
                  },
                  beforeSend: function() {
                    submittableForm.find('input.button').attr('disabled', 'disabled');
                    //submittableForm.find('img.loading').fadeIn();
                    return submittableForm.find('div.error').hide().attr('aria-hidden', 'true');
                  },
                  error: function(data) {
                    console.log(data);
                    submittableForm.find('button[type=submit]').removeAttr('disabled');
                    //submittableForm.find('img.loading').fadeOut('500');
                    return submittableForm.find('div.error').delay('600').fadeIn().removeAttr('aria-hidden');
                  }
                });
            } else {
                $("#question .error").removeClass("hide");
            }
        });

        //ajax cart functions 
        //=============================
        $('.product__add .add').click(function(e) {
            e.preventDefault();
            var id = $(this).parent().parent().find(".select select option:selected").val();
            var errorFlag = false;
            if($(".product__colorpicker").length>0){
                if($("#colors").find("input[type='radio']:checked").length<=0) {
                    errorFlag = true;
                    $(".product__colorpicker").find(".button").addClass("shake");
                    setTimeout(function(){
                      $(".product__colorpicker").find(".button").removeClass("shake");
                    }, 1500);
                }
            }
            if($(".product__sizepicker").length>0){
                if($("#sizes").find("input[type='radio']:checked").length<=0) {
                    errorFlag = true;
                    $(".product__sizepicker").find(".button").addClass("shake");
                    setTimeout(function(){
                      $(".product__sizepicker").find(".button").removeClass("shake");
                    }, 1500);
                }
            }
            if($(".product__lengthpicker").length>0){
                if($("#length").find("input[type='radio']:checked").length<=0) {
                    errorFlag = true;
                    $(".product__lengthpicker").find(".button").addClass("shake");
                    setTimeout(function(){
                      $(".product__lengthpicker").find(".button").removeClass("shake");
                    }, 1500);
                }
            }
            if(errorFlag) {
                return false;
            } else {
                // Call the addItem() method.
                // Note the empty object as the third argument, representing no line item properties.  
                CartJS.addItem(id, 1, {}, {

                    // Define a success callback to display a success message.
                    "success": function(data, textStatus, jqXHR) {
                        //$('#cartMessage').removeClass('message-error').addClass('message-success').addClass('active');
                        //$('#cartMessage .message').html('Successfully added to cart.');
                        $('.icon-bag').addClass('pulse');
                        $('.quick-cart-window').addClass('toggled');
                        setTimeout(function(){
                          $('.icon-bag').removeClass('pulse');
                          $('#cartMessage').removeClass("active");
                          $('.quick-cart-window').removeClass('toggled');
                        }, 4000);

                    },

                    // Define an error callback to display an error message.
                    "error": function(jqXHR, textStatus, errorThrown) {
                        $('#cartMessage').removeClass('message-success').addClass('message-error').addClass('active');
                        $('#cartMessage .message').html('There was a problem adding to the cart!');
                        setTimeout(function(){
                          $('#cartMessage').removeClass("active");
                        }, 2000);
                    }

                });
            }
        });
        $("#cartMessage .closer").on("click", function(){
            $(this).parent().removeClass('active');
        })
        $(document).on('cart.requestComplete', function(event, cart) {
            $('.cart-toggle .ajax_quantity').html(cart.item_count);
        });
});
