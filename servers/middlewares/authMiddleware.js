const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        logger.error("tokenMiddleware: Missing token", { ip: req.ip });
        return errorResponse(res, 401, "Không tìm thấy token!");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decoded.payload;
        next();
    } catch (error) {
        logger.error("authMiddleware: Invalid or expired token", {
            ip: req.ip,
            error: error.message,
        });
        return errorResponse(res, 401, "Token không hợp lệ hoặc đã hết hạn!");
    }
};

module.exports = authMiddleware;
