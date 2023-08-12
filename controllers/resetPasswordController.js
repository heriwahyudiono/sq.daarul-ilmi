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
        errorMessage: "Passwords do not match",
        successMessage: null,
      });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    userModel.updatePasswordByToken(token, hashedPassword, function (err, success) {
      if (err) {
        console.error("Error updating password:", err);
        return res.render("reset-password", {
          token,
          errorMessage: "An error occurred while resetting password",
          successMessage: null,
        });
      }

      if (!success) {
        return res.render("reset-password", {
          token,
          errorMessage: "Token is invalid or has expired",
          successMessage: null,
        });
      }

      return res.render("reset-password", {
        token,
        errorMessage: null,
        successMessage: "Password reset successfully",
      });
    });
  },
};

module.exports = resetPasswordController;
