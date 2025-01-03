import express, { Application } from "express";
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

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("new_message", (message) => {
    const newMessage = { send: socket.id, content: message.content };
    // Broadcast the message to other clients
    socket.broadcast.emit("message", newMessage);
  });

  const uploadedChunks = new Map<
    string,
    { chunks: Chunk[]; uploaded: number; fileName: string; fileType: string }
  >();

  socket.on("upload_chunk", (file) => {
    const { fileId, fileName, chunk, offset, total, mimeType } = file;

    // Initialize file chunks array if not exists
    if (!uploadedChunks.has(fileId)) {
      uploadedChunks.set(fileId, {
        chunks: [],
        uploaded: 0,
        fileName,
        fileType: mimeType,
      });
    }

    const fileData = uploadedChunks.get(fileId)!;
    fileData.chunks.push({ chunk, offset });
    fileData.uploaded += chunk.byteLength;

    // Check if upload is complete
    if (fileData.uploaded >= total) {
      // Combine chunks and save file
      const fileBuffer = combineChunks(fileData.chunks);

      // Notify client
      io.emit("upload_complete", {
        fileId,
        fileName,
        size: total,
        file: fileBuffer.toString("base64"),
        fileType: fileData.fileType,
      });

      // Cleanup
      uploadedChunks.delete(fileId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A User disconnected");
  });
});

interface Chunk {
  chunk: ArrayBuffer;
  offset: number;
}

function combineChunks(chunks: Chunk[]): Buffer {
  // Sort chunks by offset
  chunks.sort((a, b) => a.offset - b.offset);

  // Combine chunks into single buffer
  return Buffer.concat(chunks.map((c) => Buffer.from(c.chunk)));
}

export default server;
