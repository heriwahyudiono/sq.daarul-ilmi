const answerModel = require("../models/answerModel");

async function answer(req, res) {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect("/login");
  }

  let userId = req.session.user.id;
  let examId = req.body.examId;
  let answers = req.body.answers;

  try {
    let result = await answerModel.saveAnswer(userId, examId, answers);
    if (result) {
      let score = await answerModel.getScore(userId, examId);
      return res.render("result", { score: score });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  answer: answer,
};
