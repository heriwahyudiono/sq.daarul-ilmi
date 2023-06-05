const postModel = require('../models/postModel');
const photoModel = require('../models/photoModel');
const userModel = require('../models/userModel')

const postController = {
  createPost: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/login");
      }

      const { caption } = req.body;

      const photos = req.files;

      if (!Array.isArray(photos)) {
        throw new Error('Invalid photos data');
      }

      const post = await postModel.createPost(req.session.user.id, caption);

      for (const photo of photos) {
        await photoModel.createPhoto(post.id, photo.filename, photo.path);
      }

      res.status(200).json({ message: 'Post created successfully' });
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
        const user = await userModel.getUserById(post.user_id); 
        post.photos = photos;
        post.user = user;
      }
  
      res.render("post", { posts: posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }  
};

module.exports = postController;
