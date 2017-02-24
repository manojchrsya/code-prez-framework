'use strict;'
var express          =   require('express'),
	bodyParser       =   require('body-parser'),
    MongoClient      =   require('mongodb').MongoClient,
    routes           =   require('json-routing'),
    compression      =   require('compression'),
    methodOverride   =   require('method-override'),
    helmet           =   require('helmet'),
    modules          =   require("../module/module.json"),
    nunjucks         =   require('nunjucks'),
    fs               =   require('fs-extra'),
    path             =   require('path'),
    session          =   require('express-session'),
    RedisStore       =   require('connect-redis')(session);
    flash            =   require('express-flash'),
    cookieParser     =   require('cookie-parser'),
    _string          =   require('underscore.string'),
    multipart        =   require('connect-multiparty'),
    winston          =   require("winston");  
     
global.Validator     =   require('validatorjs');
global.fs            =   require('fs-extra');
global.async         =   require('async');
global._             =   require('lodash'); 
global.moment        =   require('moment');  
global.bcrypt        =   require('bcrypt-nodejs');
global.ObjectID      =   require('mongodb').ObjectID;
global.passport      =   require('passport');
global.LocalStrategy =   require('passport-local').Strategy;
global.HELPER        =   require('../helpers');
global.envConfig     =   require('../../config/'+process.argv[2]+'.json');
global.fileSystem    =   require('fs');   

// expose express method
exports.express = express;

//intialising app 
var app = express();

// initialize codepress module
exports.init = function () {
	app.set("env", envConfig.mode);

	var port = (envConfig.port && !isNaN(envConfig.port)) ? envConfig.port : 5000;
    app.set('port', (process.env.PORT && !isNaN(process.env.PORT)) ? process.env.PORT : port);

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(multipart({
      maxFields: 10000
    }));

    app.use(cookieParser()) // read cookies (needed for auth)

    //compressing can greatly decrease the size of the response body
    app.use(compression());

    //Override the method of a request based on a the X-HTTP-Method-Override header or custom query/post parameter
    app.use(methodOverride());

    //Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
    app.use(helmet());

    // set nunjucks as template engine and load all template files
    var appViews = [];
    for(module in modules){
        /*admin views*/
        var viewFile = '';
        viewFile = "./lib/module/" + modules[module] + '/views';
        if (fs.existsSync(viewFile)) { // check template exist or not
            appViews.push("./lib/module/" + modules[module] + '/views');
        }
       // appViews.push("./lib/module/layouts/views");
    };
    appViews.push("./lib/module/layouts/views"); // push layout dir to views

    // pass views to nunjucjks
    nunjucks.configure(appViews, {
        autoescape  : true,
        express     : app
    });
    app.set('views', appViews);
    app.set('view engine', 'html');

    // parse an HTML body into a string
    app.use(bodyParser.text());

    // static path
    app.use('/static', express.static('assets'));
    app.use(session({   store: new RedisStore({
                            host: envConfig.redis.host,
                            port: envConfig.redis.port,
                            db: envConfig.redis.database
                        }),
                        secret: 'carworkz-gms',     
                        cookie: { maxAge: 86400000 * 20 }, 
                        resave: true, 
                        saveUninitialized: true
                    }));
    // intialise passport
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.use(function(req, res, next){
        // set local variable to direct access in templates
        res.locals.envConfig    = envConfig;
        res.locals.siteurl      = envConfig.siteUrl;
        res.locals._string      = _string;
        res.locals.HELPER       = HELPER;
        res.locals.qryParams    =   req.query;
        res.locals.current_url  = req.path
        if (_.has(req.session, 'flash') && req.session.flash) {
            res.locals.flash_message = req.session.flash
        }

        if (_.has(req.session, 'passport') && req.session.passport.user) {
            res.locals.session      = req.session.passport;
            req.userId              = req.session.passport.user.id;
            res.locals.isLoggedIn   = true;
        } else {
            res.locals.isLoggedIn   = false;
        }

        res.locals.moment   = require('moment');
        res.locals._        = require('lodash');
        res.locals.adminModules = modules;
        next();
    });
 
};

exports.start = function (listen) {
    if(listen){
        app.listen(app.get('port'));
        console.log('Server is running on port ' + app.get('port') + ' in "' + app.get('env') + '" environment.');
    }
};

exports.routes = function(){
    
    for(module in modules){
        var routeOptions = {
            routesPath      : "./lib/module/"+modules[module]+"/routes",
            cors            : false,
            displayRoute    : false,
            defaultAction   : "index"
        };
        routes(app, routeOptions);    
    }
}

exports.initPassport = function(){
    
    var WorkshopUser = mysqlObj.Model.extend({
        tableName: 'users'
    });

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(sessionWorkshopUser, done) {
        new WorkshopUser({
            id: sessionWorkshopUser.id
        }).fetch().then(function(user) {
            done(null, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        new WorkshopUser({
            email: email
        }).fetch().then(function(user){
            if (user){
                var user = user.toJSON();
                // if the user is found but the password is wrong
                if (!HELPER.validPassword(password, user.password)){
                    var respdata = HELPER.errorHandler(400, {errors: ['Please enter correct password.']});
                    return done(null, false, req.flash('error_message', respdata.responseParams.message)); // create the loginMessage and save it to session as flashdata
                } 
                   
                // all is well, return successful user
                return done(null, user);   
            }else{
                var respdata = HELPER.errorHandler(400, {errors: ['Email id not found in records.']});
                return done(null, false, req.flash('error_message', respdata.responseParams.message)); // req.flash is the way to set flashdata using connect-flash      
            }
            
        })
        .catch(function(err) {
            //send the error data
            console.log(err);
            var respdata = HELPER.errorHandler(400, {errors: ["Error Code: "+err.code]});
            return done(null, false, req.flash('error_message', respdata.responseParams.message));
        });

    }));
}

exports.logger = function(){
    logger = new(winston.Logger)({
        transports: [
            new(winston.transports.File)({
                level: 'error',
                filename: __base + 'logs/error.log',
                json: false
            })
        ],
        exceptionHandlers: [
            new winston.transports.File({
                filename: __base + 'logs/exceptions.log',
                json: false
            })
        ],
        exitOnError: false
    });
};

exports.render404 = function(){
    app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
    });
    app.use(function(err, req, res, next) {
        logger.log('error', err.status, err);
        res.status(err.status || 500);
        var msg = {
            message: err.message,
            error: err
        }
        res.render('404', msg);
    });
}