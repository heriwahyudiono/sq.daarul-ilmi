const connection = require('../config/connection.js');

const PostModel = {
  createPost: async (caption) => {
    try {
      const sql = 'INSERT INTO posts (caption) VALUES (?)';
      const [result] = await connection.promise().query(sql, [caption]);
      const postId = result.insertId;
      return { id: postId, caption };
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
  }
};

module.exports = PostModel;
