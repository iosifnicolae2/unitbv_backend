var User = require('../model/user');
var Business = require('../model/business');

function setV(t, n) {
  if (typeof t != 'undefined')
  return t;
  return n || null;
}

module.exports.add = function (req, res) {

  //this function is only for Admins..
  //if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
  //  }
  //todo add some validation
  var schedule = [];
  if (req.body.schedule_count > 0)
  for (var i = 0; i < req.body.schedule_count; i++) {
    if (typeof req.body['start_day' + i] != 'undefined' &&
      typeof req.body['end_day' + i] != 'undefined' &&
      typeof req.body['start_hour' + i] != 'undefined' &&
      typeof req.body['end_hour' + i] != 'undefined')
    schedule.push({
      start_day: req.body['start_day' + i],
      end_day: req.body['end_day' + i],
      start_hour: req.body['start_hour' + i],
      end_hour: req.body['end_hour' + i],
    });
  }

  if (typeof req.body.images == 'undefined') req.body.images = {};

  var business = new Business({
    name: req.body.name,
    admin_id:  req.body.admin_id,
    short_description: req.body.short_description,
    description: req.body.description,
    phone: req.body.phone,
    address: req.body.address,
    categories: req.body.categories,
    logo: setV(req.body.images.logo, 'null.svg'),
    large_image: setV(req.body.images.large_image, null),
    schedule: schedule,//this is an array of ids!!
    location: [req.body.location_long, req.body.location_lat],// [<longitude>, <latitude>]
  });

  business.save(function (err, data) {
        if (err) {
          return res.render('error', { error: err, data: data });
        }

        res.redirect('/business/');
      });

};

module.exports.getAllBusiness = function (req, res, next) {
  Business.find({ ban: false }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return next(data);
  });
};

module.exports.remove = function (id, req, res) {
  Business.update({ _id: id }, { ban: true }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return res.redirect('/users?user_deleted=true');
  });
};

module.exports.edit_initial = function (id, req, res) {
  Business.findOne({ _id: id }, function (err, business) {
    if (err) {
      return res.render('error', { error: err });
    }

    res.render('add_business', { user: req.user, menu_business: true, edit_business: business });
  });
};

module.exports.find_nearby = function (lng, lat, distance, req, res) {
    var point = { type: 'Point', coordinates: [Number(lng), Number(lat)] };

    Business.aggregate(
    [
        {
            $geoNear: {
                near: point,
                spherical: true,
                distanceField: 'dist',
                maxDistance: 50000,
              },
          },
        {
            $project: {
              name: 1,
              address: 1,
              categories: 1,
              location: 1,
              schedule: 1,
              dist: 1,
            },
          },
    ]).exec(function (err, business) {
      if (err) {
        console.log(err);
        return res.render('error', { error: err });
      }

      res.json({ business: business });
    });
  };

module.exports.edit = function (id, req, res) {
  var schedule = [];
  if (req.body.schedule_count > 0)
  for (var i = 0; i < req.body.schedule_count; i++) {
    if (typeof req.body['start_day' + i] != 'undefined' &&
      typeof req.body['end_day' + i] != 'undefined' &&
      typeof req.body['start_hour' + i] != 'undefined' &&
      typeof req.body['end_hour' + i] != 'undefined')
    schedule.push({
      start_day: req.body['start_day' + i],
      end_day: req.body['end_day' + i],
      start_hour: req.body['start_hour' + i],
      end_hour: req.body['end_hour' + i],
    });
  }

  if (typeof req.body.images == 'undefined') req.body.images = {};

  var business = {
    name: req.body.name,
    admin_id:  req.body.admin_id,
    short_description: req.body.short_description,
    description: req.body.description,
    phone: req.body.phone,
    categories: req.body.categories,
    address: req.body.address,
    schedule: schedule,//this is an array of ids!!
  };
  if (setV(req.body.images.logo) != null)
  business.logo = setV(req.body.images.logo);

  if (setV(req.body.images.large_image) != null)
  business.large_image = setV(req.body.images.large_image);

  if (req.body.location_long != null && req.body.location_lat != null)
  business.location = [req.body.location_long, req.body.location_lat];// [<longitude>, <latitude>]

  Business.update({ _id: id }, business, function (err, user) {
    if (err) {
      console.error(err);
      return res.render('error', { error: err });
    }

    res.redirect('/business?business_edited=true');
  });
};

module.exports.findByAdminUsername = function (username, c) {
  Business.findOne({ admin_id: username, ban: false }, c);
};

module.exports.findById = function (id, c) {
  Business.findOne({ _id: id, ban: false }, c);
};

module.exports.findByIdforClient = function (id, req, res) {
  Business.findOne({ _id: id, ban: false }, function (err, business) {
    if (err) {
      return res.json({ error: err });
    }

    res.json({ business: business });
  });
};
