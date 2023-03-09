const fs = require("fs/promises");

class ProductManager {
    constructor(path){
        this.path = path
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
            savedProducts.push(newProduct)
            const productListString = JSON.stringify(savedProducts, null, '\t')
            await writeFile(this.path, productListString)
            console.log(`${product.title}`)
        }
        catch(error){
            console.log(error.message)
        }
    }
    
    async getProducts() {
        try{
                const data = await fs.readFile(this.path, "utf-8");
                const items = await JSON.parse(data);
                return items;
            }
        catch(error){
            console.log(error.message)
        }
    }

    async getProductById(id) {
        try{
            const savedProducts = await this.getProducts();
            const selectedProduct = savedProducts.find(prod => prod.id === id)
            if(!selectedProduct){
                throw new Error('No hay producto con ese id')
            }
            return selectedProduct
        }
        catch(error){
            console.log(error.message)
        }
    }

    async updateProduct(id, product) {
        try{
            const savedProducts = await this.getProducts()
            const targetProduct = await this.getProductById(id)
            if(targetProduct){
                const updatedProduct = {...targetProduct, ...product}
                const updatedList = savedProducts.map(prod =>{
                    if(prod.id === id){
                        return updatedProduct
                    }else{
                        return prod
                    }
                })
                const productListString = JSON.stringify(updatedList, null, '\t')
                await writeFile(this.path, productListString)
                console.log('producto modificado')
            }
        }
        catch(error){
            console.log(error.message)
        }
    }

    async deleteProduct(id) {
        try{
            const savedProducts = await this.getProducts();
            const targetProduct = await this.getProductById(id)
            const filteredList = savedProducts.filter(prod => prod.id !== id)
            if(!targetProduct){
                throw new Error('Id no econtrado')
            }
            else{
                const productListString = JSON.stringify(filteredList, null, '\t')
                await writeFile(this.path, productListString)
                console.log(`${targetProduct.title} eliminado`)
            }
        }
        catch(error){
            console.log(error.message)
        }
    }





    async createCart() {
        let cart = await this.getProducts();
        const newCart = { id: cart.length + 1, products: [] };
        cart.push(newCart);
        await this.writeFile(cart);
        return cart;
    }

    async addToCart (pid, cid){
        let cart = await this.getProducts();

        const order = cart.find((or) => or.orderId === cid)
        if(order){
            const prodExist = order.products.find((prod) => prod.prodId === pid);

            if(prodExist){
                const orderPos = cart.findIndex((order) => order.orderId === cid);
                const updateProd = cart[orderPos].products.find((prod) => prod.prodId === pid);
                const prodPos = cart[orderPos].products.findIndex((prod) => prod.prodId === pid);

                cart[orderPos].products[prodPos].quantity= updateProd.quantity + 1;

                await this.writeFile(cart);
                return cart;
            } else {
                const newProd = {prodId : pid, quantity : 1}
                const orderPos = cart.findIndex((or) => or.orderId === cid)

                if(orderPos <=0){
                    cart[orderPos].products.push(newProd);
                    await this.writeFile(cart);
                    return cart;
                }
            }
        } else {
            const newOrder = {
                orderId: cart.length + 1,
                products : [{prodId : pid, quantity: 1}],
            };
            cart.push(newOrder);
            await this.writeFile(cart);
            return cart;
        }
    }
}

module.exports = ProductManager;