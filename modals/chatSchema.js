import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   require: true,
    // },
    // clientId: {
    //   type: String,
    //   require: true,
    // },
    name: {
      type: String,
      require: true,
    },
    socketId: {
      type: String,
      default: "",
    },
    avatar_url: {
      type: String,
      // require: true,
    },
    user_id: {
      type: Number,
      require: true,
    },
    chats: [
      {

        chatFrom: {
          type: String,
          ref: "User",
          // require: true,
        },
        chatTo: {
          type: String,
          // require: true,
        },
        data: [
          {
            key: {
              type: String,
              // required: true,
            },
            value: {
              type: String,
              // required: true,
            },
          },
        ],
      },
    ],
  },
  {
    versionKey: false,
  }
);

const UserModal = mongoose.model("Chat", UserSchema);
export default UserModal;
