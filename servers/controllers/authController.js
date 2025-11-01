const { Users } = require('../models');
const logger = require('../utils/logger');
const { createUser } = require('../services/userService');
const { errorResponse, successResponse } = require('../utils/response');
const { hashPass, comparePass, accessTokenJWT, refreshTokenJWT } = require('../utils/hashing/hashingPassword');
const createRefershToken = require('../services/refreshTokenService');


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await Users.findOne({ where: { email } });

        if (user) {
            logger.warn("Email already exists!", { ip: req.ip });
            return errorResponse(res, 403, "Email already exists!");
        };

        const hashPassword = await hashPass(password);

        const users = await createUser(username, email, hashPassword);

        logger.info("Register successfully", { userId: users.id, ip: req.ip });
        return successResponse(res, 201);

    } catch (error) {
        logger.error("Auth/register error:", { error: error.message, stack: error.stack, ip: req.ip });
        return errorResponse(res, 500, "Server error! Please try again later.")
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            logger.warn("Email not exactly!", { ip: req.ip });
            return errorResponse(res, 404, "Email or password not exactly!");
        }

        if (await comparePass(user.password, password)) {
            logger.warn("Password not exactly!", { ip: req.ip });
            return errorResponse(res, 403, "Email or password not exactly!")
        }

        const accessToken = await accessTokenJWT({ id: user.id, email: user.email, role: user.role });
        const refreshToken = await refreshTokenJWT({ id: user.id, email: user.email })

        await createRefershToken(refreshToken, req.headers['user-agent'], req.ip, user.id);

        logger.info("Login successfully", { userId: user.id, ip: req.ip });
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
        logger.error("Auth/login error :", { error: error.message, stack: error.stack, ip: req.ip })
        return errorResponse(res, 500, "Server error! Please try again later.");
    }

}

module.exports = {
    register,
    login
}