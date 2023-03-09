const { Router } = require("express")
const ProductManager = require("../../models/daos/fileManager/manager")
const ProductManagerMongo = require('../../models/daos/mongoManager/manager')
const CartManagerMongo = require('../../models/daos/mongoManager/manager')
const { sessionMiddleware } = require('../../middlewares/session.middleware')
const { authMiddleware } = require('../../middlewares/auth.middleware')
const passportCall = require('../../middlewares/passport.middleware')


const messageModel = require('../../models/schemas/message.models')
const productModel = require('../../models/schemas/products.models')


const router = Router();

// const productManager = new ProductManager('./src/data/products.json')
const productMongoService = new ProductManagerMongo()
const cartMongoService = new CartManagerMongo()

router.get('/', sessionMiddleware, (req, res)=>{
    res.render('login')
})

router.get('/register', sessionMiddleware, (req, res)=>{
    res.render('register')
})

router.get('/profile', authMiddleware, async (req, res) => {
    const user = await req.session.user;
    res.render('profile', { user });
});
router.get('/login', sessionMiddleware, (req, res)=>{
    res.render('login')})

    router.get('/products',
    authMiddleware,
    passportCall('jwt'),
    async (req, res) => {
        const user = req.user
        try {
            const products = await productMongoService.getProducts(req.query)
            res.render('index', {
                title: "E-commerce",
                products: products.docs,
                user: user
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: error.message
            })
        }
    }
)

router.get('/cart/:cid', 
    authMiddleware,
    passportCall('jwt'),
    async (req, res) => {
        const cartId = req.params.cid 
        const user = req.user
        try {
            const cart = await cartMongoService.getCartById(cartId);
            res.render('cart', {
                title: "Cart",
                user,
                cart
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                error: error.message
            })
        }
    }
)

router.get('/chat', 
    authMiddleware,
    passportCall('jwt'),
    async (req,res)=>{
    const messages = await messageModel.find().lean()
    res.render('chat', {
        title: "Super Chat!",
        messages})
})

module.exports = router




