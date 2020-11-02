var express = require('express')
const { ensureAuth } = require('../middleware/auth')

const Story = require('./../model/Story')

var router = express.Router()


// show add page
// login route: GET : '/stories/add'

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// process to add form
// login route: POST : '/stories/add'

router.post('/', ensureAuth, async(req, res) => {
        try {
            req.body.user = req.user.id
            await Story.create(req.body)
            res.redirect('/dashboard')
        } catch (error) {
            console.error(error)
            res.render('error/500')
        }
    })
    // Discr show all stories
    // GET /stories
router.get('/', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


// show Read More
// login route: GET : '/stories/:id'

router.get('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if (!story) {
            return res.render('error/404')
        }
        res.render('stories/show', {
            story
        })

    } catch (error) {
        console.error(error)
        res.render('error/404')
    }
})

// show edit page
// login route: GET : '/stories/edit/:id'

router.get('/edit/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean()

        if (!story) {
            res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story
            })
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }

})

// show update
// login route: PUT : '/stories/:id'

router.put('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')

    }

})


// Delete story
// login route: GET : '/stories/:id'

router.delete('/:id', ensureAuth, async(req, res) => {
    try {
        await Story.findByIdAndRemove(req.params.id)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        return res.render('error/500')

    }
})

// User stories
// login route: GET : '/stories/user/:userId'

router.get('/user/:userId', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean()

        res.render('stories/index', {
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})


module.exports = router