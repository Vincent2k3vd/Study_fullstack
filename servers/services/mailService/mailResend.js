const { transporter } = require("../../utils/sendMail");
const logger = require('../../utils/logger');


const mailResend = async ({ to, token }) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify?token=${token}`;

    const mailOptions = {
        form: '"My App" <no-reply@myapp.com>',
        to,
        html: `
      <h3>Xin chào!</h3>
      <p>Nhấn vào liên kết bên dưới để xác thực tài khoản của bạn:</p>
      <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
      <p>Liên kết này sẽ hết hạn sau 10 phút.</p>
    `,
    }

    await transporter.sendMail(mailOptions);
    logger.info("sendMail/resendMail: successfully!", { to: to });
};

module.exports = { mailResend };