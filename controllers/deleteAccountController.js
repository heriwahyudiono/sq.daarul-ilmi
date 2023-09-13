const userModel = require("../models/userModel.js");
const biodataModel = require("../models/biodataModel.js");
const postModel = require("../models/postModel.js");
const photoModel = require("../models/photoModel.js");
const videoModel = require("../models/videoModel.js");
const deleteProfilePictureController = require("../controllers/deleteProfilePictureController.js");
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
  
          const videosPromise = videoModel.getVideosByPostId(post.id)
            .then(function (videos) {
              const videoPromises = [];
  
              for (const video of videos) {
                videoPromises.push(deleteVideo(video.id)); 
              }
  
              return Promise.all(videoPromises);
            });
  
          postPromises.push(
            Promise.all([photosPromise, videosPromise])
              .then(function () {
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
      // Setelah menghapus semua postingan, Anda bisa menghapus pengguna disini
      userModel.deleteUser(userId, function (err, success) {
        if (err) {
          console.error("Failed to delete user:", err);
          res.status(500).send("Internal Server Error");
        } else {
          if (success) {
            req.session.destroy();
            res.render("account-deleted");
          } else {
            res.status(500).send("Failed to delete user.");
          }
        }
      });
    })
    .catch(function (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });  
  },

  deletePhoto: function (filePath) {
    const absolutePath = path.join(__dirname, "../", filePath);

    return fs.unlink(absolutePath).catch(function (error) {
      console.error("Failed to delete photo:", error);
    });
  },

  deleteVideo: function (filePath) {
    const absolutePath = path.join(__dirname, "../", filePath);

    return fs.unlink(absolutePath).catch(function (error) {
      console.error("Failed to delete video:", error);
    });
  }
};

module.exports = deleteAccountController;
