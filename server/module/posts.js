var User = require('../model/user');
var Post = require('../model/post');

var sizeOf = require('image-size');

function setV(t, n) {
  if (typeof t != 'undefined')
  return t;
  return n || null;
}

/*
admin_id:  { type: String, required: true , ref:'User'},
content : String,
content_html : String,
images : [String],
videos : [String],
location : {
  type :[Number],// [<latitude>, <longitude>]
 index: '2dsphere'
 },
 poi_id:String,
created_at: { type: Date, default: Date.now },
ban:{type:Boolean,default:false},
stats:{
  impressions:{type:Number,default:0},
  likes:{type:Number,default:0}
},
*/

Array.prototype.pushUnique = function (item) {
    if (this.indexOf(item) == -1) {
      //if(jQuery.inArray(item, this) == -1) {
      this.push(item);
      return true;
    }

    return false;
  };

module.exports.getDiscover = function (req, res, next) {
  //TODO impelment next token..
  Post.find({ ban: false }).sort('-created_at').exec(function (err, data) {
    if (err) {
      return res.json({ error: err });
    }

    var users_ids = [];
    for (var i = 0, length = data.length; i < length; i++) {
      users_ids.pushUnique(data[i].admin_id);
    }

    User.find({ _id: { $in: users_ids } }).select('_id picture displayName username')
    .exec(function (err, usersd) {
      return next(data, usersd);
    });

  });
};

module.exports.getFeed = function (req, res, next) {
  //TODO impelment next token..
  Post.find({ ban: false }).sort('-created_at').exec(function (err, data) {
    if (err) {
      return res.json({ error: err });
    }

    var users_ids = [];
    for (var i = 0, length = data.length; i < length; i++) {
      users_ids.pushUnique(data[i].admin_id);
    }

    User.find({ _id: { $in: users_ids } }).select('_id picture displayName username')
    .exec(function (err, usersd) {
      return next(data, usersd);
    });

  });
};

