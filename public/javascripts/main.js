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

const newComment = (value) => {
    return `
    <!-- user comment -->
    <div class="user-comment">
        <hr>
        <div class="d-flex flex-row mb-2 user-comment">
        <img src="${value.author.picture}" width="40" class="rounded-image">
            <div class="d-flex flex-column ml-2"> <span class="name">${value.author.name}</span> <small class="comment-text">${value.content}</small>
                <div class="d-flex flex-row align-items-center status"><small>${value.date}</small> </div>
            </div>
        </div>
    </div>
    <!-- end user comment -->
    `
}
function toBase64(arr) {
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
 }

const newPost = (value) => {
    var tag=''
    if (value.attach.picture.data.length){
        tag = `<img class="post-picture" src="data:image/png;base64,${toBase64( value.attach.picture.data)}">`
    }
    return `
    <!-- post status start -->
        <div class="post-card card post-${ value._id}">
            <div class="row d-flex align-items-center justify-content-center">
                <div class="main">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-row align-items-center"> <img src="${ value.author.picture}" width="50" class="rounded-circle">
                            <div class="d-flex flex-column ml-2"> <span class="font-weight-bold">${ value.author.name}</span> <small class="text-primary">Collegues</small> </div>
                        </div>
                        <div class="ellipsis"> <small class="time">${ value.date}</small> <i class="fa fa-ellipsis-h"></i> </div>
                    </div>
                    </br>
                    <p class="text-justify">
                        ${ value.content}
                    </p>
                    ${ tag }
                    <div class="p-2 bottom-section">
                        <hr>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex flex-row icons d-flex align-items-center">
                                <button onclick=vote(this) data-id="${ value._id}" class="post-meta-like ${value.vote ? " voted " : " "}">
                                        <div style="background-image: url('/images/icons/${ value.vote ? "heart" : "unheart"}.png')" class="pic icon-heart"></div>
                                        <span>${ value.meta.votes.length}</span>
                                    </button></div>
                            <div class="d-flex flex-row muted-color"> <p class="no-comment">${ value.meta.comments.length} comments</p></div>
                        </div>
                        <hr>
                        <div class="comment-input-section"> <input placeholder="Nói gì đi" type="text" data-id="${ value._id}" class="form-control comments-input">
                            <div class="fonts" onclick=comment(this) data-id="${ value._id}"><i class="fa fa-paper-plane" aria-hidden="true"></i> </div>
                        </div>
                        <img class="comment-loading" src="/images/icons/comment_loading.gif">
                        <div class="comments">
                            <div class="hide-comment-section">
                                <i data-id="${ value._id}" class="fa fa-chevron-up" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- post status end -->`
    }

const postStatus = () => {
    $("#textbox").modal("hide")
    var content = $("#share-your-mood").val();
    var file = $(".picture-attach-upload")[0].files[0]
    var data = new FormData()
    data.append('file', file)
    data.append('content', content)
    if (content) {
        $.ajax({
            url: 'http://localhost:8080/status',
            data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            success: function (data, status) {
                if (status === 'success') {
                    data = JSON.parse(JSON.stringify(data))
                    var tag = newPost(data)
                    $(".post-section").prepend(tag)
                    $("#share-your-mood").val('');
                    $(".picture-attach-upload").val(null)
                    $('.image-upload-preview').hide();
                }
            }
        })
    };
}

const vote = (target) => {
    var statusid = target.dataset.id
    var data = { statusid }
    fetch("http://localhost:8080/status/vote", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    })
        .then(result => result.json())
        .then(data => {
            console.log(data)
            if (data.code === 0) {
                var likeElement = $("[data-id=" + statusid + "]")
                likeElement.find($("span")).html(data.data.no_vote)
                if (data.data.actionVote) {
                    likeElement.addClass("voted")
                    $("[data-id=" + statusid + "] .icon-heart").css("background-image", "url(/images/icons/heart.png)")
                } else {
                    likeElement.removeClass("voted")
                    $("[data-id=" + statusid + "] .icon-heart").css("background-image", "url(/images/icons/unheart.png)")
                }
            }
        })
        .catch()

}

