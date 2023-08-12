const connection = require("../config/connection.js");
const bcrypt = require("bcryptjs");
const path = require("path");

const userModel = {
  register: function (user, callback) {
    const sql =
      "INSERT INTO users (name, gender, date_of_birth, email, phone_number, password, token, token_expiration, create_at) VALUES (?,?,?,?,?,?,?,?,?)";
    const saltRounds = 10;
    const currentDate = new Date(); // Get the current date
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
            currentDate, // Add the current date to create_at
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
    const sql = "UPDATE users SET is_account_verified = 1, token = NULL WHERE token = ? AND token_expiration > ?";
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

  getUserByEmail: function (email, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        if (result.length == 0) {
          callback(null, null); // Tidak ada pengguna dengan alamat email yang diberikan
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
    const tokenExpiration = resetToken ? new Date(currentTime.getTime() + 3600000) : null; // Waktu sekarang + 1 jam (dalam milidetik)
    const sql = "UPDATE users SET token = ?, token_expiration = ? WHERE id = ?";
    connection.query(sql, [resetToken, tokenExpiration, userId], function (err, result) {
      if (err) {
        console.error(err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },  
  
  updatePasswordByToken: function (token, newPassword, callback) {
    const currentTime = new Date();
    const sql = "SELECT * FROM users WHERE token = ?";
    connection.query(sql, [token], function (err, result) {
      if (err) {
        console.error(err);
        return callback(err, null);
      }
  
      if (result.length === 0) {
        return callback(null, false);
      }
  
      const user = result[0];
  
      if (user.token_expiration && user.token_expiration < currentTime) {
        // Token telah kedaluwarsa
        return callback(null, false);
      }
  
      const saltRounds = 10;
  
      bcrypt.hash(newPassword, saltRounds, function (err, hash) {
        if (err) {
          console.error(err);
          return callback(err, null);
        }
  
        const updateSql = "UPDATE users SET password = ? WHERE id = ?";
        connection.query(updateSql, [hash, user.id], function (err, result) {
          if (err) {
            console.error(err);
            return callback(err, null);
          }
  
          userModel.resetToken(token, function (err, result) {
            if (err) {
              console.error(err);
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
    connection.query(query, [lastLogin, isLogin, userId], function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  },

  getUserById: function (id, callback) {
    const sql =
      "SELECT * FROM users LEFT JOIN biodata ON users.id = biodata.user_id WHERE users.id = ?";
    connection.query(sql, [id], function (err, result) {
      if (err) {
        console.log(err);
        // Panggil callback dengan error
        if (callback) {
          callback(err, null);
        }
      } else {
        if (result.length == 0) {
          // Panggil callback tanpa error dan data pengguna null
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
          // Panggil callback tanpa error dengan data pengguna dan biodata
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
              create_at: user.create_at, // Pastikan Anda menyertakan properti create_at
              biodata: biodata,
            });
          }
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

  deleteUser: function (userId, callback) {
    const sql = "DELETE FROM users WHERE id = ?";
    connection.query(sql, [userId], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, result.affectedRows > 0);
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
  }
};

module.exports = userModel;
