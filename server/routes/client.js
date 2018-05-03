var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var flash = require('connect-flash');
var router = express.Router();
var dish_module = require('../module/dish');
var user_module = require('../module/user');
var fcm_module = require('../module/fcm');
var category_module = require('../module/category');


router.post('/fcm/', function (req, res) {
    fcm_module.update(req, res);
  });

router.get('/categories', function (req, res) {
  category_module.getAllCategoriesNamesAPI(req, res);
});

router.get('/todayMenu', function (req, res) {
  dish_module.getTodayMenu(req, res);
});

router.get('/todayMenu/filter/by_category/:uid', function (req, res) {
  dish_module.getTodayMenuFilterCat(req, res);
});

router.post('/todayMenu/filter/', function (req, res) {
  console.log(req.body[0]);
  dish_module.getTodayMenuFilterCats(req, res);
});

router.use(function (req, res, next) {
  if (req.isAuthenticated())
  next();
  else {
    res.status(401).json({ error: 'You must be authentificated!', code: 401, authentificated: false });
  }
});

function filter_user(user) {
  return _.omit(user, 'password');
}


module.exports = router;
