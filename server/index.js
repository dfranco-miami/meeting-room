var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    expressSession = require('express-session'),
    //mongooseSession = require('mongoose-session'),  // https://github.com/chncdcksn/mongoose-session
    MongoStore = require('connect-mongo')(expressSession),
    
    accountRoutes = require('./routes/account'),
    bookingRoutes = require('./routes/bookings'),
    
    app = express(),
    
    port = 30000;

var dbName = 'bookitDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

app.use(expressSession({
        key: 'session',
        secret: '128013A7-5B9F-4CC0-BD9E-4480B2D3EFE9',
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        resave: true,
        saveUninitialized: true
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use('/api',  [accountRoutes, bookingRoutes]);

var server = app.listen(port, function () {
    console.log('Express server listening on port ' + server.address().port);
});