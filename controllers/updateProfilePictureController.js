const userModel = require("../models/userModel.js");

const UpdateProfilePictureController = {
  postUpdateProfilePicture: function (req, res) {
    if (req.session.user) {
      const userId = req.session.user.id;
      const profilePicture = req.file.originalname;

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
      res.redirect("/login");
    }
  },
};

module.exports = UpdateProfilePictureController;
