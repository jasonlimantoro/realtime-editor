import { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "lib/config";

interface UserSchema extends Document {
  username: string;
  email?: string;
  password: string;
}

interface UserVirtual extends UserSchema {
  token: string;
  comparePassword: (plaintext: string) => boolean;
}
interface UserModel extends Model<UserVirtual> {}

const userSchema = new Schema(
  { username: String, email: String, password: String },
  { versionKey: false, id: false }
);

userSchema.pre<UserSchema>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plaintext: string) {
  return bcrypt.compare(plaintext, this.password);
};
userSchema.virtual("token").get(function (this: UserSchema) {
  return jwt.sign({ sub: this._id }, config.SECRET, { expiresIn: "2h" });
});

const User = model<UserSchema, UserModel>("users", userSchema);

export default User;
