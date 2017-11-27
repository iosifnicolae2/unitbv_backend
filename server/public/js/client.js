var template_post, post_container, dialog_wrapper, dialog_show_post, dialog_image_show_post, bLazy, album_chevron_left, count_media_dialog, album_chevron_right, img_p, dialog_upload_picture, body, username_dialog, img_user_dialog, comments_listview, comments_textarea, comment_error, dialog_opened = false,unique_photo_id = 0,
  upload_images_only_imgs, images_uploaded = [],uploaded_imgs_files = {},  input_media, oppened_upload_post = false,dialog_content_text;
update_feed = function() {
  update_feed = true;
  if(user !=null)
  $("#profile_btn").html(user.displayName);
  for (var i = 0, len = posts.length; i < len; i++) {
    posts[i].p = i;
    posts[i].post_user = findUserById(posts[i].admin_id);
    addPost(posts[i]);
  }
  bLazy.revalidate();
}

function findUserById(id) {
  for (var i = 0, l = posts_users.length; i < l; i++) {
    if (posts_users[i]._id == id) return posts_users[i];
  }
}

function addPost(post_json, position,prepend) {

  var post = template_post.clone();
  post.removeAttr("id");
  post.removeAttr("style");
  post.data('id',post_json._id)
  post.data('p',post_json.p)

  var like_nr = post.find('l-c');
  like_nr.html(post_json.stats.likes);

  var username = post.find(".username");
  username.html(post_json.post_user.displayName);
  username.attr("href","/user/"+post_json.post_user.username)

  var location = post.find(".post_location");

  location.text(post_json.location!=null?post_json.location:"");


  var popups = post.find("post-action>a.popup");
  popups.bind('mouseenter', function() {

    var p = cumulativeOffset(this);
    var popup = $("#"+$(this).dataset.popup);
    popup.css("display","block")
    popup.css("top",(p.top - popup.offsetHeight - 5) + "px")
    popup.css("left",(p.left - popup.offsetWidth + 25) + "px")
  }, false);
  popups.bind('mouseleave', function() {
    var popup =$("#"+$(this).dataset.popup);
    popup.css("display","none")
  }, false);




  var like_post = post.find(".like_post");
  if(post_json.stats.likers&& (post_json.stats.likers).indexOf(user._id)>=0){
    like_post.addClass("actv");
      like_post.find("use").attr("xlink:href", "#love_ic_fill");
  }
  like_post.click(function(e) {
    $(this).toggleClass('actv');
    var l_c = $(this).parent().find('l-c');
    if ($(this).hasClass('actv')) {
      $(this).find("use").attr("xlink:href", "#love_ic_fill");
      l_c.html(parseInt(l_c.html()) + 1);
      //todo sent like to server
      postReq("/submit_like", {
      post_id:$(this).closest('post').data('id')
    },function(json){
        console.log(json);
      });
    } else {
      $(this).find("use").attr("xlink:href", "#love_ic")
      l_c.html(parseInt(l_c.html()) - 1);
      postReq("/submit_dislike", {
      post_id:$(this).closest('post').data('id')
    },function(json){
        console.log(json);
      });
    }
    e.preventDefault();
  });



  populate_album(post, post_json);


if(prepend)
  post_container.prepend(post); else
  post_container.append(post);
}

