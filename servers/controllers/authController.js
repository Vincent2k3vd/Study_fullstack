const { Users } = require('../models');
const { createUser } = require('../services/userService');
const { errorResponse, successResponse } = require('../utils/response');
const { hashPass, comparePass, accessTokenJWT, refreshTokenJWT } = require('../utils/hashing/hashingPassword');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await Users.findOne({ where: { email } });

        if (user) {
            return errorResponse(res, 403, "Email already exists!");
        };

        const hashPassword = await hashPass(password);

        await createUser(username, email, hashPassword);

        return successResponse(res, 201);

    } catch (error) {
        console.log(error);
        errorResponse(res, 500, "Server error! Please try again later.")
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return errorResponse(res, 404, "Email or password not exactly!");
        }

        if (await comparePass(user.password, password)) {
            return errorResponse(res, 403, "Email or password not exactly!")
        }

        const accessToken = await accessTokenJWT({ id: user.id, role: user.role });

        return successResponse(res, 200, {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });

    } catch (error) {
        console.log(error);
        errorResponse(res, 500, "Server error! Please try again later.");
    }

}

module.exports = {
    register,
    login
}