var Trophey = require('../model/trophy');
var User = require('../model/user');

module.exports.add = function (user_id, req, res) {

  //this function is only for Admins..
  //if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
  //}
  //todo add some validation
  console.log(req.body);
  var trophey = new Trophey({
    name: req.body.name,
    description: req.body.description,
    picture_url: req.body.images != null ? req.body.images.picture : null,
    value: req.body.value,
    business: req.body.business_id,
  });
  trophey.save(function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    User.findOneAndUpdate(
    { _id: user_id },
    { $push: { trophies: data._id } },
    { safe: true, upsert: true },
    function (err, model) {
        if (err) {
          return res.render('error', { error: err });
        }

        console.log(model);
        res.redirect('/users/edit/' + user_id + '/trophy/');
      }
);
  });

};

function getAllTropheys(id, req, res, next) {
  User.findOne({ _id: id, ban: false })
  .select('trophies displayName _id')
  .populate('trophies')
  .exec(function (err, user) {
    if (err) {
      return res.render('error', { error: err });
    }

    if (user != null)
    return User.populate(user, {
      path: 'trophies.business',
      model: 'Business', }, function (err, data) {

          if (err) {
            return res.render('error', { error: err });
          }

          return next(data);
        });

    return res.json({ error: "User doesn't exist!", code: 450 });

  });
};

module.exports.getAllTropheys = getAllTropheys;

module.exports.add_initial = function (id, req, res) {
  User.findOne({ _id: id, ban: false }, function (err, user) {
    if (err) {
      return res.render('error', { error: err });
    }

    if (user != null)
     return res.render('add_trophey', { edit_user: user, menu_users: true });

    return res.json({ error: "User doesn't exist!", code: 440 });
  });
};

module.exports.remove = function (id, trophey_id, req, res) {
  User.update({ _id: id }, { $pull: { trophies: trophey_id } }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return res.redirect('/users/edit/' + id + '/trophy?trophy_deleted=true');
  });

  Trophey.findOne({ _id: trophey_id }).remove(function (err) {
    if (err) console.log(error);

    //TODO ar trebui sa stergem si imaginea trophey-ului..

  });
};

module.exports.edit_initial = function (id, req, res) {

  getAllTropheys(id, req, res, function (user) {
      res.render('trophey', { user: req.user, menu_users: true, edit_user: user, table_trophey: user.trophies });
    });

};

module.exports.edit_initialOneTrophey = function (id, trophey_id, req, res) {
  Trophey.findOne({ _id: trophey_id }, function (err, trophey) {
    if (err) {
      return res.render('error', { error: err });
    }

    if (trophey != null)
    return User.findOne({ _id: id }).select('displayName _id').exec(function (err, user) {
      if (err) {
        return res.render('error', { error: err });
      }

      if (user != null)
       return res.render('add_trophey', { user: req.user, menu_users: true, edit_trophey: trophey, edit_user: user });

      return res.json({ error: "User doesn't exist!", code: 440 });

    });

    return res.json({ error: "Trophey doesn't exist!", code: 540 });

  });

};

module.exports.edit = function (user_id, id, req, res) {
  var update_fields = {

      name: req.body.name,
      description: req.body.description,
      value: req.body.value,
      business: req.body.business_id,
    };
  if (req.body.images != null && req.body.images.picture != null)
   update_fields.picture_url = req.body.images.picture;

  Trophey.update({ _id: id }, update_fields, function (err, user) {
    if (err) {
      return res.render('error', { error: err });
    }

    res.redirect('/users/edit/' + user_id + '/trophy?trophy_edited=true');
  });
};
