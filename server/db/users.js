var business = [{
  id:1,
  name: "Starbucks",
  short_description : "Ne place cafeaua, cel putin sa o vindem.",
  description : "Pasiunea este ingredientul secret.",
  phone : "+40752281222",
  address : "Băneasa Shopping City, Șoseaua București-Ploiești 42D, București",
  logo : "http://www.starbucks.com/static/images/global/logo.svg",
  large_image : "http://globalassets.starbucks.com/assets/960b83c436e34f5ea4a1e5c7e6d5191e.jpg",
  schedule : [{
    id: 1,
    start_day:1,
    end_day:5,
    start_hour : 8,
    end_hour :20
  }],
  location : {
    lat :44.4299748,
    long :26.0284866
  }
}];

var records = [
   {
      id:1,
      username:'jack',
      password:'secret',
      displayName:'Jack',
      birthday : "08/08/1990",
      emails:[
         {
            value:'jack@example.com',
            validated: true
         }
      ]
   },
   {
      id:2,
      username:'jill',
      password:'birthday',
      displayName:'Jill',
      birthday : "08/08/1990",
      emails:[
         {
            value:'jill@example.com',
            validated: true
         }
      ]
   },
   {
      id:3,
      username:'iosif',
      password:'iosif',
      displayName:'Iosif Nicolae',
      birthday : "08/08/1990",
      emails:[
         {
            value:'iosifnicolae2@gmail.com',
            validated: false
         }
      ],
      trophey:[{
            id:1,
            name: "Marele trofeu",
            description:"Descrierea marelui trofeu.",
            picture_url:"http://vignette2.wikia.nocookie.net/arrow/images/c/cd/Trophy.png/revision/latest?cb=20141012020028",
            value:100
          },
          {
                id:2,
                name: "Al doilea cel mai mare trofeu",
                description:"Descrierea celui de-al doliea trofeu.",
                picture_url:"https://upload.wikimedia.org/wikipedia/en/6/69/Williamsburg_International_FC_Doylie_Derby_Trophy.png",
                value:100
              }
      ],
      gifts:[{
        id : 1,
        title : "Cafea Starbucks",
        short_description : "Mica descriere",
        description : "long description loooooooooooong",
        picture_url : "http://www.starbucks.com/static/images/global/logo.svg",
        business : business[0]
      }]
   },
   {
      id:4,
      username:'a',
      password:'a',
      displayName:'Iosif Nicolae',
      birthday : "08/08/1990",
      emails:[
         {
            value:'iosifnicolae2@gmail.com',
            validated: false
         }
      ],
      trophey:[{
            id:1,
            name: "Marele trofeu",
            description:"Descrierea marelui trofeu.",
            picture_url:"http://vignette2.wikia.nocookie.net/arrow/images/c/cd/Trophy.png/revision/latest?cb=20141012020028",
            value:100
          },
          {
                id:2,
                name: "Al doilea cel mai mare trofeu",
                description:"Descrierea celui de-al doliea trofeu.",
                picture_url:"https://upload.wikimedia.org/wikipedia/en/6/69/Williamsburg_International_FC_Doylie_Derby_Trophy.png",
                value:100
              }
      ],
      gifts:[{
        id : 1,
        title : "Cafea Starbucks1",
        short_description : "Mica descriere",
        description : "long description loooooooooooong",
        picture_url : "http://vignette1.wikia.nocookie.net/logopedia/images/1/1a/Starbucks_logo_2011.png",
        business : business[0]
      }]
   }
];





exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error("User " + id + " does not exist"));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
