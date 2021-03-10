(function ($) {
	"use strict";

	$(".msg-trigger-btn").on("click", function (event) {
		event.stopPropagation();
		event.preventDefault();
		var $this = $(this);
		var $prevTartget = $(this).parent().siblings().children(".msg-trigger-btn").attr('href');
		var target = $this.attr('href');
		$(target).slideToggle();
		$($prevTartget).slideUp();
		
    });

	//Close When Click Outside
	$('body').on('click', function(e){
		var $target = e.target;
		if (!$($target).is('.message-dropdown') && !$($target).parents().is('.message-dropdown')) {
			$(".message-dropdown").slideUp("slow");
		}
	});

	//Background Image JS start
	var bgSelector = $(".bg-img");
	bgSelector.each(function (index, elem) {
		var element = $(elem),
			bgSource = element.data('bg');
		element.css('background-image', 'url(' + bgSource + ')');
	});

    // video player active js
	var plyrVideo = new Plyr('.plyr-video'),
      	plyrAudio = new Plyr('.plyr-audio'),
      	plyrYoutube = new Plyr('.plyr-youtube'),
		plyrVimeo = new Plyr('.plyr-vimeo');
		  
    // active profile carousel js
	$('.active-profile-carousel').slick({
        speed: 800,
        slidesToShow: 10,
		prevArrow: '<button type="button" class="slick-prev"><i class="bi bi-arrow-left-rounded"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="bi bi-arrow-right-rounded"></i></button>',
		responsive: [{
			breakpoint: 1200,
			settings: {
				slidesToShow: 5,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 8,
			}
		}]
	});

	// active profile carousel js
	$('.active-profile-mobile').slick({
        speed: 800,
		slidesToShow: 6,
		arrows: false,
		responsive: [{
			breakpoint: 480,
			settings: {
				slidesToShow: 4,
			}
		}]
	});

	// active profile carousel js
	$('.favorite-item-carousel').slick({
		autoplay: true,
        speed: 800,
		slidesToShow: 5,
		arrows: false,
		responsive: [{
			breakpoint: 992,
			settings: {
				slidesToShow: 3,
			}
		},
		{
			breakpoint: 576,
			settings: {
				slidesToShow: 2,
			}
		}]
	});

	// live chat box and friend search box active js
	$(".profile-active").on('click', function(){
		$(".chat-output-box").addClass('show');
	})
	$(".search-field").on('click', function(){
		$(".friend-search-list").addClass('show');
	})
	$(".close-btn").on('click', function(){
		var $this = $(this),
			$target = $this.data('close');
		$('.'+$target).removeClass('show');
	})
	
	// mobile header seach box active
	$(".search-trigger").on('click', function(){
		$('.search-trigger, .mob-search-box').toggleClass('show');
	})
	
	$(".chat-trigger, .close-btn").on('click', function(){
		$('.mobile-chat-box').toggleClass('show');
	})
	$(".request-trigger").on('click', function(){
		$('.frnd-request-list').toggleClass('show');
	})

	// mobile friend search active js
	$(".search-toggle-btn").on('click', function(){
		$('.mob-frnd-search-inner').toggleClass('show');
	})

	// profile dropdown triger js
	$('.profile-triger').on('click', function(event){
		event.stopPropagation();
        $(".profile-dropdown").slideToggle();
	})

	//Close When Click Outside
	$('body').on('click', function(e){
		var $target = e.target;
		if (!$($target).is('.profile-dropdown') && !$($target).parents().is('.profile-dropdown')) {
			$(".profile-dropdown").slideUp("slow");
		}
	});

	// perfect scroll bar js
	$('.custom-scroll').each(function(){
		var ps = new PerfectScrollbar($(this)[0]);
	});


	// light gallery active js
	$(document).ready(function() {
        $(".img-popup").lightGallery(); 

		// light gallery images
        $(".img-gallery").lightGallery({
			selector: ".gallery-selector",
			hash: false
		}); 
	});

	$('.gallery-toggle').on('click', function () {

	var productThumb = $(this).find(".product-thumb-large-view img"),
			imageSrcLength = productThumb.length,
			images = [];
		for (var i = 0; i < imageSrcLength; i++) {
			images[i] = {"src": productThumb[i].src, "thumb": productThumb[i].src};
		}

		$(this).lightGallery({
			dynamic: true,
			actualSize: false,
			hash: false,
			index: 0,
			dynamicEl: images
		});

	});

	// photo filter active js
	$('.photo-filter').imagesLoaded( function() {
		var $grid = $('.photo-filter, .friends-list').isotope({
		});
		// filter items on button click
		$('.filter-menu').on( 'click', 'button', function() {
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
			$(this).siblings('.active').removeClass('active');
	         $(this).addClass('active');
		});
		
	});

	// nice select active js
	$('select').niceSelect();

	// Scroll to top active js
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 600) {
			$('.scroll-top').removeClass('not-visible');
		} else {
			$('.scroll-top').addClass('not-visible');
		}
	});
	$('.scroll-top').on('click', function (event) {
		$('html,body').animate({
			scrollTop: 0
		}, 1000);
	});


	$('#email').bind("cut copy paste",function(e) {
		e.preventDefault();
	});
    
    
})(jQuery);


function postStatus (){
	$("#textbox").modal("hide")
    var status = $("#share-your-mood").val();
    var cookieValue = document.cookie.split('; ').find(row => row.startsWith('session_id=')).split('=')[1]; 

    $.post("http://localhost:8080/status", 
    {
        poster: cookieValue,
        content: status
    }, function(data, status){
		
        if (status === 'success'){
			data = JSON.parse(JSON.stringify(data))
			console.log(data.author)
			var tag = `
			<!-- post status start -->
                        <div class="card">
                            <!-- post title start -->
                            <div class="post-title d-flex align-items-center">
                                <!-- profile picture end -->
                                <div class="profile-thumb">
                                    <a href="">
                                        <figure class="profile-thumb-middle">
                                            <img src="`+data.author.avatar+`" alt="profile picture">
                                        </figure>
                                    </a>
                                </div>
                                <!-- profile picture end -->

                                <div class="posted-author">
                                    <h6 class="author"><a href="">` +  data.author.name+ `</a></h6>
                                    <span class="post-time">` +  data.post.postTime.toLocaleString("en-US") + `</span>
                                </div>

                                <div class="post-settings-bar">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <div class="post-settings arrow-shape">
                                        <ul>
                                            <li><button>copy link to adda</button></li>
                                            <li><button>edit post</button></li>
                                            <li><button>embed adda</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- post title start -->
                            <div class="post-content">
                                <p class="post-desc pb-0">
                                    ` +  data.post.content + `
                                </p>
                                <div class="post-meta">
                                    <button class="post-meta-like">
                                        <i class="bi bi-heart-beat"></i>
                                        <span></span>
                                        
                                    </button>
                                    <ul class="comment-share-meta">
                                        <li>
                                            <button class="post-comment">
                                                <i class="bi bi-chat-bubble"></i>
                                                <span>` +  !data.post.meta.comments?0:data.post.meta.likes + `</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
						<!-- post status end -->`
			console.log(tag)
			$(".main-body").prepend()
		}
    })
}