const logger = require("../../utils/logger");
const { errorResponse } = require("../../utils/response");
const registerSchema = require("../../utils/validations/registerValidation")

const registerMiddleware = async (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: true });

    if (error) {
        logger.warn("authMiddle/authValidation: Error validate!", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 400, error.message);
    };

    next();
};


module.exports = registerMiddleware;