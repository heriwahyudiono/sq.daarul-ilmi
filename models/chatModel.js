const connection = require('../config/connection.js');

const chatModel = {
  getChatsForUser: function(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT chats.id, 
               chats.sender_id, 
               chats.receiver_id, 
               users.name AS receiver_name
        FROM chats
        INNER JOIN users ON chats.receiver_id = users.id
        WHERE sender_id = ? OR receiver_id = ?
        GROUP BY chats.id, receiver_name
      `;
      
      connection.query(query, [userId, userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  getChatHistory: function(userId, receiverId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * 
        FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?) 
        ORDER BY timestamp ASC
      `;
      
      connection.query(query, [userId, receiverId, receiverId, userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  saveMessage: function(senderId, receiverId, message) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages (sender_id, receiver_id, text, timestamp) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `;
      
      connection.query(query, [senderId, receiverId, message], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = chatModel;
