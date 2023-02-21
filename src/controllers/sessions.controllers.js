const { userModel} = require ("../daos/models/user.model")
const { hashPassword, isValidPassword} = require("../utils/utils")

const loginController = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ status: 'error', error: 'Missing Fields'})
        }
        const user = await userModel.findOne({email});
        if (!user){
            return res.status(400).json({ status: 'error', error: 'Wrong user or password'})
        }
        if(!isValidPassword(user,password)){
            return res.status(400).json({ status: 'error', error: 'Wrong user or password'})
        }
        const sessionUser = {
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            age: user.age,
            email: user.email
        };
        req.session.user = sessionUser;
        req.session.save(err => {
            if (err) console.log('session error => ', err);
            else res.status(200).json({ status: 'success', payload: sessionUser});
        });
    } catch (error) {
        console.log(error);
    }
}

const registerController = async (req,res,next) => {
    try {
        const { name, lastname, age, email, password} = req.body;
    if (!name || !lastname || !age || !email || !password) {
        return res.status(400).json({ status: 'error', error: 'Missing Fields'})
    }
    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json({ status: 'error', error: 'User already exists'});
    }
    const newUser = {
        ...req.body,
        password: hashPassword(password)
    };
    const response = await userModel.create(newUser);
    const sessionUser = {
        _id: response._id,
        name: response.name,
        lastname: response.lastname,
        age: response.age,
        email: response.email
    };
    req.session.user = sessionUser;
    req.session.save(err => {
        if (err) console.log('session error => ', err);
        else {
            res.status(201).json({ status: 'success', payload: sessionUser});
    };
    });
    } catch (error) {
        console.log(error)
    }
}

const logoutController = (req, res, next) => {
    req.session.destroy(err => {
    if (err) {
        console.log(err);
    }
    else {
        res.clearCookie('sessions');
        res.redirect('/');
    }
    })
};

    module.exports = {
    loginController,
    registerController,
    logoutController,
}