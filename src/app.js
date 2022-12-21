import express from 'express'
import ProductManager from './product.js'

const app = express();
let productManager = new ProductManager('./src/data/Product.json');

app.use(express.urlencoded({ extenden: true}));

app.get('/products', async (req, res) => {
    let product = await productManager.getProducts();
    let limit = req.query.limit;
    if(!limit) return res.send({product})

    let productLimit = product.filter((product, indice) => indice < limit)

    res.send({productLimit})
})

app.get('/products/:pid', async (req, res) => {
    let pid = req.params.pid;
    let product = await productManager.getProducts();
    let prod = product.find(p => p.id == pid);
    console.log(prod)

    if(!prod) return res.send('No exite ID')

    res.send({prod})
})


app.listen(8080, () => console.log("Servidor funcionando"))