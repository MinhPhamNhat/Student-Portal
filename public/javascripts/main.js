const socket = io()
socket.on('connect', () => {
    socket.send("Hello")
})

socket.on("typing", (data) => {
    if ($(`.post-${data.statusId} .comments-container`).hasClass("showed"))
        $(`.post-${data.statusId} .comment-loading`).show()
})

socket.on("typing-done", (data) => {
    if ($(`.post-${data.statusId} .comments-container`).hasClass("showed"))
        $(`.post-${data.statusId} .comment-loading`).hide()
})

socket.on("comment-send", (data) => {
    if (data.userId !== $("._user-id")[0].dataset.id) {
        var commentSection = $(`.post-${data.statusId} .comments-container`)
        if (data.data.code === 0) {
            var tag = newComment(data.data.data.comments)
            commentSection.find(".comments").prepend(tag)
            $(`.post-${data.statusId} .no-comment`).text(`${data.data.data.no_comment} comments`)
            commentSection.find(".none-comment").remove()
        }
    }

})


var typingTimer;
var doneTypingInterval = 1000;

const typingCatch = (e) => {
    var statusId = e.dataset.id
    socket.emit("typing", { statusId })
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => { socket.emit("typing-done", { statusId }) }, doneTypingInterval);
}

const typingStopCatch = (e) => {
    clearTimeout(typingTimer);
}



tinymce.init({
    selector: 'textarea',
    plugins: 'lists code emoticons media paste',
    toolbar: 'undo redo | styleselect | bold italic | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'outdent indent | numlist bullist | emoticons',
    emoticons_append: {
        custom_mind_explode: {
            keywords: ['brain', 'mind', 'explode', 'blown'],
            char: '🤯'
        }
    },
    height: "300",
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    visual: false
});


$(document).on('focusin', function(e) {
    if ($(e.target).closest(".tox-dialog").length) {
        e.stopImmediatePropagation();
    }
});

const newComment = (value) => `
    <!-- user comment -->
    <div class="user-comment comment-${value._id}">
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
            ${value.myComment?`
            <div class="remove-comment">
                <span id="remove-comment-btn" title="Xoá comment" onclick=removeComment(this) data-id="${value._id}" ><i class="fa fa-minus-circle" aria-hidden="true"></i></span>
                <span id="confirm-remove-comment" title="Xác nhận xoá comment" onclick=confirmRemoveComment(this) data-id="${value._id}" data-status="${value.statusId}"><i class="fa fa-check" aria-hidden="true"></i></span>
                <span id="decline-remove-comment" title="Huỷ" onclick=declineRemoveComment(this) data-id="${value._id}" ><i class="fa fa-ban" aria-hidden="true"></i></span>
            </div>
            `:``}
            <p class="user-comment-text"> ${value.content} </p>
        </div>
    </div>
    <!-- end user comment -->
    `

const removeComment = (e) => {
    var commentId = e.dataset.id
    $(`.comment-${commentId} #remove-comment-btn`).hide(200)
    $(`.comment-${commentId} #confirm-remove-comment`).show(200)
    $(`.comment-${commentId} #decline-remove-comment`).show(200)

}

