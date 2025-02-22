import express from "express";
import { login, signOut, signup } from "../controller/auth.controller.js";
const route = express.Router();

route.post("/signup", signup);
route.post("/login",login);
route.get("/signout",signOut);

export default route;
