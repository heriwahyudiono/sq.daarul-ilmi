const connection = require("../config/connection.js");
const bcrypt = require("bcryptjs");
const path = require("path");

const UserModel = {
  register: function (user, callback) {
    const sql =
      "INSERT INTO users (name, gender, date_of_birth, email, phone_number, password) VALUES (?,?,?,?,?,?)";
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        connection.query(
          sql,
          [
            user.name,
            user.gender,
            user.date_of_birth,
            user.email,
            user.phone_number,
            hash,
          ],
          function (err, result) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else {
              callback(null, result);
            }
          }
        );
      }
    });
  },

  login: function (email, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        if (result.length == 0) {
          callback(null, false);
        } else {
          const user = result[0];
          callback(null, {
            id: user.id,
            name: user.name,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            email: user.email,
            phone_number: user.phone_number,
            passwordHash: user.password,
          });
        }
      }
    });
  },

  updateUserStatus: function (userId, lastOnlineAt, isOnline, callback) {
    const query = "UPDATE users SET last_online = ?, is_online = ? WHERE id = ?";
    connection.query(query, [lastOnlineAt, isOnline, userId], function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  },

  getUserById: function (id, callback) {
    const sql = "SELECT * FROM users LEFT JOIN biodata ON users.id = biodata.user_id WHERE users.id = ?";
    connection.query(sql, [id], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        if (result.length == 0) {
          callback(null, false);
        } else {
          const user = result[0];
          const biodata = {
            perguruan_tinggi: user.perguruan_tinggi,
            fakultas: user.fakultas,
            program_studi: user.program_studi,
            angkatan: user.angkatan
          };
          callback(null, {
            id: user.id,
            name: user.name,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            email: user.email,
            phone_number: user.phone_number,
            profile_picture: user.profile_picture,
            passwordHash: user.password,
            biodata: biodata
          });
        }
      }
    });
  },
  
  getAllUsers: function (callback) {
    const sql = "SELECT * FROM users";
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },  

  updateUser: function (user, callback) {
    const sql =
      "UPDATE users SET name = ?, gender = ?, date_of_birth = ?, email = ?, phone_number = ? WHERE id = ?";
    connection.query(
      sql,
      [
        user.name,
        user.gender,
        user.date_of_birth,
        user.email,
        user.phone_number,
        user.id,
      ],
      function (err, result) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
  },

  updateProfilePicture: function (user, callback) {
    const sql = "UPDATE users SET profile_picture = ? WHERE id = ?";
    connection.query(sql, [`${Date.now()}${path.extname(user.profile_picture)}`, user.id], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

  deleteProfilePicture: function (userId, callback) {
    const sql = "UPDATE users SET profile_picture = NULL WHERE id = ?";
    connection.query(sql, [userId], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },
};

module.exports = UserModel;
