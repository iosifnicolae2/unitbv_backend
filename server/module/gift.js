var Gift = require('../model/gift');
var User = require('../model/user');


module.exports.add = function(user_id,req,res){

  //this function is only for Admins..
  //if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
  //}
  //todo add some validation
  console.log(req.body);
var gift = new Gift({
  title: req.body.title,
  short_description: req.body.short_description,
  description: req.body.description,
  picture_url: req.body.images!=null?req.body.images.picture:null,
  business: req.body.business_id
})
  gift.save(function (err, data) {
    if (err){
      return res.render("error",{error:err});
    }
    User.findOneAndUpdate(
    {_id: user_id},
    {$push: {gifts: data._id}},
    {safe: true, upsert: true},
    function(err, model) {
        if (err){
          return res.render("error",{error:err});
        }
        console.log(model);
          res.redirect('/users/edit/'+user_id+"/gifts/");
    }
);
  });

};

function getAllGifts(id,req,res,next){
User.findOne({_id:id,ban:false})
.select('gifts displayName _id')
.populate('gifts gifts.business')
.exec(function (err, user) {
  if (err){
    return res.render("error",{error:err});
  }

  if(user!=null)
  return User.populate(user,{
    path: 'gifts.business',
      model: 'Business'},function(err,data){

        if (err){
          return res.render("error",{error:err});
        }
        return next(data);
  });


  return res.json({"error":"User doesn't exist!",code:450});


});
};

module.exports.getAllGifts = getAllGifts;


module.exports.add_initial = function(id,req,res){
  User.findOne({_id:id,ban:false},function(err,user){
    if (err){
      return res.render("error",{error:err});
    }

     if(user!=null)
      return res.render('add_gift',{edit_user:user})


      return res.json({"error":"User doesn't exist!",code:440});
  })
}
module.exports.remove = function(id,gift_id,req,res){
User.update({_id:id},{$pull:{gifts:gift_id}},function (err, data) {
  if (err){
    return res.render("error",{error:err});
  }
    return res.redirect('/users/edit/'+id+'/gifts?gift_deleted=true')
});
  Gift.findOne({_id:gift_id}).remove(function(err){
    if(err) console.log(error);

    //TODO ar trebui sa stergem si imaginea gift-ului..

  });
};


module.exports.edit_initial = function(id,req,res){

  getAllGifts(id,req,res,function(user){
      res.render('gifts',{user:req.user,menu_users:true,edit_user:user,table_gifts:user.gifts});
  })

};

module.exports.edit_initialOneGift = function(id,gift_id,req,res){
console.log(id,gift_id);
  Gift.findOne({_id:gift_id},function(err,gift){
    if (err){
      return res.render("error",{error:err});
    }
    if(gift!=null)
    return User.findOne({_id:id}).select('displayName _id').exec(function(err,user){
      if (err){
        return res.render("error",{error:err});
      }
      if(user!=null)
       return res.render('add_gift',{user:req.user,menu_users:true,edit_gift:gift,edit_user:user});

      return res.json({"error":"User doesn't exist!",code:440});

    });

  return res.json({"error":"Gift doesn't exist!",code:540});

  });



};

module.exports.edit = function(user_id,id,req,res){
  var update_fields = {
    title: req.body.title,
    short_description: req.body.short_description,
    description: req.body.description,
    business: req.body.business_id
  };
  if(req.body.images!=null&&req.body.images.picture!=null)
   update_fields.picture_url = req.body.images.picture;

Gift.update({_id:id},update_fields,function (err, user) {
  if (err){
    return res.render("error",{error:err});
  }

  res.redirect('/users/edit/'+user_id+'/gifts?gift_edited=true')
});
};


module.exports.use_gift = function(req,res){
   console.log("use_gift",req.body,req.user._id);
   User.update({_id:req.user._id,ban:false},
     { $pull: {gifts: req.body.gift_id }},function(err,data){
     if(err)
     return res.json({error:err});
    // if(!user)
    //   return res.json({"error":"User doesn't exist!",code:440});

       Gift.findOne({_id:req.body.gift_id}).remove();
      res.json({success:data.nModified>0});

   })
};
