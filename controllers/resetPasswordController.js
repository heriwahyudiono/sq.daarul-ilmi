const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");

const resetPasswordController = {
  getResetPassword: function (req, res) {
    const token = req.query.token;
    res.render("reset-password", { token, successMessage: null, errorMessage: null });
  },

  postResetPassword: function (req, res) {
    const token = req.body.token;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword !== confirmPassword) {
      return res.render("reset-password", {
        token,
        errorMessage: "Password baru dan konfirmasi password tidak sesuai",
        successMessage: null,
      });
    }

    userModel.updatePasswordByToken(token, newPassword, function (err, success) {
      if (err) {
        console.error("Terjadi kesalahan saat memperbarui password:", err);
        return res.render("reset-password", {
          token,
          errorMessage: "Terjadi kesalahan saat mereset password",
          successMessage: null,
        });
      }

      if (!success) {
        return res.render("reset-password", {
          token,
          errorMessage: "Token tidak valid atau sudah kadaluarsa",
          successMessage: null,
        });
      }

      return res.render("login", {
        token,
        errorMessage: null,
        successMessage: "Password Anda telah berhasil di reset, silakan login kembali",
      });
    });
  },
};

module.exports = resetPasswordController;
