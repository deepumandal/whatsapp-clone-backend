import express from "express";
import { allUsers, getData } from "../controller/userController.js";

const user = express.Router();

user.get("/", allUsers);
user.post('/getdata' , getData)

export default user;
