const userModel = require("../models/userModel.js");

module.exports = {
  login: function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    userModel.checkUser(email, password, function (err, result) {
      if (err) {
        if (err === "   Email Not Found") {
          res.status(404).send({ message: "Email tidak ditemukan" });
        } else if (err === "Wrong Password") {
          res.status(401).send({ message: "Password salah" });
        } else {
          res.status(500).send({ message: "Error checking user" });
        }
      } else {
        req.session.user = result[0];
        res.status(200).redirect("/home");
      }
    });
  },
};
