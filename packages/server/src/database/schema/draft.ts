import { Schema, model, Model, Document } from "mongoose";

interface DraftSchema extends Document {
  value: string;
  title: string;
  author: any;
  updatedAt: Date;
}

const draftSchema = new Schema(
  {
    value: String,
    title: { type: String, default: "Untitled" },
    _id: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    versionKey: false,
    timestamps: {
      updatedAt: "updatedAt",
    },
  }
);

const Draft = model<DraftSchema, Model<DraftSchema>>("drafts", draftSchema);

export default Draft;
