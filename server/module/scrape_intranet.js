
var dish = require('./dish');
var update_phantom = module.exports.update_phantom = function update_phantom(next) {
  var exec = require('child_process').exec;
  run_phantom = exec("sh /server/run_phantom.sh", function(err, stdout, stderr) {
    if (err) {
      // should have err.code here?
    }
    console.log("Phantooom:", stdout, stderr);
    next({stdout:stdout, stderr:stderr})

  });
}

var request = require("request");
var fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jquery')(window);


if(typeof(String.prototype.trim) === "undefined") {
  String.prototype.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '').replace('\n','');
  };
}


var getJsonFromTable = function(table) {
  var rows = [];
  $(table).find('tbody tr').each(function(i, n){
                var $row = $(n);
                rows.push({
                    nr: $row.find('td:eq(0)').text().trim(),
                    denumire: $row.find('td:eq(1)').text().trim(),
                    cantitate: $row.find('td:eq(2)').text().trim(),
                    pret: $row.find('td:eq(3)').text().trim(),
                });
            });
            delete rows[0];
            return rows;
};

var scrape_html = module.exports.scrape_html = function scrape_html(callback) {
  fs.readFile('intranet_directory/meniu.html', 'utf8', function (err, body) {
    if (err) {
      return console.log(err);
    }
    var $body = $(body);
    var date = $body.find("#dnn_ctr793_HtmlModule_lblContent > p > strong > span").text().replace("DATA:", '').trim();
    var $table = $body.find("#dnn_ctr793_HtmlModule_lblContent > center > table");
    var tbl = getJsonFromTable($table);
    if(tbl.length == 0) {
      return console.log(body);
    }
    callback({date: date, tbl:tbl});
  });
}

// TODO we should perserve the below variable in database.
var CACHED_MENU_DATE = '';
module.exports.full_scrape = function(next) {
  update_phantom(function(phantom_output) {
    scrape_html(function(menu) {
      if(menu.date != CACHED_MENU_DATE){
        CACHED_MENU_DATE = menu.date;
        console.log('Menu updated');
        dish.update_from_intranet_data(menu);
      } else {
        console.log('Menu is not updated from intranet!');
      }
      next();
    })
  })
}
