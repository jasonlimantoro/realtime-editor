import { Schema, model } from "mongoose";

const draftSchema = new Schema(
  {
    value: Object,
    title: { type: String, default: "Untitled" },
    _id: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { versionKey: false }
);

const Draft = model("drafts", draftSchema);

export default Draft;
