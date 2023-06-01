const PostModel = require('../models/postModel');
const PhotoModel = require('../models/photoModel');

const PostController = {
  createPost: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/login");
      }

      // Dapatkan data caption dari form
      const { caption } = req.body;

      // Dapatkan file-file foto yang diunggah
      const photos = req.files;

      // Memastikan bahwa photos adalah array
      if (!Array.isArray(photos)) {
        throw new Error('Invalid photos data');
      }

      // Buat postingan baru
      const post = await PostModel.createPost(caption);

      // Simpan foto-foto terkait postingan
      for (const photo of photos) {
        await PhotoModel.createPhoto(post.id, photo.filename, photo.path);
      }

      res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = PostController;