import mongoose from "mongoose";
import UserModal from "../modals/chatSchema.js";

export const getroute = (req, res) => {
  res.send("hello world");
};

export const CreateNewAccount = async (req, res) => {
  try {
    const { user_id, name, avatar_url } = req.body;

    let isUniqueId = await UserModal.find({ user_id });

    if (isUniqueId.length) {
      res.status(402).send({
        message: "User id is already used by another user",
      });
    }
    const newUser = await UserModal({
      name: name,
      avatar_url: avatar_url || "",
      user_id: user_id,
      chats: [],
    });
    console.log(newUser);

    newUser.save();
    res.send(newUser);
  } catch (err) {
    console.log(err);
    res.send("error: " + err.message);
  }
};
