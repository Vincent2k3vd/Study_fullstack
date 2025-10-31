const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT = parseInt(process.env.SALT);

const hashPass = async (password) => {
    return await bcrypt.hash(password, SALT);
};

const comparePass = async (password, hashPass) => {
    return await bcrypt.compare(password, hashPass);
};



const accessTokenJWT = async (payload) => {
    return await jwt.sign({ payload }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.EXPIRESIN_ACCESS_TOKEN });
};

const refreshTokenJWT = async (payload) => {
    return await jwt.sign({ payload }, process.env.JWT_REFRESH_TOKEN, { expiresIn: process.env.EXPIRESIN_REFRESH_TOKEN });
}



module.exports = {
    hashPass,
    comparePass,
    accessTokenJWT,
    refreshTokenJWT

}