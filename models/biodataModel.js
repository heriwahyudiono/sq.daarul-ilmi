const connection = require("../config/connection.js");

const BiodataModel = {
  getBiodataByUserId: function (userId, callback) {
    const sql = "SELECT * FROM biodata WHERE user_id = ?";
    connection.query(sql, [userId], function (err, result) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        if (result.length === 0) {
          callback(null, null);
        } else {
          const biodata = result[0];
          callback(null, {
            id: biodata.id,
            perguruan_tinggi: biodata.perguruan_tinggi,
            fakultas: biodata.fakultas,
            program_studi: biodata.program_studi,
            angkatan: biodata.angkatan,
            user_id: biodata.user_id,
          });
        }
      }
    });
  },

  updateBiodata: function (biodata, callback) {
    const sql =
      "UPDATE biodata SET perguruan_tinggi = ?, fakultas = ?, program_studi = ?, angkatan = ? WHERE user_id = ?";
    connection.query(
      sql,
      [
        biodata.perguruan_tinggi,
        biodata.fakultas,
        biodata.program_studi,
        biodata.angkatan,
        biodata.user_id,
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

  createBiodata: function (biodata, callback) {
    const sql = "INSERT INTO biodata (perguruan_tinggi, fakultas, program_studi, angkatan, user_id) VALUES (?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [
        biodata.perguruan_tinggi,
        biodata.fakultas,
        biodata.program_studi,
        biodata.angkatan,
        biodata.user_id,
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
};

module.exports = BiodataModel;
