var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var router = express.Router();
var dish_module = require('../module/dish');


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


router.post('/dish/updateMenu',function(req,res){
  dish_module.updateMenu(req,res);
})

router.get('/dishes',function(req, res) {
  dish_module.getAllDishes(req,res,function(poi){
    res.render('dishes',{user:req.user,menu_poi:true,table_poi:poi})
  });
});
router.get('/dishes/add',function(req, res) {
    res.render('add_dish',{user:req.user,menu_poi:true});
});

router.get('/dishes/filter',function(req, res) {
      dish_module.filterDish(req,res,function(data){
        res.json(data);
      });
});

var uploading_poi_images = multer({
  storage: storage_images,
  limits: {fileSize: 3000000, files:2}, // max 3MB
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'large_image', maxCount: 1 }
]);

router.post('/dishes/add',uploading_poi_images, function(req, res) {
  dish_module.add(req,res);
});

router.get('/dishes/edit/:uid',function(req, res) {
    dish_module.edit_initial(req.params.uid,req,res);
});

router.post('/dishes/edit/:uid',uploading_poi_images,function(req, res) {
    dish_module.edit(req.params.uid,req,res);
});


    module.exports = router;
