var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var router = express.Router();
var posts_module = require('../module/posts');


var multer  = require('multer');
var randtoken = require('rand-token');
var mime = require('mime');



var storage_images = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null,__dirname+'/../public/images/')
      },
      filename: function (req, file, cb) {
        var filename = randtoken.generate(56) + '.' + mime.extension(file.mimetype);
        if(typeof req.body.images =='undefined')
        req.body.images = {};
        if(typeof req.body.images[file.fieldname] == 'undefined')
        req.body.images[file.fieldname] = [];

        req.body.images[file.fieldname].push(filename);

          cb(null, filename);
      },
    });



router.get('/posts',function(req, res) {
  posts_module.getAllPosts(req,res,function(posts){
    res.render('posts',{user:req.user,menu_posts:true,table_posts:posts})
  });
});
router.get('/post/add',function(req, res) {
    res.render('add_post',{user:req.user,menu_posts:true});
});

var uploading_posts_media = multer({
  storage: storage_images,
  limits: {fileSize: 30000000, files:20}, // max 3MB
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 10 }
]);

router.post('/post/add',uploading_posts_media, function(req, res) {
  posts_module.add(req,res);
});

router.get('/posts_map/',function(req, res) {
    res.render('map_posts',{user:req.user,menu_posts:true});
});
router.get('/post/edit/:uid',function(req, res) {
    posts_module.edit_initial(req.params.uid,req,res);
});

router.post('/post/edit/:uid',uploading_posts_media,function(req, res) {
    posts_module.edit(req.params.uid,req,res);
});

router.post('/post/add/comment/',function(req, res) {
  console.log(req.body)
    posts_module.addComment(req.user._id,req,res);
});

router.get('/post/get/comments/:uid',function(req, res) {
    posts_module.getComments(req.params.uid,req,res);
});

    module.exports = router;
