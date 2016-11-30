var User = require('../model/user');
var Dish = require('../model/dish');




function setV(t,n){
  if(typeof t!='undefined')
  return t;
  return n||null;
}

module.exports.add = function(req,res){

  //this function is only for Admins..
  //if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
//  }
  //todo add some validation
/*var schedule = [];
if(req.body.schedule_count>0)
for(var i=0;i<req.body.schedule_count;i++){
  if(typeof req.body['start_day'+i] !='undefined'&&
    typeof req.body['end_day'+i] !='undefined'&&
    typeof req.body['start_hour'+i] !='undefined'&&
    typeof req.body['end_hour'+i] !='undefined')
  schedule.push({
    start_day:req.body['start_day'+i],
    end_day:req.body['end_day'+i],
    start_hour:req.body['start_hour'+i],
    end_hour:req.body['end_hour'+i],
  });
}*/

     if(typeof req.body.images=='undefined') req.body.images = {};

/*
name: { type: String, required: true},
short_description : String,
description : String,
price : { type: String, required: true},
quantity : String,
categories:[{type:String, ref:'Category', required: true}],
logo : String,
large_image : String,
created_at: { type: Date, default: Date.now },
other:Object
*/
  var dish = new Dish({
    name: req.body.name,
    //admin_id:  req.body.admin_id,
    short_description : req.body.short_description,
    description : req.body.description,
    price : req.body.price,
    quantity : req.body.quantity,
  //  type: req.body.type,
  //  phone : req.body.phone,
  //  address : req.body.address,
    categories:req.body.categories,
    logo : setV(req.body.images.logo,"null.svg"),
    large_image : setV(req.body.images.large_image,null),
  //  schedule:schedule,//this is an array of ids!!
  //  location : [ req.body.location_long,req.body.location_lat  ]// [<longitude>, <latitude>]
  });

  dish.save(function (err, data) {
        if (err){
          return res.render("error",{error:err,data:data});
        }
        res.redirect('/dishes/');
    });

};

module.exports.getFeed = function(req,res,next){
  //TODO impelment next token..
Dish.find({}).sort('-created_at').exec(function (err, data) {
  if (err){
    return res.json({error:err});
  }
    return next(data);
});
};

module.exports.getAllDishes = function(req,res,next){
Dish.find({},function (err, data) {
  if (err){
    return res.render("error",{error:err});
  }
    return next(data);
});
};

module.exports.getTodayMenu = function(req,res,next){
Dish.find({is_selected:true}).populate('categories','name').exec(function (err, data) {
  if (err){
    return res.json({error:err});
  }
    return res.json({data:data})
});
};


module.exports.getTodayMenuFilterCat = function(req,res,next){
Dish.find({is_selected:true,categories:req.params.uid}).populate('categories','name').exec(function (err, data) {
  if (err){
    return res.json({error:err});
  }
    return res.json({data:data})
});
};

module.exports.getTodayMenuFilterCats = function(req,res,next){
Dish.find({is_selected:true,categories:{$in:req.body[0]}}).populate('categories','name').exec(function (err, data) {
  if (err){
    return res.json({error:err});
  }
    return res.json({data:data})
});
};
module.exports.getTodayMenuC = function(req,res,next){
Dish.find({is_selected:true}).populate('categories','name').exec(function (err, data) {
  if (err){
    return next(err);
  }
    return next(err,data);
});
};


module.exports.getAllMenuDishes = function(req,res,next){
Dish.find({}).sort("-is_selected").populate('categories','name').exec(function (err, data) {
  if (err){
    return res.render("error",{error:err});
  }
    return next(data);
});
};

module.exports.filterDish = function(req,res,next){
console.log(req.query.filter.length)
  if(req.query.filter!=null&&req.query.filter.length==0)
  q = Dish.find({});
  else
 q = Dish.find({$text: {$search: req.query.filter}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}});

 q.sort({is_selected:1}).populate('categories','name').exec(function (err, data) {
  if (err){
    return res.render("error",{error:err});
  }
    return next(data);
});
};



module.exports.remove = function(id,req,res){
Dish.update({_id:id},{ban:true},function (err, data) {
  if (err){
    return res.render("error",{error:err});
  }
    return res.redirect('/users?user_deleted=true')
});
};

module.exports.updateMenu = function(req,res){
  Dish.update({  },{is_selected:false},{ multi: true },function (err, data) {
    if (err){
      return res.send(err);
    }
    Dish.update({ _id : { $in : req.body.todayMenu } },{is_selected:true},{ multi: true },function (err, data) {
      if (err){
        return res.send(err);
      }
      res.send("Meniul a fost actualizat.")
    });
  });

};



module.exports.edit_initial = function(id,req,res){
Dish.findOne({_id:id},function (err, Dish) {
  if (err){
    return res.render("error",{error:err});
  }

  res.render('add_dish',{user:req.user,menu_dish:true,edit_business:Dish});
});
};
module.exports.find_nearby = function(lng,lat,distance,req,res){
    var dishnt = { type : "Dishnt", coordinates : [ Number(lng), Number(lat) ] };

Dish.aggregate(
[
    {
        '$geoNear': {
            'near': dishnt,
            'spherical': true,
            'distanceField': 'dist',
            'maxDistance': 50000
        }
    },
    {
        $project: {
        name:1,
        address:1,
        categories:1,
        location:1,
        schedule:1,
        dist:1
      }
    },
]).exec(function (err, dish) {
  if (err){
    console.log(err);
    return res.render("error",{error:err});
  }
  res.json({dish:dish});
});
};



module.exports.edit = function(id,req,res){
  var schedule = [];
/*  if(req.body.schedule_count>0)
  for(var i=0;i<req.body.schedule_count;i++){
    if(typeof req.body['start_day'+i] !='undefined'&&
      typeof req.body['end_day'+i] !='undefined'&&
      typeof req.body['start_hour'+i] !='undefined'&&
      typeof req.body['end_hour'+i] !='undefined')
    schedule.push({
      start_day:req.body['start_day'+i],
      end_day:req.body['end_day'+i],
      start_hour:req.body['start_hour'+i],
      end_hour:req.body['end_hour'+i],
    });
  }*/

       if(typeof req.body.images=='undefined') req.body.images = {};

    var dish = {
      name: req.body.name,
      short_description : req.body.short_description,
      description : req.body.description,
      price : req.body.price,
      quantity : req.body.quantity,
      categories:req.body.categories,
      logo : setV(req.body.images.logo,"null.svg"),
      large_image : setV(req.body.images.large_image,null),

    };
    if(setV(req.body.images.logo)!=null)
    dish.logo = setV(req.body.images.logo);



    if(setV(req.body.images.large_image)!=null)
    dish.large_image = setV(req.body.images.large_image);



Dish.update({_id:id},dish,function (err, user) {
  if (err){
    console.error(err)
    return res.render("error",{error:err});
  }

  res.redirect('/dishes?dish_edited=true')
});
};


module.exports.findByAdminUsername = function(username,c){
  Dish.findOne({admin_id:username,},c);
};
module.exports.findById = function(id,c){
  Dish.findOne({_id:id,},c);
};
module.exports.findByIdforClient = function(id,req,res){
  Dish.findOne({_id:id,},function (err, dish) {
    if (err){
      return res.json({error:err});
    }
    res.json({dish:dish});
  });
};
