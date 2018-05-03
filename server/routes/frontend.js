var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var flash = require('connect-flash');
var router = express.Router();
var post_module = require('../module/posts');
var categories_module = require('../module/category');
var dish_module = require('../module/dish');

var QueueElementWaze = require('../model/queueElementWaze');

function uniq_fast(a, field) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item[field]] !== 1) {
               seen[item[field]] = 1;
               out[j++] = item;
         }
    }
    return out;
}

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


var _ = require('underscore');
function filter_user(user) {
  return _.omit(user, 'password');
}

router.get('/', function (req, res, next) {
  // Extract queue waze clients statistics
  MINUTES_30 = 30*60*1000;
  QueueElementWaze.find({
    created_at: {
      $gte: new Date(new Date().getTime() - MINUTES_30).toISOString()
    }
  }, function(err, queue_elements) {
    var unique_queue_elements = uniq_fast(queue_elements, 'client_id');
    var average_number_of_clients = unique_queue_elements.reduce((a, o, i, p) => a + o.number_of_clients / p.length, 0)

    res.render('frontend/home_unlogged', {unique_queue_elements, average_number_of_clients});
  });
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



module.exports = router;
