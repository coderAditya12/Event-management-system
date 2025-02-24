import Event from "../model/event.model.js";
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, month, time, date, category, location } =
      req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      month,
      category,
      hostedBy: req.user.id,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};
export const getallEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};
export const getEvent = async (req, res, next) => {
  const eventId = req.params.id;
  const singleEvent = await Event.findById(eventId);
  res.status(200).json(singleEvent);
};
