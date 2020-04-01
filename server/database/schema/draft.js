const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const draftSchema = new Schema(
  {
    value: Object,
    title: { type: String, default: "Untitled" },
    _id: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  },
  { versionKey: false }
);

const Draft = model("drafts", draftSchema);

module.exports.default = Draft;
