const userModel = require("../models/userModel.js");

const loginController = {
  login: function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    userModel.login(email, function (err, user) {
      if (user) {
        const bcrypt = require('bcryptjs');
        const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
        if (isValidPassword) {
          req.session.user = user;

          const currentDate = new Date();
          userModel.updateUserStatus(user.id, currentDate, true, function (err) {
            if (err) {
              console.log("Error updating user status:", err);
            } else {
              res.redirect("/home");
            }
          });
        } else {
          res.render("login", { errorMessage: "Password yang Anda masukkan salah" });
        }
      } else {
        res.render("login", { errorMessage: "Email tidak terdaftar" });
      }
    });
  },
};

module.exports = loginController;