function populate_album(post, json) {
  var post_content = post.find("post-content");
  var has_video = json.videos && json.videos.length > 0;
  var has_images = json.images && json.images.length > 0;


  if (has_video) {
    var video_container = $("<video-container/>")

    if (has_images)
      video_container.addClass("primary_photo");
    else {
      post_content.addClass("single_picture");
    }

    var video = $("<video/>");
    video.attr("src",images_cdn + json.videos[0].src);
    video_container.append(video);

    var video_overlay = $("<video-overlay/>")

    var play_btn = $("<play-btn/>")
    var play_btn_container = $("<play-btn-container/>")

    play_btn.html("<svg width=38 height=38 viewbox=\"0 0 1792 1792\"\ xmlns=\"http://www.w3.org/2000/svg\"><use id=\"play_ic_circle\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#play_ic_circle\"></use></svg>");


    /*  play_btn_container.click(function(e){
        video.attr("controls","")
        video.attr("preload","metadata")
          video.play();
        //  video_overlay.style="display:none";
      });*/
    open_image_listener(play_btn_container, json.p, 0, true);

    play_btn_container.append(play_btn);

    video_overlay.append(play_btn_container);

    /*
    <svg width=40 height=40 viewBox=\"0 0 1792 1792\"></svg>
    */




    video_container.append(video_overlay)
    post_content.append(video_container)
  }


  if (has_images) {
    if (!has_video) {

      var img_holder = $("<image-holder/>");
      var img = create_image(images_cdn + json.images[0].src);
      open_image_listener(img_holder, json.p, 0);
      img_holder.append(img)
      post_content.append(img_holder)

    }


    if (json.images.length > 1||has_video) {

      if (img_holder)
        img_holder.addClass("primary_photo");

      var album_holder = $("<album-holder/>");
      for (var i = has_video ? 0 : 1, len = json.images.length; i < len && i < 3; i++) {
        var img_holder = $("<image-holder/>");
        var img = create_image(images_cdn + json.images[i].src);
        img_holder.append(img)
        open_image_listener(img_holder, json.p, i);
        album_holder.append(img_holder)
      }

      if (!has_video) {
        if (json.images.length == 4) {

          var img_holder = $("<image-holder/>");
          var img = create_image(images_cdn + json.images[3].src);
          open_image_listener(img_holder, json.p, 3);
          img_holder.append(img)
          album_holder.append(img_holder)
        } else
        if (json.images.length > 4) {
          var show_more_div = $("<div/>");
          show_more_div.addClass("show_more");

          var img_holder = $("<image-holder/>");
          var img = create_image(images_cdn + json.images[3].src);
          img_holder.append(img)
          open_image_listener(show_more_div, json.p, 3);
          show_more_div.append(img_holder)

          var after_div = $("<div/>");
          after_div.addClass("after");
          after_div.html("Show more");
          show_more_div.append(after_div)
          album_holder.append(show_more_div)
        } else {
          album_holder.addClass("two-photo");
        }
      }

      post_content.append(album_holder)
    } else {
      if (!has_video)
        post_content.addClass("single_picture");
    }



  }


  var input_comment = post.find(".input-comment");
  input_comment.bind("focus", function(e) {
    comments_textarea.focus();
    open_dialog_post(img_holder, json.p, 0);
    e.preventDefault();
  });

}

function comment_submited() {
  if (dialog_opened) {
    console.log(comments_textarea.val())
    postReq("/post/add/comment/", {
      content: comments_textarea.val(),
      p_id: dialog_opened
    }, function(json) {
      if (json.success) {
        comment_error.html("");
        comment_error.css("display","none");
        addComment(user, comments_textarea.val(), true);
        comments_textarea.val('');
      } else {

        comment_error.html(json.error);
        comment_error.css("display","block");
      }
    });
  } else {
    /* TODO show error */
  }
}

function postReq(path, params, c) {

  $.ajax({
    url: path,
    data: JSON.stringify(params),
    cache: false,
    contentType: "application/json",
    processData: false,
    type: 'POST',
    success: function(data){
      if(c)
        c(data);
    }
  });
}

function getReq(path, params, c) {
  var query = "?";
  for (key in params) {
    query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
  }

  $.ajax({
    url: path + query,
    cache: false,
    contentType: "application/json",
    dataType: "json",
    processData: false,
    type: 'GET',
    success: function(data){
      if(c)
        c(data);
    }
  });

}



