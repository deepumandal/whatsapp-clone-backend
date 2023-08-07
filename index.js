import express from "express";
import http from "http";
import { Server } from "socket.io";
import dbConnect from "./lib/db.js";
import { fileURLToPath } from "url";
import path from "path";
import ChatModal from "./modals/chatSchema.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import user from "./routes/user.js";
import auth from "./routes/login.js";
import { instrument } from "@socket.io/admin-ui";
import UserModal from "./modals/chatSchema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let ActiveUserid;

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
const httpServer = http.createServer(app);

// request data
app.get("/", (req, res) => {
  // res.sendFile(__dirname + "./index.html");
  res.sendFile("hello world!");
});
app.use("/authentication", auth);
app.use("/user", user);

// socket connections
const chatSocket = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

chatSocket.on("connection", async (socket) => {
  socket.on("connection established", async (userId, callback) => {
    console.log("connection established with user id:", userId);
    const socketId = socket.id;
    let userObject = await UserModal.updateOne(
      { _id: userId },
      { $set: { socketId } }
    );
    ActiveUserid = userId;
    socket.emit("newUser");
    callback(socketId);
  });
  socket.on("reconnectMe", async (_id) => {
    console.log("reconnecting with", _id._j);
    let data = await UserModal.updateOne(
      {
        _id: _id._j,
      },
      {
        $set: { socketId: socket.id },
      }
    );
    socket.emit("newUser");
    console.log("data", data);
  });
  socket.on("disconnectMe", async () => {
    console.log(`Disconnecting client with ID ${socket.id}-and `);
    let data = await UserModal.updateOne(
      {
        socketId: socket.id,
      },
      {
        $set: { socketId: "" },
      }
    );
    console.log("data", data);
  });
  socket.on("sendMessage", async (targetId, { _j }, message) => {
    let current = _j;
    let targetUser = await UserModal.findById(targetId);
    if (!targetUser) return;
    let _id = new mongoose.Types.ObjectId(current._id);
    let mydata = await UserModal.find({
      _id: _id,
    });
    let isIchatWithOtherUser = mydata[0]?.chats?.filter(
      (item) => item.chatFrom === targetId
    );
    if (isIchatWithOtherUser.length == 0) {
      // first time chatting let start chat from here
      // my side chatdata add
      let mySideChatData = await UserModal.updateOne(
        {
          _id: current._id,
        },
        {
          $push: {
            chats: {
              chatFrom: targetId,
              chatTo: current._id,
              data: [
                {
                  key: current,
                  value: message,
                },
              ],
            },
          },
        }
      );

      // //  target side chat data
      let targetSideChatData = await UserModal.updateOne(
        {
          _id: targetId,
        },
        {
          $push: {
            chats: {
              chatFrom: current._id,
              chatTo: targetId,
              data: [
                {
                  key: current,
                  value: message,
                },
              ],
            },
          },
        }
      );
    } else {
      let mySideChatData = await UserModal.updateOne(
        {
          _id: current._id,
          chats: {
            $elemMatch: { chatFrom: targetId, chatTo: current._id },
          },
        },
        {
          $push: {
            "chats.$.data": {
              key: current._id,
              value: message,
            },
          },
        }
      );
      let targetSideChatData = await UserModal.updateOne(
        {
          _id: targetId,
          chats: {
            $elemMatch: { chatFrom: current._id, chatTo: targetId },
          },
        },
        {
          $push: {
            "chats.$.data": {
              key: current._id,
              value: message,
            },
          },
        }
      );
    }
    console.log(mydata[0].socketId);

    new Promise((res) => {
      res(mydata[0].socketId);
    }).then((myid) => {
      socket.to(targetUser.socketId).to(myid).emit("getMessage", message);
    });
  });

  socket.on("disconnect", async (id) => {
    console.log("user disconnected", id);
  });
});

instrument(chatSocket, {
  auth: false,
  type: "basic",
  username: "admin",
  password: "admin",
});
dbConnect().then((res) => {
  httpServer.listen(3000, () => {
    console.log("listening on *:3000", `with database ${res}`);
  });
});
