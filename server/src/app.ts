import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.use("/api", (req: Request, res: Response) => {
  res.send("Api is working");
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (message) => {
    const newMessage = { send: socket.id, content: message.content };
    // Broadcast the message to other clients
    socket.broadcast.emit("message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("A User disconnected");
  });
});

export default server;
