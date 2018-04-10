var User = require('../model/user');
var Category = require('../model/category');

function setV(t) {
  if (typeof t != 'undefined')
  return t;
  return null;
}

module.exports.add = function (req, res) {

  //this function is only for Admins..
  //if(!req.isAuthenticated()||req.user.user_type!=2){
  //  return console.log("We have intruders. User type isn't 2!!");
  //  }
  //todo add some validation

  if (typeof req.body.images == 'undefined') req.body.images = {};

  var category = new Category({
    name: req.body.name,
    short_description: req.body.short_description,
    color: req.body.color,
    description: req.body.description,
    logo: setV(req.body.images.logo),
  });

  category.save(function (err, data) {
        if (err) {
          return res.render('error', { error: err, data: data });
        }

        res.redirect('/categories/');
      });

};

module.exports.getAllCategories = function (req, res, next) {
  Category.find({ removed: false }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return next(data);
  });
};

module.exports.getAllCategoriesNamesAPI = function (req, res) {
  Category.find({ removed: false }, 'name', function (err, data) {
    if (err) {
      return res.json({ error: err });
    }

    return res.json({ categories: data });
  });
};

module.exports.getAllCategoriesNames = function (req, res, next) {
  Category.find({ removed: false }, 'name', function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return next(data);
  });
};

module.exports.getAllCategoriesNamesFrontend = function (next) {
  Category.find({ removed: false }, 'name logo color', function (err, data) {
    if (err) {
      console.log('getAllCategories errors: ', err);
    }

    return next(err, data);
  });
};

module.exports.get = function (id, req, res, next) {
  Category.findOne({ _id: id, removed: false }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return next(data);
  });
};

module.exports.remove = function (id, req, res) {
  Category.update({ _id: id }, { removed: true }, function (err, data) {
    if (err) {
      return res.render('error', { error: err });
    }

    return res.redirect('/categories?category_deleted=true');
  });
};

module.exports.edit_initial = function (id, req, res) {
  Category.findOne({ _id: id }, function (err, category) {
    if (err) {
      return res.render('error', { error: err });
    }

    res.render('add_category', { user: req.user, menu_categories: true, edit_category: category });
  });
};

module.exports.edit = function (id, req, res) {

      if (typeof req.body.images == 'undefined') req.body.images = {};

      var category = {
        name: req.body.name,
        short_description: req.body.short_description,
        color: req.body.color,
        description: req.body.description,
      };

      if (setV(req.body.images.logo) != null)
      category.logo = req.body.images.logo;
      Category.update({ _id: id }, category, function (err, user) {
        if (err) {
          console.error(err);
          return res.render('error', { error: err });
        }

        res.redirect('/categories?category_edited=true');
      });
    };

module.exports.findById = function (id, c) {
  Category.findOne({ _id: id, ban: false }, c);
};
