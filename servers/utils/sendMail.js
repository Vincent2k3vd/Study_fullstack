const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "1382aaada869c8",
        pass: "aa1ec0f956fbf3",
    },
});

module.exports = transporter;
