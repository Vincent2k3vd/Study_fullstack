const { Users } = require('../models');

const createUser = async (username, email, hashPassword) => {
    const user = await Users.create({
        username: username,
        email: email,
        password: hashPassword
    });

    return user;
}

module.exports = {
    createUser
};