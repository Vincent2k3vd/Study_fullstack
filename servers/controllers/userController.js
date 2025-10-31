const { where } = require('sequelize');
const { Users } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');


const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findByPk(id);

        return successResponse(res, 200, user);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Server error! Please try again later.");
    }
};

const getAllUser = async (req, res) => {
    try {
        const { count, rows } = await Users.findAndCountAll({
            where: { isverify: 0 },
        });

        successResponse(res, 200, rows, { CountAll: count, CountUser: count });
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getProfile,
    getAllUser
}