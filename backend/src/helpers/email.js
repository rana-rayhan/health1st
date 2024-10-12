const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
// const logger = require("../controllers/loggerController");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const activeEmailWithNodeMailer = async (emailData) => {
  try {
    // send mail with defined transport object
    const mailOptions = {
      from: smtpUsername, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      text: "Your email will be secure", // plain text body
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("info", "Message sent: %s", info.response);
  } catch (error) {
    console.log("error", "Error occured while sending email", error);
    throw error;
  }
};

module.exports = {
  activeEmailWithNodeMailer,
};
