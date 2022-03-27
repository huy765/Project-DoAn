const express = require("express");

const Router = express.Router();

const jwt = require("jsonwebtoken");

const argon2 = require("argon2");

const SchemaUser = require("../models/user");

const SchemaRole = require("../models/role");

const verifyToken = require("../../Middleware/Auth");

const GenerateToken = (payload) => {
  const token = jwt.sign(payload, process.env.secret_token, {
    expiresIn: "1d",
  });
  return token;
};

Router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await SchemaUser.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    } else {
      return res.status(200).json({ success: true, user, role: req.role });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Máy chủ gặp lỗi" });
  }
});

Router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await SchemaUser.find({ user: req.userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    } else {
      return res.status(200).json({ success: true, user });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Máy chủ gặp lỗi" });
  }
});

Router.post("/register", async (req, res) => {
  const { username, password, fullname, nameRole } = req.body;
  if (!username || !password || !fullname || !nameRole) {
    res.status(400).json({ success: true, message: "Nhập thiếu thông tin" });
  } else {
    const user = await SchemaUser.findOne({ username });
    if (user) {
      res.status(400).json({ success: false, message: "Tài khoản đã tồn tại" });
    } else {
      const hashPassword = await argon2.hash(password);
      const Role = await SchemaRole.findOne({ nameRole });
      const newUser = new SchemaUser({
        username,
        password: hashPassword,
        role: Role._id,
        fullname,
      });
      try {
        const result = await newUser.save();

        if (result) {
          const token = GenerateToken({ userId: newUser._id });
          res.status(200).json({
            success: true,
            tokenAccess: token,
            message: "Thêm thành công",
          });
        } else {
          res.status(400).json({ success: false, message: "Thêm thất bại" });
        }
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "Xảy ra lỗi : " + error });
      }
    }
  }
});

Router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: "Nhập thiếu thông tin Tài khoản/Mật khẩu",
    });
  } else {
    const user = await SchemaUser.findOne({ username });

    const role = await SchemaRole.findById({ _id: user.role });
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Tâì khoản không tồn tại" });
    } else {
      const validPassword = await argon2.verify(user.password, password);
      if (validPassword) {
        const accessToken = GenerateToken({
          userId: user._id,
          role: role.nameRole,
        });
        res.status(200).json({
          success: true,
          message: "Đăng nhập thành công",
          token: accessToken,
          user: user,
        });
      } else {
        res.status(400).json({ success: true, message: "Đăng nhập thất bại" });
      }
    }
  }
});

module.exports = Router;
