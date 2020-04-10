const express = require("express");
const cors = require("cors");

const projectRouter = require("./data/routers/projectRouter.js");
const actionRouter = require("./data/routers/actionRouter.js");

const server = express();

server.use(express.json());
server.use(cors());

// middleware

// endpoint routers
server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

// basic endpoint gives API running status
server.get("/", (req, res) => {
  const message = process.env.MESSAGE || "API running locally.";
  res.status(200).json({ api: "up", message });
});

// custom middleware definitions

function logger(req, res, next) {
  console.log(
    `Method: ${req.method}\nRequest URL: ${
      req.originalUrl
    }\nTimestamp: ${Date.now()}`
  );
  next();
}

module.exports = server;
