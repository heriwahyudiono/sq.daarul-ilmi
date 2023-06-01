const UpdateHasilStudiController = {
  updateHasilStudi: function (req, res) {
    if (req.session.user) {
      const userId = req.session.user.id;
      const { semester, ip } = req.body;

      const hasilStudi = {
        semester: semester,
        ip: ip,
        user_id: userId,
      };

      HasilStudiModel.getHasilStudiByUserId(userId, function (err, existingHasilStudi) {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        if (existingHasilStudi) {
          HasilStudiModel.updateHasilStudi(hasilStudi, function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal Server Error");
            }
            req.session.message = "Hasil studi berhasil diperbarui";
            res.render("perbarui-hasil-studi", { message: req.session.message });
          });
        } else {
          HasilStudiModel.createHasilStudi(hasilStudi, function (err, result) {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal Server Error");
            }
            req.session.message = "Hasil studi berhasil ditambahkan";
            res.render("perbarui-hasil-studi", { message: req.session.message });
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  },
};

module.exports = UpdateHasilStudiController;
