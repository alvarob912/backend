const { Router } = require("express");
const productMongoManager = require("../../models/daos/mongoManager/manager")

const cartService = new productMongoManager();
const productService = new productMongoManager();

const router = Router();

router.post("/", async (req, res) => {
    try {
        const data = await cartService.createCart();
        res.status(200).json({
            prod:data,
            status:"EXITOSO"
        })
    } catch (error) {
        res.status(400).json({
            message:error.message,
            status:"ERORR"
        })
    }
})

router.get("/:cid", async (req, res) => {
    const {cid} = req.params
    try{
        const data = await cartService.getCartById(cid);
        res.status(200).json({
            prod:data,
            status:"EXITOSO"
        });
    } catch (error) {
        res.status(400).json({
            message:error.message,
            status:"ERROR"
        })
    }
    
});

router.post('/:cid/products/:pid', async (req, res) => {
    try{
    let cid = req.params.cid
    let pid = req.params.pid
    let quantity = req.query.q
    !quantity ? quantity = 1 : quantity = quantity
    await productService.getProductById(pid)
    let addProduct = await cartService.addProductToCart(cid, pid, quantity);
    res.send({ status: 'success', message: addProduct })}
    catch (error) {
        res.status(400).send({
            status: "error aca",
            error: error.message
        })
    }
});
// DELETE PRODUCT TO CART 
router.delete('/:cid/product/:pid', async(req,res)=>{
    try {
        const {cid, pid} = req.params
        const deletedProduct = await cartService.deleteProductFromCart(cid, pid)
        res.send({
            status: 'success',
            newCart: deletedProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})
// DELETE CART 
router.delete('/:pid', async (req, res) => {
    
    try {
        let pid = req.params.pid
        let cartDelete = await cartService.deleteCart(pid);
        res.send({ status: 'success', payload:cartDelete })

    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
});

router.put('/:cid', async (req, res) =>{
    const { cid } = req.params
    const newProducts = req.body
    try {
        const updatedCart = await cartService.updateProducts(cid, newProducts)
        res.send({
            status: 'success',
            payload: updatedCart
        })
        
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.put('/:cid/product/:pid', async(req,res)=>{
    const {cid, pid} = req.params
    const amount = req.body.quantity
    try {
        if(!amount){
            throw new Error('an amount of product must be provided')
        }
        const updateProduct = await cartService.addProductToCart(cid, pid, amount)
        res.send({
            status: 'success',
            payload: updateProduct
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.delete('/:cid', async(req,res)=>{
    try {
        const { cid }= req.params
        const result = await cartService.deleteAllProducts(cid)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

module.exports = router;