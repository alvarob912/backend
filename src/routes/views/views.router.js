const { Router } = require("express")
const ProductManager = require("../../daos/fileManager/manager")
const uploader = require("../../utils")
const ProductManagerMongo = require('../../daos/mongoManager/manager')
const CartManagerMongo = require('../../daos/mongoManager/manager')
const { sessionMiddleware } = require('../../middlewares/session.middleware')
const { authMiddleware } = require('../../middlewares/auth.middleware')


const messageModel = require('../../daos/models/message.models')
const productModel = require('../../daos/models/products.models')


const router = Router();

const productManager = new ProductManager('./src/data/products.json')
const productMongoService = new ProductManagerMongo()
const cartMongoService = new CartManagerMongo()

router.get('/', sessionMiddleware, (req, res)=>{
    res.redirect('/login')
})

router.get('/register', sessionMiddleware, (req, res)=>{
    res.render('register', {
        title: 'Sing Up!'
    })
})

router.get('/login', sessionMiddleware, (req, res)=>{
    res.render('login', {
        title: 'Login'
    })
})

router.get('/products', authMiddleware , async (req, res) => {
    try {
        const user = req.session.user
        const products = await productMongoService.getProducts(req.query)
        res.render('index', {
            title: "E-commerce",
            products: products.docs,
            user : user
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})

router.get('/cart/:cid', async (req, res) => {
    const cartId = req.params.cid 
    try {
        const cart = await cartMongoService.getCartById(cartId)
        res.render('cart', {
            title: "Cart",
            products: cart.products,
            cartId: cart._id
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        })
    }
})



// router.get('/', async (req, res)=>{
//     const products = await productManager.getProducts()
//     const limit = req.query.limit
//     if(!limit){
//         return res.render('home',{
//             products: products,
//             title: 'Products'
//         })
//     }
//     const limitedProducts = products.slice(0,limit)
//     res.render('home',{
//         products: limitedProducts,
//         title: 'Products'
//     })
// })

router.get('/realtimeproducts', async (req, res)=>{
    const products = await productManager.getProducts()
    const limit = req.query.limit
    if(!limit){
        return res.render('realTimeProducts',{
            products: products,
            title: 'Real Time Products'
        })
    }
    const limitedProducts = products.slice(0,limit)
    res.render('realTimeProducts',{
        products: limitedProducts,
        title: 'Real Time Products'
    })
})

router.post('/realtimeproducts', uploader.array('files'), async (req, res)=>{
    const newProduct = req.body
    const socket = req.app.get('socket')
    if(!newProduct){
        return res.status(400).send({
            error: 'missing product'
        })
    }
    if(req.files){
        const paths = req.files.map(file => {
            return {path: file.path,
            originalName: file.originalname    
            }
        })
        newProduct.thumbnails = paths
    }
    socket.emit('newProduct', newProduct)
    res.send({
        status: 'success'
    })
})


// router.get('/', async (req, res) => {
//     const products = await productModel.find().lean()
//     res.render('index', {
//         title: "E-commerce",
//         products
//     })
// })

router.get('/chat', async (req,res)=>{
    const messages = await messageModel.find().lean()
    res.render('chat', {
        title: "Super Chat!",
        messages})
})




module.exports = router




