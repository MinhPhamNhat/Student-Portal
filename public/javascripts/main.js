const socket = io.connect("http://localhost:8080");
tinymce.init({
    selector: 'textarea',
    plugins: 'a11ychecker advcode casechange formatpainter linkchecker autolink lists checklist media mediaembed pageembed permanentpen paste powerpaste table advtable tinycomments tinymcespellchecker',
    toolbar: 'a11ycheck addcomment showcomments casechange checklist code formatpainter pageembed permanentpen table',
    toolbar_mode: 'floating',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
});

$(document).on('focusin', function (e) {
    if ($(e.target).closest(".tox-dialog").length) {
        e.stopImmediatePropagation();
    }
});
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

const newComment = (value) => `
    <!-- user comment -->
    <div class="user-comment">
        <div class="user-img-comment">	
            <a href="/profile/${value.author.authorId}">
                <img src="${value.author.picture}" alt="" class="user-ava-comment">
            </a>
        </div>
        <div class="user-comment-content">
            
                <span class="user-comment-name">
                    <a href="/profile/${value.author.authorId}"><strong>${value.author.name}</strong></a>
                    </span>
                <span class="user-comment-time">
                    <i class="fa fa-clock-o"></i>
                    ${value.date}
                </span>

            <p class="user-comment-text"> ${value.content} </p>
        </div>
    </div>
    <!-- end user comment -->
    `


const newPost = (value) => {
    var tag = ''
    if (value.attach.picture) {
        tag = `<img class="post-picture" src="${value.attach.picture}">`
    }
    return `
    <!-- post status start -->
        <div class="post-card card post-${ value._id}">
            <div class="row d-flex align-items-center justify-content-center">
                <div class="main">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-row align-items-center"> <a href="/profile/${value.author.authorId}"><img src="${value.author.picture}" width="50" class="rounded-circle"></a>
                            <div class="d-flex flex-column ml-2"><a href="/profile/${value.author.authorId}"> <span class="font-weight-bold">${value.author.name}</span></a><small class="text-primary">${value.author.role}</small> </div>
                        </div>
                        <div class="ellipsis"> <small class="time">${ value.date}</small> 
                            <i class="fa fa-ellipsis-h" id="option" data-toggle="dropdown" > </i>
                            <div class="option-menu"> 
                                <div class="dropdown-menu">
                                    ${ value.isDelete ? `
                                        <div class="dropdown-item edit-post" onclick=editStatus(this) data-id="${ value._id}">Edit</div>
                                        <hr>
                                        <div class="dropdown-item remove-post" onclick=removeStatus(this) data-id="${ value._id}">Delete</div>
                                    `: ``}
                                </div> 
                            </div>
                        </div>
                    </div>
                    </br>
                    <div class="text-justify">
                    
                        ${ value.content}
                    </div>
                    ${ tag}
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
                        <div class="comments-container">
                            <div class="comments">
                            </div>
                            <div data-id="${ value._id}" class="load-more">Xem thêm ...</div>
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

// POST STATUS 
const postStatus = () => {
    $("#textbox").modal("hide")
    var content = tinyMCE.activeEditor.getContent();
    var file = $(".picture-attach-upload")[0].files[0]

    var data = new FormData()
    data.append('file', file)
    data.append('content', content)
    if (content || file) {
        $.ajax({
            url: 'http://localhost:8080/status',
            data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            success: function (data, status) {
                console.log(data)
                data = JSON.parse(JSON.stringify(data))
                if (data.code === 0) {
                    var tag = newPost(data.data)
                    $(".post-section").prepend(tag)
                    showToast("Đăng status", "Đăng status thành công", "success")
                    tinymce.get("richtexteditor").setContent("");
                    $(".picture-attach-upload").val(null)
                    $('.image-upload-preview').hide();
                } else {
                    showToast("Đăng status", data.message, "Error")
                }
            }
        })
    } else {
        showToast("Đăng status", "Vui lòng nhập nội dung", "warning")
    }
}

// Remove status
const removeStatus = (target) => {
    var statusId = target.dataset.id
    var data = { statusId }
    fetch("http://localhost:8080/status", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .then(data => {
            console.log(data)
            if (data.code === 0) {
                $(`.post-${statusId}`).slideUp(300)
                setTimeout(() => {
                    $(`.post-${statusId}`).remove()
                }, 300)
                showToast("Xóa status", "Đã xóa status thành công", "success")
            } else {
                showToast("Xóa status", data.message, "warning")
            }
        })
}

const editStatus = (target) => {
    var statusId = target.dataset.id
    var content = $(`.post-${statusId} .text-justify`)[0]
    if (content) {
        var content = content.outerHTML
        tinymce.activeEditor.setContent(content);
    }
    if ($(".post-picture")[0]) {
        var image = $(".post-picture")[0].src
        $("#output").attr("src", image)
    }
    $(".image-upload-preview").css("display", "block")
    $(".post-share-btn").html("save")
    $(".share-modal").modal("show")
}

const vote = (target) => {
    var statusId = target.dataset.id
    var data = { statusId }
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
                var likeElement = $("[data-id=" + statusId + "]")
                likeElement.find($("span")).html(data.data.no_vote)
                if (data.data.actionVote) {
                    likeElement.addClass("voted")
                    $("[data-id=" + statusId + "] .icon-heart").css("background-image", "url(/images/icons/heart.png)")
                    showToast("Vote status", "Đã vote status", "success")
                } else {
                    likeElement.removeClass("voted")
                    $("[data-id=" + statusId + "] .icon-heart").css("background-image", "url(/images/icons/unheart.png)")
                    showToast("Vote status", "Đã unvote status", "success")
                }
            } else {
                showToast("Vote status", data.message, "error")
            }
        })

}

const comment = (target) => {
    var statusId = target.dataset.id
    var commentSection = $(`.post-${statusId} .comments`)
    var content = $(`.post-${statusId} .comments-input`).val()
    var data = { statusId, content }
    if (content) {
        fetch("http://localhost:8080/status/comment", {
            method: "POST",
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
                    $(`.post-${statusId} .no-comment`).text(`${data.data.no_comment} comments`)
                    $(`.post-${statusId} .comments-input`).val('')
                    commentSection.find(".none-comment").remove()
                    showToast("Comment status", "Đã comment thành công", "success")
                } else {
                    showToast("Comment status", data.message, "error")
                }
            })
    } else {
        showToast("Comment status", "Vui lòng nhập nội dung", "warning")
    }
}

const loadMorePost = (skip, id) => {
    console.log(`http://localhost:8080/status?skip=${skip}${id ? `&id=${id}` : ''}`)
    return fetch(`http://localhost:8080/status?skip=${skip}${id ? `&id=${id}` : ''}`)
        .then(result => result.json())
        .then(data => data)
}

