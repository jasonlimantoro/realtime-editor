const app = require("express")();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 4000;
const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/editor";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const mongo = mongoose.connection;

mongo.once("open", () => {
  console.log("Database connected:", url);
});

mongo.on("error", (err) => {
  console.error("connection error:", err);
});

const draftSchema = new mongoose.Schema(
  { value: String, editorId: String, _id: Number },
  { _id: false }
);
const Draft = mongoose.model("drafts", draftSchema);

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

io.on("connection", function(socket) {
  socket.on("changeEditor", async (data) => {
    await Draft.findByIdAndUpdate(
      data.editorId,
      { value: JSON.stringify(data.value) },
      { upsert: true }
    );
    io.emit(`updateEditor-${data.editorId}`, data);
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

const initialValue = "A paragraph from server";

app.get("/editor/:editorId/init", async (req, res) => {
  const draft = await Draft.findById(req.params.editorId);
  res.json(draft ? JSON.parse(draft.value) : initialValue);
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
