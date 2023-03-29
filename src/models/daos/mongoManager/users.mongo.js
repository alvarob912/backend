const UsersModel = require( "../../schemas/user.model")
const { logCyan } = require('../../../utils/console.utils')
const MongoManager = require('../../db/mongo.manager.js')


class UserManagerMongo {

    constructor(){
        MongoManager.connect()
    }

async getAll(filter = {}) {
    const { limit = 20, page = 1 } = filter;
    const users = await UsersModel.paginate({}, { limit, page });
    return users;
}

async getById(id) {
    // const user = await UsersModel.findById(id, { __v: false }).lean();
    const user = await UsersModel.findById(id, { __v: false }).populate('courses').lean();
    return user;
}

async getByEmail(email) {
    const user = await UsersModel.findOne({ email }, { __v: false }).lean();
    return user;
}

async addUser(payload) {
    const newUser = await UsersModel.create(payload);
    logCyan('New user created')
    return newUser;
}

async updateUser(id, payload) {
    const updatedUser = await UsersModel.findByIdAndUpdate(id, payload, { new: true });
    logCyan('User updated')
    return updatedUser;
}

async deleteUser(id) {
    const deletedUser = await UsersModel.findByIdAndDelete(id);
    return deletedUser;
}


}

module.exports = UserManagerMongo