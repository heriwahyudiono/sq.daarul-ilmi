const connection = require('../config/connection'); // Import the database connection setup

class LikeModel {
  static async addLike(postId, userId) {
    // Check if the user has already liked the post
    const alreadyLiked = await this.isLiked(postId, userId);
    if (alreadyLiked) {
      return false; // If already liked, return false
    }

    // Increment the likes count in the posts table
    await connection.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);

    // Insert a new row in the post_likes table to record the like
    await connection.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
    
    return true; // Like added successfully
  }

  static async removeLike(postId, userId) {
    // Decrement the likes count in the posts table
    await connection.query('UPDATE posts SET likes = likes - 1 WHERE id = ?', [postId]);

    // Remove the row from the post_likes table to remove the like
    await connection.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
  }

  static async isLiked(postId, userId) {
    const result = await connection.query('SELECT COUNT(*) as count FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
    return result[0].count > 0; // Return true if the user has liked the post, false otherwise
  }
}

module.exports = LikeModel;
