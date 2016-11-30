var express = require('express');
var _ = require('underscore');
var router = express.Router();

var xlsx = require('node-xlsx');
var fs = require('fs');
var obj = xlsx.parse('./public/orar/orar.xls'); // parses a file


router.get('/orar',function(req, res) {
try{


  var rows = [];
  var writeStr = "";
  //looping through all sheets
  for(var i = 0; i < obj.length; i++)
  {
      var sheet = obj[i];
      //loop through all rows in the sheet
      for(var j = 0; j < sheet['data'].length; j++)
      {
              //add the row to the rows array
            /*  if(sheet['data'][j]){
                sheet['data'][j] = sheet['data'][j].filter(function(val) { return val !== null; }).join(", ");
              }*/
              rows.push(sheet['data'][j]);
      }
  }

  //creates the csv string to write it to a file
  for(var i = 0; i < rows.length; i++)
  {
      writeStr += rows[i].join("|") + "\n";
  }

  //writes to a file, but you will presumably send the csv as a
  //response instead
  fs.writeFile("./public/orar_csv/orar.csv", writeStr, function(err) {
      if(err) {
          return console.log(err);
      }

        res.json({"ping":true,err:err});
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
}catch(err){

          res.json({"ping":true,err:err});
}

  });


module.exports = router;
