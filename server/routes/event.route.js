import express from 'express';
import { createEvent } from '../controller/event.controller.js';
import verifyToken from '../middleware/verify.js';

const route = express.Router();
route.post("/create",verifyToken,createEvent);

export default route;