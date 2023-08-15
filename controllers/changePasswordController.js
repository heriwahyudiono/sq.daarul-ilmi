const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");

const changePasswordController = {
  getChangePassword: function (req, res) {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    res.render("change-password", { message: req.session.message });
  },

  postChangePassword: function (req, res) {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword !== confirmPassword) {
      req.session.message = "Password baru dan konfirmasi password baru tidak cocok";
      return res.redirect("/change-password");
    }

    userModel.changePassword(userId, currentPassword, newPassword, function (err, success) {
      if (err) {
        console.error(err);
        return res.redirect("/change-password");
      }

      if (!success) {
        req.session.message = "Password lama yang Anda masukkan salah";
        return res.redirect("/change-password");
      }

      req.session.message = "Password berhasil diubah";
      return res.redirect("/change-password");
    });
  }
};

module.exports = changePasswordController;
