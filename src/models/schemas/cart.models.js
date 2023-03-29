const mongoose = require ("mongoose");
const {Schema} = require ("mongoose");

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
    products:{
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity:{
                    type: Number,
                    default: 1,
                    required: true
                }
            }
        ],
        default: [],
        required: true
    }
})

cartSchema.pre('find', function(){
    this.populate('products.product')
})

cartSchema.pre('findOne', function(){
    this.populate('products.product')
})

cartSchema.pre('findById', function(){
    this.populate('products.product')
})

const cartModel = mongoose.model(cartsCollection,cartSchema);

module.exports = cartModel;