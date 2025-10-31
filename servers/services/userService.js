const { Users } = require('../models');

const createUser = async (username, email, hashPassword) => {
    try {
        await Users.create({
            username: username,
            email: email,
            password: hashPassword
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createUser
};