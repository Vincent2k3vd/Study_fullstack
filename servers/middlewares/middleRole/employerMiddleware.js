const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const logger = require('../../utils/logger');


const roloMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        logger.error("roloMiddle/roloMiddleware: Missing token", { ip: req.ip });
        return errorResponse(res, 401, "Không tìm thấy token!");
    };
    try {
        const decode = jwt.decode(token, process.env.JWT_ACCESS_TOKEN);
        req.user = decode;
        if (req.user.role != "employer") {
            logger.warn("Access denied", { ip: req.ip });
        };

        next();
    } catch (error) {
        logger.error("roloMiddle/roloMiddleware: Invalid or expired token", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 401, "Token không hợp lệ hoặc đã hết hạn!")
    }
}