const userModel = require("../models/userModel.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const forgotPasswordController = {
  // Fungsi untuk menampilkan halaman lupa password
  getForgotPassword: function (req, res) {
    res.render("forgot-password", { errorMessage: null, successMessage: null });
  },

  // Fungsi untuk mengirim email reset password
  postForgotPassword: function (req, res) {
    const email = req.body.email;
    userModel.getUserByEmail(email, function (err, user) {
      if (err) {
        console.log(err);
        res.render("forgot-password", { errorMessage: "Error sending reset email", successMessage: null });
      } else if (!user) {
        res.render("forgot-password", { errorMessage: "Email not registered", successMessage: null });
      } else {
        const resetToken = crypto.randomBytes(20).toString("hex");
        userModel.setToken(user.id, resetToken, function (err) {
          if (err) {
            console.log(err);
            res.render("forgot-password", { errorMessage: "Error sending reset email", successMessage: null });
          } else {
            sendResetEmail(email, resetToken, function (error, info) {
              if (error) {
                console.log(error);
                res.render("forgot-password", { errorMessage: "Error sending reset email", successMessage: null });
              } else {
                console.log("Email sent: " + info.response);
                res.render("forgot-password", { successMessage: "Reset email sent successfully", errorMessage: null });
              }
            });
          }
        });
      }
    });
  },
};

function sendResetEmail(email, resetToken, callback) {
  // Konfigurasi transporter Nodemailer (sesuaikan dengan email Anda)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "heriwhydiono@gmail.com", // Ganti dengan email Anda
      pass: "twyvhevrdpvjdtnp", // Ganti dengan password email Anda
    },
  });

  const mailOptions = {
    from: "heriwhydiono@gmail.com", // Ganti dengan email Anda
    to: email,
    subject: "Reset Password",
    html: `
      <html>
      <head>
        <style>
          /* Ganti dengan stylesheet Anda */
          .container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Password</h1>
          <p>Hello there,</p>
          <p>Please click the button below to reset your password:</p>
          <a class="button" href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a>
          <p>If you did not request this password reset, you can safely ignore this email.</p>
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

module.exports = forgotPasswordController;
