var mongoose = require('mongoose')

var connectDB = async() => {
    try {
        var conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MongoDB is Connected ${(await conn).connection.host}`);
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB