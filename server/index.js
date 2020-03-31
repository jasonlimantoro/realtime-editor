const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const { Draft } = require("./database/schema");
require("./database");

const port = 4000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

io.on("connection", function(socket) {
  socket.on("CREATE_ROOM", (room) => {
    socket.join(room);
  });
  socket.on("CHANGE_STATE", async (data) => {
    await Draft.findByIdAndUpdate(
      data.editorId,
      { value: data.value },
      { upsert: true, setDefaultsOnInsert: true }
    );
    socket.broadcast.to(data.editorId).emit("CHANGE_STATE_LISTENER", data);
  });

  socket.on("CHANGE_TITLE", async (data) => {
    await Draft.findByIdAndUpdate(
      data.editorId,
      { title: data.title },
      { upsert: true, setDefaultsOnInsert: true }
    );
    socket.broadcast.to(data.editorId).emit("CHANGE_TITLE_LISTENER", data);
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/drafts", require("./routes/draft").default);

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
