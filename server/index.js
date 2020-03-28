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

const db = {};

io.on("connection", function(socket) {
  socket.on("changeEditor", (data) => {
    db[data.editorId] = data.value;
    io.emit(`updateEditor-${data.editorId}`, data);
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

const initialValue = "A paragraph from server";

app.get("/editor/:editorId/init", (req, res) => {
  res.json(db[req.params.editorId] || initialValue);
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
