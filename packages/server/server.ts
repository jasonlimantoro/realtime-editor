import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import morgan from "morgan";
import "express-async-errors";
import "./database";
import { jwt, errorHandler } from "./lib/middleware";

const port = 4000;

const app = express();
const server = http.createServer(app);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/drafts", jwt(), require("./routes/draft").default);
app.use("/auth", require("./routes/auth").default);

app.use(errorHandler);

server.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`)
);

export { server };
