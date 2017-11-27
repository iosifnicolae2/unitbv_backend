var User = require('../model/user');
var Gift = require('../model/gift');
var Trophey = require('../model/trophy');

var bcrypt = require('bcrypt-nodejs');

const saltRounds = 10;

module.exports.add = function(req,res){

  //this function is only for Admins..
//  if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
//  }
  //todo add some validation

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      var user = new User({
        username: req.body.username,
        password: hash,
        user_type:req.body.user_type,
        displayName: req.body.name,
        birthday : req.body.birthday,
        email:req.body.email,
        picture:req.body.images!=null?req.body.images.picture:null
      });
      user.save(function (err, data) {
        if (err){
          return res.render("error",{error:err});
        }
          res.redirect('/users/');
      });
    });
});




};
module.exports.getAllUsers = function(req,res,next){
User.find({ban:false},function (err, data) {
  if (err){
    return res.render("error",{error:err});
  }
    return next(data);
});
};
module.exports.remove = function(id,req,res){
User.update({_id:id},{ban:true},function (err, data) {
  if (err){
    return res.render("error",{error:err});
  }
    return res.redirect('/users?user_deleted=true')
});
};


module.exports.edit_initial = function(id,req,res){
User.findOne({_id:id},function (err, user) {
  if (err){
    return res.render("error",{error:err});
  }

  res.render('add_user',{user:req.user,menu_users:true,edit_user:user});
});
};

module.exports.edit = function(id,req,res){

  var update_fields = {
    username: req.body.username,
    user_type:req.body.user_type,
    displayName: req.body.name,
    birthday : req.body.birthday,
    email:req.body.email,
  };
  if(req.body.images!=null)
  update_fields.picture = req.body.images.picture;

  if(req.body.password){
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
          update_fields.password = hash;
        User.update({_id:id},update_fields,function (err, user) {
          if (err){
            return res.render("error",{error:err});
          }

          res.redirect('/users?user_edited=true')
        });

      });
  });

    return;
  }
User.update({_id:id},update_fields,function (err, user) {
  if (err){
    return res.render("error",{error:err});
  }

  res.redirect('/users?user_edited=true')
});
};


module.exports.findByUsername = function(username,c){
  User.findOne({username:username,ban:false},c);
};
module.exports.findById = function(id,c){
  User.findOne({_id:id,ban:false},c);
};

module.exports.getDashboard = function(req,res){
  User.findOne({_id:req.user._id,ban:false})
  .populate('gifts')
  .populate('trophies')
  .exec(function(err,user){

    if(err)
    return res.json({error:err});
    if(user==null)
    return res.json({error:"User doesn't exist or has been banned.",code:340});

    User.populate(user,{
      path: 'gifts.business',
      model: 'Business'},function(err,data){

          if (err){
            return res.render("error",{error:err});
          }

          User.populate(data,{
            path: 'trophies.business',
            model: 'Business'},function(err,data2){

                if (err){
                  return res.render("error",{error:err});
                }
                res.json({authentificated : true,user:data2});
          });
    });
  })
}
module.exports.getDashboardVersion = function(req,res){
  User.findOne({_id:req.user._id,ban:false})
  .select('__v gifts trophies')
  .populate('gifts','__v')
  .populate('trophies','__v')
  .exec(function(err,user){
//TODO trebuie implementat ceva custom..
    if(err)
    return res.json({error:err});
    if(user==null)
    return res.json({error:"User doesn't exist or has been banned.",code:340});


    res.json({version:user.__v});
  })
}
