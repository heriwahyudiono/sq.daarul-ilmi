const userModel = require("../models/userModel.js");
const path = require("path");

const updateProfilePictureController = {
  updateProfilePicture: function (req, res) {
    if (req.session.user) {
      if (req.file) {
        const userId = req.session.user.id;
        const profilePicture = req.file.filename; 

        const user = {
          id: userId,
          profile_picture: profilePicture,
        };

        userModel.updateProfilePicture(user, function (err, result) {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
          } else {
            req.session.user.profile_picture = profilePicture;
            req.session.message = "Foto profil berhasil diperbarui";
            res.redirect(`/user?id=${userId}`);
          }
        });
      } else {
        req.session.message = "Error: Terjadi kesalahan saat memperbarui foto profil";
        res.redirect("/user");
      }
    } else {
      res.redirect("/login");
    }
  },
};

module.exports = updateProfilePictureController;
