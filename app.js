var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let partials = require('express-partials');
var session = require('express-session');

// routers
var index = require('./routes/index');
var users = require('./routes/users');
var install = require('./routes/install');

// config
let website = require('./util/website');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({resave: true,saveUninitialized: true, secret: 'leopard', cookie: { maxAge: 1000 * 3600 * 24 }}))
app.use(require('flash')());

// 读取网站信息
app.use(function (req,res,next) {
    if (!website.installed() && req.url.indexOf('/install') < 0) {
        return res.redirect('/install');
    }
    res.locals.website = website;
    next();
});

app.use(function(req,res,next){
    function goNext() {
        var flash = res.locals.flash;
        if (flash.length > 0) {
            var info = flash[0];
            var type = info['type'];
            var message = info['message'];
            if (type === 'success') {
                res.locals.error = null;
                res.locals.success = message;
            } else {
                res.locals.error = message;
                res.locals.success = null;
            }
            req.session.flash = [];
        } else {
            res.locals.error = null;
            res.locals.success = null;
        }
        next();
    }
    res.locals.user = null;
    if (req.session.uid) {
        // Users.getbyId(req.session.uid,function (err,user) {
        //     res.locals.user=user;
        //     goNext();
        // });
        goNext();
    } else  {
        res.locals.user=null;
        goNext();
    }

});

app.use('/', index);
app.use('/users', users);
app.use('/install', install);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = '出错啦';
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
