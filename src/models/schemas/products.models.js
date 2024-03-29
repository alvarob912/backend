const mongoose = require ("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')


const productCollection = "products";

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    code:{
        type: Number,
        required:true,
        unique:true
    },
    status:{
        type: String
    },
    stock:{
        type: Number,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },  
    status: {
        type: Boolean,
        default: true
    },
    thumbnails:{
        type: [],
        default: []
    }
});

productSchema.plugin(mongoosePaginate)
const ProductModel = mongoose.model(productCollection,productSchema);

module.exports = ProductModel;