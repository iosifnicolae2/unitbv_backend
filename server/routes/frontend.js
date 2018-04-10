var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var flash = require('connect-flash');
var router = express.Router();
var post_module = require('../module/posts');
var categories_module = require('../module/category');
var dish_module = require('../module/dish');

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.render('login', { authentificated: false, message: 'Authentification failed' });
    }

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/p/:uid', function (req, res) {
  post_module.findById(res, req.params.uid, function (post, users) {

    res.render('frontend/one_post_template', { post, users,
      images_cdn: '/static/images/',
      user: filter_user(req.user), });
  });
});

var _ = require('underscore');
function filter_user(user) {
  return _.omit(user, 'password');
}

router.get('/', function (req, res, next) {
  res.render('frontend/home_unlogged');
});

router.get('/meniu', function (req, res, next) {
  dish_module.getTodayMenuC(req, res, function (err, data) {
    if (err) return next(err);;
    res.render('frontend/menu_frontend', { todayMenu: data });
  });
});

// router.use(function(req,res,next){
//   if(!req.isAuthenticated())
//   if(req.headers["x-requested-with"] == 'XMLHttpRequest')
//   return res.json({error:403,message:"You must be logged!"})
//   else
//   return res.redirect('/login');
//   next();
// })

router.get('/', function (req, res, next) {
  res.render('frontend/home');
});

router.get('/angajari', function (req, res, next) {
  res.render('frontend/angajari');
});

router.get('/discover', function (req, res, next) {
  categories_module.getAllCategoriesNamesFrontend(function (err, cats) {
    res.render('frontend/discover', { images_cdn: '/static/images/', cats: cats });
  });
});

router.post('/submit_like', function (req, res, next) {
  post_module.addLike(req, res);
});

router.post('/submit_dislike', function (req, res, next) {
  post_module.removeLike(req, res);
});

module.exports = router;
