const { errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        logger.warn("adminMiddleware: Missing user info", { ip: req.ip });
        return errorResponse(res, 401, "Chưa xác thực người dùng!");
    }

    if (req.user.role !== "admin") {
        logger.warn("adminMiddleware: Access denied", {
            ip: req.ip,
            userId: req.user.id,
            role: req.user.role,
        });
        return errorResponse(res, 403, "Bạn không có quyền truy cập!");
    }

    next();
};

module.exports = adminMiddleware;
