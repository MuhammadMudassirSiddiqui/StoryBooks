var express = require('express')
var passport = require('passport')
var router = express.Router()


// login route : '5000/auth/google'

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


//  route : '5000/auth/google/callback'

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard')
})

// logout /auth/logout

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router