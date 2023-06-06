const connection = require('../config/connection.js');

const PostModel = {
  createPost: async (user_id, caption) => {
    try {
      const sql = 'INSERT INTO posts (user_id, caption) VALUES (?, ?)';
      const [result] = await connection.promise().query(sql, [user_id, caption]);
      const postId = result.insertId;
      return { id: postId, user_id, caption };
    } catch (error) {
      throw error;
    }
  },
  
  getAllPosts: async () => {
    try {
      const sql = 'SELECT * FROM posts';
      const [rows] = await connection.promise().query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (postId) => {
    try {
      const sql = 'DELETE FROM posts WHERE id = ?';
      const [result] = await connection.promise().query(sql, [postId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PostModel;
