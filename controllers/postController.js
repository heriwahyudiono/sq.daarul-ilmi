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

  getPosts: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/login");
      }

      const posts = await postModel.getAllPosts();

      for (const post of posts) {
        const photos = await photoModel.getPhotosByPostId(post.id);
        const videos = await videoModel.getVideosByPostId(post.id);
        const user = await userModel.getUserById(post.user_id);
      
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
        }
      }
      
      res.render("index", { posts: posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = postController;
