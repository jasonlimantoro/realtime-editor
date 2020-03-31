const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema(
  { username: String, email: String, password: String },
  { versionKey: false }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(plaintext) {
  return bcrypt.compare(plaintext, this.password);
};

const User = model("users", userSchema);

module.exports.default = User;
