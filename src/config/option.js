const enviroment = require('./enviroment.config.js')

const options = {
    fileSystem:{
        cartFileName:"./src/data/cart.json",
        productsFileName:"./src/data/Product.json"
    },
    mongoDb:{
        url:enviroment.MONGO_URI
    }
};

module.exports = options ;