import mongoose from "mongoose";

const url = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/editor";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.once("open", () => {
  // eslint-disable-next-line no-console
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("connection error:", err);
});
