var express       = require('express')
  , passport      = require('passport')
  , rpio          = require('rpio')
  //, morgan        = require('morgan')
  , bodyParser    = require('body-parser')
  , session       = require('express-session')
  , request       = require('request')
  , config        = require('./config')
  , models        = require('./models');

var app = express();
var port = process.env.PORT || 3000;

// INITIALIZATION
app.use(express.static(__dirname + '/public'));

rpio.init({ gpiomem: false, mapping: 'gpio' });
for (var gpio in config.gpios) {
    rpio.open(parseInt(gpio), config.gpios[gpio]);
}


passport.use(models.User.createStrategy());
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());

//app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/register', function(req, res, next) {
    models.User.register(req.body.username, req.body.password, function(err) {
        if (err) {
            console.log('error registering user', err);
            return next(err);
        }

        console.log('user registered');

        res.redirect('/');
    });
});


// SESSION ROUTES
app.get('/session', isLoggedIn, function(req, res) {
    res.status(200).end();
});

app.post('/session', passport.authenticate('local'), function(req, res) {
    res.status(201).end();
});

app.delete('/session', function(req, res) {
    req.logout();
    res.redirect('/#/login');
});


// GPIO ROUTES
app.get('/api/\*', isLoggedIn, function(req, res) {
    var gpios = {};
    for (gpio in config.gpios) {
        gpios[gpio] = { "value": rpio.read(parseInt(gpio)) };
    }
    res.json({"GPIO": gpios});
});
app.post('/api/GPIO/:pin/value/:value', isLoggedIn, function(req, res) {
    var value = req.params.value == '0' ? rpio.LOW : rpio.HIGH;
    rpio.write(parseInt(req.params.pin), value);
    res.send(req.params.value);
});

// CAMERA ROUTE
app.use('/camera', isLoggedIn, function(req, res) {
    var proxyUrl = 'http://localhost:8080' + req.url;
    req.pipe(request(url)).pipe(res);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(401).end();
}

models.sequelize.sync().then(function () {
    app.listen(port, function() {
        console.log('starting server on port ' + port);
    });
});
