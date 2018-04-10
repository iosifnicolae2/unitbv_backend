var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var router = express.Router();
var gift_module = require('../module/gift');

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

router.get('/users/edit/:uid/gifts', function (req, res) {

    gift_module.edit_initial(req.params.uid, req, res);
  });

router.get('/users/add/:uid/gift', function (req, res) {
    gift_module.add_initial(req.params.uid, req, res);
  });

var uploading_gift_image = multer({
  storage: storage_images,
  limits: { fileSize: 3000000, files: 1 }, // max 3MB
}).fields([
  { name: 'picture', maxCount: 1 },
]);

router.post('/users/add/:uid/gift', uploading_gift_image, function (req, res) {
    gift_module.add(req.params.uid, req, res);
  });

router.get('/users/remove/:uid/gift/:gift', uploading_gift_image, function (req, res) {
    gift_module.remove(req.params.uid, req.params.gift, req, res);
  });

router.get('/users/edit/:uid/gift/:gift', uploading_gift_image, function (req, res) {
    gift_module.edit_initialOneGift(req.params.uid, req.params.gift, req, res);
  });

router.post('/users/edit/:uid/gift/:gift', uploading_gift_image, function (req, res) {
    gift_module.edit(req.params.uid, req.params.gift, req, res);
  });

module.exports = router;
