import express from "express";
import {
  getroute,
  CreateNewAccount,
  DeleteNewAccount,
} from "../controller/authController.js";

const auth = express.Router();

auth.get("/", getroute);

auth.post("/newuser", CreateNewAccount);
auth.get("/delete", DeleteNewAccount);

export default auth;
