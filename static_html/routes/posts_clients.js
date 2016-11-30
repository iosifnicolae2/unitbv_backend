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
        if(typeof req.body.files =='undefined')
        req.body.files = {};
        if(typeof req.body.files[file.fieldname] == 'undefined')
        req.body.files[file.fieldname] = [];

        req.body.files[file.fieldname].push(filename);

          cb(null, filename);
      },
    });



var uploading_posts_media = multer({
  storage: storage_images,
  limits: {fileSize: 300000000, files:25}, // max 3MB
}).any();


router.post('/post/add',uploading_posts_media, function(req, res) {
  posts_module.add_byClient(req.user._id,req,res);
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
    posts_module.addComment(req.user._id,req,res);
});

router.get('/post/get/comments/:uid',function(req, res) {
    posts_module.getComments(req.params.uid,req,res);
});

    module.exports = router;
