const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs")

const loginController = require("./controllers/loginController.js");
const registerController = require("./controllers/registerController.js");
const logoutController = require("./controllers/logoutController.js");
const userModel = require("./models/userModel.js");
const updateUserController = require("./controllers/updateUserController.js");
const updateProfilePictureController = require("./controllers/updateProfilePictureController.js");
const deleteProfilePictureController = require("./controllers/deleteProfilePictureController.js");
const updateBiodataController = require("./controllers/updateBiodataController.js");
const biodataModel = require("./models/biodataModel.js");
const postController = require("./controllers/postController.js");
const postModel = require("./models/postModel.js");
const photoModel = require("./models/photoModel.js");
const deleteAccountController = require("./controllers/deleteAccountController.js");
const changePasswordController = require("./controllers/changePasswordController.js")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/profile_pictures", express.static(path.join(__dirname, "uploads/profile_pictures")));
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
    cb(null, path.join(__dirname, "uploads/profile_pictures"));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});

const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only image files (jpeg, jpg, png) are allowed!");
    }
  },
});

const profilePictureDirectory = path.join(__dirname, "uploads/profile_pictures");
if (!fs.existsSync(profilePictureDirectory)) {
  fs.mkdirSync(profilePictureDirectory, { recursive: true });
}

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

const uploadPost = multer({
  storage: postStorage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only image files (jpeg, jpg, png) and video files (mp4) are allowed!");
    }
  },
});

const postDirectory = "uploads/posts";
if (!fs.existsSync(postDirectory)) {
  fs.mkdirSync(postDirectory, { recursive: true });
}

app.get("/", function (req, res) {
  postModel.getAllPosts()
    .then((posts) => {
      res.render("index", { posts: posts });
    })
    .catch((error) => {
      console.error("Failed to get posts:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", loginController.login);

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", registerController.register);

app.get("/logout", logoutController.logout);

app.get("/menu", function (req, res) {
  if (req.session.user) {
    res.render("menu", { user: req.session.user });
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
      return res.status(500).send("Internal Server Error");
    }
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    biodataModel.getBiodataByUserId(userId, function (err, biodata) {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      res.render("user", {
        user: user,
        biodata: biodata,
        message: message,
      });
    });
  });
});

app.get("/change-password", changePasswordController.getChangePassword);

app.post("/change-password", changePasswordController.postChangePassword);

app.get("/users", function (req, res) {
  userModel.getAllUsers(function (err, users) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("users", { users: users });
    }
  });
});

app.post(
  "/update-profile-picture",
  uploadProfilePicture.single("profilePicture"),
  updateProfilePictureController.updateProfilePicture
);

app.post("/delete-profile-picture", deleteProfilePictureController.deleteProfilePicture);


app.get("/create-post", function (req, res) {
  if (req.session.user) {
    res.render("create-post", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.post('/create-post', uploadPost.fields([
  { name: 'photos', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), postController.createPost);

app.get("/home", function (req, res) {
  postModel.getAllPosts()
    .then((posts) => {
      res.render("home", { posts: posts });
    })
    .catch((error) => {
      console.error("Failed to get posts:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/edit-profile", updateUserController.getUpdateUser);

app.post("/update-profile", updateUserController.updateUser);

app.get("/update-biodata", updateBiodataController.getUpdateBiodata);

app.post("/update-biodata", updateBiodataController.updateBiodata);

app.post("/delete-account", deleteAccountController.deleteAccount);

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
