const { Router } = require("express");
const productMongoManager = require("../../models/daos/mongoManager/manager")

const productService = new productMongoManager();

const router = Router();

router.get("/", async(req,res)=>{
    try {
        const products = await productService.getProducts(req.query)
        return res.send({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: null,
            nexLink: null})
    } catch (error) {
        res.stauts(400).json({
            message:error,
            status:"ERORR"
        })
    }
})

router.post("/", async (req, res) => {
    const product = req.body;
    if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.code ||
        !product.status ||
        !product.stock ||
        !product.category ||
        !product.thumbnails
    ) {
        res.status(400).send("todos los campos deben ser obligatorios");
    } else {
        res.json({
        status: "success",
        data: await productService.addProduct(product),
        });
    }
});

router.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const fieldsToUpdate = req.body;
    try {
    const data = await productService.updateProduct(pid, fieldsToUpdate)
    res.status(200).json({
        prod:data,
        status:"EXITOSO"
    })}
    catch(error){
        res.status(400).json({
            message:error.message,
            status:"ERROR"
        })
        }
    
});

router.delete("/:pid", async (req, res) => {
    const {pid} = req.params
    try {
        const response = await productService.deleteById(pid);
        res.status(200).json({
            message:response,
            status:"EXITOSO"
        })
    } catch (error) {
        res.status(400).json({
            message:error.message,
            status:"ERROR"
        })
    }
});

router.delete("/",async(req,res)=>{
    try {
        const response = await productService.deleteAll();
        res.status(200).json({
            message:response,
            status:"EXITOSO"
        })
    } catch (error) {
        res.status(400).json({
            message:error.message,
            status:"ERROR"
        })
    }
});

module.exports = router;