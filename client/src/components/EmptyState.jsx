import { CalendarX } from "lucide-react";

const EmptyState = ({ message = "No events found" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <CalendarX className="h-16 w-16 mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-sm text-gray-400">
        Try adjusting your filters to find events
      </p>
    </div>
  );
};

export default EmptyState;
