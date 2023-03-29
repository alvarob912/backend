const HTTP_STATUS = require ("../constants/api.constants.js");
const { SESSION_KEY } = require("../constants/session.constants.js");
const { apiSuccessResponse } = require("../utils/api.utils.js");
const HttpError = require("../utils/error.utils");
const { generateToken } = require("../utils/session.utils.js");
const UserManagerMongo = require ("../models/daos/mongoManager/users.mongo.js")
const usersDao = new UserManagerMongo()
class SessionsController{

    static async login(req, res, next){
        const {email, password} = req.body;
        try {
            const user = await usersDao.getByEmail(email);
            if(!user || user.password !== password)
            {
                throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'Invalid email or password')
            }
            const access_token = generateToken(user);
            res.cookie(SESSION_KEY, access_token, {
            maxAge: 60 * 60 * 24 * 1000,
            httpOnly: true
            });
            const response = apiSuccessResponse("User logged in successfully!");
            return res.json(response);
        } catch (error) {
            next(error)
        }
    }   

    static async register(req,res,next){
        const { firstname, lastname, age, email, password } = req.body;
        try {
            if (!firstname || !lastname || !age || !email || !password) {
            return res.status(400).json({
                error: 'Incomplete Registration'
            });
        }
        const accessToken = generateToken({ firstname, lastname, age, email, role: 'user' });
        res.cookie(SESSION_KEY, accessToken, {
            maxAge: 60 * 60 * 24 * 1000,
            httpOnly: true
        });
        const response = apiSuccessResponse("User registed successfully!");
            return res.json(response);
        } catch (error) {
            next(error)
        }
    }

    static async loginGithub(req, res, next){
        const user = req.user;
        const access_token = generateToken(user);
        res.cookie(SESSION_KEY, access_token, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true
        });
        const response = apiSuccessResponse("User logged in successfully with github!");
        return res.json(response);
        }

    static async logout(req, res, next){
        try {
            res.clearCookie(SESSION_KEY);
            res.redirect('/');
        } catch (error) {
            next(error) 
        }
    }

    static async currentSession(req, res, next){
        const response = apiSuccessResponse(req.user);
        return res.json(response);
    }
}

module.exports = SessionsController