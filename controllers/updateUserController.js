const UserModel = require("../models/userModel.js");
const BiodataModel = require("../models/biodataModel.js");

const UpdateUserController = {
  getUpdateUser: function (req, res) {
    if (req.session.user && req.session.user.id) {
      const userId = req.session.user.id;

      BiodataModel.getBiodataByUserId(userId, function (err, biodata) {
        if (err) {
          console.log(err);
          res.redirect("/home");
        } else {
          res.render("edit-profil", { user: req.session.user, biodata: biodata || {}, message: req.session.message });
        }
      });
    } else {
      res.redirect("/login");
    }
  },

  updateUser: function (req, res) {
    if (req.session.user && req.session.user.id) {
      const user = {
        id: req.session.user.id,
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin,
        tanggal_lahir: req.body.tanggal_lahir,
        email: req.body.email,
        nomor_telepon: req.body.nomor_telepon
      };

      UserModel.updateUser(user, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        } else {
          req.session.user = user;
          req.session.message = "Profil berhasil diperbarui";
          const userId = user.id;
          res.redirect(`/user?id=${userId}`);
        }
      });
    } else {
      res.redirect("/login");
    }
  },
};

module.exports = UpdateUserController;