function addComment(user, msg, on_top) {


  var comment = $("<div/>");
  comment.addClass("comment");
  var img_comm = $("<img/>");
  img_comm.attr("src", user.cdn_picture)  //TODO..
  comment.append(img_comm);


  var uname_comm = $("<span/>");
  uname_comm.addClass("comm-username");
  uname_comm.html(user.displayName);
  comment.append(uname_comm);

  var text_comm = $("<span/>");
  text_comm.addClass("comm-text");
  text_comm.html(msg);
  comment.append(text_comm);

  comment.css("opacity" ,0);
  setTimeout(function() {
    comment.css("opacity" ,1);
  }, on_top ? 0 : 100)



  if (on_top)
    comments_listview.prepend(comment);
  else
    comments_listview.append(comment);

}

function create_image(src) {
  var img = $("<img/>");
  img.attr("src","data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  img.addClass("b-lazy");
  img.attr("data-src",src);
  return img;
}

function open_dialog_post(img_holder, p, img_pp, video) {

  img_p = img_pp;
  dialog_opened = posts[p]._id;

  comments_listview.html('');
  getReq("/post/get/comments/" + dialog_opened, {}, function(json) {
    if (json.success && json.comm != null) {
      for (var i = 0, l = json.comm.length; i < l; i++) {

        addComment(json.comm[i].author_id, json.comm[i].content, false);
      }
    } else {
      /* TODO show errors */
    }
  })

  dialog_wrapper.toggleClass("show");
  body.addClass("dialog_opened");


  dialog_content_text.text(posts[p].content);

  username_dialog.text(posts[p].post_user.displayName);
  img_user_dialog.attr("src", posts[p].post_user.cdn_picture);

  var count_imgs = posts[p].images && posts[p].images.length;
  var count_videos = posts[p].videos && posts[p].videos.length;

  count_media_dialog = count_imgs + count_videos;

  if (count_media_dialog > 1) {

    album_chevron_left.css("display",img_p == 0  ? "none" : "block");
    album_chevron_right.css("display",img_p == (count_imgs - 1) ? "none" : "block");

  } else {
    album_chevron_left.css("display","none");
      album_chevron_right.css("display","none");
  }

  for (var i = 0; i < count_videos; i++) {
    var dialog_video = $("<video/>");
    dialog_video.attr("controls", "");

    dialog_video.attr("src", images_cdn + posts[p].videos[i]);
    if (i == img_p&&video) {
      dialog_video.css("display", "block");
      dialog_video.attr("autoplay", "true");
    }

    dialog_image_show_post.append(dialog_video);
  }

  for (var i = 0; i < count_imgs; i++) {
    var dialog_img = $("<img/>");

    dialog_img.attr("src",  images_cdn + posts[p].images[i].src);
    if (i == img_p&&!video) {
      dialog_img.css("display","block");
    }

    dialog_image_show_post.append(dialog_img);
  }



  dialog_show_post.toggleClass("show");
}

function open_image_listener(img_holder, p, img_pp, video) {
  img_holder.click(function() {
    open_dialog_post(img_holder, p, img_pp, video);

  })
}

function close_dialogs(e) {
  oppened_upload_post = dialog_opened = false;
  body.removeClass("dialog_opened");

  dialog_wrapper.removeClass("show");
  dialog_wrapper.children().removeClass("show");


  dialog_image_show_post.empty();
  return false;
}

function upTo(el, tagName) {
  tagName = tagName.toLowerCase();

  while (el && el.parent()) {
    el = el.parent();
    if (el.tagName && el.tagName.toLowerCase() == tagName) {
      return el;
    }
  }

  // Many DOM methods return null if they don't
  // find the element they are searching for
  // It would be OK to omit the following and just
  // return undefined
  return null;
}

function initializeListeners() {

  template_post = $("#inflater_post");
  post_container = $("#post-container");
  dialog_wrapper = $("modal-dialog-wrapper");
  dialog_wrapper.click(function(e) {
    e.stopPropagation();
    close_dialogs();
  })
  dialog_image_show_post = $("dialog-image");
  dialog_show_post = $("#show_picture");

  dialog_upload_picture = $("#upload_picture");

  dialog_content_text = $("#dialog-show-post-text");

  dialog_upload_picture.click(function(e) {
    e.stopPropagation();
  })

  dialog_show_post.click(function(e) {
    e.stopPropagation();
  })

  album_chevron_right = $("#album_chevron_right");
  album_chevron_left = $("#album_chevron_left");

  username_dialog = $("#username_dialog");
  img_user_dialog = $("#img_user_dialog");

  album_chevron_left.click(function(e) {

    $(this).css("display", img_p - 1 == 0 ? "none" : "block")
    album_chevron_right.css("display", "block")


    if (img_p < 1) {
      $(this).css("display", "none");
      return;
    }
    var imgs = dialog_image_show_post.children();
    if ($(imgs.get(img_p)).prop("tagName").toLowerCase() == "video") $(imgs.get(img_p)).pause();
      $(imgs.get(img_p)).css("display","none");
    $(imgs.get(--img_p)).css("display","block");
  })
  album_chevron_right.click(function(e) {

    $(this).css("display", img_p == count_media_dialog ? "none" : "block");
    album_chevron_left.css("display","block");

    if (img_p + 2 > count_media_dialog) {
      $(this).css("display","none");
      return;
    }

    var imgs = dialog_image_show_post.children();
    if ($(imgs.get(img_p)).prop("tagName").toLowerCase() == "video") $(imgs.get(img_p)).pause();
      $(imgs.get(img_p)).css("display","none");
    $(imgs.get(++img_p)).css("display","block");
    if (img_p + 2 > count_media_dialog) {
      $(this).css("display","none");
    }

  })

  bLazy = new Blazy({
    container:'#post-container',
    error: function(err, msg) {
      console.log("error loading image", err, msg)
    },
    offset: 1200
  });

  comments_listview = $("#comments-listview");
  comments_textarea = $("#dialog-show-post-textarea");
  comment_error = $("#comment_error");

  var submit_comment = $("#submit_comment");

  submit_comment.click(comment_submited);

  upload_images_only_imgs = $("div#upload_pictures_only_images");


  $("#search_categories>a").click(function(e){
    e.preventDefault();
    $("#search_categories>a").removeClass("active");
    $(this).addClass("active");
  })

  $("input#submit_search_discovery").click(function(e){
    e.preventDefault();

      process_category_search($("input#search-discovery").val());
  })

$("input#search-discovery").keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    process_category_search($(this).val());
    return false;
  }
});

}

