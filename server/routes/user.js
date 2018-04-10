var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var router = express.Router();
var user_module = require('../module/user');

var multer  = require('multer');
var randtoken = require('rand-token');
var mime = require('mime');

var storage_images = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, __dirname + '/../public/images/');
      },

      filename: function (req, file, cb) {
        var filename = randtoken.generate(56) + '.' + mime.extension(file.mimetype);
        console.log(filename);
        if (typeof req.body.images == 'undefined')
        req.body.images = {};
        req.body.images[file.fieldname] = filename;
        cb(null, filename);
      },
    });

var uploading_user_image = multer({
  storage: storage_images,
  limits: { fileSize: 3000000, files: 1 }, // max 3MB
}).fields([
  { name: 'picture', maxCount: 1 },
]);

router.get('/users', function (req, res) {

    user_module.getAllUsers(req, res, function (users) {
      res.render('user', { user: req.user, menu_users: true, table_users: users });

    });

  });

router.get('/users/add', function (req, res) {
    res.render('add_user', { user: req.user, menu_users: true });
  });

router.get('/users/remove/:uid', function (req, res) {
    user_module.remove(req.params.uid, req, res);
  });

router.get('/users/edit/:uid', function (req, res) {
    user_module.edit_initial(req.params.uid, req, res);
  });

router.post('/users/add', uploading_user_image, function (req, res) {
  user_module.add(req, res);
});

router.post('/users/edit/:uid', uploading_user_image, function (req, res) {
    user_module.edit(req.params.uid, req, res);
  });

module.exports = router;
