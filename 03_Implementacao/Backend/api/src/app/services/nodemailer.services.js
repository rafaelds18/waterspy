const nodemailerConfig = require("../config/nodemailer.config.js");

exports.sendEmail = function (to, subject, text, html) {
  let transporter = nodemailerConfig.transporter;
  var mailOptions = {
    from: nodemailerConfig.user,
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
  
