const userModel = require("../models/userModel.js");

module.exports = {
  register: function (req, res) {
    const nama_lengkap = req.body.nama_lengkap;
    const tanggal_lahir = req.body.tanggal_lahir;
    const jenis_kelamin = req.body.jenis_kelamin;
    const email = req.body.email;
    const password = req.body.password;
    const konfirmasi_password = req.body.konfirmasi_password;
    if (password !== konfirmasi_password) {
      res.status(400).send({ message: "Konfirmasi password tidak sesuai" });
    } else {
      userModel.addUser(
        { nama_lengkap, tanggal_lahir, jenis_kelamin, email, password },
        function (err, result) {
          if (err) {
            console.log(err);
            res.status(500).send({ message: "Pendaftaran gagal" });
          } else {
            res.status(200).redirect("/home");
          }
        }
      );
    }
  },

  login: function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    userModel.checkUser(email, password, function (err, result) {
      if (err) {
        res.status(401).send({ message: "Email atau password salah" });
      } else {
        req.session.user = result[0];
        res.status(200).redirect("/home");
      }
    });
  },
};
