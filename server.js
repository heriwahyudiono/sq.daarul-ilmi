const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const multer = require("multer");

const loginController = require("./controllers/loginController.js");
const registerController = require("./controllers/registerController.js");
const userModel = require("./models/userModel.js");
const updateUserController = require("./controllers/updateUserController.js");
const updateProfilePictureController = require("./controllers/updateProfilePictureController.js");
const deleteProfilePictureController = require("./controllers/deleteProfilePictureController.js");
const updateBiodataController = require("./controllers/updateBiodataController.js");
const biodataModel = require("./models/biodataModel.js");
const updateHasilStudiController = require("./controllers/updateHasilStudiController");
const hasilStudiModel = require("./models/hasilStudiModel.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    if (req.session.user && req.session.user.id) {
      const userId = req.session.user.id;
      const extension = path.extname(file.originalname);
      const filename = `${userId}${extension}`;
      cb(null, filename);
    } else {
      cb(new Error('User session is not defined'));
    }
  }
});

const upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.redirect("/login");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", loginController.login);

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", registerController.register);

app.get("/home", function (req, res) {
  if (req.session.user) {
    res.render("home", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/settings", function (req, res) {
  if (req.session.user) {
    res.render("settings", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/user", function (req, res) {
  const userId = req.query.id;
  const message = req.session.message;
  req.session.message = null;

  userModel.getUserById(userId, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else if (!user) {
      res.status(404).send("User Not Found");
    } else {
      biodataModel.getBiodataByUserId(userId, function (err, biodata) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          hasilStudiModel.getHasilStudiByUserId(userId, function (err, hasilStudi) {
            if (err) {
              console.log(err);
              res.status(500).send("Internal Server Error");
            } else {
              res.render("user", { user, message, biodata, hasilStudi });
            }
          });
        }
      });
    }
  });
});

app.post("/update-user", updateUserController.postUpdateUser);

app.post("/update-profile-picture", upload.single("profile_picture"), updateProfilePictureController.postUpdateProfilePicture);

app.post("/delete-profile-picture", deleteProfilePictureController.deleteProfilePicture);

app.get("/perbarui-biodata", function (req, res) {
  if (req.session.user) {
    res.render("perbarui-biodata", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.post("/update-biodata", updateBiodataController.postUpdateBiodata);

app.get("/perbarui-hasil-studi", function (req, res) {
  if (req.session.user) {
    res.render("perbarui-hasil-studi", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.post("/update-hasil-studi", updateHasilStudiController.postUpdateHasilStudi);

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
