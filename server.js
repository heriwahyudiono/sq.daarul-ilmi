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
const postController = require("./controllers/postController.js");
const postModel = require("./models/postModel.js");
const photoModel = require("./models/photoModel.js");
const chatController = require("./controllers/chatController.js");
const chatModel = require("./models/chatModel.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_pictures");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/posts");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});

const uploadProfilePicture = multer({ storage: profilePictureStorage });
const uploadPost = multer({ storage: postStorage });

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

app.get("/post", function (req, res) {
  if (req.session.user) {
    res.render("post", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/menu", function (req, res) {
  if (req.session.user) {
    res.render("menu", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/setting", function (req, res) {
  if (req.session.user) {
    res.render("setting", { user: req.session.user });
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
          hasilStudiModel.getHasilStudiByUserId(userId, function (
            err,
            hasilStudi
          ) {
            if (err) {
              console.log(err);
              res.status(500).send("Internal Server Error");
            } else {
              res.render("user", {
                user: user,
                biodata: biodata,
                hasilStudi: hasilStudi,
                message: message,
              });
            }
          });
        }
      });
    }
  });
});

app.post("/update-user", updateUserController.updateUser);

app.post(
  "/update-profile-picture",
  uploadProfilePicture.single("profilePicture"),
  updateProfilePictureController.updateProfilePicture
);

app.post("/delete-profile-picture", deleteProfilePictureController.deleteProfilePicture);

app.post("/update-biodata", updateBiodataController.updateBiodata);

app.post("/update-hasil-studi", updateHasilStudiController.updateHasilStudi);

app.get("/create-post", function (req, res) {
  if (req.session.user) {
    res.render("create-post", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.post("/create-post", uploadPost.array("photos"), postController.createPost);

app.get("/post/:id", function (req, res) {
  const postId = req.params.id;

  postModel.getPostById(postId, function (err, post) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else if (!post) {
      res.status(404).send("Post Not Found");
    } else {
      photoModel.getPhotosByPostId(postId, function (err, photos) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.render("post", { post: post, photos: photos });
        }
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