function process_category_search(q){
  var category_selected = [];
  $("#search_categories>a.active").each(function(index,elm){
    category_selected.push($(elm).data("id"));
  })
console.log("query: ",q,category_selected)
}


window.onload = function() {
  initializeListeners();

  if (!update_feed_ok && user != null)
    update_feed();
else
  if(typeof posts != 'undefined')
  update_feed();


  var button_upload, parent;
  button_upload = $('#upload_post > button');
  parent = button_upload.parent();
  body = $("body");

  input_media = $('#post_media_input');
  input_media.bind('change', function() {
    console.log("fireee",input_media[0])
    if (input_media[0].files) {
      var anyWindow = window.URL || window.webkitURL;


      for (var i = 0; i < input_media[0].files.length; i++) {
        var objectUrl = anyWindow.createObjectURL(input_media[0].files[i]);
        var media_tag = (input_media[0].files[i].type).indexOf("video")>=0?'video':'img';
        var uploaded = $('<div class="uploaded_image_container"><'+media_tag+' preload="metadata"  src="' + objectUrl + '" class="uploaded_picture"/></div>');
        upload_images_only_imgs.append(uploaded);
        uploaded.data("id",unique_photo_id)
        window.URL.revokeObjectURL(input_media[0].files[i]);

        if(!uploaded_imgs_files['images'])  uploaded_imgs_files['images'] = {};
        uploaded_imgs_files['images'][unique_photo_id++] = input_media[0].files[i];

      }
      open_upload_box();

    }

  });


  button_upload.click(function(e) {
        input_media.click();
  });


}

