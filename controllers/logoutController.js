const logoutController = {
  logout: function (req, res) {
    req.session.destroy();
    res.redirect("/login");
  },
};

module.exports = logoutController;
