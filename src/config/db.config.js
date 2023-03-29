// const mongoose = require('mongoose')
// const { logRed, logCyan } = require('../utils/console.utils')
// const options = require('./option')

// mongoose.set('strictQuery', false)
// mongoose.connect(options.mongoDb.url, (error) => {
//     if(error){
//         return logRed(`db connection failed: ${error}`)
//     }
//     logCyan('connected to db');
// })

const {MONGO_URI, DATABASE, DB_PASSWORD} = require('./enviroment.config.js')

const DB_CONFIG = {
    mongo: {
        uri: MONGO_URI.replace('<password>', DB_PASSWORD).replace('<database>', DATABASE)
    }
}

module.exports = DB_CONFIG 