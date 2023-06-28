const {MONGO_URI, DATABASE, DB_PASSWORD} = require('./enviroment.config.js')

const DB_CONFIG = {
    mongo: {
        uri: MONGO_URI,
    },
}

module.exports = DB_CONFIG 