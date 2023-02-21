const passport = require("passport");
const userModel = require("../daos/models/user.model");
const { hashPassword, isValidPassword } = require("../utils/utils");
const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github2").Strategy;

//Login Local strategy
const initializePassport = () =>{

passport.use('login', new LocalStrategy(
    {usernameField: 'email'},
    async (username, password, done) =>{
        try {
            const user = await userModel.findOne({email: username});;
            if(!user){
                done(null, false);
            } 
                if(!isValidPassword(user, password)) {
                    done(null, false)
                } else {
                    const sessionUser = {
                        _id: user._id,
                        firstName: user.name,
                        lastname: user.lastname,
                        age: user.age,
                        email: user.email
                    };
                        done(null, sessionUser)}
            } catch (error) {
            done(error);
        }
    }
));

passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email'},
    async (req, username, password, done) => {
        const{ name, lastName, age, email} = req.body;
        try {
            const user = await userModel.findOne({ email: username });
            if(user) {
                done(null,false)
            } else{
                const newUser = {
                    name,
                    lastName,
                    email,
                    age,
                    password: hashPassword(password)
                };
                const userDB = await userModel.create(newUser);
                const sessionUser = {
                    _id: userDB._id,
                    name: userDB.name,
                    lastName: userDB.lastName,
                    age: userDB.age,
                    email: userDB.email
                };
                return done(null, sessionUser);
            }
        } catch (error) {
            done(error)
        }
    }
));

//Github strategy
passport.use(
    new GithubStrategy({
        clientID: 'Iv1.de19a1affae835da',
        clientSecret: '272bfece36b0d426395142054c58a1bcaffee7bf',
        callbackURL: 'http://localhost:8080/api/session/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
        const userData = profile._json;
        const user = await userModel.findOne({ email: userData.email});
        if (!user) {
            const newUser = {
                name: userData.name.split(" ")[0],
                lastname: userData.name.split(" ")[1],
                age: userData.age || null,
                email: userData.email || ' ',
                password: ' ',
                githubLogin: userData.login
            };
        const response = await userModel.create(newUser);
        done(null, response._doc);
        } else {
            done(null, user);
        }
    }
    catch(error) {
        done(error);
    }
    }
));
}
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
});

module.exports = initializePassport;