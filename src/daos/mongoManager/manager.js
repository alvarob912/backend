const ProductModel = require ("../models/products.models")
const cartModel = require("../models/cart.models")

class productMongoManager{
    async getProducts() {
        try{
                const prod = ProductModel.find();
                return prod;
            }
        catch(error){
            throw new Error(`no se pudo leer el archivo ${error}`)
        }
    }

    async getProductById(id) {
        try{
            const prod = ProductModel.findById(id);
                return prod;
        }
        catch(error){
            throw new Error(`no se pudo leer el archivo ${error}`)
        }
    }

    async addProduct(product) {
        try{
            const savedProducts = await this.getProducts()
            const DuplicatedProduct = savedProducts.find(item => item.code == product.code)
            if (DuplicatedProduct){
                throw new Error(`El codigo ya esta registrado ${product.code}`)
            }
            if (Object.keys(product).length < 6) {
                throw new Error(`Todos los campos son requeridos`)
            }
            const newId = savedProducts.length > 0 ? savedProducts[savedProducts.length -1 ].id + 1 : 1
            const newProduct = {
                id: newId, 
                ...product
            }
            const addProd= await ProductModel.create(newProduct)
            return addProd
        }
        catch(error){
            throw new Error(`error ${error}`)
        }
        }
        async updateProduct(id, product) {
            try {
                const ProdUpdated = await ProductModel.findByIdAndUpdate(id, product,{new:true});
                return ProdUpdated;
            } catch (error) {
                throw new Error(`Error updating ${error}`);}
    }


    async deleteById(id) {
        try {
            const prod = await ProductModel.findByIdAndDelete(id);
            return `Element with code: ${prod.code} deleted successfully`;
        } catch (error) {
            throw new Error(`Error deleting: ${error}`);
        }
    }

    async deleteAll() {
        try {
            await ProductModel.deleteMany({});
            return "delete all successfully";
        } catch (error) {
            throw new Error(`Error deleting: ${error}`);
        }
    }

    async getCarts() {
        try{
                const cart = cartModel.find();
                return cart;
            }
        catch(error){
            throw new Error(`no se pudo leer el archivo ${error}`)
        }
    }

    async getCartById(id) {
        try{
            const cart = cartModel.findOne({id});
            if (!cart) {
                throw new Error('ERROR: no existe ID')
            }
                return cart;
        }
        catch(error){
            throw new Error(`no se pudo leer el archivo ${error}`)
        }
    }
    async createCart() {
        try {
            const newCart = { products: [] };
            const addProd = await cartModel.create(newCart)
                return addProd
        } catch (error) {
            throw new Error(`no se pudo crear el cart ${error}`)
        }
        
    }

    async addProductToCart(cid, pid) {
        try {
            const cartExist = await this.getCartById(cid)
            const productExist = cartExist.products.find(product => product.productId == pid)
            const setProductId = productExist ? productExist.productId : pid;
            const setQuantity = productExist ? quantity + productExist.quantity : quantity

            if (productExist != undefined) {
                const updatedProduct = await cartModel.findOneAndUpdate(
                    { _id: cid, 'products': { $elemMatch: { productId: setProductId } } },
                    { $set: { 'products.$.quantity': setQuantity } },
                    { new: true },
                );
                return updatedProduct
            } else {
                const updatedProduct =
                    await cartModel.updateOne({ _id: cid }, { $push: { products: { productId: pid, quantity: quantity } } })
                return updatedProduct
            }

        }
        catch (error) {
            throw new Error(error.message)
        }
    };

    async deleteProductToCart(cid, pid) {
        try {
            const deleteProduct = await cartModel.findOneAndUpdate(

                { _id: cid, "products.productId": pid },
                { $pull: { "products": { "productId": pid } } },
            );
            return deleteProduct

        }
        catch (error) {
            throw new Error(error.message)
        }
    };

    async deleteCart(id) {
        try {
            const deletedProduct = await cartModel.deleteOne({ _id: id })
            console.log(`product deleted`)
            return deletedProduct
        }
        catch (error) {
            throw new Error(error.message)
        }
    }

}

module.exports = productMongoManager;