const { Op } = require('sequelize');
const { Users } = require('../models');

const createUser = async ({ username, email, hashPassword, isVerified = false }) => {
    console.log(username, email, hashPassword, isVerified);
    return await Users.create({ username, email, password: hashPassword, isVerified });
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

const getAllUser = async (search = '', limit = 10, offset = 0) => {
    const whereCondition = search
        ? {
            [Op.or]: [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
            ],
        }
        : {};
    return await Users.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
    });
};

const updateUser = async (user, { username, email, phone, dob }) => {
    return await user.update({ username, email, phone, dob });
};

const updateRole = async (user, role) => {
    return await user.update({ role });
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getProfile,
    getAllUser,
    updateRole,
    updateUser,
};