const comment = (target) => {
    var statusid = target.dataset.id
    var commentSection = $(`.post-${statusid} .comments`)
    var content = $(`.post-${statusid} .comments-input`).val()
    var data = { statusid, content }
    if (content) {
        fetch("http://localhost:8080/status/comment", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(result => result.json())
            .then(data => {
                console.log(data)
                if (data.code === 0) {
                    var tag = newComment(data.data.comments)
                    commentSection.prepend(tag)
                    console.log(data.data.no_comment)
                    $(`.post-${statusid} .no-comment`).text(`${data.data.no_comment} comments`)
                    $(`.post-${statusid} .comments-input`).val('')
                    commentSection.find(".none-comment").remove()
                }
            })
    }
}

const loadMorePost = (skip) => {
    return fetch(`http://localhost:8080/status?skip=${skip}`)
        .then(result => result.json())
        .then(data => {
            console.log(data)
            if (data.code === 0) {
                return data.data
            } else { }
        })
}

$(document).delegate(".attach .picture",'click', () => {
    $(".picture-attach-upload").trigger('click')
})

$(document).delegate(".cancel-share-btn, .close-share",'click', () => {
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

$(document).delegate('.image-upload-preview .close-icon','click', function () {
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
                    $(".post-section").append(tag)
                })
                $('.body-loading').css("display", "none")
            }
        })

    }
};

// Hide comment
$(document).delegate('.hide-comment-section','click', (e) => {
    var statusid = e.target.dataset.id
    var commentSection = $(`.post-${statusid} .comments`)

    commentSection.slideUp(300, 'swing')
    setTimeout(() => {
        commentSection.removeClass("showed")
        commentSection.find(".user-comment").remove()
        commentSection.find(".none-comment").remove()

    }, 300)
})

// Show comment
$(document).delegate('.comments-input','click', (e) => {
    var statusid = e.target.dataset.id
    var commentSection = $(`.post-${statusid} .comments`)
    if (!commentSection.hasClass("showed")) {
        $(`.post-${statusid} .comment-loading`).show()
        fetch(`http://localhost:8080/status/comment?statusid=${statusid}`)
            .then(result => result.json())
            .then(data => {
                console.log(data)
                if (data.code === 0) {
                    var tag;
                    if (data.data.length) {
                        data.data.forEach(value => {
                            tag = newComment(value)
                            commentSection.append(tag)
                        })
                    } else {
                        console.log(1)
                        tag = `<p class="none-comment">Không có ai bình luận cả</p>`
                        commentSection.prepend(tag)
                    }
                    $(`.post-${statusid} .comment-loading`).hide()
                    commentSection.slideDown(300, 'swing')
                    commentSection.addClass("showed")
                }
            })
    }
})
if ($(".post-section")[0]) {
    console.log(1)
    const countPost = $(".post-card").length
    $('.body-loading').css("display", "block")
    loadMorePost(countPost).then(data => {
        var tag;
        if (data) {
            data.forEach(value => {
                tag = newPost(value)
                $(".post-section").append(tag)
            })
            $('.body-loading').css("display", "none")
        }
    })
}


    // $(document).ready(function () {
    //     var tag, x, y, timeOut;
    //     for (var i = 0; i < 50; i++) {
    //         x = Math.floor(Math.random() * 1920);
    //         y = Math.floor(Math.random() * 1080);
    //         timeOut = Math.floor(Math.random() * 2000) + 1000;
    //         tag = `<div class="toast toast-${i}"  id="myToast" style="position: absolute; top: ${y};
    //         right: ${x}; z-index: 100;">
    //         <div class="toast-header">
    //             <strong class="mr-auto"><i class="fa fa-grav"></i> Chào mừng bạn đã vô đây chơi</strong>
    //             <small>0 sec ago</small>
    //             <button type="button" class="ml-2 mb-1 close"
    //                 data-dismiss="toast">
    //                 <span aria-hidden="true">&times;</span>
    //             </button>
    //         </div>
    //         <div class="toast-body">
    //             <div>Chúc bạn trải nghiệm vui vẻ</div>
    //         </div>
    //     </div>`
    //         $("body").append(tag)

//         $(`.toast-${i}`).toast({ delay: timeOut });
//         $(`.toast-${i}`).toast("show")
//     }
//     setTimeout(function () {
//         for (var i = 0; i < 50; i++) {
//             $(`.toast-${i}`).remove()
//         }
//     }, 2500)
// });
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