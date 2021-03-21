const socket = io.connect("http://localhost:8080");
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
    $('body').on('click', function (e) {
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
        }
        ]
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
        }
        ]
    });

    // live chat box and friend search box active js
    $(".profile-active").on('click', function () {
        $(".chat-output-box").addClass('show');
    })
    $(".search-field").on('click', function () {
        $(".friend-search-list").addClass('show');
    })
    $(".close-btn").on('click', function () {
        var $this = $(this),
            $target = $this.data('close');
        $('.' + $target).removeClass('show');
    })

    // mobile header seach box active
    $(".search-trigger").on('click', function () {
        $('.search-trigger, .mob-search-box').toggleClass('show');
    })

    $(".chat-trigger, .close-btn").on('click', function () {
        $('.mobile-chat-box').toggleClass('show');
    })
    $(".request-trigger1").on('click', function () {
        $('.portal-request-list').removeClass('show');
        $('.frnd-request-list').toggleClass('show');
    })

    $(".request-trigger2").on('click', function (event) {
        $('.frnd-request-list').removeClass('show');
        $('.portal-request-list').toggleClass('show');
    })

    // mobile friend search active js
    $(".search-toggle-btn").on('click', function () {
        $('.mob-frnd-search-inner').toggleClass('show');
    })

    // profile dropdown triger js
    $('.profile-triger').on('click', function (event) {
        event.stopPropagation();
        $(".profile-dropdown").slideToggle();
    })

    //Close When Click Outside
    $('body').on('click', function (e) {
        var $target = e.target;
        if (!$($target).is('.profile-dropdown') && !$($target).parents().is('.profile-dropdown')) {
            $(".profile-dropdown").slideUp("slow");
        }
    });

    // perfect scroll bar js
    $('.custom-scroll').each(function () {
        var ps = new PerfectScrollbar($(this)[0]);
    });


    // light gallery active js
    $(document).ready(function () {
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
            images[i] = { "src": productThumb[i].src, "thumb": productThumb[i].src };
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
    $('.photo-filter').imagesLoaded(function () {
        var $grid = $('.photo-filter, .friends-list').isotope({});
        // filter items on button click
        $('.filter-menu').on('click', 'button', function () {
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


    $('#email').bind("cut copy paste", function (e) {
        e.preventDefault();
    });


})(jQuery);


const newPost = (data) => `<!-- post status start -->
    <div class="card post-card">
        <!-- post title start -->
        <div class="post-title d-flex align-items-center">
            <!-- profile picture end -->
            <div class="profile-thumb">
                <a href="https://demo.hasthemes.com/adda-preview/adda/index.html#">
                    <figure class="profile-thumb-middle">
                        <img src="${ data.author.avatar}" alt="profile picture">
                    </figure>
                </a>
            </div>
            <!-- profile picture end -->

            <div class="posted-author">
                <h6 class="author">
                    <a href="/profile/${ data.author._id}">
                        ${ data.author.name}
                    </a>
                </h6>
                <span class="post-time">${ data.post.postTime}</span>
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
                ${ data.post.content}
            </p>
            <div class="post-meta">

                <button data-id="${ data.post._id}" ${data.vote ? "voted" : ""} onclick=vote("${data.post._id}") class="post-meta-like">
                    <div style="background-image: url('/images/icons/${ data.vote ? "heart" : "unheart"}.png')" class="pic icon-heart"></div>
                    <span>${ data.post.meta.likes}</span>
                </button>
                <button onclick="location.href='/post/${ data.post._id}';" class="post-meta-comment">
                    <div class="pic icon-comment"></div>
                    <span>${ data.post.meta.comments}</span>
                </button>

            </div>
        </div>
    </div>
    <!-- post status end -->`

const postStatus = () => {
    $("#textbox").modal("hide")
    var status = $("#share-your-mood").val();
    var cookieValue = document.cookie.split('; ').find(row => row.startsWith('session_id=')).split('=')[1];
    $.post("http://localhost:8080/status", {
        poster: cookieValue,
        content: status
    }, (data, status) => {
        console.log(data)
        if (status === 'success') {
            data = JSON.parse(JSON.stringify(data))
            var tag = newPost(data)
            $(".main-body").prepend(tag)
        }
    })
}

const vote = (postid) => {
    var userVote = document.cookie.split('; ').find(row => row.startsWith('session_id=')).split('=')[1];
    $.post("http://localhost:8080/vote", {
        userVote: userVote,
        postVote: postid
    }, (data, status) => {
        data = JSON.parse(JSON.stringify(data))
        console.log(data)
        if (status === 'success') {
            if (data.code === 0) {
                var likeElement = $("[data-id=" + postid + "]")
                if (likeElement.hasClass("voted")) {
                    likeElement.removeClass("voted")
                    $("[data-id=" + postid + "] .icon-heart").css("background-image", "url(/images/icons/unheart.png)")
                } else {
                    likeElement.toggleClass("voted")
                    $("[data-id=" + postid + "] .icon-heart").css("background-image", "url(/images/icons/heart.png)")
                }
                likeElement.find($("span")).html(data.data.no_vote)
            }
        } else
            console.log(data)
    })
}

const loadMorePost = (skip) => {
    return fetch(`http://localhost:8080/status?skip=${skip}`)
        .then(result => result.json())
        .then(data => {
            console.log(data.code)
            if (data.code === 0) {
                return data.data
            } else {

            }
        }).catch(err => cosnoel.log(err))
}

$(".attach .picture").on('click', () => {
    $(".picture-attach-upload").trigger('click')
})

$(".cancel-share-btn, .close-share").on('click', () => {
    $("#share-your-mood").val('');
    $(".picture-attach-upload").val(null)
    $('.image-upload-preview').hide();
})

$(".picture-attach-upload").change((e) => {
    var file = e.target.files[0]
    console.log(file)
    var image = $('#output');
    image.src = URL.createObjectURL(file);

    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        output.src = reader.result;
    };
    reader.readAsDataURL(file);
    $(".image-upload-preview").css("display", "block")
})

$('.image-upload-preview .close-icon').on('click', function () {
    $('.image-upload-preview').slideToggle(300, 'swing');
    $(".picture-attach-upload").val(null)
})

window.onscroll = async (e) => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        console.log(1)
        const countPost = $(".post-card").length
        $('.body-loading').css("display", "block")
        loadMorePost(countPost).then(data => {
            var tag;
            if (data) {
                data.forEach(value => {
                    console.log(value)
                    tag = newPost(value)
                    $(".main-body").append(tag)
                })
                $('.body-loading').css("display", "none")
            }
        }).catch(err => {
            console.log(err)
        })

    }
};
$(document).ready(function(){
    var tag, x, y, timeOut;
    for (var i = 0; i < 50; i++) {
        x = Math.floor(Math.random() * 1920);
        y = Math.floor(Math.random() * 1080);
        timeOut = Math.floor(Math.random() * 2000) + 1000;
        tag = `<div class="toast toast-${i}"  id="myToast" style="position: absolute; top: ${y};
        right: ${x}; z-index: 100;">
        <div class="toast-header">
            <strong class="mr-auto"><i class="fa fa-grav"></i> Chào mừng bạn đã vô đây chơi</strong>
            <small>0 sec ago</small>
            <button type="button" class="ml-2 mb-1 close"
                data-dismiss="toast">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            <div>Chúc bạn trải nghiệm vui vẻ</div>
        </div>
    </div>`
        $("body").append(tag)
        
        $(`.toast-${i}`).toast({ delay: timeOut });
        $(`.toast-${i}`).toast("show")
    }
    setTimeout(function () {
        for (var i = 0; i < 50; i++){
            $(`.toast-${i}`).remove()
        }
    }, 2500)
  });
// $(".show-toast").click(function () {
//     for (var i = 0; i < 100; i++) {
//         var x = Math.floor(Math.random() * 1920);
//         var y = Math.floor(Math.random() * 1080);
//         var tag = `<div class="toast toast-${i}"  id="myToast" style="position: absolute; top: ${y};
//         right: ${x}; z-index: 100;">
//         <div class="toast-header">
//             <strong class="mr-auto"><i class="fa fa-grav"></i> We miss
//                 you!</strong>
//             <small>11 mins ago</small>
//             <button type="button" class="ml-2 mb-1 close"
//                 data-dismiss="toast">
//                 <span aria-hidden="true">&times;</span>
//             </button>
//         </div>
//         <div class="toast-body">
//             <div>It's been a long time since you visited us. We've
//                 something special for you. <a href="#">Click here!</a></div>
//         </div>
//     </div>`
//         $("body").append(tag)
        
//         $(`.toast-${i}`).toast("show")
//     }
//     setTimeout(function () {
//         for (var i = 0; i < 100; i++){
//             $(`.toast-${i}`).remove()
//         }
//     }, 1000)
    
    

// })