const connection = require("../config/connection.js");

exports.getQuestions = (callback) => {
  if (connection) {
    connection.query("SELECT * FROM questions", (err, rows) => {
      if (err) {
        throw err;
      } else {
        callback(null, rows);
      }
    });
  }
};
