const connection = require("../config/connection");

module.exports = {
  addQuestion: (req, res) => {
    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      answer,
    } = req.body;
    const sql = `
      INSERT INTO questions (question, option_a, option_b, option_c, option_d, option_e, answer) 
      VALUES (?,?,?,?,?,?,?)
    `;
    connection.query(
      sql,
      [question, option_a, option_b, option_c, option_d, option_e, answer],
      (err, results) => {
        if (err) throw err;
        res.redirect("/exam");
      }
    );
  },
};