const confirmRemoveComment = (e) => {
    var commentId = e.dataset.id
    var statusId = e.dataset.status
    var formData = {commentId, statusId}
    fetch("/status/comment", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(data=>data.json())
    .then(data=>{
        if (data.code === 0){
            $(`.comment-${data.data.commentId}`).slideUp(200)
            $(`.post-${data.data.statusId} .no-comment`).text(data.data.no_comment+ "comments")
            showToast("Xoá comment", "Xoá comment thành công", "success")
        }else if (data.code === -2){
            showToast("Xoá comment", "Không tìm thấy comment", "error")
        }else if (data.code === -3){
            showToast("Xoá comment", "Không tìm thấy status", "error")
        }else{
            showToast("Xoá comment", "Xoá thất bại", "error")
        }
    })
}

const declineRemoveComment = (e) => {
    var commentId = e.dataset.id
    $(`.comment-${commentId} #remove-comment-btn`).show(200)
    $(`.comment-${commentId} #confirm-remove-comment`).hide(200)
    $(`.comment-${commentId} #decline-remove-comment`).hide(200)
}
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
                                        <div class="dropdown-item edit-post" onclick=editModal(this) data-id="${ value._id}">Edit</div>
                                        <hr>
                                        <div class="dropdown-item remove-post" onclick=removeModal(this) data-id="${ value._id}">Delete</div>
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
                        <div class="comment-input-section"> 
                            <input placeholder="Nói gì đi" type="text" data-id="${ value._id}" onkeyup=typingCatch(this) onkeydown=typingStopCatch(this) class="form-control comments-input">
                            <div class="fonts" onclick=comment(this) data-id="${ value._id}">
                                <i class="fa fa-paper-plane" aria-hidden="true">
                                </i> 
                            </div>
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

    $(".share-modal").modal("hide")
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
                data = JSON.parse(JSON.stringify(data))
                if (data.code === 0) {
                    var tag = newPost(data.data)
                    $(".post-section").prepend(tag)
                    showToast("Đăng status", "Đăng status thành công", "success")
                    tinymce.get("richtexteditor").setContent("");
                    $(".picture-attach-upload").val(null)
                    $('.image-upload-preview').hide();
                } else {
                    showToast("Đăng status", data.message, "error")
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

    $(".remove-confirm").modal("hide")
}

const editStatus = (target) => {
    $(".share-modal").modal("hide")
    var statusId = target.dataset.id
    var content = tinyMCE.activeEditor.getContent();
    var file = undefined
    if ($("#output")[0].src) {
        var image = $("#output")[0].src
        var block = image.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];
        var blob = b64toBlob(realData, contentType);
        var file = new File([blob], "image.png")
    }
    var data = new FormData()
    data.append('statusId', statusId)
    data.append('file', file)
    data.append('content', content)
    if (content || file) {
        $.ajax({
            url: 'http://localhost:8080/status',
            data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'PUT',
            success: function (data, status) {
                data = JSON.parse(JSON.stringify(data))
                if (data.code === 0) {
                    var tag = newPost(data.data)
                    $(`.post-${statusId}`).replaceWith(tag)
                    showToast("Chỉnh sửa status", "Chỉnh sửa status thành công", "success")
                    tinymce.get("richtexteditor").setContent("");
                    $(".picture-attach-upload").val(null)
                    $('.image-upload-preview').hide();
                } else {
                    showToast("Chỉnh sửa status", data.message, "error")
                }
            }
        })
    } else {
        showToast("Chỉnh sửa status", "Vui lòng nhập nội dung", "warning")
    }
    $(".post-share-btn").attr("onclick", "postStatus(this)")
}

const removeModal = (target) => {
    $(".remove-confirm").modal("show")
    $(".ok-remove").attr("data-id", target.dataset.id)
}

const editModal = (target) => {
    var statusId = target.dataset.id
    var content = $(`.post-${statusId} .text-justify`)[0]
    if (content) {
        var content = content.innerHTML
        tinymce.activeEditor.setContent(content);
    }
    if ($(`.post-${statusId} .post-picture`)[0]) {
        var image = $(`.post-${statusId} .post-picture`)[0].src

        $("#output").attr("src", image)
        $(".image-upload-preview").css("display", "block")
    }
    $(".post-share-btn").attr("onclick", "editStatus(this)")
    $(".post-share-btn").attr("data-id", statusId)
    $(".post-share-btn").html("save")
    $(".share-modal").modal("show")
}

const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
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

$(".share-modal").on('hidden.bs.modal', function(){
    setTimeout(() => {
        $(".post-share-btn").attr("onclick", "postStatus(this)")
        $(".post-share-btn").html("post")
        $("#output").attr("src", null)
        tinymce.get("richtexteditor").setContent("");
        $(".picture-attach-upload").val(null)
        $('.image-upload-preview').hide();
    }, 300)
});


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
    setTimeout(() => {
        $("#output").attr("src", null)
    }, 300);
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
    $('.department-thumbnail-preview').attr("src", "/images/tdtu_logo.png")
    $(".department-thumbnail-upload").val(null)
})


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


