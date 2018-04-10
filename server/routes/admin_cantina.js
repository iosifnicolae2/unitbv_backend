var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var flash = require('connect-flash');
var dish_module = require('../module/dish');
var router = express.Router();

module.exports = function (io) {
  router.get('/', function (req, res, next) {
    dish_module.getAdminCantinaDishes(req, res, function (err, data) {
      if (err) return next(err);;
      res.render('frontend/admin_cantina', { todayMenu: data });
    });
  });

  router.get('/disable_menu/:uid', function (req, res, next) {
    dish_module.disableDish(req, res, req.params.uid, function (err, data) {
      if (err) return res.render('error', { error: err });
      console.log(data);
      res.redirect('/admin_cantina#' + req.params.uid);
      io.emit('update_menu');
    });
  });

  router.get('/enable_menu/:uid', function (req, res, next) {
    dish_module.enableDish(req, res, req.params.uid, function (err, data) {
      if (err) return res.render('error', { error: err });
      console.log(data);
      res.redirect('/admin_cantina#' + req.params.uid);
      io.emit('update_menu');
    });
  });

  return router;
};