const loadMoreComment = (skip, statusId) => {
    return fetch(`http://localhost:8080/status/comment?skip=${skip}&statusId=${statusId}`)
        .then(result => result.json())
        .then(data => data)
}

$(document).delegate(".attach .picture", 'click', () => {
    $(".picture-attach-upload").trigger('click')
})

$(document).delegate(".cancel-share-btn, .close-share", 'click', () => {
    setTimeout(() => {
        tinymce.get("richtexteditor").setContent("");
        $(".picture-attach-upload").val(null)
        $('.image-upload-preview').hide();
    }, 300)

})

$(".picture-attach-upload").change((e) => {
    var file = e.target.files[0]

    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        output.src = reader.result;
    };
    reader.readAsDataURL(file);
    $(".image-upload-preview").css("display", "block")
})

$(document).delegate('.image-upload-preview .close-icon', 'click', function () {
    $('.image-upload-preview').slideToggle(300, 'swing');
    $(".picture-attach-upload").val(null)
})

// LOAD STATUS WHEN SCROLL BOTTOM
if ($(".post-section")[0]) {
    var userId = ''
    if (window.location.pathname.includes("/profile/"))
        userId = window.location.pathname.replace("/profile/", "")
    window.onscroll = async (e) => {
        if (Math.ceil($(window).scrollTop() + $(window).height()) >= $(document).height()) {
            const countPost = $(".post-card").length

            $('.body-loading').css("display", "block")
            loadMorePost(countPost, userId).then(ressult => {
                if (ressult.code === 0) {
                    if (ressult.data.length) {
                        ressult.data.forEach(value => {
                            tag = newPost(value)
                            $(".post-section").append(tag)
                        })
                        $('.body-loading').css("display", "none")
                        showToast("Tải status", "Tải status thành công", "success")
                    } else {
                        showToast("Tải status", "Không có status nào để tải", "success")
                    }
                } else {
                    showToast("Tải status", data.message, "error")
                }
            })

        }
    };
}