$('.edit-btn').on('click', () => {
    fetch("/profile",{method:"GET"}).then(data => data.json()).then(data=> {
        if (data.code === 0){
            $(".profile-modal .modal-profile-picture").attr("src", data.data.avatar)
            $(".profile-modal #profile-fullname").val(data.data.name)
            $(".profile-modal #profile-email").val(data.data.email)
            $(".profile-modal #profile-role").val(data.data.role.admin?"Admin":data.data.role.department?"Phòng/Khoa":"Sinh viên")
            $(".profile-modal #profile-class").val(data.data.class)
            $(".profile-modal #profile-faculty").val(data.data.faculty)
            $(".profile-modal #profile-desc").val(data.data.desc)
            $(".profile-modal #profile-quote").val(data.data.quote)
        }else{
            showToast("Lấy thông tin", "Thất bại", "error") 
        }
    })
    $(".profile-modal").modal("show")
})

$(".modal-profile-picture-edit a").click((e)=>{
    e.preventDefault()
    $(".profile-picture-upload").trigger('click')
})

$(".profile-picture-upload").change((e) => {
    var file = e.target.files[0]
    var image = $('.modal-profile-picture-preview');
    var reader = new FileReader();
    reader.onload = function (e) {

        image.attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
    $('.modal-profile-picture').hide()
    image.show()
})

$(".profile-modal").on('hidden.bs.modal', function(){
    setTimeout(() => {
        $('.modal-profile-picture').show()
        $('.modal-profile-picture-preview').hide()
        $('.modal-profile-picture-preview').attr('src',null)
        $('.profile-modal .profile-picture-upload').val(null)
    }, 300)
});

$(".profile-save-button").click((e) => {
    var name = $(".profile-modal #profile-fullname").val()
    var profileClass = $(".profile-modal #profile-class").val()
    var faculty = $(".profile-modal #profile-faculty").val()
    var quote = $(".profile-modal #profile-quote").val()
    var desc = $(".profile-modal #profile-desc").val()
    var file = $(".profile-modal .profile-picture-upload")[0].files[0]

    var form = new FormData()

    form.append('name', name)
    form.append('class', profileClass)
    form.append('faculty', faculty)
    form.append('quote', quote)
    form.append('desc', desc)
    form.append('file', file)

    $.ajax({
        url: 'http://localhost:8080/profile',
        data: form,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function (data, status) {
            if (data.code === 0){
                showToast("Thay đổi thông tin cá nhân ", "Thay đổi thành công", "success")
                window.location.reload()
            }else{
                showToast("Thay đổi thông tin cá nhân ", "Thay đổi thất bại", "error")
            }
        }
    })
    $(".profile-modal").modal("hide")

})

$(".save-change-btn").click(()=>{
    var oldPassword = $(".change-password #old-password").val()
    var newPassword = $(".change-password #new-password").val()
    var reNewPassword = $(".change-password #re-new-password").val()

    var formData = {oldPassword, newPassword, reNewPassword}
    fetch('/profile/change-password', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(data=>data.json()).then(data=>{
        if (data.code===0){
            var fields = ["oldPassword", "newPassword", "reNewPassword"]
            fields.forEach(value => {
                var inputField = $(`.change-password .${value}`)
                inputField.find("small").remove()
                inputField.find("label").removeClass("text-danger")
                inputField.find("input").removeClass("is-invalid")
                inputField.find("label").addClass("text-success")
                inputField.find("input").addClass("is-valid")
            })
            window.location.href = window.location.origin + "/signout"
        }else if (data.code === -3){
            var fields = ["oldPassword", "newPassword", "reNewPassword"]
            fields.forEach(value => {
                var inputField = $(`.change-password .${value}`)
                console.log(inputField)
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
        }else if (data.code === -2){
            showToast("Thay đổi mật khẩu", "Đã xảy ra lỗi ", "error")
        }
    })
})

$(".notifications-create .create-btn").click((e)=>{
    $(".create-noti-modal").modal("show")
})

$(".noti-modal-save").click((e) => {
    var title = $(".create-noti-modal #noti-title").val()
    var subTitle = $(".create-noti-modal #noti-sub-title").val()
    var categoryId = $(".create-noti-modal #noti-categories-picker").val()
    var content = tinyMCE.activeEditor.getContent()
    var isImportance = $(".create-noti-modal #noti-is-importance").prop("checked")
    var formData = {title , subTitle, content, categoryId, isImportance}

    fetch("/notification", 
    {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(data => data.json()).then(data=> {
        if (data.code === 0 ){
            showToast("Tạo thông báo", "Tạo thông báo thành công", "success")
            window.location.href = window.location.origin + "/notification/detail/"+data.data
        } else if(data.code === -3){
            showToast("Tạo thông báo", "Thông tin không hợp lệ, vui lòng kiểm tra lại", "warning")
        } else{
            showToast("Tạo thông báo", data.message, "warning")
        }
    }).catch()
    
})



$(document).ready(function () {
    var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
        removeItemButton: true,
        maxItemCount: null,
    });

});





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
    $(`.toast-${toastNum + 1}`).toast({ delay: 8080 });
    $(`.toast-${toastNum + 1}`).toast("show")
    setTimeout(() => {
        $(`.toast-${toastNum + 1}`).remove()
    }, 4000)
}






// NOT MY SCRIPT// NOT MY SCRIPT// NOT MY SCRIPT// NOT MY SCRIPT// NOT MY SCRIPT// NOT MY SCRIPT// NOT MY SCRIPT// NOT MY SCRIPT

(function($) {
    "use strict";

    $(".msg-trigger-btn").on("click", function(event) {
        event.stopPropagation();
        event.preventDefault();
        var $this = $(this);
        var $prevTartget = $(this).parent().siblings().children(".msg-trigger-btn").attr('href');
        var target = $this.attr('href');
        $(target).slideToggle();
        $($prevTartget).slideUp();

    });

    //Close When Click Outside
    $('body').on('click', function(e) {
        var $target = e.target;
        if (!$($target).is('.message-dropdown') && !$($target).parents().is('.message-dropdown')) {
            $(".message-dropdown").slideUp("slow");
        }
    });

    //Background Image JS start
    var bgSelector = $(".bg-img");
    bgSelector.each(function(index, elem) {
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
    $(".profile-active").on('click', function() {
        $(".chat-output-box").addClass('show');
    })
    $(".search-field").on('click', function() {
        $(".friend-search-list").addClass('show');
    })
    $(".close-btn").on('click', function() {
        var $this = $(this),
            $target = $this.data('close');
        $('.' + $target).removeClass('show');
    })

    // mobile header seach box active
    $(".search-trigger").on('click', function() {
        $('.search-trigger, .mob-search-box').toggleClass('show');
    })

    $(".chat-trigger, .close-btn").on('click', function() {
        $('.mobile-chat-box').toggleClass('show');
    })
    $(".request-trigger1").on('click', function() {
        $('.portal-request-list').removeClass('show');
        $('.frnd-request-list').toggleClass('show');
    })

    $(".request-trigger2").on('click', function(event) {
        $('.frnd-request-list').removeClass('show');
        $('.portal-request-list').toggleClass('show');
    })

    // mobile friend search active js
    $(".search-toggle-btn").on('click', function() {
        $('.mob-frnd-search-inner').toggleClass('show');
    })

    // profile dropdown triger js
    $('.profile-triger').on('click', function(event) {
        event.stopPropagation();
        $(".profile-dropdown").slideToggle();
    })

    //Close When Click Outside
    $('body').on('click', function(e) {
        var $target = e.target;
        if (!$($target).is('.profile-dropdown') && !$($target).parents().is('.profile-dropdown')) {
            $(".profile-dropdown").slideUp("slow");
        }
    });

    // perfect scroll bar js
    $('.custom-scroll').each(function() {
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

    $('.gallery-toggle').on('click', function() {

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
    $('.photo-filter').imagesLoaded(function() {
        var $grid = $('.photo-filter, .friends-list').isotope({});
        // filter items on button click
        $('.filter-menu').on('click', 'button', function() {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
        });

    });

    // nice select active js
    $('select').niceSelect();

    // Scroll to top active js
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 600) {
            $('.scroll-top').removeClass('not-visible');
        } else {
            $('.scroll-top').addClass('not-visible');
        }
    });
    $('.scroll-top').on('click', function(event) {
        $('html,body').animate({
            scrollTop: 0
        }, 1000);
    });


    $('#email').bind("cut copy paste", function(e) {
        e.preventDefault();
    });


})(jQuery);