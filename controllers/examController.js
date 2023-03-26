const examModel = require("../models/examModel.js");

exports.exam = (req, res) => {
  examModel.getQuestions((err, data) => {
    if (err) {
      throw err;
    } else {
      res.render("exam", {
        questions: data,
      });
    }
  });
};

exports.checkAnswer = (req, res) => {
  let score = 0;
  const answers = req.body;
  examModel.getQuestions((err, data) => {
    if (err) {
      throw err;
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].answer === answers["question-" + i]) {
          score++;
        }
      }

      examModel.addScore(req.session.user.id, score, (err) => {
        if (err) {
          throw err;
        } else {
          res.redirect("/result");
        }
      });
    }
  });
};
