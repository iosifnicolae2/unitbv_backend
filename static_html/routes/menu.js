var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var router = express.Router();
var dish_module = require('../module/dish');


var multer  = require('multer');
var randtoken = require('rand-token');
var mime = require('mime');

router.get('/menu',function(req, res) {
  dish_module.getAllMenuDishes(req,res,function(poi){
    res.render('dishes_menu',{user:req.user,menu_menu:true,table_poi:poi})
  });
});
/*
router.post('/menu/update',uploading_poi_images, function(req, res) {
  dish_module.add(req,res);
});
*/

    module.exports = router;
