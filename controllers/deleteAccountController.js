const userModel = require("../models/userModel.js");
const postModel = require("../models/postModel.js");
const photoModel = require("../models/photoModel.js");
const biodataModel = require("../models/biodataModel.js");
const fs = require("fs").promises;
const path = require("path");

const deleteAccountController = {
  deleteAccount: function (req, res) {
    const userId = req.session.user.id;

    postModel.getAllPosts()
      .then(function (posts) {
        const postPromises = [];

        for (const post of posts) {
          if (post.user_id === userId) {
            const photosPromise = photoModel.getPhotosByPostId(post.id)
              .then(function (photos) {
                const photoPromises = [];

                for (const photo of photos) {
                  photoPromises.push(deletePhoto(photo.file_path));
                }

                return Promise.all(photoPromises);
              });

            postPromises.push(
              photosPromise.then(function () {
                return postModel.deletePost(post.id)
                  .catch(function (error) {
                    console.error("Failed to delete post:", error);
                  });
              })
            );
          }
        }

        return Promise.all(postPromises);
      })
      .then(function () {
        if (req.session.user.profile_picture) {
          return deletePhoto(req.session.user.profile_picture);
        }
      })
      .then(function () {
        biodataModel.deleteBiodataByUserId(userId);

        userModel.deleteUser(userId)
          .then(function () {
            req.session.destroy();
            res.redirect("/login");
          })
          .catch(function (error) {
            console.error("Failed to delete user:", error);
            res.status(500).send("Internal Server Error");
          });
      })
      .catch(function (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      });
  },

  deletePhoto: function (filePath) {
    const absolutePath = path.join(__dirname, "../", filePath);

    return fs.unlink(absolutePath)
      .catch(function (error) {
        console.error("Failed to delete photo:", error);
      });
  }
};

module.exports = deleteAccountController;
