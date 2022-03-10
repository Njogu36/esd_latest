const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const router = express.Router();

const auth = (req, res, next) => {
    if (!req.user) {
        req.flash('danger', 'You are logged out. Please login.');
        res.redirect('/')
    }
    else {
        next()
    }
}

// MODELS
const User = require('../models/user')

router.get('/', (req, res) => {
    if (req.user) {
        req.redirect('/admin/')
    }
    else {
        User.find({}, (err, users) => {
            if (users.length < 1) {
                let password = 'Teamwork2021'
                let data = new User();
                data.fullname = 'Jon Doe';
                data.username = 'support@centum.co.ke';
                data.password = password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        data.password = hash
                        data.save(() => {
                            res.render('login')
                        })
                    })
                })
            }
            else {
                res.render('login')
            }
        })
    }

})

router.post('/login_post', passport.authenticate('User', {
    successRedirect: '/admin/',
    failureRedirect: '/',
    failureFlash: true,
    session: true
})
)


router.get('/logout', auth, (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router;