function showFormData(){
  console.log(uploaded_imgs_files)
}
function performClick(elemId) {
  var elem = document.getElementById(elemId);
  console.log(elem)
  if (elem && document.createEvent) {
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, false);
    elem.dispatchEvent(evt);
  }
}

var cumulativeOffset = function(element) {
  var top = 0,
    left = 0;
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top: top,
    left: left
  };
};

/*

$(function(){
  var like_post =
  var open_post_content = function(){
    window.open("post/"+$(this).parent().data("id"),"_self");
  }

  var open_action_popup = function(){
    var id = $(this).data("id");
  }




  $("like-holder .like_post").click(like_post);
  $("post-content").click(open_post_content);
  $(".action-item").click(open_action_popup);

  $(".popup").mouseenter(function(){
    var p = $(this).position();
    var popup = $("popup#"+$(this).data("popup"));
    popup.css({top: p.top-popup.height()-10, left: p.left-popup.width()+16});
    popup.show();
  })
  $(".popup").mouseleave(function(){
    var popup = $("popup#"+$(this).data("popup"));
    popup.hide();
  })

})
*/
function escape_key() {
  if (dialog_opened) {
    close_dialogs();
  }
}
document.onkeydown = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key == "Escape";
  } else {
    isEscape = evt.keyCode == 27;
  }
  if (isEscape) {
    escape_key();
  }
};




function open_upload_box() {
  dialog_upload_picture.addClass("show");

  body.addClass("dialog_opened");
  dialog_wrapper.addClass("show");
  oppened_upload_post = true;
}
var get_icon = function(name, width, height) {
  return '<svg width="' + width + '" height="' + height + '" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><use id="love_ic" xlink:href="#' + name + '" /></svg>';
}
var build_link = function(link, content, className) {
  return '<a class="' + className + '" href="' + link + '">' + content + '</a>';
}

var edit_photo_div = '<div class="edit_photo">' + build_link('#', get_icon('edit_svg', 16, 16), 'edit_photo_icon') + '</div>';
var edit_video_div = function(video){
  return '<div class="edit_video">' + build_link('#', get_icon('play', 13, 13), 'play_video '+(video.paused?'':'hide')) + build_link('#', get_icon('stop', 13, 13), 'stop_video '+(video.paused?'hide':''))+ '</div>';
}
$('#upload_pictures_only_images').on("mouseenter mouseleave", ".uploaded_image_container", function(e) {
  if (e)
    if (e.type == 'mouseenter') {
      var video = $(this).find("video");
      if(video.length>0)
      $(this).append(edit_video_div(video.get(0)));
      $(this).append(edit_photo_div);
    } else if (e.type == 'mouseleave') {
    $(this).find('div.edit_photo').remove();
    $(this).find('div.edit_video').remove();
  }
});
$("div#btn_upload").click(function() {
  input_media.click();
})
$('#upload_pictures_only_images').on("click", ".edit_photo_icon", function(e) {
  var parent = $(this).parent().parent();
  delete uploaded_imgs_files['images'][parent.data("id")]
  parent.remove();
});
$('#upload_pictures_only_images').on("click", "a.play_video", function(e) {
  e.preventDefault();
  $(this).parent().parent().find("video")[0].play();
  $(this).addClass("hide");
  $(this).parent().find("a.stop_video").removeClass("hide");
});
$('#upload_pictures_only_images').on("click", "a.stop_video", function(e) {
  e.preventDefault();
  $(this).parent().parent().find("video")[0].pause();
  $(this).parent().find("a.play_video").removeClass("hide");
  $(this).addClass("hide");
});
$("a#upload_post_final").click(function(){
  var textarea = $("textarea#post_message");
  var post_msg = textarea.val();
    if (!window.FormData) return alert('Your browser does\'t accept FormData. Please update your browser.');

  var files_upload_form = new FormData();
  files_upload_form.append("post_message",post_msg);


  for (var prop in uploaded_imgs_files.images) {
    if(uploaded_imgs_files.images[prop].type.indexOf("video")==0)
   files_upload_form.append("videos",uploaded_imgs_files.images[prop]);
    else
   files_upload_form.append("images",uploaded_imgs_files.images[prop]);
}

  $.ajax({
    url: '/api/post/add',
    data: files_upload_form,
    cache: false,
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){
        console.log(data);
        if(data.user)
        posts_users.push(data.user);
        if(data.data){
          var i = posts.push(data.data) -1;
          posts[i].post_user = findUserById(posts[i].admin_id);
          addPost(posts[i],i,true);
          bLazy.revalidate();
        }
          close_dialogs();
          textarea.val('');
          upload_images_only_imgs.empty();
    }
  });

})



