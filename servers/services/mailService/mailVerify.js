const logger = require('../../utils/logger');
const transporter = require("../../utils/sendMail");

const mailVerify = async ({ to, token }) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Hello ✔",
        html: `<b>Hello world?${verifyUrl}</b>`,
    });
    logger.info("SendMail/mailVerify: successfully!", { to: to });
};

module.exports = mailVerify;