import express from "express";
import { userUpdate } from "../controller/user.controller.js";
import verifyToken from "../middleware/verify.js";
const route = express.Router();

route.post("/:id/update", verifyToken, userUpdate);

export default route;