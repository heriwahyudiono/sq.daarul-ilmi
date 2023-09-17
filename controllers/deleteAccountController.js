const connection = require("../config/connection.js");

const deleteBiodataByUserId = async (userId) => {
  try {
    const sql = "DELETE FROM biodata WHERE user_id = ?";
    await connection.promise().query(sql, [userId]);
  } catch (error) {
    throw error;
  }
};

const deletePhotoByPostId = async (postId) => {
  try {
    const sql = "DELETE FROM photos WHERE post_id = ?";
    await connection.promise().query(sql, [postId]);
  } catch (error) {
    throw error;
  }
};

const deleteVideoByPostId = async (postId) => {
  try {
    const sql = "DELETE FROM videos WHERE post_id = ?";
    await connection.promise().query(sql, [postId]);
  } catch (error) {
    throw error;
  }
};

const deletePostById = async (postId) => {
  try {
    await deletePhotoByPostId(postId); 
    await deleteVideoByPostId(postId); 

    const sql = "DELETE FROM posts WHERE id = ?";
    await connection.promise().query(sql, [postId]);
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (userId) => {
  try {
    const [posts] = await connection
      .promise()
      .query("SELECT id FROM posts WHERE user_id = ?", [userId]);

    for (const post of posts) {
      const postId = post.id;
      await deletePostById(postId); 
    }

    await deleteBiodataByUserId(userId); 

    const sql = "DELETE FROM users WHERE id = ?";
    await connection.promise().query(sql, [userId]); 
  } catch (error) {
    throw error;
  }
};

module.exports = {
  deleteAccount,
  deleteBiodataByUserId,
  deletePostById,
  deletePhotoByPostId,
  deleteVideoByPostId,
};
