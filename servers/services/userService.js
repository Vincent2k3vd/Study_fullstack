const { Op } = require('sequelize');
const { Users } = require('../models');

const createUser = async ({ avatar, username, email, hashPassword, isVerified = false }) => {
    return await Users.create({ avatar, username, email, password: hashPassword, isVerified });
};

const getUserByEmail = async (email) => {
    return await Users.findOne({ where: { email } });
};

const getUserById = async (userId) => {

    return await Users.findByPk(userId, { attributes: { exclude: ['password'] } });
};

const getProfile = async (userId) => {
    return await Users.findByPk(userId, { attributes: { exclude: ['password'] } });
};

const getAllUser = async (queryOptions) => {

    return await Users.findAndCountAll(queryOptions);
};

const updateUser = async (user, { username, email, phone, dob }) => {
    return await user.update({ username, email, phone, dob });
};

const updateRole = async (user, role) => {
    return await user.update({ role });
};

const deleteUser = async (user) => {
    return await Users.destroy({
        where: {
            id: user.id,
        },
    });
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getProfile,
    getAllUser,
    updateRole,
    updateUser,
    deleteUser
};
