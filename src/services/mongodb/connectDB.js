const mongoose = require('mongoose')

const DB_URI = `mongodb+srv://nivethaaa:password495@cluster0.zdeygc8.mongodb.net/test`

const connectDB = async () => {
    try {
      await mongoose.connect(DB_URI) 
      console.log("connected to database")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    connectDB
}