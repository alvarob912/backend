const { Router } = require("express");
// const productRoutes = require("./product/product.routes");
const productRoutes = require("./product/product.mongo.routes")
// const cartRoutes = require("./cart/cart.routes");
const cartRoutes = require("./cart/cart.mongo.routes");
const chatRoutes = require("./message/message.mongo.routes")
const sessionRoutes = require("./session/session.routes")

const router = Router();

router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/chat", chatRoutes);
router.use("/session", sessionRoutes);


module.exports = router;
