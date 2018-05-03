var express = require('express');
var passport = require('passport');
var router = express.Router();
var fcm_module = require('../module/fcm');
var scrape_intranet = require('../module/scrape_intranet');
var dish = require('../module/dish');

router.get('/login', function (req, res) {
  res.render('login');
});

router.use(function (req, res, next) {
  try {
    if (req.isAuthenticated() && req.user.user_type == 2)
      next();
    else {
      res.redirect('/login');
    }
  }catch (err) {}
});

router.get('/admin/', function (req, res) {
    res.redirect('/dishes');
  });

router.get('/admin/run_phantom', function (req, res) {
  scrape_intranet.update_phantom(function (data) {

    res.redirect('/admin/extract_menu_from_phantom');
  });
});

router.get('/send_gcm', function (req, res) {
  fcm_module.sendNotification('title',
  'http://pngimg.com/upload/gift_PNG5945.png', 'Ai primit un gift!', false);
  return res.json({ ok: true });
});

/* Users route */
router.use(require('./user'));

/* Menu route */
router.use(require('./menu'));

/* Categories routes */
router.use(require('./categories'));

module.exports = function (io) {
  /* Dish route */
  router.use(require('./dish')(io));

  router.get('/admin/extract_menu_from_phantom', function (req, res) {
    scrape_intranet.scrape_html(function (menu_of_the_day) {
      res.send('ok');
      io.emit('update_menu');
    });
  });

  router.get('/admin/full_scrape', function (req, res) {
    scrape_intranet.full_scrape(function (menu_of_the_day) {
      res.send('ok');
      io.emit('update_menu');
    });
  });

  return router;
};
