const app = require("express")();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 4000;
const { Draft } = require("./database/schema");
require("./database");

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
      { upsert: true }
    );
    socket.broadcast.to(data.editorId).emit("updateEditor", data);
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

const initialValue = "A paragraph from server";

app.get("/editor/:editorId/init", async (req, res) => {
  const draft = await Draft.findById(req.params.editorId);
  res.json(draft ? draft.value : initialValue);
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
