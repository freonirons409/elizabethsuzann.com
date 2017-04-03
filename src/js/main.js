/*
 * jQuery outside events - v1.1 - 3/16/2010
 * http://benalman.com/projects/jquery-outside-events-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,c,b){$.map("click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup".split(" "),function(d){a(d)});a("focusin","focus"+b);a("focusout","blur"+b);$.addOutsideEvent=a;function a(g,e){e=e||g+b;var d=$(),h=g+"."+e+"-special-event";$.event.special[e]={setup:function(){d=d.add(this);if(d.length===1){$(c).bind(h,f)}},teardown:function(){d=d.not(this);if(d.length===0){$(c).unbind(h)}},add:function(i){var j=i.handler;i.handler=function(l,k){l.target=k;j.apply(this,arguments)}}};function f(i){$(d).each(function(){var j=$(this);if(this!==i.target&&!j.has(i.target).length){j.triggerHandler(e,[i.target])}})}}})(jQuery,document,"outside");
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
        if($(".screen-size").css("float")==="left" || $(".screen-size").css("float")==="none") {
            $(".image-toggle-container").each(function(){
                var mainImageHeight = $(this).find(".product__mainimage .zoomer").height();
                var x = $(this).find(".product__sideimages_list li").length;
                $(this).find(".product__sideimages_list li img").each(function(){
                    $(this).height(mainImageHeight/x);
                });
            });
        } else {
            $(".image-toggle-container").each(function(){
                var mainImageWidth = $(this).find(".product__mainimage .zoomer").width();
                var y = $(this).find(".product__sideimages_list li").length;
                $(this).find(".product__sideimages_list li img").each(function(){
                    $(this).width(mainImageWidth/y);
                    //console.log(mainImageWidth);
                });
            });
        }
    }
}
function makeFooterStayDown() {
    if($("body").hasClass("template-index")) {
        $(".master-container").css({"padding-bottom": $("footer").height()+36});
    } else {
        $(".master-container").css({"padding-bottom": $("footer").height()+80});
    }
}
function formatCartPrices() {
    $(".quick-cart-details .cart-price").each(function(){
        if($(this).text().indexOf("$") == -1){
            $(this).text("$"+(parseFloat($(this).text())/100).toFixed(2));
        }
    })
}
function setQuickCartHeader() {
    if($(".screen-size").css("float")==="right") {
        $(".quick-cart-window").css({"top": $("header").height()});
    } else {
        $(".quick-cart-window").css({"top": $(".alert-bar").outerHeight()});
    }
}
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}
function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
function changeSwatchStatus(x,y,z){
    //console.log(x.text());
    if(y==="color") {
        var unavailableItem = x.text().split(" / ")[1];
        $(".swatch-element[data-value='"+unavailableItem+"']").removeClass("available").addClass("unavailable").find("input").removeAttr("checked").attr("disabled", true);
    } else {
        //console.log("dfjdf");
        if($("#length").length <= 0) {
            $("#sizes .swatch-element").each(function(){
                $(this).removeClass("unavailable").addClass("available").find("input").removeAttr("disabled");
            });
            var soldoutArray = x.text().split(" / ");
            jQuery.each(soldoutArray, function(index, item) {
                if(index>0){
                    $(".swatch-element[data-value='"+soldoutArray[index]+"']").removeClass("available").addClass("unavailable").find("input").removeAttr("checked").attr("disabled", true);
                }
            });
        } else {
            var soldoutArray = x.text().split(z);
            var unavailableItem = soldoutArray[1].replace(/\s\/\s/,"");
            $(".swatch-element[data-value='"+unavailableItem+"']").removeClass("available").addClass("unavailable").find("input").removeAttr("checked").attr("disabled", true);
        }
    }
    //console.log(unavailableItem);
    
}
function checkAvailability(x) {
    // x equals changed input value
    var selectedColor,selectedSize,selectedLength;
    $("#colors input").each(function(){ if($(this).is(":checked")) { selectedColor = $(this).val(); }});
    $("#sizes input").each(function(){ if($(this).is(":checked")) { selectedSize = $(this).val(); }});
    $("#length input").each(function(){ if($(this).is(":checked")) { selectedLength = $(this).val(); }});

    $(".product__sizepicker .swatch-element,.product__lengthpicker .swatch-element")
            .removeClass("unavailable")
            .addClass("available")
            .find("input")
            .removeAttr("disabled");

    $(".select option").each(function(){
        var $swatch = $(this);
        if($swatch.attr("data-available")==="unavailable") {
            var soldOutString = $swatch.text().split("/");
            //console.log(soldOutString);
            if(selectedColor === soldOutString[0].trim()) {
                if($("#length").length <= 0) {
                    $(".product__sizepicker .swatch-element[data-value='"+soldOutString[1].trim()+"']")
                        .addClass("unavailable")
                        .removeClass("available")
                        .find("input")
                        .attr("disabled",true)
                        .prop("checked",false);
                } else {
                    if(selectedSize === soldOutString[1].trim()) {
                        if(soldOutString[2]) {
                            $(".product__lengthpicker .swatch-element[data-value='"+soldOutString[2].trim()+"']")
                            .addClass("unavailable")
                            .removeClass("available")
                            .find("input")
                            .attr("disabled",true)
                            .prop("checked",false);
                        }
                    }
                }
            }
        }
    });
}
function autoSelectFirstColor() {
    var colorOption = $(".swatch.colors").attr("data-option-index");
    var selectedVariant = false;
    $(".image-toggle-container").each(function(){
        if($(this).hasClass("hide")==false) {
            selectedVariant = $(this).attr("class").replace("row image-toggle-container ","");
        }
    });
    if(selectedVariant) {
        $(".swatch-element.color").each(function(){
            if($(this).attr("data-color") == selectedVariant) {
                $(this).find("input[name='option-"+colorOption+"']").attr('checked',true).trigger("change").trigger("click");
            }
        });
    } else {
        if(colorOption) {
            $("input[name='option-"+colorOption+"']").first().attr('checked',true).trigger("change").trigger("click");
        }
    }
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
function loadProductSlider() {
    $('.product-slider').slick({
        dots: false,
        slidesToShow:6,
        infinite:false,
        arrows:true,
        responsive: [
            {
              breakpoint: 1100,
              settings: { arrows:true, infinite:true, slidesToShow:4 }
            },
            {
              breakpoint: 800,
              settings: { slidesToShow:3, arrows:true }
            },
            {
              breakpoint: 600,
              settings: { slidesToShow:2, arrows:true }
            },
            {
              breakpoint: 350,
              settings: { slidesToShow:1, arrows:true }
            }
        ]
    });
}
$(document).foundation({
    accordion: {
        multi_expand: false,
        callback: function(accordion) {
            if (accordion.hasClass("active")) {
                if(accordion.parent().parent().hasClass("no-jump")===false ) {
                        $('html,body').animate({
                            scrollTop: (accordion.siblings("a[href=#" + accordion.attr("id") + "]").offset().top-90)
                        }, 800);
                } else {
                    $(".user-grid-container").css({"min-height": $(".sidebar-track").outerHeight() });
                }
            }
        }
    },
    reveal: {
        animation: 'none',
        animation_speed: 250
    }
});
$(window).load(function(){
    formatCartPrices();
    $('.grid').masonry({
      // options... 
        columnWidth: '.grid-sizer',
        itemSelector: '.grid-item'
    });
    makeFooterStayDown();
    openRecoveryWindow();
    autoSelectFirstColor();
    resizeSingleProductImages();
    if($("body").hasClass("newsletter-promo")){
        if(readCookie('newsletterOption')!=1) {
            setTimeout(function(){
                $("#newsletterPopup").addClass("toggled");
            },10000);
        }
    }
    if($("body").hasClass("template-customers-login")) {
        if(window.location.hash === "#recover") {
            ////console.log(window.location.hash);
            $("#forgot_password a").trigger("click");
        }
    }
    $('.product-slider').on('init', function(event, slick){
        ////console.log("product slider loaded, fading in");
        setTimeout(function(){
          $("ul.related-products").animate({"opacity": 1},500);
        }, 800);
    });
    loadProductSlider();
    
});
$(window).resize(function () {
    resizeSingleProductImages();
    makeFooterStayDown();
    setQuickCartHeader();
});
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
$(document).ready(function() {
    formatCartPrices();
    // $("button").on("click",function(){
    //     alert("button!");
    //     if($(this).find("a").length>1) {

    //         $(this).find("a").trigger("click");
    //     }
    // });
    
    $(".swatch-element input").change(function(){
        checkAvailability($(this).val());
    })

    if($(".screen-size").css("float")!="right" && $(".bottom-blog").length <= 0 ){
        $(".sticky").sticky({topSpacing:64,bottomSpacing:250});
    }
    if($(".bottom-blog").length >0 ) {
        $(".bottom-blog").ready(function(){
            var bottomVar = $(".bottom-blog").outerHeight()+290;
            ////console.log(bottomVar);
            $(".sticky").sticky({topSpacing:64,bottomSpacing: bottomVar});
        });
        
        // $(window).scroll(function(){
        //     if($("#sticky-wrapper").hasClass("is-sticky")) {
        //         var $div = $( '.bottom-blog' );
        //         var returnTop = 64;
        //         if ( $div.is( ':in-viewport(480)' ) ) {
        //             $(".sticky-wrapper").height($(".main-content").height());
        //             //$(".sticky").unstick();
        //             $(".sticky").css({'position': 'absolute', 'bottom': 37, 'top': 'auto'});
        //         } else {
        //             $(".sticky").css({'bottom': 'auto', 'top': returnTop, 'position': 'fixed'});
        //         }
        //     }
        // });
    }

    if($("body").hasClass("template-product")) {
        resizeSingleProductImages();
    }

    $("body").on("click", ".noclick", function(e){
        e.preventDefault();
    });
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
              settings: { centerMode:false, slidesToShow:1 }
            }
        ]
    });
    $('.blog-slider').slick({
        dots: false,
        slidesToShow:3,
        responsive: [
            {
              breakpoint: 740,
              settings: { arrows:true, dots: false, adaptiveHeight: true, slidesToShow:1
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

    $("#sidebar .toggler").on("click", function(){
        $(this).parent().toggleClass("toggled");
        $("#sidebar").css({ "top": $("header").height() });
        $("body").toggleClass("fixed");
        $("#sidebarToggle").toggleClass("toggled");
    });
    $("#sidebarToggle").on("click", function(){
        $(this).toggleClass("toggled");
        $("#sidebar").css({ "top": $("header").height() });
        $("body").toggleClass("fixed");
        $("#sidebar").toggleClass("toggled");
    });

    //turn customer profile images into sliders
    //===================================================
    if($(".collection-profile-slider").length>0) {
        $(".collection-description.text-editor img").each(function(){
            $(".collection-profile-slider").append($(this));
        });
        $(".collection-profile-slider img").each(function(){
            $(this).wrap("<div></div>");
        });
        $('.collection-profile-slider').slick({
            dots: false,
            infinite: true,
            speed: 300,
            arrows:true,
            draggable:true,
            centerMode:true,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            adaptiveHeight: false,
            responsive: [
                {
                  breakpoint: 900,
                  settings: { slidesToShow:2, slidesToScroll: 2 }
                },
                {
                  breakpoint: 600,
                  settings: { slidesToShow:1 }
                }
            ]
        });
    } else {
        //turn groups of images into slideshow 
        //===================================================
    if($(".text-editor p").length>=1 ) {
        $(".text-editor p").each(function(index){
            var x = index;
            $(this).find("img");
            if($(this).find("img").length>=2) {
                $(this).find("img").each(function(){
                    $(this).wrap("<div></div>");
                });
                $(this).replaceWith($('<div class="loader"><div class="load-watch"><div class="autoSlider" id="autoSlider'+x+'">' + this.innerHTML + '</div></div></div>'));
                $("#autoSlider"+x).slick({
                    dots: false,
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    speed: 300,
                    centerMode:true,
                    slidesToShow: 3,
                    variableWidth: true,
                    adaptiveHeight: true,
                    responsive: [
                        {
                          breakpoint: 900,
                          settings: { slidesToShow:2 }
                        },
                        {
                          breakpoint: 800,
                          settings: { slidesToShow:1, centerMode:false, variableWidth: true, adaptiveHeight: false }
                        }
                    ]
                });
            }
        });
    }
    }

    //fixing button clicks in hover captions 



    //Diversity image details
    //---------------------------------------------------
    if($(".diversity-panel-container img").length>0) {
        var divAlt = $(".diversity-panel-container img").attr("alt");
        var $personContainer = $(".diversity-panel-details");
        var listHTML = "";
        var personCount = 0;
        var personArray = divAlt.match(/\[person\](.*?)\[\/person\]/ig);
        for (i = 0; i < personArray.length; i++) {
            ////console.log(personArray[i]);
            var userURL = personArray[i].match(/\[(person\-name)\](.*)\[\/(person\-name)\]/i);
            var userSlug = userURL[0].replace("[person-name]","").replace("[/person-name]","").replace(/\s/ig,"-").replace("\.","").toLowerCase();
            ////console.log(userSlug);
            listHTML += personArray[i].replace("[person]","<li><a href=\"/collections/"+userSlug+"\">")
                .replace("[/person]","</a></li>")
                //.replace("[person-age]","<div class=\"person-age\">Age: ")
                .replace("[person-age]","<div class=\"clearfix\">")
                .replace("[person-weight]","<div class=\"person-weight\">Weight: ")
                .replace("[person-size]","<div class=\"person-size\">Size: ")
                .replace("[person-height]","<div class=\"person-height\">Height: ")
                .replace("[person-name]","<div class=\"person-name\">")
                .replace(/\[\/person\-(.*?)\]/ig,"</div>");
            personCount++
        }
        $personContainer.addClass("small-block-grid-"+personCount).html(listHTML);
    }

    //customer image filtering
    //===================================================
    $grid = $('.user-grid-layout');
    $(".filter-list a").on("click", function(e){
        e.preventDefault();
        $(".filter-list a").removeClass("active");
        $(this).addClass("active");
        var filterText = $(this).text();
        var filterVar = $(this).attr("data-filter");
        if(filterVar) {
            $(".user-grid-layout .grid-item").fadeOut(200,function(){
                $('.user-grid-layout').imagesLoaded().progress( function() {
                  $('.user-grid-layout').masonry('layout');
                });
            });
            $(".filter-clear").html(filterText+ " [&times;]");
            if($("."+filterVar).length>=1) {
                $("."+filterVar).each(function(){
                    if($(this).parent().parent().hasClass("hover-image")||$(this).parent().hasClass("hover-image-alt")||$(this).parent().hasClass("hover-image-alt-2")||$(this).parent().hasClass("hover-image-alt-3")) {
                        ////console.log("hasHover");
                        $(this).parent().parent().parent().fadeIn();
                    } else {
                        $(this).parent().parent().fadeIn();
                    }
                });
                $(".grid-sizer").text("");
                $('.user-grid-layout').imagesLoaded().progress( function() {
                  $('.user-grid-layout').masonry('layout');
                });
            } else {
                $(".grid-sizer").text("Could not find any results. Please select a different option.");
            }
            $("#sidebar").removeClass("toggled");
            $("#sidebarToggle").removeClass("toggled");
            $("body").removeClass("fixed");
            $(".user-grid-container").css({"min-height": $(".sidebar-track").height() });
        }
    });
    $(".customer-filters .accordion-navigation").on("click", function(){
        $(".customer-filters .accordion-navigation").not(this).removeClass("active").find(".content").removeClass("active")
    });
    $(".filter-clear").on("click", function(e){
        $(".filter-list a").removeClass("active");
        $(this).text("");
        $(".grid-sizer").text("");
        $(".user-grid-layout .grid-item").fadeIn();
        $('.user-grid-layout').masonry({
          // options... 
            columnWidth: '.grid-sizer',
            itemSelector: '.grid-item'
        });
    });

    if($(".screen-size").css("float") != "right") {
        $(".product__mainimage .zoomer").zoom({on: 'click'});
    }
    //make user images grid layout
    //==================
        if($(".user-grid-container a")){
            $(".user-grid-container").html("<ul class=\"grid user-grid-layout small-block-grid-1 medium-block-grid-2 large-block-grid-3\">\n<li class=\"grid-sizer\"></li>\n"+$(".user-grid-container").html()+"</ul>");
            $(".user-grid-container a").each(function(){
                $(this).wrap("<li class=\"grid-item\"></li>");
            });
        }
        if($(".fabric-grid-container img")){
            $(".fabric-grid-container").html("<ul class=\"grid user-grid-layout small-block-grid-1 medium-block-grid-2 large-block-grid-3\">\n<li class=\"grid-sizer\"></li>\n"+$(".fabric-grid-container").html()+"</ul>");
            $(".fabric-grid-container img").each(function(){
                $(this).wrap("<li class=\"grid-item\"></li>");
            });
            $('.fabric-grid-layout').imagesLoaded().progress( function() {
                  $('.fabric-grid-layout').masonry('layout');
                });
        }

    //===================================================
    // $(".user-image-slider .slick-slide img").each(function(){
    //     var $theImage = $(this);
    //     var altText = $(this).attr("alt");
    //     var pattTest = new RegExp(/\[linkthis\]/);
    //     if(pattTest.test(altText)) {
    //         var linkedUrl = altText.match(/\[linkthis\].*\[\/linkthis\]/)[0].replace("[linkthis]","").replace("[/linkthis]","");
    //         $theImage.wrap("<a href='"+linkedUrl+"''></a>");
    //     }
    // });
    //Image hover functions - based on ALT text for caption
    $("body").on("click", ".caption button", function(e){
            e.preventDefault();
            e.stopPropagation();
            var linkedUrl = $(this).find("a").attr("href");
            if(linkedUrl) {
                window.location = linkedUrl;
            }
    });
      var patt = new RegExp("HOVER");
      var altPatt = new RegExp("HOVER2");
      var alt2Patt = new RegExp("HOVER3");
      var alt3Patt = new RegExp("HOVER4");
        $("img").each(function(){
            var hoverClass = "hover-image";
            var altText = $(this).attr("alt");
          if(patt.test(altText)||altPatt.test(altText)) {
            var htmlText = altText.replace(/HOVER[1-4]*\_/,"")
               .replace(/\[h1\]/ig,"<h1>").replace(/\[\/h1\]/ig,"</h1>")
               .replace(/\[h2\]/ig,"<h2>").replace(/\[\/h2\]/ig,"</h2>")
               .replace(/\[h3\]/ig,"<h3>").replace(/\[\/h3\]/ig,"</h3>")
               .replace(/\[h4\]/ig,"<h4>").replace(/\[\/h4\]/ig,"</h4>")
               .replace(/\[h5\]/ig,"<h5>").replace(/\[\/h5\]/ig,"</h5>")
               .replace(/\[h6\]/ig,"<h6>").replace(/\/h6\]/ig,"</h6>")
               .replace(/\[p\]/ig,"<p>").replace(/\[\/p\]/ig,"</p>")
               .replace(/\[em\]/ig,"<em>").replace(/\[\/em\]/ig,"</em>")
               .replace(/\[button\]/ig,"<button>").replace(/\[\/button\]/ig,"</button>")
               .replace(/\[br\]/ig,"<br>")
               .replace(/\[a href\=\|/ig,"<a href=\'").replace(/\|\]/ig,"\'>").replace(/\[\/a\]/ig,"</a>");
            if(altPatt.test(altText)) { 
                hoverClass = "hover-image-alt";
            }
            if(alt2Patt.test(altText)) { 
                hoverClass = "hover-image-alt-2";
            }
            if(alt3Patt.test(altText)) { 
                hoverClass = "hover-image-alt-3";
            }
            $(this).wrap("<div class='"+hoverClass+"'></div>").after("<div class='caption'><div class='closer show-for-small-only'></div><div class='text'>"+htmlText+"</div></div>");
          }
        });
        $(".hover-image-alt-2,.hover-image-alt-3, .hover-image-alt, .hover-image").on("click", function(e){
                //console.log(e.target.nodeName);
                if(e.target.nodeName != "A" && e.target.nodeName != "BUTTON") {
                    e.preventDefault();
                }
        });
        $(".hover-image-alt-2 .closer, .hover-image-alt-3 .closer, .hover-image-alt .closer, .hover-image .closer").on("click", function(e){
            if($(".screen-size").css("float") === "right") {
               $(this).parent().fadeOut(10);
            }
        });
        $(".hover-image-alt-2, .hover-image-alt-3, .hover-image-alt, .hover-image").on("click", function(e){
            if($(".screen-size").css("float") === "right") {
               $(".caption",this).removeAttr("style");
               //$(".hover-image:hover:before, .hover-image-alt:hover:before").css({"opacity": 1});
            }
        });

    //===================================================
    // Single Product functions
    $(".product__sideimages_list li a").on("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        $(".product__sideimages_list li a").removeClass("active");
        $('.product__mainimage .zoomer').trigger('zoom.destroy');
        $(this).addClass("active");
        var $parentContainer = $(this).parent().parent().parent().parent();
        //$parentContainer.find(".product__mainimage .zoomer").animate({"opacity": 0},200);
        var img = $(this).attr("data-image");
        var zoomImg = $(this).attr("data-zoom-image");
        $parentContainer.find(".product__mainimage .zoomer img").attr("src",zoomImg);
        $parentContainer.find(".product__mainimage .zoomer img").on("load", function(){
            //$parentContainer.find(".product__mainimage .zoomer").animate({"opacity": 1},200);
            if($(".screen-size").css("float") != "right") {
                $(".product__mainimage .zoomer").zoom({on: 'click'});
            }
            resizeSingleProductImages();
        });
    });
    function checkSwatches() {
        var swatchFlag = "true";
        $(".swatch").each(function(index){
            if(!$(this).find("input[name='option-"+index+"']:checked").val()){
               //console.log("required swatches not selected");
               swatchFlag = "false";
            }
        });
        return swatchFlag;
    }

        // show selected swatch
        //=====================
        $(".swatch-element input[type='radio']").on("change", function(){
            //$(this).parent().parent().parent().parent().find(".selected-swatch").html($(this).parent().find(".square,.circle").clone());
            //$(this).parent().parent().parent().parent().find(".selected-text").text($(this).parent().find(".text").text());
            //console.log(checkSwatches());
            var swatchFlag = checkSwatches();
            if(swatchFlag==="true") {
                $(".product__add .button").removeClass("disabled").removeAttr("disabled");
            } else {
                $(".product__add .button").addClass("disabled").attr("disabled",true);
            }
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
        resizeSingleProductImages();
        $("."+swatchColor).find(".product__mainimage .zoomer img").attr("src",featureImage).attr("id", featureId);
        // $("."+swatchColor).find(".product__mainimage .zoomer img").on("load", function(){
        //     $("."+swatchColor).find(".product__mainimage .zoomer").animate({"opacity": 1},500);
        // });
    });
    //setting the correct SKU based on color, size (, length options selected 
    function switchOption(x,y,z) {
        var searchOption = "";
        if(x && y && z) { searchOption = x + " / " + y + " / " +z; }
        if(x && y && !z) { searchOption = x + " / " + y; }
        if(!x && y && !z) { searchOption = y; }
        if(!x && !y && z) { searchOption = z; }
        //console.log(searchOption);
        $("div.select option").removeAttr("selected");
        $("div.select option").each(function(){
            //console.log($(this).text());
          if($(this).text()===searchOption) {
              $(this).attr("selected", true);
          }
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
            //console.log("loaded");
            $container.animate({"opacity": 1},600);
            $loader.css({"background": "transparent"});
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
        //$('html,body').animate({scrollTop:0}, 800,'swing');
        $("header").toggleClass("toggled");
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
    $(".main-nav > li > a").on("mouseover", function(){
        clearOpenItems(".main-nav-wrap, #newsletterPopup");
    });
    // $("body").on("click", function(){
    //     $(".quick-cart-window,.quick-login-window").removeClass("toggled");
    // });
    // $(".quick-cart-window,.quick-login-window, .cart-toggle,.account-toggle").on("click", function(e){
    //     e.stopPropagation();
    // });
    $(".quick-login-window,.quick-cart-window").bind( "clickoutside", function(event){
        $(this).removeClass("toggled");
    });
    //toggle Quick Cart
    $(".quick-cart-window").hover(function(e){
        e.stopPropagation();
    });
    $(".quick-cart-window").on("mouseleave", function(e){
        $(".quick-cart-window").removeClass("toggled");
    });
    $(".master-cart-toggle").on("mouseover click", function(e) {
        e.preventDefault();
        clearOpenItems(".quick-cart-window");
        $(".quick-cart-window").addClass("toggled");
        setQuickCartHeader();
        formatCartPrices();
    });
    
    $(".show-for-small-only .cart-toggle").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        clearOpenItems(".quick-cart-window");
        $(".quick-cart-window").toggleClass("toggled");
        setQuickCartHeader();
        formatCartPrices();
    });
    //toggle Quick Login
    $(".account-toggle").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        clearOpenItems(".quick-login-window");
        $(".quick-login-window").toggleClass("toggled");
        if($(".screen-size").css("float")==="right") {
            $(".quick-login-window").css({"top": $("header").height()});
        }
    });
    //trying to fix the bug where removing items leaves prices unformatted
    $(".remove_item").on("click", function() {
        setTimeout(function(){
          formatCartPrices();
        }, 800);
    });
    $(".newsletter-toggle").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        clearOpenItems("#newsletterPopup");
        $("#newsletterPopup").toggleClass("toggled");
    });
    //closing parent containers
    $("body").on("click", ".closer", function(e){
        e.stopPropagation();
        if($(this).parent().attr("id")==="newsletterPopup") {
            createCookie("newsletterOption",1,200);
            $(this).parent().removeClass("toggled");
        } else {
            $(this).parent().removeClass("toggled");
        }
    });
    // $("body").on("click", ".icon-search", function(){
    //     clearOpenItems("#searchBar");
    //     $("#searchBar").toggleClass("toggled");
    //     $("#searchBar #q").focus();
    // });

    $("#forgot_password a").on("click", function(e){
        e.preventDefault();
        $(".flipper").addClass("flip");
        $("#recover-email").focus();
    });
    $("#cancel_password").on("click", function(e){
        e.preventDefault();
        $(".flipper").removeClass("flip");
    });

    //lighbox functions for images and shit
    // ====================================================
    $("body").on("click",".lightbox", function(e){
        e.preventDefault();
        makeLightbox($(this));
    });
    $("body").on("click",".hover-image, .hover-image-alt", function(e){
        if($(this).find(".lightbox").length>0) {
            e.preventDefault();
            makeLightbox($(this).find("img"));
        }
    });
    function makeLightbox(lb) {
        var imgSrc="";
        var imgAlt = "";
        $("#lightbox .image").html("");

        if(lb.attr("src")) {
            imgSrc = lb.attr("src");
            imgAlt = lb.attr("alt");
        } else {
            imgSrc = lb.find("img").attr("src");
            imgAlt = lb.find("img").attr("alt");
        }
        if(!imgAlt) {
            imgAlt = "Full width lightbox image";
        }
        if(imgSrc!="") {
            var image = document.createElement("img");
            image.setAttribute('src', imgSrc);
            image.setAttribute('alt', imgAlt);
            $('#lightbox').find(".image").animate({"opacity": 0},500, function(){
                $(this).html(image);
                $(this).animate({"opacity": 1},500);
            });
            $('#lightbox').foundation('reveal', 'open');
        }
    }

    //product variant functions
    //=====================================================
    function changeProductVariant(action, x, e) {
        e.stopPropagation();
        var $child = $(x);
        var $parent = $child.parent().parent();
        var parentImg = $child.attr("data-variant");
        var parentUrl = $child.attr("data-link");
        $parent.find(".variant-image").attr("src", parentImg);
        if(action === "click") {
            $parent.find(".variant").removeClass("active").removeClass("toggled");
            $parent.find(".variant-image").parent().attr("href",parentUrl);
            $child.addClass("active toggled");
            $parent.find(".variant-image").attr("data-holder",parentImg);
        } else {
            //$parent.find(".variant").removeClass("active");
            //$child.addClass("active");
        }
    }
    $("div.variant").on("click", function(e){
        changeProductVariant("click", this, e);
    });
    $("div.variant").on("mouseover", function(e){
        $(this).parent().parent().css({ "height": $(this).parent().parent().height() });
        //console.log($(this).parent().parent().height());
        changeProductVariant("mouseover", this, e);
    });
    $("div.variant").on("mouseout", function(e){
        if($(this).hasClass("toggled")===false) {
            var $parent = $(this).parent().parent();
            var original = $parent.find(".variant-image").attr("data-holder");
            $parent.find(".variant-image").attr("src", original);
            //$parent.find(".variant").removeClass("active");
            //$(this).addClass("active");
        }
    });

    //make product detail accordions
    //=====================================================
      // $("#productAccordion").find("h5").each(function(i){
      //       var accordion = $(this).nextUntil("h5").andSelf();
      //       $(accordion).find("h5").replaceWith($('<a href="#panel'+i+'a">' + this.innerHTML + '</a>'));
      //       console.log(accordion);
      //   });
    if($("#productAccordion").length>0){
            //console.log($("#productAccordion").html());
            $("#productAccordion").html($("#productAccordion").html().replace(/\<h5\>/ig,'</div></li><li class="accordion-navigation"><a href="#panela" class="accordion-toggle">').replace(/\<\/h5\>/ig,'</a><div id="panela" class="content">'));
            $("#productAccordion .accordion-navigation >a").each(function(i){
                $(this).attr("href", "#panela"+i);
            });
            $("#productAccordion .accordion-navigation div.content").each(function(i){
                $(this).attr("id", "panela"+i);
            });
    }

    //Toggle Address functions in account settings 
    //=====================================================
    $(".cancel-address").on("click", function(){
        var target = $(this).attr("data-id");
        $('#'+target).foundation('reveal', 'close');
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
                    //console.log(data);
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
                    //console.log(data);
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
        $('.product__add .add').on("click",function(e) {
            //console.log("kjkfjdkfd");
            e.stopPropagation();
            e.preventDefault();
            var id = "";
            $("select[name='id'] option").each(function(){
                if($(this).attr("selected")==="selected" || $(this).attr("selected")===true) {
                    id = $(this).val();
                }
            });
            var errorFlag = false;
            if($(".product__colorpicker").length>0){
                if($("#colors").find("input[type='radio']:checked").length<=0) {
                    errorFlag = true;
                    $(".product__colorpicker").find("h3,ul").addClass("shake");
                    setTimeout(function(){
                      $(".product__colorpicker").find("h3,ul").removeClass("shake");
                    }, 1500);
                }
            }
            if($(".product__sizepicker").length>0){
                if($("#sizes").find("input[type='radio']:checked").length<=0) {
                    errorFlag = true;
                    $(".product__sizepicker").find("h3,ul").addClass("shake");
                    setTimeout(function(){
                      $(".product__sizepicker").find("h3,ul").removeClass("shake");
                    }, 1500);
                }
            }
            if($(".product__lengthpicker").length>0){
                if($("#length").find("input[type='radio']:checked").length<=0) {
                    errorFlag = true;
                    $(".product__lengthpicker").find("h3,ul").addClass("shake");
                    setTimeout(function(){
                      $(".product__lengthpicker").find("h3,ul").removeClass("shake");
                    }, 1500);
                }
            }
            if(errorFlag) {
                return false;
            } else {
                // Call the addItem() method.
                // Note the empty object as the third argument, representing no line item properties. 
                //console.log(id);
                CartJS.addItem(id, 1, {}, {

                    // Define a success callback to display a success message.
                    "success": function(data, textStatus, jqXHR) {
                        //$('#cartMessage').removeClass('message-error').addClass('message-success').addClass('active');
                        //$('#cartMessage .message').html('Successfully added to cart.');
                        setQuickCartHeader();
                        $('.icon-bag').addClass('active');
                        $('.quick-cart-window').addClass('toggled');
                        $('.ajax_quantity').addClass('active');
                        formatCartPrices();
                        window.setTimeout(function(){
                            formatCartPrices();
                        }, 900);
                        //var millisecBeforeRedirect = 10000; 
                        timer = window.setTimeout(function(){
                            $('#cartMessage').removeClass("active");
                            //if($(".screen-size").css("float")!="right") {
                                $('.quick-cart-window').removeClass('toggled');
                            //}
                        }, 4000);
                        $(".quick-cart-window").hover(function(){
                            window.clearTimeout(timer);
                        });

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
        //update cart quantity and remove active state if empty
        $(document).on('cart.requestComplete', function(event, cart) {
            $('.cart-toggle .ajax_quantity').html(cart.item_count);
            if(cart.item_count<1) {
                $('.ajax_quantity').removeClass("active");
                $('.icon-bag').removeClass("active");
            }
        });
});

//tools only
$(document).ready(function(){
    $(".person-generator-container .adder").on("click", function(){
        var count = parseFloat($(this).attr("data-count"))+1;
        $(".adder-target").prepend('<div class="generator__person" id="person'+count+'">\
                <input type="text" placeholder="Name" name="person'+count+'_name" id="person'+count+'_name"/>'+
                // <input type="text" placeholder="Age" name="person'+count+'_age" id="person'+count+'_age"/>\
                '<input type="text" placeholder="Size" name="person'+count+'_size" id="person'+count+'_size"/>\
                <input type="text" placeholder="Height" name="person'+count+'_height" id="person'+count+'_height"/>\
                <input type="text" placeholder="Weight" name="person'+count+'_weight" id="person'+count+'_weight"/>\
                <div class="remover">&times;</div>\
            </div>');
        $(this).attr("data-count",count);
    });
    $("body").on("click",".generator__person .remover", function(){
        $(this).parent().fadeOut(500,function(){
            $(this).remove();
        });
    });
    function makePeople() {
        var outputCode = "DIVERSITY_";
        $(".generator__person").each(function(){
            var id= $(this).attr("id");
            var name = $("#"+id+"_name").val().replace(/\'/ig, "&apos;").replace(/\"/ig, "&quot;");
            var height = $("#"+id+"_height").val().replace(/\'/ig, "&apos;").replace(/\"/ig, "&quot;");
            if($("#"+id+"_age").val()) {
                var age = $("#"+id+"_age").val();
            }
            var weight = $("#"+id+"_weight").val().replace(/\'/ig, "&apos;").replace(/\"/ig, "&quot;");
            var size = $("#"+id+"_size").val().replace(/\'/ig, "&apos;").replace(/\"/ig, "&quot;");
            outputCode += "[person][person-name]" + name + "[/person-name]";
            if(age){ outputCode +="[person-age]" + age + "[/person-age]" }
            outputCode += "[person-height]" + height + "[/person-height][person-weight]" + weight + "[/person-weight][person-size]" + size + "[/person-size][/person]";
        });
        return outputCode;
    }
    $(".generate-code").on("click", function(){
        $("#person-generator_outputCode").text(makePeople());
    });
});

