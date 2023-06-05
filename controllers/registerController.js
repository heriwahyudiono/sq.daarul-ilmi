const userModel = require("../models/userModel.js");

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
      userModel.registerUser(
        {
          name,
          gender,
          date_of_birth,
          email,
          phone_number,
          password
        },
        function (err, result) {
          if (err) {
            console.log(err);
            res.status(500).send({ message: "Gagal mendaftar" });
          } else {
            res.status(200).redirect("/home");
          }
        }
      );
    }
  },
};

module.exports = registerController;
