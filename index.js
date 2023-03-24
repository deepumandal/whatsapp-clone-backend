import express from "express";
import http from "http";
import { Server } from "socket.io";
import dbConnect from "./lib/db.js";
import { fileURLToPath } from "url";
import path from "path";
import ChatModal from "./modals/chatSchema.js";
import mongoose from "mongoose";
import route from "./routes/login.js";
import bodyParser from "body-parser";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
const httpServer = http.createServer(app);

// request data
app.get("/", (req, res) => {
  res.send("hello world!");
});
app.use("/authentication", route);

// socket connections
const chatSocket = new Server(httpServer);

chatSocket.on("connection", async (socket) => {
  console.log("a user connected", socket.id);

  // new user connected
  socket.on("new user login", async (message) => {
    // console.log("a user logged in", message);
    const user_data = message;
    const new_user = await ChatModal({
      ...user_data,
      _id: new mongoose.Types.ObjectId(),
      clientId: socket.id,
    });
    new_user.save();
    // send  greetings to new user
    socket.emit("welcome user", {
      socket_id: socket.id,
      message: `welcome ${user_data.name}`,
    });
    // Send a message to all connected clients about new user information
    socket.broadcast.emit(
      "welcome to user",
      "A new user has joined the chat room!"
    );
    // all user information
    try {
      const all_users = await ChatModal.find();
      socket.broadcast.emit("all user information", all_users);
    } catch (error) {
      console.log(error);
    }
  });

  // send message

  socket.on("sendMessage", (message) => {
    console.log("message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
dbConnect().then((res) => {
  httpServer.listen(3000, () => {
    console.log("listening on *:3000", `with database ${res}`);
  });
});
