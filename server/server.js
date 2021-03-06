var express = require('express');

var scrape_intranet = require('./module/scrape_intranet');

var mongoose = require('mongoose');
var passport = require('./module/auth/passport');

var mongodb_config = require('./conf/mongodb');
var redis = require('redis');
var redis_client = redis.createClient(6379, 'reddis');
redis_client.on('error', function (err) {
    console.log('Redis error: ' + err);
  });

var session = require('express-session');
var redisStore = require('connect-redis')(session);

mongoose.connect(mongodb_config.url);

// Create a new Express application.
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var auth_api = require('./routes/auth_api');
var admin_route = require('./routes/admin')(io);
var client_route = require('./routes/client');

var api_route = require('./routes/api')(io);

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
var morgan = require('morgan');
morgan.token('headers', function (req, res) {
  console.log('Headers', req.headers);
  return '';
});

morgan.token('body', function (req, res) {
  console.log('Body', req.body);
  return '';
});

app.use(morgan(':status :method :url  - :response-time ms '));
app.use(require('cookie-parser')());

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());

app.use(session({
    secret: 'iah80f8-329fh293hi-asifhaof-8sf9a',
    cookie: { maxAge: 30 * 24 * 3600 * 1000 * 30 },//30 days on mobile we need to login user for more time..
    // create new redis store.
    store: new redisStore({ host: process.env.REDDIS_PORT_6379_TCP_ADDR, port: 6379, client: redis_client, logErrors: true,
      ttl: 30 * 24 * 60 * 60, }),

    saveUninitialized: false,
    resave: false,
    name: 'unitbv',
  }));

// Initialize Passport and restore authentication state, if any, from the
// session.
//app.use(passport.initialize());
//app.use(passport.session());

app.use(require('./conf/web_server'));

// Define routes.
app.use(express.static('public'));

app.use('/static', express.static('public'));

app.use('/api', api_route);

//app.use('/api/auth/', auth_api);
app.use('/api', client_route);

//app.use('/api', api_route);

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./conf/web_server'));

var auth_api = require('./routes/auth_api');
app.use('/api/auth/', auth_api);
//app.use('/api', client_route);

app.use('/', require('./routes/frontend'));
app.use('/admin_cantina', require('./routes/admin_cantina')(io));

app.use(logErrors);
app.use(clientErrorHandler);

//you must be Administrator to use this routes..
app.use('/', admin_route);

app.use(logErrors);
app.use(clientErrorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  //res.status(500).json({ error: 'Something failed!',stacktrace:err });

  if (req.headers['x-requested-with'] == 'XMLHttpRequest')
  return res.json({ error: 505, message: err });

  res.render('error', { error: err });

}

var update_menu_hourly = () => {
  console.log('Updating menu from intranet!');
  scrape_intranet.full_scrape(()=> {console.log('Scrape from intranet completed!');});
};

update_menu_hourly();
// Update menu from intranet every hour
setInterval(update_menu_hourly, 60 * 60 * 1000);

server.listen(3000);