// Hide comment
$(document).delegate('.hide-comment-section', 'click', (e) => {
    var statusId = e.target.dataset.id
    var commentSection = $(`.post-${statusId} .comments-container`)

    commentSection.slideUp(300, 'swing')
    setTimeout(() => {
        commentSection.removeClass("showed")
        commentSection.find(".user-comment").remove()
        commentSection.find(".none-comment").remove()

    }, 300)
})

// Show comment
$(document).delegate('.comments-input', 'click', (e) => {
    var statusId = e.target.dataset.id
    var commentSection = $(`.post-${statusId} .comments-container`)
    if (!commentSection.hasClass("showed")) {
        $(`.post-${statusId} .comment-loading`).show()
        fetch(`http://localhost:8080/status/comment?statusId=${statusId}`)
            .then(result => result.json())
            .then(data => {
                console.log(data)
                if (data.code === 0) {
                    var tag;
                    if (data.data.length) {
                        data.data.forEach(value => {
                            tag = newComment(value)
                            commentSection.find(".comments").append(tag)
                        })
                    } else {
                        tag = `<p class="none-comment">Không có ai bình luận cả</p>`
                        commentSection.find(".comments").prepend(tag)
                    }
                    showToast("Tải comment", "Tải comment thành công", "success")
                    $(`.post-${statusId} .comment-loading`).hide()
                    commentSection.slideDown(300, 'swing')
                    commentSection.addClass("showed")
                } else {
                    showToast("Tải comment", "Tải comment thất bại", "error")
                }
            })
    }
})

// LOAD MORE COMMENT
$(document).delegate(".comments-container .load-more", 'click', (e) => {

    var statusId = e.target.dataset.id
    var commentSection = $(`.post-${statusId} .comments-container`)
    const countComment = commentSection.find(".user-comment").length
    $(`.post-${statusId} .comment-loading`).show()
    loadMoreComment(countComment, statusId).then(result => {
        var tag;
        if (result.code === 0) {
            if (result.data) {
                result.data.forEach(value => {
                    tag = newComment(value)
                    commentSection.find(".comments").append(tag)
                })
                $(`.post-${statusId} .comment-loading`).hide()
                showToast("Tải comment", "Tải comment thành công", "success")
            } else {
                showToast("Tải comment", "Không có comment nào để tải", "success")
            }
        } else {
            showToast("Tải comment", "Tải comment thất bại", "error")
        }
    })
})



