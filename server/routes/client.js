var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var flash = require('connect-flash');
var router = express.Router();
var business_module = require('../module/business');
var dish_module = require('../module/dish');
var feedback_module = require('../module/feedback');
var user_module = require('../module/user');
var posts_module = require('../module/posts');
var gift_module = require('../module/gift');
var fcm_module = require('../module/fcm');
var category_module = require('../module/category');



/*
router.post('/poi/find/nearby/',function(req, res) {
    dish_module.find_nearby(req.body.lng,req.body.lat,req.body.distance,req,res);
});*/

router.post('/poi/get/', function (req, res) {
    dish_module.findByIdforClient(req.body.id, req, res);
  });


/* Posts route */
router.use(require('./posts_clients'));

router.post('/business/find/nearby/', function (req, res) {
    business_module.find_nearby(req.body.lng, req.body.lat, req.body.distance, req, res);
  });

router.post('/business/get/', function (req, res) {
    business_module.findByIdforClient(req.body.id, req, res);
  });

router.post('/feedback/', function (req, res) {
    feedback_module.add(req, res);
  });

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

router.get('/discover/informations', function (req, res) {
    dish_module.getFeed(req, res, function (pois) {
      posts_module.getDiscover(req, res, function (posts, users) {
          return res.json({
            success: true,
            pois: pois,
            posts: posts,
            posts_users: users,
            images_cdn: '/static/images/',
            user: filter_user(req.user),
          });
        });
    });
  });

router.get('/informations', function (req, res) {
    dish_module.getFeed(req, res, function (pois) {
      posts_module.getFeed(req, res, function (posts, users) {
          return res.json({
            success: true,
            pois: pois,
            posts: posts,
            posts_users: users,
            images_cdn: '/static/images/',
            user: filter_user(req.user),
          });
        });
    });
  });

router.get('/poi/feed/', function (req, res) {
    dish_module.getFeed(req, res);
  });

router.get('/posts/feed/', function (req, res) {
    posts_module.getFeed(req, res);
  });

router.get('/user/dashboard', function (req, res) {
    user_module.getDashboard(req, res);
  });

router.post('/user/use_gift', function (req, res) {
    gift_module.use_gift(req, res);
  });

router.get('/user/dashboard/version', function (req, res) {
    user_module.getDashboardVersion(req, res);
  });

module.exports = router;
