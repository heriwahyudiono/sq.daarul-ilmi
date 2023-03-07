const connection = require("../config/connection.js");

async function saveAnswer(userId, examId, answers) {
  if (!userId || !examId || !answers || answers.length === 0) {
    return;
  }

  answers.forEach(async function (answer) {
    await connection.query(
      "INSERT INTO answers (user_id, exam_id, question_id, answer) VALUES (?, ?, ?, ?)",
      [userId, examId, answer.questionId, answer.answer],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
      }
    );
  });

  return true;
}

async function getScore(userId, examId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT COUNT(*) as score FROM answers WHERE user_id = ? AND exam_id = ? AND answer = (SELECT answer FROM questions WHERE id = exam_answer.question_id)",
      [userId, examId],
      function (error, results, fields) {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(results[0].score);
      }
    );
  });
}

module.exports = {
  saveAnswer: saveAnswer,
  getScore: getScore,
};
