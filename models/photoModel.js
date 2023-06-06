const connection = require('../config/connection.js');

const PhotoModel = {
  createPhoto: async (postId, fileName, filePath) => {
    try {
      const sql = 'INSERT INTO photos (post_id, filename, file_path) VALUES (?, ?, ?)';
      await connection.promise().query(sql, [postId, fileName, filePath]);
    } catch (error) {
      throw error;
    }
  },

  getPhotosByPostId: async (postId) => {
    try {
      const sql = 'SELECT * FROM photos WHERE post_id = ?';
      const [rows] = await connection.promise().query(sql, [postId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  deletePhotosByPostId: async (postId) => {
    try {
      const sql = 'DELETE FROM photos WHERE post_id = ?';
      const [result] = await connection.promise().query(sql, [postId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PhotoModel;
