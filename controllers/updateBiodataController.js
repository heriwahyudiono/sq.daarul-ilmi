const biodataModel = require("../models/biodataModel.js");

const updateBiodataController = {
  getUpdateBiodata: function (req, res) {
    if (req.session.user) {
      const userId = req.session.user.id;

      biodataModel.getBiodataByUserId(userId, function (err, biodata) {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        res.render("update-biodata", {
          user: req.session.user,
          biodata: biodata || {},
          message: req.session.message,
        });
      });
    } else {
      res.redirect("/login");
    }
  },

  updateBiodata: function (req, res) {
    if (req.session.user) {
      const userId = req.session.user.id;
      const { perguruan_tinggi, fakultas, program_studi, angkatan } = req.body;

      const biodata = {
        perguruan_tinggi: perguruan_tinggi,
        fakultas: fakultas,
        program_studi: program_studi,
        angkatan: angkatan,
        user_id: userId,
      };

      biodataModel.getBiodataByUserId(userId, function (err, existingBiodata) {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        if (existingBiodata) {
          biodataModel.updateBiodata(biodata, function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal Server Error");
            }
            req.session.message = "Biodata berhasil diperbarui";
            res.redirect("/user?id=" + userId);
          });
        } else {
          biodataModel.createBiodata(biodata, function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal Server Error");
            }
            req.session.message = "Biodata berhasil ditambahkan";
            res.redirect("/user?id=" + userId);
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  },
};

module.exports = updateBiodataController;
