const { Router } = require('express')
const userModel = require('../../daos/models/user.model')
const { roleMiddleware } = require('../../middlewares/role.middleware')

const router = Router();

router.get('/', (req, res)=>{
    res.send('Session')
})
router.post('/register', async (req,res) => {
    try {
        const email = req.body.email;
        let user = await userModel.findOne({email})
        if (user){
            return res.send('ERROR : email registrado')
        }
        await userModel.create(req.body)
        res.redirect('/login')
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status:'error',
            error: error
        })
    }
})

router.post('/login', roleMiddleware , async (req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email}).lean()
        if (user.password !== password){
            return res.send('contraseña incorrecta')
        }
        if(!user){
            return res.send('usuario no encontrado')
        }
        const userSession ={
            ...user,
            role: 'user'
        }
        req.session.user = userSession;
        req.session.save(err=>{
            if (err){
                console.log('session error; ', err)
            } else{
                res.redirect('/products')
            }
        })

    } catch (error) {
        res.status(500).send({
            status: 'error',
            error: error
        })
    }
})

router.get('/logout', async (req, res)=>{
    try {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            }
            else {
                res.clearCookie('session')
            }
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            error: error
        })   
    }
})

module.exports = router;