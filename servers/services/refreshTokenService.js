const { RefreshTokens } = require('../models');


const createRefershToken = async (refreshToken, agent, ip, userId) => {
    return await RefreshTokens.create({
        token: refreshToken,
        userAgent: agent,
        ipAddress: ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: userId
    });
};

module.exports = createRefershToken;