var express       = require('express')
  , passport      = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , morgan        = require('morgan')
  //, cookieParser  = require('cookie-parser')
  , session       = require('express-session');

var app = express();
var port = process.env.PORT || 8080;
var config = require('./config.js')

passport.use(new LocalStrategy(
    function(username, password, done) {

    }
));

app.use(morgan('dev'));
//app.use(cookieParser());

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res) {
    res.send('Hello!');
});

app.listen(port);
console.log('starting server on port ' + port);
