const nodemailer = require ("nodemailer");
let account = {
  user: "back2study.gps@gmail.com",
  passwd: "ahsdtuogtgnlmars"
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: account.user, // generated gmail user
      pass: account.passwd, // generated gmail password
    },
});

module.exports = transporter;
  