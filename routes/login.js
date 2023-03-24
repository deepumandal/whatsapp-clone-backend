import express from "express";
import { getroute, CreateNewAccount } from "../controller/authController.js";

const route = express.Router();

route.get("/", getroute);

route.post("/newuser", CreateNewAccount);

export default route;