$(".department-thumbnail-upload").change((e) => {

    var file = e.target.files[0]
    var image = $('.department-thumbnail-preview');
    var reader = new FileReader();
    reader.onload = function (e) {

        image.attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
})

$(".department-insert-container .remove").on('click', (e) => {
    e.preventDefault()
    $('.department-thumbnail-preview').attr("src", "/images/tdt_logo.png")
    $(".department-thumbnail-upload").val(null)
})

$(document).ready(function () {

    var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
        removeItemButton: true,
        maxItemCount: null,
        // searchResultLimit: 5,
        // renderChoiceLimit: 5
    });
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(".department-insert-container .submit").click((e) => {
    var name = $("#department-name").val()
    var email = $("#department-email").val()
    var username = $("#department-username").val()
    var password = $("#department-password").val()
    var passwordConfirm = $("#department-password-confirm").val()
    var id = $("#department-id").val()
    var file = $("#department-thumbnail")[0].files[0]

    var form = new FormData()

    $.each($(".department-insert-container select option:selected"), function () {
        form.append('permission[]', $(this).val());
    });
    form.append('name', name)
    form.append('email', email)
    form.append('username', username)
    form.append('password', password)
    form.append('passwordConfirm', passwordConfirm)
    form.append('id', id)
    form.append('file', file)

    $.ajax({
        url: 'http://localhost:8080/department/insert',
        data: form,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function (data, status) {
            if (data.code === -1) {
                var field = ["name", "username", "password", "passwordConfirm", "email", "id"]
                $('.nav a[href="#nav-tab-info"]').tab('show');
                field.forEach(value => {
                    var inputField = $(`.department-insert-container .input-field-${value}`)
                    if (data.errors[value]) {
                        inputField.find("small").remove()
                        inputField.find("label").removeClass("text-success")
                        inputField.find("input").removeClass("is-valid")
                        inputField.find("label").addClass("text-danger")
                        inputField.find("input").addClass("is-invalid")
                        inputField.append(`<small class='text-danger'>${data.errors[value].msg}</>`)
                    } else {
                        inputField.find("small").remove()
                        inputField.find("label").removeClass("text-danger")
                        inputField.find("input").removeClass("is-invalid")
                        inputField.find("label").addClass("text-success")
                        inputField.find("input").addClass("is-valid")
                    }
                })
                showToast("Thêm phòng khoa", "Thêm thất bại, vui lòng kiểm tra lại thông tin", "warning")
            } else if (data.code == 0) {
                window.location.href = "/department"
                showToast("Thêm phòng khoa", "Thêm thành công", "success")
            }
        }
    })
})

// var input = document.getElementsByClassName("comments-input");
// input.addEventListener("keyup", function(event) {
//   if (event.keyCode === 13) {
//    event.preventDefault();
//    console.log(1)
//    document.getElementsByClassName(`post-${statusId}`).find(".fonts").click();
//   }
// });
// $(".comments-input").keydown(function(event){ 
//     var statusId = event.target.dataset.id

//     var keyCode = (event.keyCode ? event.keyCode : event.which);   
//     if (keyCode == 13) {console.log(1)
//         $(`.post-${statusId} .fonts`).trigger('click');
//     }
// });

var showToast = (title, mess, type = "noti", x = 20, y = 20) => {
    var toastNum = $(".toast").length
    var typeVal = {
        "warning": `<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>`,
        "error": `<i class="fa fa-exclamation" aria-hidden="true"></i>`,
        "noti": `<i class="fa fa-bell" aria-hidden="true"></i>`,
        "success": `<i class="fa fa-check" aria-hidden="true"></i>`
    }
    var tag =
        `<div class="toast toast-${toastNum + 1}"  id="myToast" style="position: fixed; bottom: ${y}px;
                left: ${x}px; z-index: 999;">
                <div class="toast-header">
                    <div style="margin-right: 20px">${typeVal[type]}</div><strong class="mr-auto">${title}</strong>
                    <small class="time"></small>
                    <button type="button" class="ml-2 mb-1 close"
                        data-dismiss="toast">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body" style="margin: 10px;">
                    <div>${mess}</div>
                </div>
            </div>`

    $("body").append(tag)
    $(`.toast-${toastNum + 1}`).toast({ delay: 3000 });
    $(`.toast-${toastNum + 1}`).toast("show")
    setTimeout(() => {
        $(`.toast-${toastNum + 1}`).remove()
    }, 4000)
}


    // $(document).ready(function() {
    //     var tag, x, y, timeOut;
    //     for (var i = 0; i < 50; i++) {
    //         x = Math.floor(Math.random() * 1920);
    //         y = Math.floor(Math.random() * 1080);
    //         timeOut = Math.floor(Math.random() * 2000) + 1000;
    //         tag = `<div class="toast toast-${i}"  id="myToast" style="position: absolute; top: ${y};
    //                 right: ${x}; z-index: 999;">
    //                 <div class="toast-header">
    //                     <strong class="mr-auto"><i class="fa fa-grav"></i> Chào mừng bạn đã vô đây chơi</strong>
    //                     <small>0 sec ago</small>
    //                     <button type="button" class="ml-2 mb-1 close"
    //                         data-dismiss="toast">
    //                         <span aria-hidden="true">&times;</span>
    //                     </button>
    //                 </div>
    //                 <div class="toast-body">
    //                     <div>Chúc bạn trải nghiệm vui vẻ</div>
    //                 </div>
    //             </div>`
    //         $("body").append(tag)

//         $(`.toast-${i}`).toast({ delay: timeOut });
//         $(`.toast-${i}`).toast("show")
//     }
//     setTimeout(function() {
//         for (var i = 0; i < 50; i++) {
//             $(`.toast-${i}`).remove()
//         }
//     }, 2500)
// });
// $(".show-toast").click(function() {
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
//     setTimeout(function() {
//         for (var i = 0; i < 100; i++) {
//             $(`.toast-${i}`).remove()
//         }
//     }, 1000)
// })


// SHOW INDEX PAGE POST WHEN LOAD PAGE
// if ($(".post-section")[0]) {
//     var currentPage = window.location.pathname
//     const countPost = $(".post-card").length
//     $('.body-loading').css("display", "block")
//     loadMorePost(countPost, currentPage).then(ressult => {
//         if (ressult.code === 0) {
//             if (ressult.data.length) {
//                 ressult.data.forEach(value => {
//                     tag = newPost(value)
//                     $(".post-section").append(tag)
//                 })
//                 $('.body-loading').css("display", "none")
//                 showToast("Tải status", "Tải status thành công", "success")
//             } else {
//                 showToast("Tải status", "Không có status nào để tải", "success")
//             }
//         } else {
//             showToast("Tải status", data.message, "error")
//         }
//     })
// }
