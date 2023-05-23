const connection = require("../config/connection.js");
const bcrypt = require("bcryptjs");

const UserModel = {
  registerUser: function (user, callback) {
    const sql =
      "INSERT INTO users (nama_lengkap, jenis_kelamin, tanggal_lahir, email, nomor_telepon, password) VALUES (?,?,?,?,?,?)";
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        connection.query(
          sql,
          [
            user.nama_lengkap,
            user.jenis_kelamin,
            user.tanggal_lahir,
            user.email,
            user.nomor_telepon,
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

  loginUser: function (email, callback) {
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
            nama_lengkap: user.nama_lengkap,
            jenis_kelamin: user.jenis_kelamin,
            tanggal_lahir: user.tanggal_lahir,
            email: user.email,
            nomor_telepon: user.nomor_telepon,
            passwordHash: user.password,
          });
        }
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
            nama_lengkap: user.nama_lengkap,
            jenis_kelamin: user.jenis_kelamin,
            tanggal_lahir: user.tanggal_lahir,
            email: user.email,
            nomor_telepon: user.nomor_telepon,
            profile_picture: user.profile_picture,
            passwordHash: user.password,
            biodata: biodata
          });
        }
      }
    });
  },
  
  updateUser: function (user, callback) {
    const sql =
      "UPDATE users SET nama_lengkap = ?, jenis_kelamin = ?, tanggal_lahir = ?, email = ?, nomor_telepon = ? WHERE id = ?";
    connection.query(
      sql,
      [
        user.nama_lengkap,
        user.jenis_kelamin,
        user.tanggal_lahir,
        user.email,
        user.nomor_telepon,
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
    connection.query(sql, [user.profile_picture, user.id], function (err, result) {
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
