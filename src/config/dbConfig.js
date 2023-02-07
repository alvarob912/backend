const mongoose = require('mongoose')
const options = require('./option')

mongoose.set('strictQuery', false)
mongoose.connect(options.mongoDb.url, (error) => {
    if(error){
        return console.log(`db connection failed: ${error}`)
    }
    console.log('connected to db');
})