const BiodataModel = require("../models/biodataModel.js");

const UpdateBiodataController = {
  getUpdateBiodata: function (req, res) {
    if (req.session.user) {
      const userId = req.session.user.id;

      BiodataModel.getBiodataByUserId(userId, function (err, biodata) {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        res.render("perbarui-biodata", {
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

      BiodataModel.getBiodataByUserId(userId, function (err, existingBiodata) {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        if (existingBiodata) {
          BiodataModel.updateBiodata(biodata, function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal Server Error");
            }
            req.session.message = "Biodata berhasil diperbarui";
            res.redirect("/user?id=" + userId);
          });
        } else {
          BiodataModel.createBiodata(biodata, function (err, result) {
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

module.exports = UpdateBiodataController;
