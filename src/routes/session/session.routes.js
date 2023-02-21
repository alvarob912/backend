const { Router } = require('express')
const userModel = require('../../daos/models/user.model')
const { roleMiddleware } = require('../../middlewares/role.middleware')
const passport = require('passport')
const { logoutController }= require("../../controllers/sessions.controllers")

const router = Router();

//Sessions routes
router.post(
    '/register', 
    passport.authenticate('register', { failureRedirect: '/failRegister' }), 
    (req,res) => {
    try {
        const sessionUser = {
            name: req.user.name,
            lastname: req.user.lastname,
            age: req.user.age,
            email: req.user.email,
        };
        req.session.user = sessionUser;
        res.json({ status: 'success', payload: sessionUser});
        res.render('profile')
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status:'error',
            error: error
        })
    }
})

router.post('/register',
    passport.authenticate('register', {failureRedirect: '/api/session/failRegister'}), 
    (req, res)=>res.redirect('/login')
)

router.get('/failRegister', (req,res)=>{
    res.send({error: 'Failed Register'})
})

router.post(
    '/login', 
    passport.authenticate('login', { failureRedirect: '/api/session/failLogin'}),roleMiddleware,
    (req, res) => {
        try{
        if (!req.user) {
            return res.status(400).json({ status: 'error', error: 'Wrtong user or password'});
    }
    const sessionUser = {
        name: req.user.name,
        lastname: req.user.lastname,
        age: req.user.age,
        email: req.user.email,
        githubLogin: req.user.githubLogin,
        role: 'user'
    };
    req.session.user = sessionUser;
    res.json({ status: 'success', payload: sessionUser})
    res.render('profile')
    } catch (error) {
        res.status(500).send({
            status: 'error',
            error: error
        })   
    }}
);

router.get('/failLogin', (req,res)=>{
    res.send({error: 'Failed Login'})
})

//github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/api/session/failLogin'}),
    async (req, res) => {
    const sessionUser = {
        name: req.user.name,
        lastname: req.user.lastname,
        age: req.user.age,
        email: req.user.email,
        githubLogin: req.user.githubLogin,
        role: 'user'
    };
    req.session.user = sessionUser;
    res.redirect('/profile');
    }
);


//logout
router.get('/logout', logoutController);

module.exports = router;