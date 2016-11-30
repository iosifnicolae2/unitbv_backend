var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var router = express.Router();
var business_module = require('../module/business');


var multer  = require('multer');
var randtoken = require('rand-token');
var mime = require('mime');

var storage_images = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null,__dirname+'/../public/images/')
      },
      filename: function (req, file, cb) {
        var filename = randtoken.generate(56) + '.' + mime.extension(file.mimetype);
        console.log(filename);
        if(typeof req.body.images =='undefined')
        req.body.images = {};
        req.body.images[file.fieldname] = filename;
          cb(null, filename);
      },
    });




router.get('/business',function(req, res) {
  business_module.getAllBusiness(req,res,function(business){
    res.render('business',{user:req.user,menu_business:true,table_business:business})
  });
});
router.get('/business/add',function(req, res) {
    res.render('add_business',{user:req.user,menu_business:true});
});




var uploading_business_images = multer({
  storage: storage_images,
  limits: {fileSize: 3000000, files:2}, // max 3MB
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'large_image', maxCount: 1 }
]);

var uploading_category_image = multer({
  storage: storage_images,
  limits: {fileSize: 3000000, files:1}, // max 3MB
}).fields([
  { name: 'logo', maxCount: 1 }
]);

router.post('/business/add',uploading_business_images, function(req, res) {
  business_module.add(req,res);
});

router.get('/business_map/',function(req, res) {
    res.render('map_business',{user:req.user,menu_business:true});
});
router.get('/business/edit/:uid',function(req, res) {
    business_module.edit_initial(req.params.uid,req,res);
});

router.post('/business/edit/:uid',uploading_business_images,function(req, res) {
    business_module.edit(req.params.uid,req,res);
});


    module.exports = router;
