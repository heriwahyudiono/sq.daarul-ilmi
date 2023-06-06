const userModel = require("../models/userModel.js");
const postModel = require("../models/postModel.js");
const photoModel = require("../models/photoModel.js");
const biodataModel = require("../models/biodataModel.js");
const fs = require("fs");
const path = require("path");

const deleteAccountController = {
  deleteAccount: function (req, res) {
    const userId = req.session.user.id;

    // Hapus postingan
    postModel
      .getAllPosts()
      .then(async (posts) => {
        for (const post of posts) {
          if (post.user_id === userId) {
            // Hapus foto yang terkait dengan postingan
            const photos = await photoModel.getPhotosByPostId(post.id);
            for (const photo of photos) {
              deletePhoto(photo.file_path); // Hapus file foto dari sistem
            }

            // Hapus postingan
            await postModel.deletePost(post.id);
          }
        }

        // Hapus foto profil
        if (req.session.user.profile_picture) {
          deletePhoto(req.session.user.profile_picture); // Hapus file foto dari sistem
        }

        // Hapus biodata
        biodataModel.deleteBiodataByUserId(userId);

        // Hapus akun pengguna
        userModel
          .deleteUser(userId)
          .then(() => {
            req.session.destroy();
            res.redirect("/login");
          })
          .catch((error) => {
            console.error("Failed to delete user:", error);
            res.status(500).send("Internal Server Error");
          });
      })
      .catch((error) => {
        console.error("Failed to get posts:", error);
        res.status(500).send("Internal Server Error");
      });
  },
};

function deletePhoto(filePath) {
  const absolutePath = path.join(__dirname, "../", filePath);
  fs.unlink(absolutePath, (error) => {
    if (error) {
      console.error("Failed to delete photo:", error);
    }
  });
}

module.exports = deleteAccountController;
