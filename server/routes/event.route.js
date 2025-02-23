import express from 'express';
import { createEvent } from '../controller/event.controller.js';

const route = express.Router();
route.post("/create",createEvent);

export default route;