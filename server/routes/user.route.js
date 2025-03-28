import express from "express";
import verifyToken from "../middleware/verify.js";
import { userUpdate } from "../controller/user.controller.js";
const route = express.Router();

route.put("/:id/updateProfile", verifyToken, userUpdate);

export default route;