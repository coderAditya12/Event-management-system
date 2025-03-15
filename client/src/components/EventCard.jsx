import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon } from "lucide-react";

const EventCard = ({ event }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image})` }}
      ></div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-xl mb-2 text-gray-900">
          {event.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-1">
          <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{event.date}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{event.location}</span>
        </div>
        <Link
          to={`/events/${event.id}`}
          className="text-purple-600 font-medium hover:text-purple-800 inline-block mt-2"
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventCard;
