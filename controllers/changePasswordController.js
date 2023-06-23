const userModel = require("../models/userModel.js");
const bcrypt = require("bcryptjs");

module.exports = {
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
      req.session.message = "New password and confirm password do not match";
      return res.redirect("/change-password");
    }

    userModel.changePassword(userId, currentPassword, newPassword, function (err, success) {
      if (err) {
        console.log(err);
        req.session.message = "An error occurred while changing the password";
        return res.redirect("/change-password");
      }

      if (!success) {
        req.session.message = "Current password is incorrect";
        return res.redirect("/change-password");
      }

      req.session.message = "Password changed successfully";
      return res.redirect("/dashboard");
    });
  }
};
