const userModel = require("../models/userModel.js");

module.exports = {
  login: function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    userModel.loginUser(email, function (err, user) {
      if (user) {
        const bcrypt = require('bcryptjs');
        const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
        if (isValidPassword) {
          req.session.user = user;
          res.redirect("/post");
        } else {
          res.send("Password yang Anda masukkan salah");
        }
      } else {
        res.send("Email tidak terdaftar");
      }
    });
  },
};
