var express = require('express')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('./../model/Story')

var router = express.Router()



// login route : '/'

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

router.get('/dashboard', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()

        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

module.exports = router