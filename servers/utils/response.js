const errorResponse = (res, status, message = "") => {
    return res.status(status).json({
        success: false,
        message: message
    })
};

const successResponse = (res, status, data = [], meta = {}) => {
    return res.status(status).json({
        success: true,
        data: data,
        meta: meta
    })
};

module.exports = {
    errorResponse,
    successResponse
}