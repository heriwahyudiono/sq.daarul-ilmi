const connection = require("../config/connection.js");
const bcrypt = require("bcryptjs");
const path = require("path");

const userModel = {
  register: function (user, callback) {
    const sql =
      "INSERT INTO users (name, gender, date_of_birth, email, phone_number, password, token, token_expiration, create_at) VALUES (?,?,?,?,?,?,?,?,?)";
    const saltRounds = 10;
    const currentDate = new Date();
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
            user.verification_token,
            user.token_expiration,
            currentDate,
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

  verifyAccount: function (token, callback) {
    const currentTime = new Date();
    const sql =
      "UPDATE users SET is_account_verified = 1, token = NULL WHERE token = ? AND token_expiration > ?";
    connection.query(sql, [token, currentTime], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, false);
      } else {
        const isAccountVerified = result.affectedRows > 0;
        callback(null, isAccountVerified);
      }
    });
  },

  login: function (email, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], function (err, result) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        if (result.length === 0) {
          return callback(null, false);
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

  getUserByEmail: function (email, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        if (result.length == 0) {
          callback(null, null);
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

  setToken: function (userId, resetToken, callback) {
    const currentTime = new Date();
    const tokenExpiration = resetToken
      ? new Date(currentTime.getTime() + 3600000)
      : null;
    const sql = "UPDATE users SET token = ?, token_expiration = ? WHERE id = ?";
    connection.query(
      sql,
      [resetToken, tokenExpiration, userId],
      function (err, result) {
        if (err) {
          console.error(err);
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
  },

  updatePasswordByToken: function (token, newPassword, callback) {
    const currentTime = new Date();
    const getUserSql = "SELECT * FROM users WHERE token = ?";

    connection.query(getUserSql, [token], function (err, result) {
      if (err) {
        console.error(err);
        return callback(err, null);
      }

      if (result.length === 0) {
        return callback(null, false);
      }

      const user = result[0];

      if (!user.token_expiration || user.token_expiration < currentTime) {
        return callback(null, false);
      }

      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          console.error("Terjadi kesalahan saat membuat salt:", err);
          return callback(err, null);
        }

        bcrypt.hash(newPassword, salt, function (err, hash) {
          if (err) {
            console.error(
              "Terjadi kesalahan saat melakukan hashing password:",
              err
            );
            return callback(err, null);
          }

          const updateSql =
            "UPDATE users SET password = ?, token = NULL, token_expiration = NULL WHERE id = ?";
          connection.query(updateSql, [hash, user.id], function (err, result) {
            if (err) {
              console.error(err);
              return callback(err, null);
            }

            return callback(null, true);
          });
        });
      });
    });
  },

  resetToken: function (token, callback) {
    const sql = "UPDATE users SET token = NULL WHERE token = ?";
    connection.query(sql, [token], function (err, result) {
      if (err) {
        console.error(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

  updateUserStatus: function (userId, lastLogin, isLogin, callback) {
    const query = "UPDATE users SET last_login = ?, is_login = ? WHERE id = ?";
    connection.query(
      query,
      [lastLogin, isLogin, userId],
      function (err, result) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      }
    );
  },

  getUserById: function (id, callback) {
    const sql =
      "SELECT * FROM users LEFT JOIN biodata ON users.id = biodata.user_id WHERE users.id = ?";
    connection.query(sql, [id], function (err, result) {
      if (err) {
        console.log(err);
        if (callback) {
          callback(err, null);
        }
      } else {
        if (result.length == 0) {
          if (callback) {
            callback(null, false);
          }
        } else {
          const user = result[0];
          console.log(user);
          const biodata = {
            perguruan_tinggi: user.perguruan_tinggi,
            fakultas: user.fakultas,
            program_studi: user.program_studi,
            angkatan: user.angkatan,
          };
          if (callback) {
            callback(null, {
              id: user.id,
              name: user.name,
              gender: user.gender,
              date_of_birth: user.date_of_birth,
              email: user.email,
              phone_number: user.phone_number,
              profile_picture: user.profile_picture,
              passwordHash: user.password,
              create_at: user.create_at,
              biodata: biodata,
            });
          }
        }
      }
    });
  },

  getUserNameById: function (userId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT name FROM users WHERE id = ?";
      connection.query(sql, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            resolve(results[0].name);
          } else {
            resolve(null);
          }
        }
      });
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
    connection.query(
      sql,
      [user.profile_picture, user.id],
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
  
  changePassword: function (userId, currentPassword, newPassword, callback) {
    const sql = "SELECT * FROM users WHERE id = ?";
    connection.query(sql, [userId], function (err, result) {
      if (err) {
        console.error(err);
        return callback(err, null);
      }

      if (result.length === 0) {
        return callback(null, false);
      }

      const user = result[0];
      const saltRounds = 10;

      bcrypt.compare(currentPassword, user.password, function (err, isMatch) {
        if (err) {
          console.error(err);
          return callback(err, null);
        }

        if (!isMatch) {
          return callback(null, false);
        }

        bcrypt.hash(newPassword, saltRounds, function (err, hash) {
          if (err) {
            console.error(err);
            return callback(err, null);
          }

          const updateSql = "UPDATE users SET password = ? WHERE id = ?";
          connection.query(updateSql, [hash, userId], function (err, result) {
            if (err) {
              console.error(err);
              return callback(err, null);
            }

            return callback(null, true);
          });
        });
      });
    });
  },
};

module.exports = userModel;
