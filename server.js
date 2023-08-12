const express = require("express");
const bodyParser = require("body-parser");
const http = require('http');
const socketIo = require('socket.io');
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs")

const loginController = require("./controllers/loginController.js");
const registerController = require("./controllers/registerController.js");
const forgotPasswordController = require("./controllers/forgotPasswordController.js");
const resetPasswordController = require("./controllers/resetPasswordController.js");
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
const changePasswordController = require("./controllers/changePasswordController.js");

const chatController = require("./controllers/chatController"); // Import chatController

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Meletakkan kode middleware untuk menyajikan file klien socket.io
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist'));

// Konfigurasi socket.io di sini
io.on('connection', (socket) => {
    // Logika socket.io di sini
    socket.on('send-message', (data) => {
      // Lakukan sesuatu dengan data pesan yang diterima, misalnya menyimpan ke database
      // Kemudian mengirim ulang pesan ke semua klien yang terhubung
      io.emit('receive-message', data);
    });
});

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
    // Gunakan timestamp dalam milidetik sebagai bagian dari nama file
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}${extension}`;
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

app.get("/verify-account", function (req, res) {
  const { token } = req.query;
  userModel.verifyAccount(token, function (err, isAccountVerified) {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      if (isAccountVerified) {
        res.render("account-verified");
      } else {
        res.send("Invalid verification token");
      }
    }
  });
});

app.get("/reset-password-successfully", function (req, res) {
  res.render("reset-password-successfully");
});

app.get("/forgot-password", forgotPasswordController.getForgotPassword);
app.post("/forgot-password", forgotPasswordController.postForgotPassword);

app.get("/reset-password", (req, res) => {
  const token = req.query.token; 
  res.render("reset-password", { token, successMessage: null, errorMessage: null });
});

app.post("/reset-password", resetPasswordController.postResetPassword);

app.get("/logout", logoutController.logout);

app.get("/menu", function (req, res) {
  if (req.session.user) {
    res.render("menu", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/chats", chatController.getChatInbox);
app.get("/chat/:receiverId", chatController.getChatRoom);
app.post("/chat/:receiverId", chatController.postSendMessage);

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

app.get("/profile", function (req, res) {
  const user = req.session.user; // Ambil informasi pengguna dari sesi
  const message = req.session.message;
  req.session.message = null;

  if (!user) {
    return res.redirect("/login"); // Redirect jika pengguna tidak masuk
  }

  userModel.getUserById(user.id, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    if (!user) {
      return res.render("user-not-found");
    }

    biodataModel.getBiodataByUserId(user.id, function (err, biodata) {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      res.render("profile", {
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
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect jika pengguna belum masuk
  }

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
]), (req, res) => {
  // Check if any non-allowed photo files were uploaded
  const photoFiles = req.files['photos'];
  if (photoFiles) {
    const invalidPhotos = photoFiles.filter(file => !['.jpeg', '.jpg', '.png'].includes(path.extname(file.originalname).toLowerCase()));
    if (invalidPhotos.length > 0) {
      return res.render("create-post", {
        user: req.session.user,
        errorMessage: "Only .jpeg, .jpg, and .png files are allowed for photos."
      });
    }
  }

  // Check if any .mp4 files were uploaded
  const videoFiles = req.files['videos'];
  if (videoFiles) {
    const invalidVideos = videoFiles.filter(file => path.extname(file.originalname) !== '.mp4');
    if (invalidVideos.length > 0) {
      return res.render("create-post", {
        user: req.session.user,
        errorMessage: "Only .mp4 files are allowed."
      });
    }
  }

  // Continue with your existing postController.createPost logic here
  postController.createPost(req, res);
});

app.get("/home", function (req, res) {
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect jika pengguna belum masuk
  }

  postModel.getAllPosts()
    .then((posts) => {
      res.render("home", { posts: posts, user_id: req.user ? req.user.id : null });
    })
    .catch((error) => {
      console.error("Failed to get posts:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/post", async function (req, res) {
  const postId = req.query.id;

  try {
    const post = await postModel.getPostById(postId);

    if (!post) {
      return res.render("post-not-found");
    }

    res.render("post", { post: post });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/edit-profile", updateUserController.getUpdateUser);

app.post("/update-profile", updateUserController.updateUser);

app.get("/update-biodata", updateBiodataController.getUpdateBiodata);

app.post("/update-biodata", updateBiodataController.updateBiodata);

app.post("/delete-account", deleteAccountController.deleteAccount);

app.use(function (req, res, next) {
  res.status(404).render("page-not-found");
});

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
