const connection = require("../config/connection.js");

const HasilStudiModel = {
  getHasilStudiByUserId: function (userId, callback) {
    const sql = "SELECT * FROM hasil_studi WHERE user_id = ?";
    connection.query(sql, [userId], function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        if (result.length > 0) {
          callback(null, result[0]);
        } else {
          callback(null, null);
        }
      }
    });
  },

  createHasilStudi: function (hasilStudi, callback) {
    const sql = "INSERT INTO hasil_studi SET ?";
    connection.query(sql, hasilStudi, function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },

  updateHasilStudi: function (hasilStudi, callback) {
    const sql = "UPDATE hasil_studi SET semester = ?, ip = ? WHERE user_id = ?";
    connection.query(sql, [hasilStudi.semester, hasilStudi.ip, hasilStudi.user_id], function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  },
};

module.exports = HasilStudiModel;
