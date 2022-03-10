const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

const path = require('path')




require('./config/passport')(passport);

mongoose.connect('mongodb://localhost/esd');

const db = mongoose.connection;
db.on('connected', () => {
    console.log('DB IS CONNECTED.')
})
db.once('error', (err) => {
    console.log(err)
})

//app.use(express.static('public'));
// VIEWS - JADE
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'jade');

// CONNECT FLASH
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// SESSION
const store = new MongoDBStore({
    uri: "mongodb://localhost/esd",
    collection: 'sessions'
});

app.use(session({
    secret: 'Tier Data Limited Company Billing Management System',
    resave: true,
    saveUninitialized: true,
    store: store
}));


// PASSPORT
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const admin = require('./routes/admin')
const auth = require('./routes/auth')
const sessions = require('./routes/session')
app.use('/admin', admin)
app.use('/session',sessions)
app.use('/', auth)


app.listen(process.env.PORT || 7070, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log('App is running on port 7070')
    }
})

module.exports = app