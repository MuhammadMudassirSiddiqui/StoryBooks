var express = require('express')
var path = require('path')
var dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')
const connectDB = require('./config/db')
const MongoStore = require('connect-mongo')(session)


dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)

connectDB()

var app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
// handle bars login
const { formatDate, editIcon, truncate, stripTags, select } = require('./helpers/hbs')

// handle bars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

// session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// global variables

app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))



var PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running in  mode on port ${PORT}`);
})