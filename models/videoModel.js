const connection = require('../config/connection.js');

const videoModel = {
  createVideo: async (post_id, filename, file_path) => {
    try {
      const sql = 'INSERT INTO videos (post_id, filename, file_path) VALUES (?, ?, ?)';
      const [result] = await connection.promise().query(sql, [post_id, filename, file_path]);
      const videoId = result.insertId;
      return { id: videoId, post_id, filename, file_path };
    } catch (error) {
      throw error;
    }
  },

  getVideosByPostId: async (post_id) => {
    try {
      const sql = 'SELECT * FROM videos WHERE post_id = ?';
      const [rows] = await connection.promise().query(sql, [post_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = videoModel;
