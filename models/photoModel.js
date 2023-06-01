const connection = require('../config/connection.js');

const PhotoModel = {
  createPhoto: async (postId, fileName, filePath) => {
    try {
      const sql = 'INSERT INTO photos (post_id, file_name, file_path) VALUES (?, ?, ?)';
      await connection.promise().query(sql, [postId, fileName, filePath]);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PhotoModel;
