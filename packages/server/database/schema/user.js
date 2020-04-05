const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../lib/config");

const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema(
  { username: String, email: String, password: String },
  { versionKey: false, id: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plaintext) {
  return bcrypt.compare(plaintext, this.password);
};
userSchema.virtual("token").get(function () {
  return jwt.sign({ sub: this._id }, config.SECRET, { expiresIn: "2h" });
});

const User = model("users", userSchema);

module.exports.default = User;
