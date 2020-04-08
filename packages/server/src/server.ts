import express from "express";
require("dotenv").config();
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import morgan from "morgan";
import "express-async-errors";
import "./database";
import { errorHandler } from "./lib/middleware";

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
app.use(morgan("common"));
app.use(bodyParser.json());

const whitelist = ["http://localhost:3000", "http://localhost:5000"];
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || whitelist.indexOf(origin!) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/", (req, res) => res.send("Hello World!"));

app.use(require("./routes").default);

app.use(errorHandler);

server.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`)
);

export default server;