$("#post-container").on("click", "a.share_post", function(g) {
    g.preventDefault();
    var f = $("#share_post_dialog")
      , d = $(this);
    var c = d.closest("post");
    f.toggleClass("active");
    if (!f.hasClass("active")) {
        return f.hide()
    }
    var i = d.offset().top - $("#post-container").offset().top + 40;
    var b = c.data("id");
    console.log(c.data())
    var a = window.location.hostname + "/p/" + b;
    f.find("a#facebook").off("click").click(function(j) {
        j.preventDefault();
        PopupCenter("https://www.facebook.com/sharer/sharer.php?u=" + a, "Share post", 550, 300)
    });
    f.find("a#google-plus").off("click").click(function(j) {
        j.preventDefault();
        PopupCenter(" https://plus.google.com/share?url=" + a, "Share post", 550, 300)
    });
    f.find("a#twitter").off("click").click(function(j) {
        j.preventDefault();
        PopupCenter(" http://twitter.com/share?text=" + a + "%0a&url=" + a, "Share post", 550, 300)
    });
    f.find("a#copy_link").off("click").click(function(j) {
        j.preventDefault();
        copyTextToClipboard(a)
    });
    f.css("top", i);
    f.show();
    var handler = function(e) {
         f.hide().removeClass("active")
    }
    $("html").on("click",handler );
    event.stopPropagation()
});
function PopupCenter(f, g, a, c) {
    var e = screen.width / 2 - a / 2;
    var d = screen.height / 2 - c / 2;
    var b = window.open(f, g, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + a + ", height=" + c + ", top=" + d + ", left=" + e);
    return b
}
function copyTextToClipboard(c) {
    var b = document.createElement("textarea");
    b.style.position = "fixed";
    b.style.top = 0;
    b.style.left = 0;
    b.style.width = "2em";
    b.style.height = "2em";
    b.style.padding = 0;
    b.style.border = "none";
    b.style.outline = "none";
    b.style.boxShadow = "none";
    b.style.background = "transparent";
    b.value = c;
    document.body.appendChild(b);
    b.select();
    try {
        var d = document.execCommand("copy");
        if (d) {
            SnackBar("Link was copied in your clipboard!", 4e3)
        }
    } catch (a) {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", c)
    }
    document.body.removeChild(b)
}
function SnackBar(b, a, c) {
    $("<div/>").addClass("toast").prependTo($("body")).text(b || "What are you doing?").click(function() {
        if (typeof c != "undefined") {
            c()
        }
    }).queue(function(e) {
        $(this).css({
            opacity: 1
        });
        var d = 30;
        $(".toast").each(function() {
            var g = $(this);
            var f = g.outerHeight();
            var h = 15;
            g.css("bottom", d + "px");
            d += f + h
        });
        e()
    }).delay(a).queue(function(e) {
        var f = $(this);
        var d = f.outerWidth() + 20;
        f.css({
            left: "-" + d + "px",
            opacity: 0
        });
        e()
    }).delay(600).queue(function(d) {
        $(this).remove();
        d()
    })
}
