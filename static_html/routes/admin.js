var express = require('express');
var passport = require('passport');
var router = express.Router();
var fcm_module = require('../module/fcm');



router.use(function(req,res,next){
  try{
  if(req.isAuthenticated()&&req.user.user_type==2)
  next();
  else {
    res.redirect('/login');
  }
}catch(err){}
})


router.get('/admin/',function(req, res) {
    res.redirect('/dishes');
});


router.get('/send_gcm',function(req,res){
  fcm_module.sendNotification("title",
  "http://pngimg.com/upload/gift_PNG5945.png","Ai primit un gift!",false)
  return res.json({ok:true});
})

/* Users route */
router.use(require('./user'));

/* Menu route */
router.use(require('./menu'));

/* Gifts route */
router.use(require('./gift'));

/* Trophey route */
router.use(require('./trophey'));

/* POI route */
router.use(require('./dish'));

/* Posts route */
router.use(require('./posts'));

/* Business route */
router.use(require('./business'));

/* Categories routes */
router.use(require('./categories'));

module.exports = router;
