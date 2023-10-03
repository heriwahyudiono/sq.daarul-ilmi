const userModel = require("../models/userModel.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const registerController = {
  register: function (req, res) {
    const name = req.body.name;
    const gender = req.body.gender;
    const date_of_birth = req.body.date_of_birth;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    if (password !== confirm_password) {
      res.render("register", { errorMessage: "Konfirmasi password tidak sesuai" });
    } else {
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1);

      const verificationToken = crypto.randomBytes(20).toString("hex");

      userModel.register(
        {
          name,
          gender,
          date_of_birth,
          email,
          phone_number,
          password,
          verification_token: verificationToken,
          token_expiration: tokenExpiration,
          create_at: new Date(),
        },
        function (err, result) {
          if (err) {
            console.log(err);
            res.status(500).send({ message: "Gagal mendaftar" });
          } else {
            sendVerificationEmail(email, verificationToken, function (error, info) {
              if (error) {
                console.log(error);
                res.status(500).send({ message: "Gagal mengirim email verifikasi" });
              } else {
                console.log("Email sent: " + info.response);
                if (result && result.verification_token !== null) {
                  res.render("verify-account", { email: email });
                }                
              }
            });
          }
        }
      );
    }
  },
};

function sendVerificationEmail(email, verificationToken, callback) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "heriwhydiono@gmail.com",
      pass: "twyvhevrdpvjdtnp",
    },
  });

  const mailOptions = {
    from: "heriwhydiono@gmail.com",
    to: email,
    subject: "Account Verification",
    html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
          }
          p {
            color: #666666;
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Account Verification</h1>
          <p>Hello there,</p>
          <p>Please click the button below to verify your account:</p>
          <a class="button" href="https://www.daarul-ilmi.com/verify-account?token=${verificationToken}">Verify Account</a>
          <p>If you did not request this verification, you can safely ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, info);
    }
  });
}

module.exports = registerController;
