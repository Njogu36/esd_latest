const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Models //

const User = require('../models/user');

module.exports = function (passport) {

    //local strategy
    passport.use('User',new LocalStrategy(function (username, password, done) {
        //match Username
        let query = {
            username: username
        };
        User.findOne(query, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return done(null, false, {
                    message: 'No User Found'
                });
            }

            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) 
                  throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
            });
        });

    }));


    function SessionConstructor(userId, userGroup, details) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.details = details;
    }

    passport.serializeUser(function (userObject, done) {
        let userPrototype =  Object.getPrototypeOf(userObject);

        if (userPrototype === User.prototype) {
            userGroup = "model1";
        } 

        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
    });

    passport.deserializeUser(function (sessionConstructor, done) {

        if (sessionConstructor.userGroup == 'model1') {
            User.findOne({
                _id: sessionConstructor.userId
            },'-User', function (err, user) {
                done(err, user);
            });
        } 


    });
}
