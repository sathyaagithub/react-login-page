const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//db
mongoose
  .connect("mongodb://localhost:27017/login")
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("db not connected");
  });

//schema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

//model
const User = mongoose.model("Login", userSchema);
//hash
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password,this.password);
};

const accessToken = process.env.ACCESS_TOKEN_KEY;
const refreshToken = process.env.REFRESH_TOKEN_KEY;

const accessTokenFunc = (user) => {
  return jwt.sign({ id: user.id }, accessToken || "yoursecretkey", {
    expiresIn: "1hr",
  });
};

const refreshTokenFunc = (user) => {
  return jwt.sign({ id: user._id }, refreshToken || "yoursecretkey", {
    expiresIn: "2d",
  });
};

//endpoint

app.post("/auth/register", async (req, res) => {
  const { email, password, fullname } = req.body;
  try {
    const user = new User({ email, password, fullname });
    await user.save();
    res.status(201).json("user registered successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json("user is unauthorized");
    }

    const isMatch = await user.comparePassword(password);

    const accesstoken = accessTokenFunc(user);
    const refreshtoken = refreshTokenFunc(user);

    user.refreshToken = refreshtoken;
    await user.save();
    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      maxAge: "2*24*24*1000",
    });
    res.status(200).json("user logged in successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/refreshtoken", async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, refreshtoken);

    const user = await User.findById(decoded._id);

    const accesstokens = accessTokenFunc(user);
    const refreshtokens = refreshTokenFunc(user);

    user.refreshToken = refreshtokens;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: "2*24*24*1000",
    });
    await user.save();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//middleware
app.post("/auth/authorization", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const user = authHeader.split(" ")[1];

    const decoded = await User.findById(user._id).select(
      "-password -refreshtoken",
    );

    req.user = decoded;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.post("/profile", async (req, res) => {
//   try {
//   } catch {}
// });

const PORT = 8000;
app.listen(PORT, () => {
  console.log("server is running on" + PORT);
});
