var express = require('express');
var _ = require('underscore');
var passport = require('passport');
var flash=require("connect-flash");
var router = express.Router();
var fcm_module = require('../module/fcm');



router.get('/',function(req, res) {
    res.json({"ping":true,"authentificated":req.isAuthenticated()});
  });

router.post('/login',function(req, res, next){
  console.log("trying to auth",req.body)
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.status(401).json({ authentificated : false, message : 'Authentication failed' });
    }
    req.login(user, function(err){
      if(err){
        return next(err);
      }

        fcm_module.updateUser(user._id,req.body.token);

      return res.json({
        "authentificated":true,
        "user":filter_user(req.user)
    });
    });
  })(req, res, next);
});

  router.get('/login_error', function(req, res) {
      res.send(401, {login_error: req.flash('loginMessage')});
    });

router.get('/logout',function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/profile',function(req, res){

    res.json({
      "authentificated":req.isAuthenticated(),
      "user":filter_user(req.user)
  });
});

function filter_user(user){
  return _.omit(user, 'password');
}

module.exports = router;
