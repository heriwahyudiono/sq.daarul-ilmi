const userModel = require("../models/userModel.js");

const logoutController = {
  logout: function (req, res) {
    const user = req.session.user;
    if (user) {
      userModel.updateUserStatus(user.id, null, false, function (err) {
        if (err) {
          console.log("Error updating user status:", err);
        }
      });
    }
    req.session.destroy();
    res.redirect("/");
  },
};

module.exports = logoutController;
