const express = require("express");
const cors = require("cors");
require("express-async-errors");
const http = require("http");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressJwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");

const { Draft, User } = require("./database/schema");
const config = require("./lib/config");
require("./database");

const port = 4000;

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

function jwt() {
  const secret = config.SECRET;
  return expressJwt({ secret, isRevoked });
}

async function isRevoked(req, payload, done) {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, true);
    }
    done();
  } catch (e) {
    done(null, true);
  }
}

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jsonwebtoken.verify(socket.handshake.query.token, config.SECRET, function(
      err,
      decoded
    ) {
      if (err) return next(new Error("Authentication error"));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});
io.on("connection", function(socket) {
  socket.on("LEAVE_ROOM", async (data) => {
    const user = await User.findById(socket.decoded.sub);
    socket.broadcast
      .to(data.room)
      .emit("REMOVE_COLLABORATOR", { user: user.username });
  });
  socket.on("CREATE_ROOM", async (room) => {
    const user = await User.findById(socket.decoded.sub);
    socket.join(room);
    socket.broadcast.to(room).emit("NEW_COLLABORATOR", { user: user.username });
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

const errorHandler = (err, req, res, _next) => {
  console.error(err);
  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "ValidationError") {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    if (err.inner.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", code: "token_expired" });
    }
    return res
      .status(401)
      .json({ message: "Invalid Token", code: "token_invalid" });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
};
app.use(errorHandler);

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
