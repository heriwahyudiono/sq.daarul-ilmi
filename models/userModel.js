const connection = require("../config/connection.js");
const bcrypt = require("bcryptjs");

module.exports = {
  getUsers: function (callback) {
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
  addUser: function (user, callback) {
    const sql =
      "INSERT INTO users (nama_lengkap, tanggal_lahir, jenis_kelamin, email, password) VALUES (?,?,?,?,?)";
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        connection.query(
          sql,
          [
            user.nama_lengkap,
            user.tanggal_lahir,
            user.jenis_kelamin,
            user.email,
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
      });
    });
  },
  checkUser: function (email, password, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, function (err, isMatch) {
            if (isMatch) {
              callback(null, result);
            } else {
              callback("Wrong Password", null);
            }
          });
        } else {
          callback("Email Not Found", null);
        }
      }
    });
  },
};
