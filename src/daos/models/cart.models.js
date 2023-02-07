const mongoose = require ("mongoose");
const {Schema} = require ("mongoose");

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'productId' },
        quantity: Number,
        _id:false
    }]
})

const cartModel = mongoose.model(cartsCollection,cartSchema);

module.exports = cartModel;