### Waze client
GET `/api/queue/waze_clients` - retrieve a list of clients that reported that there is a lot of people at the queue and a computed number of clients in the queue(average reported number in the last 30 minutes).

POST `/api/queue/waze_clients`
You can report that there are a lot of people at the queue.
Android
```javascript
// Node.js code
var request = require("request");

var options = {
  method: 'POST',
  url: 'https://unitbv.mailo.ml/api/queue/waze_clients',
  headers: {
     'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    client_id: '123456789',
    number_of_clients: 20
  }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

```

### APs clients
GET `/api/queue/aps_clients` - retrieve a list of clients that are in the queue and a computed number of clients in the queue.

POST `/api/queue/aps_clients`
You can report that there are a lot of people at the queue.
Android
```javascript
// Node.js code
var request = require("request");

var options = {
  method: 'POST',
  url: 'https://unitbv.mailo.ml/api/queue/aps_clients',
  headers: {
     'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    client_id: '123456789',
    APs: [{
      name:"ap1", level:40
    }, {
      name:"ap2", level:45.5
    }]
  }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

```