function create_img_size(images) {
  var images_sized = null;
  if (typeof images != 'undefined' && typeof images.images != 'undefined') {
    images_sized = [];
    try {
      for (var i = 0, l = images.images.length; i < l; i++) {
        var dimensions = sizeOf(__dirname + '/../public/images/' + images.images[i]);
        images_sized.push({
          src: images.images[i],
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    }catch (err) {
      console.log('dimmensions error', err);
    }
  }

  return images_sized;
}

module.exports.add = function (req, res) {

  //this function is only for Admins..
  //if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
  //  }
  //todo add some validation
  //console.log(req.body);

  var imags_sized = create_img_size(req.body.images);

  if (typeof req.body.images == 'undefined') req.body.images = {};
  var post = new Post({
    admin_id:  req.body.admin_id,
    content: req.body.content,
    images: setV(images_sized, null),
    videos: setV(req.body.images.videos, null),
    location: [req.body.location_long, req.body.location_lat],
    poi_id: req.body.poi_id,
  });

  post.save(function (err, data) {
        if (err) {
          return res.render('error', { error: err, data: data });
        }

        res.redirect('/posts/');
      });

};

module.exports.add_byClient = function (client_id, req, res) {

  //this function is only for Admins..
  //if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
  //  }
  //todo add some validation

  var imags_sized = create_img_size(req.body.files);
  var post = new Post({
    admin_id:  client_id,
    content: req.body.post_message,
    images: setV(imags_sized, null),
    videos: setV(req.body.files.videos, null),
    location: req.body.location_long != null && req.body.location_lat != null ? [req.body.location_long, req.body.location_lat] : null,
    poi_id: req.body.poi_id,
  });

  post.save(function (err, data) {
        if (err)
          return res.json({ error: err });

        User.findOne({ _id: data.admin_id }).select('displayName username').exec(function (err, user) {
                if (err)
                  return res.json({ error: err });
                return res.json({ success: true, data: data, user: user });

              });
      });

};

module.exports.getAllPosts = function (req, res, next) {
  Post.find({ ban: false }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return next(data);
  });
};

module.exports.remove = function (id, req, res) {
  Post.update({ _id: id }, { ban: true }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return res.redirect('/posts?post_deleted=true');
  });
};

module.exports.edit_initial = function (id, req, res) {
  Post.findOne({ _id: id }, function (err, Post) {
    if (err) {
      return res.render('error', { error: err });
    }

    res.render('add_post', { user: req.user, menu_Post: true, edit_Post: Post });
  });
};

module.exports.find_nearby = function (lng, lat, distance, req, res) {
    var postnt = { type: 'Postnt', coordinates: [Number(lng), Number(lat)] };

    Post.aggregate(
    [
        {
            $geoNear: {
                near: postnt,
                spherical: true,
                distanceField: 'dist',
                maxDistance: 50000,
              },
          },
        {
            $project: {
              location: 1,
              dist: 1,
            },
          },
    ]).exec(function (err, post) {
      if (err) {
        console.log(err);
        return res.render('error', { error: err });
      }

      res.json({ post: post });
    });
  };

module.exports.edit = function (id, req, res) {
  if (typeof req.body.images == 'undefined') req.body.images = {};

  var post = {
      admin_id:  req.body.admin_id,
      content: req.body.content,
    };

  if (setV(req.body.images.images) != null) {

    var imags_sized = create_img_size(req.body.images);
    post.images = setV(imags_sized);
  }

  if (setV(req.body.images.videos) != null) {

    post.videos = setV(req.body.images.videos);
  }

  if (req.body.poi_id != null)
   post.poi_id = req.body.poi_id;

  if (req.body.location_long != null && req.body.location_lat != null)
  post.location = [req.body.location_long, req.body.location_lat];// [<longitude>, <latitude>]

  Post.update({ _id: id }, post, function (err, user) {
    if (err) {
      console.error(err);
      return res.render('error', { error: err });
    }

    res.redirect('/posts?post_edited=true');
  });
};

module.exports.findByAdminUsername = function (username, c) {
  Post.findOne({ admin_id: username, ban: false }, c);
};

module.exports.findById = function (res, id, next) {

  Post.findOne({ _id: id, ban: false }).exec(function (err, data) {
    if (err) {
      return res.json({ error: err });
    }

    User.findOne({ _id: data.admin_id }).select('_id picture displayName username')
    .exec(function (err, usersd) {
      console.log(usersd);
      return next(data, usersd);
    });

  });

};

module.exports.findByIdforClient = function (id, req, res) {
  Post.findOne({ _id: id, ban: false }, function (err, post) {
    if (err) {
      return res.json({ error: err });
    }

    res.json({ post: post });
  });
};

module.exports.addComment = function (user_id, req, res) {
  if (typeof req.body.content == 'undefined' || req.body.content.length < 2)
  return res.json({ error: 'Comment must have minimum 2 characters.' });
  Post.update({ _id: req.body.p_id, ban: false }, { $push: { comments: {
    author_id: user_id,
    content: req.body.content,
  }, }, }, { upsert: true }, function (err) {
    return res.json({ success: err == null, err: err });
  });

};

module.exports.addLike = function (req, res) {
  var u_id = req.user._id;
  Post.update(
   { _id: req.body.post_id, ban: false, 'stats.likers': { $ne: u_id } },
   {
      $inc: { 'stats.likes': 1 },
      $push: { 'stats.likers': u_id },
    }, function (err, resp) {

    if (err)   return res.json({ error: err });

    res.json({ updated: true, stats: resp.stats });
  }
);
};

module.exports.removeLike = function (req, res) {
  var u_id = req.user._id;
  Post.update(
   { _id: req.body.post_id, ban: false, 'stats.likers': u_id },
   {
      $inc: { 'stats.likes': -1 },
      $pull: { 'stats.likers': u_id },
    }, function (err, resp) {

    if (err)   return res.json({ error: err });

    res.json({ updated: true, stats: resp.stats });
  }
);
};

module.exports.getComments = function (post_id, req, res) {
  Post.findOne({ _id: post_id, ban: false })
  .select('comments')
  .populate('comments.author_id', 'displayName _id picture')
  .exec(function (err, data) {
    if (err)   return res.json({ error: err });
    var comm = null;
    if (data) {

      comm = data.comments.toObject();
      comm.sort(function (m1, m2) { return m2.created_at - m1.created_at; });
    }

    res.json({ success: true, comm: comm });

  });
};
