const postModel = require('../models/postModel');
const photoModel = require('../models/photoModel');
const videoModel = require('../models/videoModel');
const userModel = require('../models/userModel');

const postController = {
  createPost: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/login");
      }

      const { caption } = req.body;

      const files = req.files;

      if (!files || Object.keys(files).length === 0) {
        throw new Error('Invalid files data');
      }

      const post = await postModel.createPost(req.session.user.id, caption);

      const photos = files['photos'];
      const videos = files['videos'];

      if (photos) {
        for (const photo of photos) {
          await photoModel.createPhoto(post.id, photo.filename, photo.path);
        }
      }

      if (videos) {
        for (const video of videos) {
          await videoModel.createVideo(post.id, video.filename, video.path);
        }
      }

      res.redirect("/home");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getPost: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/login");
      }

      const postId = req.query.id;
      const post = await postModel.getPostById(postId);

      if (!post) {
        return res.render("post-not-found");
      }

      const photos = await photoModel.getPhotosByPostId(postId);
      const videos = await videoModel.getVideosByPostId(postId);
      const user = await userModel.getUserById(post.user_id);
      const userProfilePicture = user ? user.profile_picture : null;

      if (user) {
        post.photos = photos.map(photo => ({
          filename: photo.filename,
          file_path: photo.file_path
        }));
        post.videos = videos.map(video => ({
          filename: video.filename,
          file_path: video.file_path
        }));
        post.user = user;
        post.userProfilePicture = userProfilePicture;
      }

      res.render("post", { post: post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = postController;
