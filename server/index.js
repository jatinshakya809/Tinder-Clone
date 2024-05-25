import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import http from "http";
import { Server } from "socket.io";
import connectDb from "./db/Connection.js";
import morgan from "morgan";
import userRouter from "./routes/userRoutes.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api", userRouter);

const users = {};

io.on("connection", (socket) => {
  console.log(socket.id, "Connected");

  socket.emit("welcome", `Welcome to the chat server ${socket.id}`);

  socket.on("initiate-chat", ({ senderEmail, recipientEmail }) => {
    users[senderEmail] = socket.id;

    console.log(Object.keys(users).length);

    if (users[recipientEmail]) {
      io.to(users[recipientEmail]).emit("chat-initiated", senderEmail);
      io.to(users[senderEmail]).emit("chat-initiated", recipientEmail);
    } else {
      console.log(`User ${recipientEmail} is offline`);

      io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
    }
  });

  socket.on("send-message", ({ senderEmail, recipientEmail, message }) => {
    console.log({ senderEmail, recipientEmail, message });
    if (users[recipientEmail]) {
      io.to(users[recipientEmail]).emit("receive-message", {
        senderEmail,
        message,
      });
    } else {
      console.log(`User ${recipientEmail} is offline`);

      io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
    const email = Object.keys(users).find((key) => users[key] === socket.id);
    if (email) {
      delete users[email];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is Listening at PORT ${PORT}`.bgGreen);
});

connectDb();
