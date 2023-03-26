const questionModel = require("../models/addQuestionModel.js");

module.exports = {
  addQuestion: (req, res) => {
    questionModel.addQuestion(req, res);
  },
};
