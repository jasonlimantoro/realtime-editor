const express = require("express");
const { User } = require("../database/schema");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    const result = await user.save();
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({
        message: "Username invalid"
      });
    }
    const authenticated = await user.comparePassword(req.body.password);
    if (!authenticated) {
      return res.status(401).json({
        message: "Password invalid"
      });
    }
    res.json({
      message: "Successfully logged in"
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports.default = router;
