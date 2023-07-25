const connection = require('../config/connection');
const LikeModel = require('../models/likeModel');

// ... other controller functions ...

async function likePost(req, res) {
  const postId = req.body.postId;
  const userId = req.session.user.id;

  try {
    const added = await LikeModel.addLike(postId, userId);
    if (added) {
      // If the like is successfully added, update the post likes count in the response
      const postLikes = await connection.query('SELECT likes FROM posts WHERE id = ?', [postId]);
      res.json({ success: true, likes: postLikes[0].likes });
    } else {
      res.json({ success: false, message: 'You have already liked this post.' });
    }
  } catch (error) {
    console.error('Failed to like post:', error);
    res.status(500).json({ success: false, message: 'Failed to like post.' });
  }
}

async function unlikePost(req, res) {
  const postId = req.body.postId;
  const userId = req.session.user.id;

  try {
    await LikeModel.removeLike(postId, userId);
    // Decrement the post likes count in the response
    const postLikes = await connection.query('SELECT likes FROM posts WHERE id = ?', [postId]);
    res.json({ success: true, likes: postLikes[0].likes });
  } catch (error) {
    console.error('Failed to unlike post:', error);
    res.status(500).json({ success: false, message: 'Failed to unlike post.' });
  }
}

module.exports = {
  // ... other controller functions ...
  likePost,
  unlikePost,
};
