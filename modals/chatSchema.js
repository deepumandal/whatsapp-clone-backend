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
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          // require: true,
        },
        chatTo: {
          type: mongoose.Schema.Types.ObjectId,
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
