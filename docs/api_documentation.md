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

var options = { method: 'POST',
  url: 'https://unitbv.mailo.ml/api/queue/aps_clients',
  headers: {
     'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  body: 'client_id=12345&APs%5B0%5D%5Bap_name%5D=ap1&APs%5B0%5D%5Bap_level%5D=20' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

```
```Java
// Java
OkHttpClient client = new OkHttpClient();

MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded; charset=UTF-8");
RequestBody body = RequestBody.create(mediaType, "client_id=12345&APs%5B0%5D%5Bap_name%5D=ap1&APs%5B0%5D%5Bap_level%5D=20");
Request request = new Request.Builder()
  .url("https://unitbv.mailo.ml/api/queue/aps_clients")
  .post(body)
  .addHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8")
  .addHeader("cache-control", "no-cache")
  .build();

Response response = client.newCall(request).execute();
```
```bash
// cURL
curl -X POST \
  https://unitbv.mailo.ml/api/queue/aps_clients \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8' \
  -d 'client_id=12345&APs%5B0%5D%5Bap_name%5D=ap1&APs%5B0%5D%5Bap_level%5D=20'
  ```
