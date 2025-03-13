import express from 'express';
import { notify, subscribe } from '../controller/notification.controller.js';
import verifyToken from '../middleware/verify.js';
const route = express.Router();
route.post('/:eventId/subscribe',subscribe)
route.post('/:eventId/notify',verifyToken,notify)
export default route;