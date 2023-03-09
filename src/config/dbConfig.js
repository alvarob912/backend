const mongoose = require('mongoose')
const { logRed, logCyan } = require('../utils/console.utils')
const options = require('./option')

mongoose.set('strictQuery', false)
mongoose.connect(options.mongoDb.url, (error) => {
    if(error){
        return logRed(`db connection failed: ${error}`)
    }
    logCyan('connected to db');
})