import mongoose from "mongoose";
import { config } from "dotenv";
config();

const dbConnect = async () => {
  try {
    const uri =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_DEV
        : process.env.MONGODB_URI_PROD;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return uri;
  } catch (err) {
    return console.error(err);
  }
};

export default dbConnect;
