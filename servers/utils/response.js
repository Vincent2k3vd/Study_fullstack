const errorResponse = (res, status, message = "") => {
    return res.status(status).json({
        success: false,
        message: message
    })
};

const successResponse = (res, status, message, data = [], meta = {}) => {
    return res.status(status).json({
        success: true,
        message: message,
        data: data,
        meta: meta
    })
};

module.exports = {
    errorResponse,
    successResponse
}