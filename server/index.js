const app = require("express")();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

io.on("connection", function(socket) {
  socket.on("changeEditor", (data) => {
    io.emit("updateEditor", data);
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

const initialValue = "";

app.get("/editor/init", (_req, res) => {
  res.json(initialValue);
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
