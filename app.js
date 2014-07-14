'use strict'

// ---------------------------------
// import

var express = require('express')
    , ejs = require('ejs')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
    , RedisStore = require('connect-redis')(session)
    , path = require('path')
    , csrf = require('csurf')
    , methodOverride = require('method-override')
    , errorHandle = require('errorhandler')
    , http = require('http');

var etc = require('./etc/etc');

// ---------------------------------
// app

var app = module.exports = express();

// ---------------------------------
// all env

app.set('port', process.env.PORT || 9000);
app.set('views', path.join(__dirname, 'controllers/views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// static
app.use(express.static(path.join(__dirname, '/public')));

// log
app.use(logger('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// cookie
app.use(cookieParser('cc'));

// session, use redis
app.use(session({
    store: new RedisStore({
        host: etc.redis.host,
        port: etc.redis.port,
        db: etc.redis.db,
        ttl: etc.redis.ttl
    }),
    secret: 'cc',
    key: 'cc',
    cookie: {
        maxAge: etc.redis.ttl
    },
    resave: true,
    saveUninitialized: true
}));

// csrf
app.use(csrf());
app.use(function(req, res, next){
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
});

// method override
app.use(methodOverride('_method'));

// errorhandle
if(app.get('env') == 'development') {
    app.use(errorHandle());
}

// ===============================
// bind

// 加载routes
var routes = require('./routes/index');
var users = require('./routes/users');

// 绑定请求路由
app.use('/', routes);
app.use('/login', users);
app.use('/logout', users);

// ===============================
// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if(app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message : err.message,
        error   : {}
    });
});

// ==============================
// listen port

http.createServer(app).listen(app.get('port'), function(){
    // console.log(path.basename(__filename));
    console.log('Express server listening on port: ' + app.get('port'));
});
