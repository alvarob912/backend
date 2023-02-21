const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.resolve(__dirname, './public/img'))
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})

const uploader = multer({storage})

const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (userDB, password) => bcrypt.compareSync(password, userDB.password);

module.exports = {
    hashPassword,
    isValidPassword,
    uploader,
};