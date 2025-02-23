import Event from "../model/event.model.js";
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      month,
      time,
      date,
      category,
      hostedBy,
      location,
    } = req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      month,
      category,
      hostedBy,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};
