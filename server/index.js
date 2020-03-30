const app = require("express")();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { Draft } = require("./database/schema");
require("./database");

const port = 4000;

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

io.on("connection", function(socket) {
  socket.on("create", (room) => {
    socket.join(room);
  });
  socket.on("changeEditor", async (data) => {
    await Draft.findByIdAndUpdate(
      data.editorId,
      { value: data.value },
      { upsert: true, setDefaultsOnInsert: true }
    );
    socket.broadcast.to(data.editorId).emit("updateEditor", data);
  });

  socket.on("changeTitle", async (data) => {
    await Draft.findByIdAndUpdate(
      data.editorId,
      { title: data.title },
      { upsert: true, setDefaultsOnInsert: true }
    );
    socket.broadcast.to(data.editorId).emit("updateTitle", data);
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/editors", async (req, res) => {
  const drafts = await Draft.find({}, { _id: 1, title: 1 })
    .sort({ _id: -1 })
    .lean();
  res.json(drafts);
});

app.get("/editor/:editorId", async (req, res) => {
  const draft = await Draft.findById(req.params.editorId).lean();
  res.json(draft);
});

app.delete("/editor/:editorId", async (req, res) => {
  await Draft.findByIdAndRemove(req.params.editorId);
  res.send("success");
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
