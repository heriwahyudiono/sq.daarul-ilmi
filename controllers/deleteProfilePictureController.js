const userModel = require("../models/userModel.js");

const deleteProfilePictureController = {
  deleteProfilePicture: function (req, res) {
    if (req.session.user) {
      const userId = req.session.user.id;

      userModel.deleteProfilePicture(userId, function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          req.session.user.profile_picture = null; 
          req.session.message = "Foto profil berhasil dihapus";
          res.redirect("/user?id=" + userId);
        }
      });
    } else {
      res.redirect("/login");
    }
  },
};

module.exports = deleteProfilePictureController;
