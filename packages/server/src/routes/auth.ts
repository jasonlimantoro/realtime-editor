import express from "express";
import { User } from "@app/database/schema";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    if (await User.findOne({ username: req.body.username })) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.json({ username: req.body.username });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({
        message: "Username invalid",
      });
    }
    const authenticated = await user.comparePassword(req.body.password);
    if (!authenticated) {
      return res.status(401).json({
        message: "Password invalid",
      });
    }
    const { password: _password, _id, ...userData } = user.toObject({
      virtuals: true,
    });
    res.json({
      message: "Successfully logged in",
      user: userData,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
