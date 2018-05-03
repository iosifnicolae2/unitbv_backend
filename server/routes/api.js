var express = require('express');
var _ = require('underscore');
var router = express.Router();

var xlsx = require('node-xlsx');
var fs = require('fs');
var obj = xlsx.parse('./public/orar/orar.xls'); // parses a file

var QueueElementWaze = require('../model/queueElementWaze');
var QueueElementAPs = require('../model/queueElementAPs');


router.get('/test', function(req, res) {
    res.json({
        test: 'ok12'
    });
});

// Utils
function uniq_fast(a, field) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item[field]] !== 1) {
            seen[item[field]] = 1;
            out[j++] = item;
        }
    }
    return out;
}
module.exports = function(io) {
    router.get('/queue/waze_clients', function(req, res) {
        MINUTES_30 = 30 * 60 * 1000;
        QueueElementWaze.find({
            created_at: {
                $gte: new Date(new Date().getTime() - MINUTES_30).toISOString()
            }
        }, function(err, queue_elements) {
            var unique_queue_elements = uniq_fast(queue_elements, 'client_id');
            var average_number_of_clients = unique_queue_elements.reduce((a, o, i, p) => a + o.number_of_clients / p.length, 0)
            res.json({
                err,
                unique_queue_elements,
                average_number_of_clients
            });
        });
    });

    router.post('/queue/waze_clients', function(req, res) {
        // TODO(iosif) we need to validate user input
        var queue_element = new QueueElementWaze({
            client_id: req.body.client_id,
            number_of_clients: req.body.number_of_clients,
        });

        queue_element.save(function(err, data) {
            if (err) {
                return res.json({
                    error: err,
                    data: data,
                    success: false
                });
            }

            io.emit('update_menu');
            res.json({
                error: false,
                success: true,
                data: data
            })
        });

    });

    router.get('/queue/aps_clients', function(req, res) {
        MINUTES_15 = 15 * 60 * 1000;
        QueueElementAPs.find({
            created_at: {
                $gte: new Date(new Date().getTime() - MINUTES_15).toISOString()
            }
        }, function(err, queue_elements) {
            var unique_queue_elements = uniq_fast(queue_elements, 'client_id');
            var number_of_clients = unique_queue_elements.reduce((a, o, i, p) => a + o.in_the_queue, 0)
            res.json({
                err,
                unique_queue_elements,
                number_of_clients
            });
        });
    });

    router.post('/queue/aps_clients', function(req, res) {
        // TODO(iosif) we need to validate user input
        var queue_element = new QueueElementAPs({
            client_id: req.body.client_id,
            APs: req.body.APs,
        });

        queue_element.save(function(err, data) {
            if (err) {
                return res.json({
                    error: err,
                    data: data,
                    success: false
                });
            }

            io.emit('update_menu');
            res.json({
                error: false,
                success: true,
                data: data
            })
        });

    });

    router.get('/orar', function(req, res) {
        console.log('generate orar');
        try {

            var rows = [];
            var writeStr = '';
            //looping through all sheets
            for (var i = 0; i < obj.length; i++) {
                var sheet = obj[i];
                //loop through all rows in the sheet
                for (var j = 0; j < sheet['data'].length; j++) {
                    //add the row to the rows array
                    /*  if(sheet['data'][j]){
                        sheet['data'][j] = sheet['data'][j].filter(function(val) { return val !== null; }).join(", ");
                      }*/
                    rows.push(sheet['data'][j]);
                }
            }

            //creates the csv string to write it to a file
            for (var i = 0; i < rows.length; i++) {
                writeStr += rows[i].join('|') + '\n';
            }

            //writes to a file, but you will presumably send the csv as a
            //response instead
            fs.writeFile('./public/orar_csv/orar.csv', writeStr, function(err) {
                if (err) {
                    return console.log(err);
                }

                res.json({
                    ping: true,
                    err: err,
                    data: rows
                });
            });

            /*
var workbook = XLSX.readFile('./public/orar/orar.xls');


var sheet_name_list = workbook.SheetNames;
sheet_name_list.forEach(function(y) {
var worksheet = workbook.Sheets[y];

          res.json({"ping":true,workbook:worksheet});
for (z in worksheet) {
   all keys that do not begin with "!" correspond to cell addresses
  if(z[0] === '!') continue;
  //console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
}
});

*/
        } catch (err) {

            res.json({
                ping: true,
                err: err
            });
        }

    });


    return router;
};
