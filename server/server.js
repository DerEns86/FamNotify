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

server.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
