import UserModal from "../modals/chatSchema.js";

export const allUsers = async (req, res) => {
  try {
    let ActiveUser = await UserModal.find();
    res.status(200).send(ActiveUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getData = async (req, res) => {
  try {
    let { id, subject } = req.body;
    console.log(id);
    let userData = await UserModal.findById(id);
    let data = userData.chats.filter((item) => item.chatFrom === subject);
    res.send(
      data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
