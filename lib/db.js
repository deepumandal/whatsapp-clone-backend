import mongoose from "mongoose";
import { config } from "dotenv";
config();

const dbConnect = async () => {
  try {
    const uri =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI
        : "mongodb://localhost:27017";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return uri;

    // console.log("Connected to MongoDB database!");
  } catch (err) {
    return console.error(err);
  }
};

export default dbConnect;
