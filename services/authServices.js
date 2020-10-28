const passwordGenerator = require("generate-password");
const nodemailer = require("nodemailer");
const config = require("../config/config.js");

exports.passwordGenerator = () => {
  return passwordGenerator.generate({
    length: 10,
    numbers: true,
  });
};

exports.sendPasswordRecoveryMail = async (email, password, next) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.GMAIL_USERNAME,
      pass: config.GMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: config.GMAIL_USERNAME,
    to: email,
    subject: "blog.com Password Recovery",
    text: `New Password is "${password}"`,
  };

  await transporter.sendMail(mailOptions).then((info, err) => {
    if (err) {
      next(err);
    }
    console.log(`Message sent: ${info.messageId}`);
  });
};
