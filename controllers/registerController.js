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
      res.status(400).send({ message: "Konfirmasi password tidak sesuai" });
    } else {
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
                  // Email belum diverifikasi, arahkan ke halaman untuk memberitahu pengguna
                  res.render("verify-your-email");
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
    subject: "Email Verification",
    html: `<p>Please click the following link to verify your email: <a href="http://localhost:3000/verify-email?token=${verificationToken}">Verify Email</a></p>`,
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
