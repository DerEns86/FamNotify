const express = require("express");
const cors = require("cors");
const http = require("http"); // Importiere das http-Modul
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.HOST_LOCAL, process.env.HOST_NETWORK],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send image", (imgUrl) => {
    console.log("Bild-URL empfangen:", imgUrl);
    io.emit("receive image", imgUrl);
  });

  socket.on("image clicked", (data) => {
    console.log("Client hat auf das Bild geklickt:", data);
    io.emit("image was clicked", true);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
