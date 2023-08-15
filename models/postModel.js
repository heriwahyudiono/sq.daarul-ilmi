const connection = require('../config/connection.js');

const postModel = {
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
      const sql = `
        SELECT 
          posts.id AS post_id, 
          posts.caption,
          posts.create_at,
          posts.user_id,
          users.name AS user_name,
          photos.id AS photo_id,
          photos.file_path AS photo_file_path,
          videos.id AS video_id,
          videos.file_path AS video_file_path
        FROM posts
        LEFT JOIN users ON posts.user_id = users.id
        LEFT JOIN photos ON posts.id = photos.post_id
        LEFT JOIN videos ON posts.id = videos.post_id
        ORDER BY posts.id DESC
      `;    
      const [rows] = await connection.promise().query(sql);

      const posts = [];
      for (const row of rows) {
        const post = posts.find((p) => p.post_id === row.post_id);
        if (!post) {
          const { post_id, caption, user_name, user_id, create_at } = row;
          const photos = [];
          const videos = [];
          if (row.photo_id && row.photo_file_path) {
            photos.push({ id: row.photo_id, file_path: row.photo_file_path });
          }
          if (row.video_id && row.video_file_path) {
            videos.push({ id: row.video_id, file_path: row.video_file_path });
          }
          posts.push({
            post_id,
            caption,
            user_name,
            user_id,
            create_at,
            photos,
            videos,
          });
        } else {
          if (row.photo_id && row.photo_file_path) {
            post.photos.push({ id: row.photo_id, file_path: row.photo_file_path });
          }
          if (row.video_id && row.video_file_path) {
            post.videos.push({ id: row.video_id, file_path: row.video_file_path });
          }
        }
      }

      return posts;
    } catch (error) {
      throw error;
    }
  },

  getPostById: async (postId) => {
    try {
      const sql = `
        SELECT 
          posts.id AS post_id, 
          posts.create_at,
          posts.caption,
          posts.user_id,
          users.name AS user_name,
          photos.id AS photo_id,
          photos.file_path AS photo_file_path,
          videos.id AS video_id,
          videos.file_path AS video_file_path
        FROM posts
        LEFT JOIN users ON posts.user_id = users.id
        LEFT JOIN photos ON posts.id = photos.post_id
        LEFT JOIN videos ON posts.id = videos.post_id
        WHERE posts.id = ?
      `;
      const [rows] = await connection.promise().query(sql, [postId]);

      if (rows.length === 0) {
        return null; // Return null if no post is found with the given postId
      }

      // Assemble the post object with photos and videos as needed
      const post = {
        post_id: rows[0].post_id,
        caption: rows[0].caption,
        user_id: rows[0].user_id,
        user_name: rows[0].user_name,
        create_at: rows[0].create_at,
        photos: [],
        videos: [],
      };

      for (const row of rows) {
        if (row.photo_id && row.photo_file_path) {
          post.photos.push({ id: row.photo_id, file_path: row.photo_file_path });
        }
        if (row.video_id && row.video_file_path) {
          post.videos.push({ id: row.video_id, file_path: row.video_file_path });
        }
      }

      return post;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (postId) => {
    try {
      await deletePhotosByPostId(postId);
      await deleteVideosByPostId(postId);

      const sql = 'DELETE FROM posts WHERE id = ?';
      const [result] = await connection.promise().query(sql, [postId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

async function deletePhotosByPostId(postId) {
  try {
    const sql = 'DELETE FROM photos WHERE post_id = ?';
    await connection.promise().query(sql, [postId]);
  } catch (error) {
    throw error;
  }
}

async function deleteVideosByPostId(postId) {
  try {
    const sql = 'DELETE FROM videos WHERE post_id = ?';
    await connection.promise().query(sql, [postId]);
  } catch (error) {
    throw error;
  }
}

module.exports = postModel;
