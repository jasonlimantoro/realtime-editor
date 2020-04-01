const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressJwt = require("express-jwt");

const { Draft, User } = require("./database/schema");
const config = require("./lib/config");
require("./database");

const port = 4000;

const app = express();
const server = http.createServer(app);
const io = socket(server);

function jwt() {
  const secret = config.SECRET;
  return expressJwt({ secret, isRevoked });
}

async function isRevoked(req, payload, done) {
  const user = await User.findById(payload.sub);
  if (!user) {
    return done(null, true);
  }
  done();
}
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
// app.use(jwt());

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

app.use("/drafts", jwt(), require("./routes/draft").default);
app.use("/auth", require("./routes/auth").default);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
  next(err);
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
