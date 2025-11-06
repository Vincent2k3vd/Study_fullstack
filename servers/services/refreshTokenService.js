const { RefreshTokens } = require('../models');


const createRefreshToken = async (refreshToken, agent, ip, userId) => {
    return await RefreshTokens.create({
        token: refreshToken,
        userAgent: agent,
        ipAddress: ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: userId
    });
};

const getRefershTokenByuserId = async (userId) => {
    return await RefreshTokens.findByPk(userId);
};

const deleteRefershToken = async (userId) => {
    return await RefreshTokens.destroy({
        where: {
            userId: userId,
        },
    });
};

module.exports = {
    createRefreshToken,
    getRefershTokenByuserId,
    deleteRefershToken
};