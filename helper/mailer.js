var nodemailer = require("nodemailer");
module.exports.sendMail = (to_email, subject_text, msg_text) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: process.env.EMAIL_TYPE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: to_email,
      subject: subject_text,
      text: msg_text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(false);
        console.log(error);
      } else {
        resolve(true);
      }
    });
  });
};
