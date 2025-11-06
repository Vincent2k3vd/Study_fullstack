const { Users } = require('../models');
const logger = require('../utils/logger');
const { OAuth2Client } = require('google-auth-library');
const mailVerify = require('../services/mailService/mailVerify');
const { mailResend } = require('../services/mailService/mailResend');
const { createUser, getUserByEmail, getUserById } = require('../services/userService');
const { errorResponse, successResponse } = require('../utils/response');
const { hashPass, comparePass, accessTokenJWT, refreshTokenJWT, decodeToken } = require('../utils/hashing/hashingPassword');
const { createRefreshToken, deleteRefershToken, getRefershTokenByuserId } = require('../services/refreshTokenService');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await getUserByEmail(email);

        if (user) {
            logger.warn("Auth/register: Email already exists!", { ip: req.ip, email: email });
            return errorResponse(res, 403, "Email already exists!");
        };

        const hashPassword = await hashPass(password);

        const newUser = await createUser({ avatar: '', username, email, hashPassword, isVerified: false });

        const users = newUser.dataValues;
        const token = await accessTokenJWT({
            userId: users.id,
            email: users.email,
            type: 'email_verification'
        });

        mailVerify({ to: users.email, token });

        logger.info("Server error: Register successfully!", { ip: req.ip, userId: users.id });
        return successResponse(res, 201, "Đăng ký thành công!");

    } catch (error) {
        logger.error("Auth/register: Server error", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Server error! Please try again later.");
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);

        if (!user) {
            logger.warn("Auth/login: Email not exactly!", { ip: req.ip, email: email });
            return errorResponse(res, 401, "Email hoặc mật khẩu không chính xác!");
        };

        const isMatch = await comparePass(password, user.password);
        if (!isMatch) {
            logger.warn("Auth/login: Password not exactly!", { ip: req.ip });
            return errorResponse(res, 401, "Email hoặc mật khẩu không chính xác!");
        };

        if (!user.isVerified) {
            logger.warn("Auth/login: Account not activate!", { ip: req.ip });
            return errorResponse(res, 403, "Tài khoản chưa kích hoạt!");
        };


        const accessToken = await accessTokenJWT({ id: user.id, email: user.email, role: user.role });
        const refreshToken = await refreshTokenJWT({ id: user.id, email: user.email })

        await createRefreshToken(refreshToken, req.headers['user-agent'], req.ip, user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            SameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        logger.info("Auth/login: Login successfully", { userId: user.id, ip: req.ip });
        return successResponse(res, 200, "Đăng nhập thành công!", {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });

    } catch (error) {
        logger.error("Auth/login: Server error!", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Server error! Please try again later.");
    }
};

const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) {
            logger.warn("Auth/googleLogin: Token id undefined!", { ip: req.ip });
            return errorResponse(res, 400, "Google ID token không hợp lệ");
        }

        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
        } catch (err) {
            logger.warn("Auth/googleLogin: Token verification failed!", { ip: req.ip, error: err.message });
            return errorResponse(res, 400, "Google token không hợp lệ");
        }

        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        let user = await getUserByEmail(email);
        if (!user) {
            user = await createUser({ avatar: picture, username: name, email, hashPassword: '', isVerified: true });
        }

        const accessToken = await accessTokenJWT({ id: user.id, email: user.email, role: user.role });
        const refreshToken = await refreshTokenJWT({ id: user.id, email: user.email });

        await createRefreshToken(refreshToken, req.headers['user-agent'], req.ip, user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        logger.info("Auth/googleLogin: Login successfully", { ip: req.ip, userId: user.id });
        return successResponse(res, 200, "Đăng nhập thành công!", {
            user: {
                id: user.id,
                avatar: user.avatar,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });
    } catch (error) {
        logger.error("Auth/googleLogin: Server error!", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Server error! Please try again later.");
    }
};

const verifyAccount = async (req, res) => {
    try {
        const token = req.params.token;

        let decode = await decodeToken(token);
        const users = decode.payload;
        if (users.type !== 'email_verification') {
            logger.warn("Auth/verifyAccount: Type is not correct!", { ip: req.ip, userId: users.userId });
            return errorResponse(res, 403, "Token không hợp lệ hoặc không dành cho xác thực email.");
        };

        const user = await Users.findByPk(users.userId);

        if (!user) {
            logger.warn("Auth/mailVerify: Not found user!", { ip: req.ip, email: user.email });
            return errorResponse(res, 404, "Không tìm thấy người dùng!");
        };

        user.update({
            isVerified: true,
            createAt: Date.now(),
        });

        logger.info("Auth/verifyAccount: Activate successfully!", { ip: req.ip, userId: user.id })
        return successResponse(res, 200, "Kích hoạt tài khoản thành công!")

    } catch (error) {
        logger.error("Auth/googleLogin: Server error!", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Server error! Please try again later.");
    }
}


const logout = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            logger.warn("Auth/logout: User id undefined!");
            errorResponse(res, 400, "Thiếu id người dùng!");
        };

        await deleteRefershToken(userId);
        res.clearCookie('refreshToken');

        logger.info("Auth/logout: Logout successfully!", { ip: req.ip, email: req.user.email });
        return successResponse(res, 200, "Đăng xuất thành công!");
    } catch (error) {
        logger.error("Auth/logout: Server error!", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Server error! Please try again later.");
    }
};

module.exports = {
    register,
    login,
    googleLogin,
    verifyAccount,
    logout
}