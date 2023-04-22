const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") }); //For process.env variables
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socket_io_server = require("./socket-io-server");
const io = socket_io_server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "../build")));
app.use("/api", require("./api").route);

//For testing purpose
app.get("/ping", function (req, res) {
  res.json({
    1: "one",
    2: "two",
    3: "three",
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 7483;

server.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
