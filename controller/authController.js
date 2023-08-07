import mongoose from "mongoose";
import UserModal from "../modals/chatSchema.js";

export const getroute = (req, res) => {
  res.send("hello world");
};

export const CreateNewAccount = async (req, res) => {
  try {
    const { user_id, name, avatar_url } = req.body;

    const isUserExist = await UserModal.findOne({ user_id });

    if (isUserExist) {
      return res.send(isUserExist);
    }
    const newUser = await UserModal({
      name: name,
      avatar_url: avatar_url || "",
      user_id: user_id,
      chats: [],
    });

    newUser.save();
    return res.send(newUser);
  } catch (err) {
    console.log(err);
    return res.send("error: " + err.message, err);
  }
};
export const DeleteNewAccount = (req, res) => {};
