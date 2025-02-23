import express from 'express';
import { createEvent, getallEvents } from '../controller/event.controller.js';
import verifyToken from '../middleware/verify.js';

const route = express.Router();
route.post("/create",verifyToken,createEvent);
route.get("/getallevents",getallEvents);

export default route;