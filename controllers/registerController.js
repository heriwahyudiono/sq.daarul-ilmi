const userModel = require("../models/userModel.js");

module.exports = {
  register: function (req, res) {
    const nama_lengkap = req.body.nama_lengkap;
    const jenis_kelamin = req.body.jenis_kelamin; 
    const tanggal_lahir = req.body.tanggal_lahir;
    const email = req.body.email;
    const nomor_telepon = req.body.nomor_telepon;
    const password = req.body.password;
    const konfirmasi_password = req.body.konfirmasi_password;
    if (password !== konfirmasi_password) {
      res.status(400).send({ message: "Konfirmasi password tidak sesuai" });
    } else {
      userModel.registerUser(
        { nama_lengkap, jenis_kelamin, tanggal_lahir, email, nomor_telepon, password }, 
        function (err, result) {
          if (err) {
            console.log(err);
            res.status(500).send({ message: "Gagal mendaftar" });
          } else {
            res.status(200).redirect("/post");
          }
        }
      );
    }
  },
};
