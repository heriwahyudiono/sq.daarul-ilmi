const UserModel = require("../models/userModel.js");
const BiodataModel = require("../models/biodataModel.js");

const updateUserController = {
  getUpdateUser: function (req, res) {
    if (req.session.user && req.session.user.id) {
      const userId = req.session.user.id;

      BiodataModel.getBiodataByUserId(userId, function (err, biodata) {
        if (err) {
          console.log(err);
          res.redirect("/home");
        } else {
          res.render("edit-profile", { user: req.session.user, biodata: biodata || {}, message: req.session.message });
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
        name: req.body.name,
        gender: req.body.gender,
        date_of_birth: req.body.date_of_birth,
        email: req.body.email,
        phone_number: req.body.phone_number
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

module.exports = updateUserController;
